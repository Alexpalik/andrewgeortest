"use client"

import React, { useRef } from "react"



{/* This is how you add comments inside JSX/React components */}

const BaptismAndBabyShowerSection = () => {
  const baptismCarouselRef = useRef(null)
  const babyShowerCarouselRef = useRef(null)

  // Sample products for baptism category
  const baptismProducts = [
    { image: "/images/product1.png" },
    { image: "/images/product2.png" },
    { image: "/images/product3.png" },
    { image: "/images/product4.png" },
    { image: "/images/product5.png" },
    { image: "/images/product6.png" },
  ]

  // Sample products for baby shower category
  const babyShowerProducts = [
    { image: "/images/product1.png" },
    { image: "/images/product2.png" },
    { image: "/images/product3.png" },
    { image: "/images/product4.png" },
    { image: "/images/product5.png" },
    { image: "/images/product6.png" },
  ]

  const scroll = (ref, direction) => {
    const container = ref.current
    if (!container) return
    const containerWidth = container.offsetWidth
    if (direction === "left") {
      container.scrollBy({ left: -containerWidth, behavior: "smooth" })
    } else {
      container.scrollBy({ left: containerWidth, behavior: "smooth" })
    }
  }

  const ProductCarousel = ({ products, carouselRef, title }) => (
    <div className="mt-8">
      {/* Carousel Navigation */}
      {/* <div className="flex justify-end mb-4 space-x-2 ">
        <button
          onClick={() => scroll(carouselRef, "left")}
          className="p-2 bg-gray-200 hover:bg-gray-300"
        >
          ←
        </button>
        <button
          onClick={() => scroll(carouselRef, "right")}
          className="p-2 bg-gray-200 hover:bg-gray-300"
        >
          →
        </button>
      </div> */}

      {/* Products Carousel */}
      <div className="overflow-hidden">
        <div
          ref={carouselRef}
          className="flex overflow-x-auto no-scrollbar snap-x snap-mandatory"
        >
          {/* Group products in sets of 3 for desktop */}
          {Array.from({ length: Math.ceil(products.length / 3) }).map((_, groupIndex) => (
            <div
              key={groupIndex}
              className="flex-shrink-0 flex  snap-start"
              style={{ width: '100%' }}
            >
              {products
                .slice(groupIndex * 3, groupIndex * 3 + 3)
                .map((product, index) => (
                  <div
                    key={index}
                    className="flex-shrink-0"
                    style={{ width: 'calc((100% - 2rem) / 3)' }}
                  >
                    <img
                      src={product.image}
                      alt={`${title} product ${index + 1}`}
                      className="w-full h-[200px] object-cover"
                    />
                  </div>
                ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  return (
    <div className="w-full ">
      {/* Static Category Cards - Side by Side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Baptism Card */}
        <div className="relative overflow-hidden group">
          <img style={{ height:'100%'}}
            src="/images/wedding.png"
            alt="Baptism list inspiration"
            className="w-full h-[400px] object-cover"
          />
          <div className="absolute inset-0"></div>

          {/* Text Content */}
          <div className="absolute top-8 left-8 text-white max-w-[80%] space-y-3" style={{ padding:'30px'}}>
            <h3 
              className="text-2xl lg:text-3xl font-light leading-tight" 
              style={{ fontFamily: "'Gotham', Arial, sans-serif" , fontSize:'55px', lineHeight:'1.1'}}
            >
              Baby shower<br />
              list inspiration
            </h3>
            <p 
              className="text-sm font-light" 
              style={{ fontFamily: "'Gotham', Arial, sans-serif" ,  fontSize:'20px'}}
            >
              With Ciseco you will get freeship &<br />
              savings combo...
            </p>
          </div>

          {/* Button */}
          <div className="absolute bottom-8 left-8">
            <button 
              className="bg-[#063B67] text-white text-sm px-5 py-2 hover:bg-[#052d4a] transition-colors"
              style={{ fontFamily: "'Gotham', Arial, sans-serif", fontSize:'16px' , padding:'15.5px 24px' , marginLeft:'30px', marginBottom:'50px' }}
            >
              Μάθε περισσότερα
            </button>
          </div>
        </div>

        {/* Baby Shower Card */}
        <div className="relative overflow-hidden group">
          <img style={{ height:'100%'}}
            src="/images/baby.png"
            alt="Baby shower list inspiration"
            className="w-full h-[400px] object-cover"
          />
          <div className="absolute inset-0  "></div>

          {/* Text Content */}
          <div className="absolute top-8 left-8 text-white max-w-[80%] space-y-3" style={{ padding:'30px'}}>
            <h3 
              className="text-2xl lg:text-3xl font-light leading-tight" 
              style={{ fontFamily: "'Gotham', Arial, sans-serif" , fontSize:'55px', lineHeight:'1.1'}}
            >
              Baby shower<br />
              list inspiration
            </h3>
            <p 
              className="text-sm font-light" 
              style={{ fontFamily: "'Gotham', Arial, sans-serif", fontSize:'20px' }}
            >
              With Ciseco you will get freeship &<br />
              savings combo...
            </p>
          </div>

          {/* Button */}
          <div className="absolute bottom-8 left-8">
            <button 
              className="bg-[#063B67] text-white text-sm px-5 py-2 hover:bg-[#052d4a] transition-colors"
              style={{ fontFamily: "'Gotham', Arial, sans-serif", fontSize:'16px' , padding:'15.5px 24px' , marginLeft:'30px', marginBottom:'50px' }}
            >
              Μάθε περισσότερα
            </button>
          </div>
        </div>
      </div>

      {/* Product Carousels - One for each category */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Baptism Products Carousel */}
        <div>
          <ProductCarousel 
            products={baptismProducts} 
            carouselRef={baptismCarouselRef} 
            title="Baptism"
          />
        </div>

        {/* Baby Shower Products Carousel */}
        <div>
          <ProductCarousel 
            products={babyShowerProducts} 
            carouselRef={babyShowerCarouselRef} 
            title="Baby Shower"
          />
        </div>
      </div>
    </div>
  )
}

export default BaptismAndBabyShowerSection
