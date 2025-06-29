"use client"
import React, { useEffect, useRef, useState } from "react"
import Heading from "@/components/Heading/Heading"
import Glide from "@glidejs/glide"
import ProductCard from "./ProductCard"
import fetchSaleorProducts from "@/app/lib/collectionView"

const SectionSliderProductCard = ({
  className = "",
  itemClassName = "",
  headingFontClassName,
  headingClassName,
  heading,
  subHeading = "You may also like",
  currentProductId // Ensure we exclude the current product from recommendations
}) => {
  const sliderRef = useRef(null)
  const [products, setProducts] = useState([])
  const [isShow, setIsShow] = useState(false)

  useEffect(() => {
    async function loadRelatedProducts() {
      try {
        const { products } = await fetchSaleorProducts(
          4,
          null,
          "default-channel"
        )
        setProducts(products.filter(p => p.id !== currentProductId)) // Exclude current product
      } catch (error) {
        console.error("Error fetching related products:", error)
      }
    }
    loadRelatedProducts()
  }, [currentProductId])

  useEffect(() => {
    if (!sliderRef.current || products.length === 0) return

    const OPTIONS = {
      perView: 4,
      gap: 32,
      bound: true,
      breakpoints: {
        1280: { perView: 3 },
        1024: { perView: 3, gap: 20 },
        768: { perView: 2, gap: 20 },
        640: { perView: 1.5, gap: 20 },
        500: { perView: 1.3, gap: 20 }
      }
    }

    const slider = new Glide(sliderRef.current, OPTIONS)
    slider.mount()
    setIsShow(true)

    return () => slider.destroy()
  }, [products])

  if (products.length === 0) return null // Prevent rendering empty slider

  return (
    <div className={`nc-SectionSliderProductCard ${className}`}>
      <div ref={sliderRef} className={`flow-root ${isShow ? "" : "invisible"}`}>
        <Heading
          className={headingClassName}
          fontClass={headingFontClassName}
          rightDescText={subHeading}
          hasNextPrev
        >
          {heading || `New Arrivals`}
        </Heading>
        <div className="glide__track" data-glide-el="track">
          <ul className="glide__slides">
            {products.slice(0, 4).map((
              item,
              index // Show only 4 products
            ) => (
              <li key={index} className={`glide__slide ${itemClassName}`}>
                <ProductCard data={item} />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}

export default SectionSliderProductCard
