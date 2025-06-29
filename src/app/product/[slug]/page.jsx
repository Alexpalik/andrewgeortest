"use client"
import React, { useState } from "react"
import ButtonPrimary from "@/shared/Button/ButtonPrimary"
import LikeButton from "@/components/LikeButton"
import { StarIcon } from "@heroicons/react/24/solid"
import BagIcon from "@/components/BagIcon"
import NcInputNumber from "@/components/NcInputNumber"
import { fetchSaleorProductBySlug } from "@/app/lib/productView"
import { useParams } from "next/navigation"
import { useEffect } from "react"
import { addToCart } from "@/app/lib/saleorCart"
import {
  NoSymbolIcon,
  ClockIcon,
  SparklesIcon
} from "@heroicons/react/24/outline"
import IconDiscount from "@/components/IconDiscount"
import Prices from "@/components/Prices"
import toast from "react-hot-toast"
import SectionSliderProductCard from "@/components/SectionSliderProductCard"
import Policy from "./Policy"
import ReviewItem from "@/components/ReviewItem"
import ButtonSecondary from "@/shared/Button/ButtonSecondary"
import SectionPromo2 from "@/components/SectionPromo2"
import ModalViewAllReviews from "./ModalViewAllReviews"
import NotifyAddTocart from "@/components/NotifyAddTocart"
import Image from "next/image"
import AccordionInfo from "@/components/AccordionInfo"
import DOMPurify from "dompurify"
import { useCheckout } from "@/app/CheckoutContext"
import SelectRegistryModal from "@/components/SelectRegistryModal"
import { useRouter } from "next/navigation"
import RegistryProductForm from "@/components/RegistryProductForm"
import GroupGiftingModal from "@/components/GroupGiftingModal"

console.log(SelectRegistryModal)

