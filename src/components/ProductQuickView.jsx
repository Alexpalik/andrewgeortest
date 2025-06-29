"use client"
import React, { useState } from "react"
import ButtonPrimary from "@/shared/Button/ButtonPrimary"
import LikeButton from "@/components/LikeButton"
import { StarIcon } from "@heroicons/react/24/solid"
import BagIcon from "@/components/BagIcon"
import NcInputNumber from "@/components/NcInputNumber"
import DOMPurify from "dompurify"
import {
  NoSymbolIcon,
  ClockIcon,
  SparklesIcon
} from "@heroicons/react/24/outline"
import IconDiscount from "@/components/IconDiscount"
import Prices from "@/components/Prices"
import toast from "react-hot-toast"
import NotifyAddTocart from "./NotifyAddTocart"
import AccordionInfo from "@/components/AccordionInfo"
import Image from "next/image"
import Link from "next/link"
import { useCheckout } from "@/app/CheckoutContext"
import { addToCart } from "@/app/lib/saleorCart"
import ButtonSecondary from "@/shared/Button/ButtonSecondary"
import SelectRegistryModal from "./SelectRegistryModal"
import RegistryProductForm from "@/components/RegistryProductForm"

const ProductQuickView = ({ className = "", product, variantActive, onVariantChange }) => {
  if (!product) {
    return (
      <div className="text-center p-6">
        <p className="text-xl ">Product not found</p>
        <p className="text-gray-500">Please try again later.</p>
      </div>
    )
  }

  const { name, description, pricing, media, variants, sizes } = product
  const [sizeSelected, setSizeSelected] = useState(sizes ? sizes[0] : "")
  const [qualitySelected, setQualitySelected] = useState(1)
  const { refreshCheckout } = useCheckout()
  const [isSelectRegistryOpen, setIsSelectRegistryOpen] = useState(false)
  const [isRegistryProductFormOpen, setIsRegistryProductFormOpen] = useState(false)
  const [selectedRegistryUuid, setSelectedRegistryUuid] = useState(null)
  const [selectedVariantId, setSelectedVariantId] = useState(null)

  const renderDescription = description => {
    if (!description) {
      return "No description available."
    }

    try {
      const parsedDescription = JSON.parse(description)

      if (parsedDescription.blocks && Array.isArray(parsedDescription.blocks)) {
        return parsedDescription.blocks
          .map(block => DOMPurify.sanitize(block.data.text))
          .join("<br/>") // Join paragraphs with a line break
      }
    } catch (error) {
      console.error("Error parsing product description:", error)
    }

    return "No description available."
  }

  const notifyAddTocart = () => {
    toast.custom(
      t => (
        <NotifyAddTocart
          productImage={media[0].url}
          qualitySelected={qualitySelected}
          show={t.visible}
          sizeSelected={sizeSelected}
          variantActive={variantActive}
          variants={variants} 
        />
      ),
      { position: "top-right", id: "nc-product-notify", duration: 3000 }
    )
  }

  const renderVariants = () => {
    if (!variants || !variants.length) return null;
  
    return (
      <div>
        <label className="block text-sm font-medium mb-1">Variant:</label>
        <div className="flex gap-2 flex-wrap">
          {variants.map((variant, index) => (
            <button
              key={variant.id}
              onClick={() => onVariantChange(index)}
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
      </div>
    )
  }

  const renderSizeList = () => {
    if (!sizes || !sizes.length) {
      return null
    }
    return (
      <div>
        <div className="flex justify-between font-medium text-sm">
          <label htmlFor="">
            <span className="">
              Size:
              <span className="ms-1 ">{sizeSelected}</span>
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
        <div className="grid grid-cols-5 sm:grid-cols-7 gap-2 mt-2.5">
          {sizes.map((size, index) => {
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
      "absolute top-3 start-3 px-2.5 py-1.5 text-xs bg-white dark:bg-slate-900 nc-shadow-lg rounded-none flex items-center justify-center text-slate-700 text-slate-900 dark:text-slate-300"
    if (status === "New in") {
      return (
        <div className={CLASSES}>
          <SparklesIcon className="w-3.5 h-3.5" />
          <span className="ms-1 leading-none">{status}</span>
        </div>
      )
    }
    if (status === "50% Discount") {
      return (
        <div className={CLASSES}>
          <IconDiscount className="w-3.5 h-3.5" />
          <span className="ms-1 leading-none">{status}</span>
        </div>
      )
    }
    if (status === "Sold Out") {
      return (
        <div className={CLASSES}>
          <NoSymbolIcon className="w-3.5 h-3.5" />
          <span className="ms-1 leading-none">{status}</span>
        </div>
      )
    }
    if (status === "limited edition") {
      return (
        <div className={CLASSES}>
          <ClockIcon className="w-3.5 h-3.5" />
          <span className="ms-1 leading-none">{status}</span>
        </div>
      )
    }
    return null
  }

  const renderSectionContent = () => {
    return (
      <div className="space-y-8">
        {/* ---------- 1 HEADING ----------  */}
        <div>
          <h2 className="text-2xl  hover:text-primary-6000 transition-colors">
            <Link href="/">Heavy Weight Shoes</Link>
          </h2>

          <div className="flex justify-start rtl:justify-end items-center mt-5 space-x-4 sm:space-x-5 rtl:space-x-reverse">
            {/* <div className="flex text-xl ">$112.00</div> */}
            <Prices
              contentClass="py-1 px-2 md:py-1.5 md:px-3 text-lg "
              price={pricing.priceRange.start.gross.amount}
            />
            <div className="h-6 border-s border-slate-300 dark:border-slate-700"></div>

            <div className="flex items-center">
              <Link
                href="/product-detail-2"
                className="flex items-center text-sm font-medium"
              >
                <StarIcon className="w-5 h-5 pb-[1px] text-yellow-400" />
                <div className="ms-1.5 flex">
                  <span>4.9</span>
                  <span className="block mx-2">·</span>
                  <span className="text-slate-600 dark:text-slate-400 underline">
                    142 reviews
                  </span>
                </div>
              </Link>
              <span className="hidden sm:block mx-2.5">·</span>
              <div className="hidden sm:flex items-center text-sm">
                <SparklesIcon className="w-3.5 h-3.5" />
                <span className="ms-1 leading-none">{status}</span>
              </div>
            </div>
          </div>
        </div>

        {/* ---------- 3 VARIANTS AND SIZE LIST ----------  */}
        <div className="">{renderVariants()}</div>
        <div className="">{renderSizeList()}</div>

        {/*  ---------- 4  QTY AND ADD TO CART BUTTON */}
        <div className="flex flex-col sm:flex-row sm:space-x-3.5 rtl:space-x-reverse">
          <div className="flex items-center justify-center bg-slate-100/70 dark:bg-slate-800/70 px-2 py-3 sm:p-3.5 rounded-none sm:mb-0 mb-3">
            <NcInputNumber
              defaultValue={qualitySelected}
              onChange={setQualitySelected}
            />
          </div>
          <ButtonPrimary
            className="flex-1 mb-3 sm:mb-0"
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
                const response = await addToCart(selectedVariant.id, qualitySelected);

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
            <span className="ms-3">Add to cart</span>
          </ButtonPrimary>
        </div>

        {/* Add to Registry below */}
        <ButtonSecondary
          className="w-full sm:w-auto"
          onClick={() => {
            const tokenKey =
              process.env.NEXT_PUBLIC_SALEOR_API_URL + "+saleor_auth_module_refresh_token";
            const token = sessionStorage.getItem(tokenKey);

            if (!token) {
              toast.error("You must be logged in to add to registry.");
              return;
            }

            setIsSelectRegistryOpen(true);
          }}
        >
          Add to Registry
        </ButtonSecondary>

        {/*  */}
        <hr className=" border-slate-200 dark:border-slate-700"></hr>
        {/*  */}

        {/* ---------- 5 ----------  */}
        <AccordionInfo
          data={[
            {
              name: "Description",
              content: renderDescription(description)
            }
            //   {
            //     name: "Features",
            //     content: `<ul class="list-disc list-inside leading-7">
            //   <li>Material: 43% Sorona Yarn + 57% Stretch Polyester</li>
            //   <li>
            //    Casual pants waist with elastic elastic inside
            //   </li>
            //   <li>
            //     The pants are a bit tight so you always feel comfortable
            //   </li>
            //   <li>
            //     Excool technology application 4-way stretch
            //   </li>
            // </ul>`,
            //   },
          ]}
        />
      </div>
    )
  }

  return (
    <>
    <div className={`nc-ProductQuickView ${className}`}>
      {/* MAIn */}
      <div className="lg:flex">
        {/* CONTENT */}
        <div className="w-full lg:w-[50%] ">
          {/* HEADING */}
          <div className="relative">
            <div className="aspect-w-16 aspect-h-16">
              <Image
                src={media[0].url}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="w-full rounded-none object-cover"
                alt="product detail 1"
              />
            </div>

            {/* STATUS */}
            {renderStatus()}
            {/* META FAVORITES */}
            <LikeButton className="absolute end-3 top-3 " />
          </div>
          {/* <div className="hidden lg:grid grid-cols-2 gap-3 mt-3 sm:gap-6 sm:mt-6 xl:gap-5 xl:mt-5">
            {[LIST_IMAGES_DEMO[1], LIST_IMAGES_DEMO[2]].map((item, index) => {
              return (
                <div key={index} className="aspect-w-3 aspect-h-4">
                  <Image
                    fill
                    src={item}
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="w-full rounded-none object-cover"
                    alt="product detail 1"
                  />
                </div>
              );
            })}
          </div> */}
        </div>

        {/* SIDEBAR */}
        <div className="w-full lg:w-[50%] pt-6 lg:pt-0 lg:ps-7 xl:ps-8">
          {renderSectionContent()}
        </div>
      </div>
    </div>
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
        // Debug: log productType metadata
        console.log('productType.metadata:', product.productType?.metadata);
        // Show form if productType.metadata has registry.product_type === 'virtual'
        const isVirtual = Array.isArray(product.productType?.metadata) &&
          product.productType.metadata.some(
            (meta) => meta.key === "registry.product_type" && meta.value === "virtual"
          );
        if (isVirtual) {
          setIsRegistryProductFormOpen(true);
        } else {
          // Add to registry directly for non-virtual products
          const token = sessionStorage.getItem(
            process.env.NEXT_PUBLIC_SALEOR_API_URL + "+saleor_auth_module_refresh_token"
          );
          try {
            const response = await fetch(
              `${process.env.NEXT_PUBLIC_REGISTRY_URL}/api/registries/${registryUuid}/products/`,
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                  web_variant_id: variantId,
                  quantity: qualitySelected,
                }),
              }
            );
            if (!response.ok) throw new Error("Failed to add to registry");
            toast.success("Product added to registry!");
          } catch (error) {
            console.error("Add to registry failed:", error);
            toast.error("Could not add product to registry.");
          }
        }
      }}
    />
    {isRegistryProductFormOpen && Array.isArray(product.productType?.metadata) &&
      product.productType.metadata.some(
        (meta) => meta.key === "registry.product_type" && meta.value === "virtual"
      ) && (
      <RegistryProductForm
        isOpen={true}
        onClose={() => setIsRegistryProductFormOpen(false)}
        onSubmit={async ({ title, description, price }) => {
          setIsRegistryProductFormOpen(false);
          const token = sessionStorage.getItem(
            process.env.NEXT_PUBLIC_SALEOR_API_URL + "+saleor_auth_module_refresh_token"
          );
          try {
            const response = await fetch(
              `${process.env.NEXT_PUBLIC_REGISTRY_URL}/api/registries/${selectedRegistryUuid}/products/`,
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                  web_variant_id: selectedVariantId,
                  quantity: qualitySelected,
                  virtual_product_title: title,
                  virtual_product_description: description,
                  virtual_product_price: parseFloat(price),
                  virtual_product_price_currency: "EUR",
                }),
              }
            );
            if (!response.ok) throw new Error("Failed to add to registry");
            toast.success("Product added to registry!");
          } catch (error) {
            console.error("Add to registry failed:", error);
            toast.error("Could not add product to registry.");
          }
        }}
      />
    )}
  </>
  )
  
}

export default ProductQuickView
