"use client"
import React, { useState } from "react"
import LikeButton from "./LikeButton"
import Prices from "./Prices"
import { ArrowsPointingOutIcon } from "@heroicons/react/24/outline"
import { StarIcon } from "@heroicons/react/24/solid"
import ButtonPrimary from "@/shared/Button/ButtonPrimary"
import ButtonSecondary from "@/shared/Button/ButtonSecondary"
import BagIcon from "./BagIcon"
import toast from "react-hot-toast"
import { Transition } from "@/app/headlessui"
import ModalQuickView from "./ModalQuickView"
import ProductStatus from "./ProductStatus"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import NcImage from "@/shared/NcImage/NcImage"
import DOMPurify from "dompurify"
import { addToCart } from "@/app/lib/saleorCart"
import { useEffect } from "react"
import { useCheckout } from "@/app/CheckoutContext"
import SelectRegistryModal from "@/components/SelectRegistryModal"
import CollectionPrices from "./CollectionPrices"
import RegistryProductForm from "@/components/RegistryProductForm"
import GroupGiftingModal from "@/components/GroupGiftingModal"

const ProductCard = ({   className = "",
  data,
  isLiked: initialIsLiked,
  variantActive = 0,            
  onVariantChange = () => {},  }) => {
  const {
    name,
    pricing,
    description,
    variants,
    variantType,
    status,
    media,
    rating,
    id,
    numberOfReviews,
    sizes
  } = data

  const { refreshCheckout } = useCheckout()
  const [showModalQuickView, setShowModalQuickView] = useState(false)
  const [isHovered, setIsHovered] = useState(false);
  const router = useRouter()
  const [hoverTimeout, setHoverTimeout] = useState(null);
  const [isLiked, setIsLiked] = useState(initialIsLiked);
  const [isSelectRegistryOpen, setIsSelectRegistryOpen] = useState(false);
  const [isRegistryProductFormOpen, setIsRegistryProductFormOpen] = useState(false);
  const [selectedRegistryUuid, setSelectedRegistryUuid] = useState(null);
  const [selectedVariantId, setSelectedVariantId] = useState(null);
  const [isGroupGiftingModalOpen, setIsGroupGiftingModalOpen] = useState(false);
  const [pendingRegistryData, setPendingRegistryData] = useState(null);

  useEffect(() => {
    setIsLiked(initialIsLiked);
  }, [initialIsLiked]);

  const handleWishlistToggle = async () => {
    const action = isLiked ? "remove" : "add";
    const tokenKey = process.env.NEXT_PUBLIC_SALEOR_API_URL + "+saleor_auth_module_refresh_token";
    const token = sessionStorage.getItem(tokenKey);
  
    if (!token) {
      toast.error("You must be logged in to update your wishlist.");
      return; 
    }
  
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_REGISTRY_URL}/api/wishlist/modify/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            action: action,
            product_web_id: String(id),
          }),
        }
      );
  
      if (!response.ok) throw new Error("Failed to update wishlist");
  
      setIsLiked((prev) => !prev); 
      toast.success(action === "add" ? "Added to wishlist!" : "Removed from wishlist!");
    } catch (error) {
      console.error("Error updating wishlist:", error);
      toast.error("Could not update wishlist.");
    }
  };
  
  const handleMouseEnter = () => {
    if (hoverTimeout) {
      clearTimeout(hoverTimeout);
    }
    setIsHovered(true); 
  };
  
  const handleMouseLeave = () => {
    const timeout = setTimeout(() => {
      setIsHovered(false);
    }, 200);
  
    setHoverTimeout(timeout);
  };
  

  const renderDescription = description => {
    try {
      const parsedDescription = JSON.parse(description)

      if (parsedDescription.blocks && Array.isArray(parsedDescription.blocks)) {
        return parsedDescription.blocks.map((block, index) => (
          <p
            key={index}
            dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(block.data.text)
            }}
          />
        ))
      }
    } catch (error) {
      console.error("Error parsing product description:", error)
    }

    return <p></p>
  }

  const notifyAddTocart = ({ size }) => {
    toast.custom(
      (t) => (
        <Transition
          as={"div"}
          appear
          show={t.visible}
          className="relative p-4 max-w-md w-full bg-white dark:bg-slate-800 shadow-lg -2xl pointer-events-auto ring-1 ring-black/5 dark:ring-white/10 text-slate-900 dark:text-slatroundede-200"
          enter="transition-all duration-150"
          enterFrom="opacity-0 translate-x-20"
          enterTo="opacity-100 translate-x-0"
          leave="transition-all duration-150"
          leaveFrom="opacity-100 translate-x-0"
          leaveTo="opacity-0 translate-x-20"
        >
          {/* Close Button */}
          <button
            onClick={() => toast.dismiss(t.id)}
            className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
          >
            ✕
          </button>
  
          {/* Modal Content */}
          <p className="block text-base  leading-none">
            Added to cart!
          </p>
          <div className="border-t border-slate-200 dark:border-slate-700 my-4" />
          {renderProductCartOnNotify({ size })}
        </Transition>
      ),
      {
        position: "top-right",
        id: String(id) || `/product/${data.slug}`,
        duration: 3000,
      }
    );
  };
  
  const renderProductCartOnNotify = ({ size }) => {
    const activeVariant = variants?.[variantActive]; 
  
    return (
      <div className="flex flex-col space-y-3">
        <div className="flex">
          <Link
            href={`/product/${data.slug}`}
            className="h-24 w-20 flex-shrink-0 overflow-hidden rounded-none bg-slate-100"
          >
            <Image
              width={80}
              height={96}
              src={media[0]?.url}
              alt={name}
              className="absolute object-cover object-center"
            />
          </Link>
  
          <div className="ms-4 flex flex-1 flex-col justify-between">
            <div>
              <h3 className="text-base font-medium">
                <Link href={`/product/${data.slug}`}>{name}</Link>
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {activeVariant?.name}
              </p>
              {activeVariant?.attributes?.map((attr, index) => (
                <p key={index} className="text-xs text-slate-500">
                  <strong>{attr.attribute.name}:</strong>{" "}
                  {attr.values.map((v) => v.name).join(", ")}
                </p>
              ))}
            </div>
  
            <div className="flex justify-between items-end text-sm">
              <p className="text-gray-500 dark:text-slate-400">Qty: 1</p>
              <CollectionPrices price={pricing.priceRange.start.gross.amount} />
            </div>
          </div>
        </div>
  
        {/* VARIANT SELECTOR */}
        {variants?.length > 1 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {variants.map((variant, index) => (
              <button
                key={variant.id}
                onClick={() => onVariantChange(index)} // optionally re-use
                className={`px-3 py-1 text-sm rounded-none border transition-all ${
                  variantActive === index
                    ? "border-black bg-black text-white"
                    : "border-gray-300 bg-white text-black hover:border-black"
                }`}
              >
                {variant.name}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  };
  

  const getBorderClass = (Bgclass = "") => {
    if (Bgclass.includes("red")) {
      return "border-red-500"
    }
    if (Bgclass.includes("violet")) {
      return "border-violet-500"
    }
    if (Bgclass.includes("orange")) {
      return "border-orange-500"
    }
    if (Bgclass.includes("green")) {
      return "border-green-500"
    }
    if (Bgclass.includes("blue")) {
      return "border-blue-500"
    }
    if (Bgclass.includes("sky")) {
      return "border-sky-500"
    }
    if (Bgclass.includes("yellow")) {
      return "border-yellow-500"
    }
    return "border-transparent"
  }

  const renderVariants = () => {
    if (!variants || !variants.length || !variantType) {
      return null
    }

    // if (variantType === "color") {
    //   return (
    //     <div className="flex gap-1.5">
    //       {variants.map((variant, index) => (
    //         <div
    //           key={index}
    //           onClick={() => onVariantChange(index)}
    //           className={`relative w-6 h-6 rounded-none overflow-hidden z-10 border cursor-pointer ${
    //             variantActive === index
    //               ? getBorderClass(variant.color)
    //               : "border-transparent"
    //           }`}
    //           title={variant.name}
    //         >
    //           <div
    //             className={`absolute inset-0.5 rounded-none z-0 ${variant.color}`}
    //           ></div>
    //         </div>
    //       ))}
    //     </div>
    //   );
    // }

    return (
      <div className="flex ">
        {variants.map((variant, index) => (
          <div
            key={index}
            onClick={() => onVariantChange(index)}
            className={`relative w-11 h-6 rounded-none overflow-hidden z-10 border cursor-pointer ${
              variantActive === index
                ? "border-black dark:border-slate-300"
                : "border-transparent"
            }`}
            title={variant.name}
          >
            {/* <div
              className="absolute inset-0.5 rounded-none overflow-hidden z-0 bg-cover"
              style={{
                backgroundImage: `url(${
                  typeof media?.src === "string"
                    ? variant.thumbnail?.src
                    : typeof media.thumbnail === "string"
                    ? variant.thumbnail
                    : ""
                })`,
              }}
            ></div> */}
          </div>
        ))}
      </div>
    )
  }

  const renderGroupButtons = () => {
    return (
      <Transition
        show={isHovered}
        enter="transition-opacity duration-200"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="transition-opacity duration-200"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        <div className="absolute bottom-0 inset-x-0 px-2 pb-2 flex flex-col space-y-1 transition-all">
          <div className="flex gap-1">
          <ButtonPrimary
            className="flex-1 bg-[#1E293B] hover:bg-[#1E293B] text-white"
            fontSize="text-xs"
            sizeClass="py-2"
            onClick={async () => {
              if (!data.variants || data.variants.length === 0) {
                toast.error("This product has no available variants to add to cart.");
                return;
              }

              if (data.variants.length > 1) {
                setShowModalQuickView(true);
                return;
              }

              try {
                const response = await addToCart(data.variants[0].id, 1);
                if (response?.checkout?.id) {
                  sessionStorage.setItem("checkout_id", response.checkout.id);
                  notifyAddTocart({ size: "" });
                  refreshCheckout();
                } else {
                  toast.error("Failed to add to cart.");
                }
              } catch (error) {
                console.error("Error adding to cart:", error);
                toast.error("Failed to add product to cart.");
              }
            }}
          >
            <BagIcon className="w-3.5 h-3.5 mb-0.5" />
            <span className="ms-1">Add to Cart</span>
          </ButtonPrimary>
          <ButtonSecondary
            className="flex-1 bg-white hover:bg-gray-100 hover:text-slate-900 transition-colors"
            sizeClass="py-2"
            fontSize="text-xs"
            onClick={() => {
              const tokenKey = process.env.NEXT_PUBLIC_SALEOR_API_URL + "+saleor_auth_module_refresh_token";
              const token = sessionStorage.getItem(tokenKey);

              if (!token) {
                toast.error("You must create an account to start a registry.");
                router.push("/login");
                return;
              }

              if (data.variants?.length > 1) {
                // Show quick view if multiple variants
                setShowModalQuickView(true);
              } else {
                // Open direct registry modal if only one variant
                setIsSelectRegistryOpen(true);
              }
            }}
          >
            Add to Registry
          </ButtonSecondary>


            {/* <ButtonSecondary
              className="flex-1 bg-white hover:bg-gray-100 hover:text-slate-900 transition-colors"
              fontSize="text-xs"
              sizeClass="py-2"
              onClick={() => setShowModalQuickView(true)}
            >
              <ArrowsPointingOutIcon className="w-3.5 h-3.5" />
              <span className="ms-1">Quick view</span>
            </ButtonSecondary> */}
          </div>
        </div>
      </Transition>
    );
  };
  

  const renderSizeList = () => {

    if (!sizes || !sizes.length) {
      return null
    }

    return (
        <div className="absolute bottom-0 inset-x-1 gap-2 flex flex-wrap justify-center opacity-0 invisible group-hover:bottom-4 group-hover:opacity-100 group-hover:visible transition-all">
          {sizes.map((size, index) => {
            return (
              <div
                key={index}
                className="nc-shadow-lg w-10 h-10 rounded-none bg-white hover:bg-slate-900 hover:text-white transition-colors cursor-pointer flex items-center justify-center uppercase  tracking-tight text-sm text-slate-900"
                onClick={() => notifyAddTocart({ size })}
              >
                {size}
              </div>
            )
          })}
        </div>
    )
  }

  return (
    <>
      <div
        className={`nc-ProductCard relative flex flex-col bg-transparent ${className}`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div className="relative flex-shrink-0 bg-slate-50 dark:bg-slate-300 overflow-hidden z-1 group">
          <Link href={`/product/${data.slug}`} className="block">
            <NcImage
              containerClassName="flex aspect-w-11 aspect-h-12 w-full h-0"
              src={media?.[0]?.url || "/placeholder-image.jpg"}
              className="object-cover w-full h-full drop-shadow-xl"
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1200px) 50vw, 40vw"
              alt="product"
            />
          </Link>
          <ProductStatus status={status} />
          <LikeButton 
            className="absolute top-3 end-3 z-10"
            liked={isLiked}
            onClick={() => {
              const tokenKey = process.env.NEXT_PUBLIC_SALEOR_API_URL + "+saleor_auth_module_refresh_token";
              const token = sessionStorage.getItem(tokenKey);
              
              if (!token) {
                toast.error("You must be logged in to update your wishlist.");
                return;
              }

              handleWishlistToggle();
            }} 
          />
          {sizes ? renderSizeList() : renderGroupButtons()}
        </div>

        <div className="space-y-4 px-2.5 pb-2.5">
          <div className="text-center mt-4">
            <Link href={`/product/${data.slug}`}>
              <h2 className="text-base  transition-colors hover:text-primary-600">
                {name}
              </h2>
            </Link>
            <div className="mt-1 text-lg font-medium text-slate-700 dark:text-slate-300">
              <CollectionPrices price={pricing?.priceRange?.start.gross.amount} />
            </div>
          </div>
        </div>
      </div>

      {/* QUICKVIEW */}
      <ModalQuickView
          show={showModalQuickView} // No longer tied to hover
          onCloseModalQuickView={() => setShowModalQuickView(false)}
          product={data}
        />
        <SelectRegistryModal
          isOpen={isSelectRegistryOpen}
          onClose={() => setIsSelectRegistryOpen(false)}
          onSelect={async (registryUuid) => {
            setIsSelectRegistryOpen(false);
            const variantId = data.variants?.[variantActive]?.id;
            if (!variantId) {
              toast.error("No variant selected.");
              return;
            }
            setSelectedRegistryUuid(registryUuid);
            setSelectedVariantId(variantId);
            const isVirtual = Array.isArray(data.productType?.metadata) &&
              data.productType.metadata.some(
                (meta) => meta.key === "registry.product_type" && meta.value === "virtual"
              );
            if (isVirtual) {
              setIsRegistryProductFormOpen(true);
            }
            // Always show group gifting modal after registry selection
            setPendingRegistryData({
              registryUuid,
              variantId,
              quantity: 1,
              isVirtual,
            });
            setIsGroupGiftingModalOpen(true);
          }}
        />
        <RegistryProductForm
          isOpen={isRegistryProductFormOpen}
          onClose={() => setIsRegistryProductFormOpen(false)}
          onSubmit={({ title, description, price }) => {
            setIsRegistryProductFormOpen(false);
            setPendingRegistryData((prev) => ({
              ...prev,
              title,
              description,
              price,
              isVirtual: true,
            }));
            setIsGroupGiftingModalOpen(true);
          }}
        />
        {isGroupGiftingModalOpen && (
          <GroupGiftingModal
            isOpen={true}
            onClose={() => setIsGroupGiftingModalOpen(false)}
            onSelect={async (isGroupGifting) => {
              setIsGroupGiftingModalOpen(false);
              if (!pendingRegistryData) return;
              const token = sessionStorage.getItem(
                process.env.NEXT_PUBLIC_SALEOR_API_URL + "+saleor_auth_module_refresh_token"
              );
              try {
                let body;
                if (pendingRegistryData.isVirtual) {
                  body = {
                    web_variant_id: pendingRegistryData.variantId,
                    quantity: pendingRegistryData.quantity,
                    virtual_product_title: pendingRegistryData.title,
                    virtual_product_description: pendingRegistryData.description,
                    virtual_product_price: parseFloat(pendingRegistryData.price),
                    is_group_gifting: isGroupGifting,
                  };
                } else {
                  body = {
                    web_variant_id: pendingRegistryData.variantId,
                    quantity: pendingRegistryData.quantity,
                    is_group_gifting: isGroupGifting,
                  };
                }
                const response = await fetch(
                  `${process.env.NEXT_PUBLIC_REGISTRY_URL}/api/registries/${pendingRegistryData.registryUuid}/products/`,
                  {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                      Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify(body),
                  }
                );
                if (!response.ok) throw new Error("Failed to add to registry");
                toast.success("Product added to registry!");
              } catch (error) {
                console.error("Add to registry failed:", error);
                toast.error("Could not add product to registry.");
              } finally {
                setPendingRegistryData(null);
              }
            }}
          />
        )}
    </>
  )
}

export default ProductCard