const ProductDetailPage = () => {
  const { slug } = useParams()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { refreshCheckout } = useCheckout()
  const router = useRouter();

  useEffect(() => {
    if (slug) {
      fetchSaleorProductBySlug(slug)
        .then(async (product) => {
          setProduct(product)
  
          const tokenKey = process.env.NEXT_PUBLIC_SALEOR_API_URL + "+saleor_auth_module_refresh_token"
          const token = sessionStorage.getItem(tokenKey)
          if (!token) return
  
          try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_REGISTRY_URL}/api/wishlist/`, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            })
            const data = await res.json()
  
            const liked = data?.some((item) => String(item.product_web_id) === String(product.id))
            setIsLiked(liked)
          } catch (err) {
            console.error("Error fetching wishlist:", err)
          }
        })
        .catch((err) => setError(err.message))
        .finally(() => setLoading(false))
    }
  }, [slug])
  
  

  const [variantActive, setVariantActive] = useState(0)
  const LIST_IMAGES = product?.media
  const [isSelectRegistryOpen, setIsSelectRegistryOpen] = useState(false);
  const [qualitySelected, setQualitySelected] = useState(1)
  const [isOpenModalViewAllReviews, setIsOpenModalViewAllReviews] = useState(
    false
  )
  const [isLiked, setIsLiked] = useState(false);
  const [isRegistryProductFormOpen, setIsRegistryProductFormOpen] = useState(false);
  const [selectedRegistryUuid, setSelectedRegistryUuid] = useState(null);
  const [selectedVariantId, setSelectedVariantId] = useState(null);
  const [isGroupGiftingModalOpen, setIsGroupGiftingModalOpen] = useState(false);
  const [pendingRegistryData, setPendingRegistryData] = useState(null);

  const handleWishlistToggle = async () => {
    const action = isLiked ? "remove" : "add"
    const tokenKey = process.env.NEXT_PUBLIC_SALEOR_API_URL + "+saleor_auth_module_refresh_token"
    const token = sessionStorage.getItem(tokenKey)
  
    if (!token) {
      toast.error("You must be logged in to update your wishlist.")
      return
    }
  
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_REGISTRY_URL}/api/wishlist/modify/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          action,
          product_web_id: String(product.id),
        }),
      })
  
      if (!response.ok) throw new Error("Failed to update wishlist")
  
      setIsLiked((prev) => !prev)
      toast.success(action === "add" ? "Added to wishlist!" : "Removed from wishlist!")
    } catch (error) {
      console.error("Error updating wishlist:", error)
      toast.error("Could not update wishlist.")
    }
  }
  
  const handleAddToCart = async () => {
    if (!product?.variants?.length) {
      toast.error("No variants available for this product.")
      return
    }

    const selectedVariant = product.variants[variantActive]
    if (!selectedVariant?.id) {
      toast.error("Please select a valid variant.")
      return
    }

    try {
      const response = await addToCart(selectedVariant.id, qualitySelected)

      if (response?.checkout?.id) {
        sessionStorage.setItem("checkout_id", response.checkout.id)
        notifyAddTocart()
        refreshCheckout() // Refresh the cart drawer immediately
        handleAddToCart()
      } else {
        toast.error("Failed to add to cart.")
      }
    } catch (error) {
      console.error("Error adding to cart:", error)
      toast.error("Failed to add product to cart.")
    }
  }

  const notifyAddTocart = () => {
    const selectedVariant = product?.variants?.[variantActive];
  
    toast.custom(
      (t) => (
        <NotifyAddTocart
          productImage={product?.media?.[0]?.url}
          qualitySelected={qualitySelected}
          show={t.visible}
          sizeSelected={selectedVariant?.name || ""}
          variantActive={selectedVariant}
          price={selectedVariant?.pricing?.price?.gross?.amount || product?.pricing?.priceRange?.start?.gross?.amount}
        />
      ),
      {
        position: "top-right",
        id: `nc-product-notify-${selectedVariant?.id || "default"}`,
        duration: 3000,
      }
    );
  };
  

  const renderVariants = () => {
    if (!product?.variants?.length) return null;
  
    return (
      <div className="mb-6">
        <label className="block text-sm font-medium mb-1">
          Variant: <span className="">{product.variants[variantActive]?.name}</span>
        </label>
        <div className="flex gap-2 flex-wrap">
          {product.variants.map((variant, index) => (
            <button
              key={variant.id}
              onClick={() => setVariantActive(index)}
              className={`px-4 py-2 text-sm border transition-all rounded-none ${
                variantActive === index
                  ? "bg-gray-900 text-white border-gray-900"
                  : "bg-white text-black border-gray-300 hover:border-black"
              }`}
            >
              {variant.name}
            </button>
          ))}
        </div>
      </div>
    );
  };
  
  const renderDescriptionAsHtml = (description) => {
  try {
    const parsed = JSON.parse(description);
    if (parsed?.blocks?.length) {
      return parsed.blocks
        .map((block) => DOMPurify.sanitize(block.data?.text || ""))
        .join("");
    }
  } catch (e) {
    console.error("Failed to parse description JSON:", e);
  }
  return DOMPurify.sanitize(description || "");
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

  const renderSizeList = () => {
    if (!allOfSizes || !sizes || !sizes.length) {
      return null
    }
    return (
      <div>
        <div className="flex justify-between font-medium text-sm">
          <label htmlFor="">
            <span className="">
              Size:
              <span className="ml-1 ">{sizeSelected}</span>
            </span>
          </label>
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="##"
            className="text-primary-6000 hover:text-primary-500"
          >
            See sizing chart
          </a>
        </div>
        <div className="grid grid-cols-5 sm:grid-cols-7 gap-2 mt-3">
          {allOfSizes.map((size, index) => {
            const isActive = size === sizeSelected
            const sizeOutStock = !sizes.includes(size)
            return (
              <div
                key={index}
                className={`relative h-10 sm:h-11 rounded-2xl border flex items-center justify-center 
                text-sm sm:text-base uppercase  select-none overflow-hidden z-0 ${
                  sizeOutStock
                    ? "text-opacity-20 dark:text-opacity-20 cursor-not-allowed"
                    : "cursor-pointer"
                } ${
                  isActive
                    ? "bg-primary-6000 border-primary-6000 text-white hover:bg-primary-6000"
                    : "border-slate-300 dark:border-slate-600 text-slate-900 dark:text-slate-200 hover:bg-neutral-50 dark:hover:bg-neutral-700"
                }`}
                onClick={() => {
                  if (sizeOutStock) {
                    return
                  }
                  setSizeSelected(size)
                }}
              >
                {size}
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  const renderStatus = () => {
    if (!status) {
      return null
    }
    const CLASSES =
      "absolute top-3 left-3 px-2.5 py-1.5 text-xs bg-white dark:bg-slate-900 nc-shadow-lg rounded-none flex items-center justify-center text-slate-700 text-slate-900 dark:text-slate-300"
    if (status === "New in") {
      return (
        <div className={CLASSES}>
          <SparklesIcon className="w-3.5 h-3.5" />
          <span className="ml-1 leading-none">{status}</span>
        </div>
      )
    }
    if (status === "50% Discount") {
      return (
        <div className={CLASSES}>
          <IconDiscount className="w-3.5 h-3.5" />
          <span className="ml-1 leading-none">{status}</span>
        </div>
      )
    }
    if (status === "Sold Out") {
      return (
        <div className={CLASSES}>
          <NoSymbolIcon className="w-3.5 h-3.5" />
          <span className="ml-1 leading-none">{status}</span>
        </div>
      )
    }
    if (status === "limited edition") {
      return (
        <div className={CLASSES}>
          <ClockIcon className="w-3.5 h-3.5" />
          <span className="ml-1 leading-none">{status}</span>
        </div>
      )
    }
    return null
  }

  const renderSectionContent = () => {
    return (
      <div className="space-y-7 2xl:space-y-8">
        {/* ---------- 1 HEADING ----------  */}
        <div>
          <h2 className="text-2xl sm:text-3xl ">
            {product?.name}
          </h2>

          <div className="flex items-center mt-5 space-x-4 sm:space-x-5">
            {/* <div className="flex text-xl ">$112.00</div> */}
            <Prices
              price={product?.pricing?.priceRange?.start?.gross?.amount}
            />

            <div className="h-7 border-l border-slate-300 dark:border-slate-700"></div>

            <div className="flex items-center">
              <a
                href="#reviews"
                className="flex items-center text-sm font-medium"
              >
                <StarIcon className="w-5 h-5 pb-[1px] text-yellow-400" />
                <div className="ml-1.5 flex">
                  <span>4.9</span>
                  <span className="block mx-2">·</span>
                  <span className="text-slate-600 dark:text-slate-400 underline">
                    142 reviews
                  </span>
                </div>
              </a>
              <span className="hidden sm:block mx-2.5">·</span>
              <div className="hidden sm:flex items-center text-sm">
                <SparklesIcon className="w-3.5 h-3.5" />
                <span className="ml-1 leading-none">{status}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="">{renderVariants()}</div>


        {/*  ---------- 4  QTY AND ADD TO CART BUTTON */}
   <div className="flex space-x-3.5">
      <div className="flex items-center justify-center bg-slate-100/70 dark:bg-slate-800/70 px-2 py-3 sm:p-3.5 rounded-none">
        <NcInputNumber
          defaultValue={qualitySelected}
          onChange={setQualitySelected}
        />
      </div>

      <ButtonPrimary
        className="flex-1 flex-shrink-0"
        onClick={async () => {
          if (!product?.variants?.length) {
            toast.error("No variants available for this product.");
            return;
          }

          const selectedVariant = product.variants[variantActive]; 
          if (!selectedVariant?.id) {
            toast.error("Please select a valid variant.");
            return;
          }

          try {
            const response = await addToCart(
              selectedVariant.id,
              qualitySelected
            );

            if (response?.checkout?.id) {
              sessionStorage.setItem("checkout_id", response.checkout.id);
              notifyAddTocart();
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
        <BagIcon className="hidden sm:inline-block w-5 h-5 mb-0.5" />
        <span className="ml-3">Add to cart</span>
        </ButtonPrimary>
          
        <ButtonSecondary
          className="flex-1 flex-shrink-0"
          onClick={() => {
            const tokenKey = process.env.NEXT_PUBLIC_SALEOR_API_URL + "+saleor_auth_module_refresh_token";
            const token = sessionStorage.getItem(tokenKey);

            if (!token) {
              toast.error("You must create an account to start a registry.");
              router.push("/login");
              return;
            }

            setIsSelectRegistryOpen(true);
          }}
        >
          <span className="ml-3">Add to registry</span>
        </ButtonSecondary>

    </div>


        {/*  */}
        <hr className=" 2xl:!my-10 border-slate-200 dark:border-slate-700"></hr>
        {/*  */}

        {/* ---------- 5 ----------  */}
        <AccordionInfo productDescription={renderDescriptionAsHtml(product?.description)} />

        {/* ---------- 6 ----------  */}
        <div className="hidden xl:block">
          <Policy />
        </div>
      </div>
    )
  }

  const renderReviews = () => {
    return (
      <div className="">
        {/* HEADING */}
        <h2 className="text-2xl  flex items-center">
          <StarIcon className="w-7 h-7 mb-0.5" />
          <span className="ml-1.5"> 4,87 · 142 Reviews</span>
        </h2>

        {/* comment */}
        <div className="mt-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-11 gap-x-28">
            <ReviewItem />
            <ReviewItem
              data={{
                comment: `I love the charcoal heavyweight hoodie. Still looks new after plenty of washes. 
                  If you're unsure which hoodie to pick.`,
                date: "December 22, 2021",
                name: "Stiven Hokinhs",
                starPoint: 5
              }}
            />
            <ReviewItem
              data={{
                comment: `The quality and sizing mentioned were accurate and really happy with the purchase. Such a cozy and comfortable hoodie. 
                Now that it's colder, my husband wears his all the time. I wear hoodies all the time. `,
                date: "August 15, 2022",
                name: "Gropishta keo",
                starPoint: 5
              }}
            />
            <ReviewItem
              data={{
                comment: `Before buying this, I didn't really know how I would tell a "high quality" sweatshirt, but after opening, I was very impressed. 
                The material is super soft and comfortable and the sweatshirt also has a good weight to it.`,
                date: "December 12, 2022",
                name: "Dahon Stiven",
                starPoint: 5
              }}
            />
          </div>

          <ButtonSecondary
            onClick={() => setIsOpenModalViewAllReviews(true)}
            className="mt-10 border border-slate-300 dark:border-slate-700 "
          >
            Show me all 142 reviews
          </ButtonSecondary>
        </div>
      </div>
    )
  }

  return (
    <div className={`nc-ProductDetailPage `}>
      {/* MAIn */}
      <main className="container mt-5 lg:mt-11">
        <div className="lg:flex">
          {/* CONTENT */}
          <div className="w-full lg:w-[55%] ">
            {/* HEADING */}
            <div className="relative">
              <div className="aspect-w-16 aspect-h-16 relative">
                <Image
                  fill
                  sizes="(max-width: 640px) 100vw, 33vw"
                  src={product?.media[0].url}
                  className="w-full rounded-2xl object-cover"
                  alt="product detail 1"
                />
              </div>
              {renderStatus()}
              {/* META FAVORITES */}
              <LikeButton 
                className="absolute right-3 top-3 z-10"
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

            </div>
            <div className="grid grid-cols-2 gap-3 mt-3 sm:gap-6 sm:mt-6 xl:gap-8 xl:mt-8">
              {product?.media
                ?.slice(1, 3) // Get the second and third images only
                .filter(media => media?.url) // Filter out null/undefined URLs
                .map((media, index) => (
                  <div
                    key={index}
                    className="aspect-w-11 xl:aspect-w-10 2xl:aspect-w-11 aspect-h-16 relative"
                  >
                    <Image
                      sizes="(max-width: 640px) 100vw, 33vw"
                      fill
                      src={media.url}
                      className="w-full rounded-2xl object-cover"
                      alt={`product detail ${index + 2}`}
                    />
                  </div>
                ))}
            </div>
          </div>

          {/* SIDEBAR */}
          <div className="w-full lg:w-[45%] pt-10 lg:pt-0 lg:pl-7 xl:pl-9 2xl:pl-10">
            {renderSectionContent()}
          </div>
        </div>

        {/* DETAIL AND REVIEW */}
        <div className="mt-12 sm:mt-16 space-y-10 sm:space-y-16">
          <div className="block xl:hidden">
            <Policy />
          </div>

          <hr className="border-slate-200 dark:border-slate-700" />

          {renderReviews()}

          <hr className="border-slate-200 dark:border-slate-700" />

          {/* OTHER SECTION */}
          <SectionSliderProductCard
            heading="Customers also purchased"
            subHeading=""
            headingFontClassName="text-2xl "
            headingClassName="mb-10 text-neutral-900 dark:text-neutral-50"
          />

          {/* SECTION */}
          <div className="pb-20 xl:pb-28 lg:pt-14">
            <SectionPromo2 />
          </div>
        </div>
      </main>
      <SelectRegistryModal
        isOpen={isSelectRegistryOpen}
        onClose={() => setIsSelectRegistryOpen(false)}
        onSelect={async (registryUuid) => {
          setIsSelectRegistryOpen(false);
          const variantId = product.variants?.[variantActive]?.id;
          if (!variantId) {
            toast.error("No variant selected.");
            return;
          }
          setSelectedRegistryUuid(registryUuid);
          setSelectedVariantId(variantId);
          const isVirtual = Array.isArray(product.productType?.metadata) &&
            product.productType.metadata.some(
              (meta) => meta.key === "registry.product_type" && meta.value === "virtual"
            );
          if (isVirtual) {
            setIsRegistryProductFormOpen(true);
          } else {
            // For normal products, show group gifting modal
            setPendingRegistryData({
              registryUuid,
              variantId,
              quantity: qualitySelected,
              isVirtual: false,
            });
            setIsGroupGiftingModalOpen(true);
          }
        }}
      />

      {/* For virtual products: after RegistryProductForm, show group gifting modal */}
      {isRegistryProductFormOpen && Array.isArray(product.productType?.metadata) &&
        product.productType.metadata.some(
          (meta) => meta.key === "registry.product_type" && meta.value === "virtual"
        ) && (
        <RegistryProductForm
          isOpen={true}
          onClose={() => setIsRegistryProductFormOpen(false)}
          onSubmit={({ title, description, price }) => {
            setIsRegistryProductFormOpen(false);
            setPendingRegistryData({
              registryUuid: selectedRegistryUuid,
              variantId: selectedVariantId,
              quantity: qualitySelected,
              isVirtual: true,
              title,
              description,
              price,
            });
            setIsGroupGiftingModalOpen(true);
          }}
        />
      )}

      {/* Group Gifting Modal */}
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

      {/* MODAL VIEW ALL REVIEW */}
      <ModalViewAllReviews
        show={isOpenModalViewAllReviews}
        onCloseModalViewAllReviews={() => setIsOpenModalViewAllReviews(false)}
      />
    </div>
    
  )
}

export default ProductDetailPage
