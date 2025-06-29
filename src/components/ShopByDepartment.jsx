"use client";

import React, { useEffect, useRef, useState } from "react";
import Heading from "./Heading/Heading"; // IMPORT your Heading component!

const departments = [
  {
    title: "Travel Kits",
    subtitle: "20+ categories",
    image: "/images/travel-kits.png",
    link: "/collection",
  },
  {
    title: "Beauty Products",
    subtitle: "10+ categories",
    image: "/images/beauty-products.png",
    link: "/collection",
  },
  {
    title: "Sport Kits",
    subtitle: "34+ categories",
    image: "/images/sport-kits.png",
    link: "/collection",
  },
  {
    title: "Pets Food",
    subtitle: "12+ categories",
    image: "/images/pets-food.png",
    link: "/collection",
  },
  {
    title: "Toys",
    subtitle: "8+ categories",
    image: "/images/toys.png",
    link: "/collection",
  },
  {
    title: "Travel Kits",
    subtitle: "20+ categories",
    image: "/images/travel-kits.png",
    link: "/collection",
  },
  {
    title: "Beauty Products",
    subtitle: "10+ categories",
    image: "/images/beauty-products.png",
    link: "/collection",
  },
  {
    title: "Sport Kits",
    subtitle: "34+ categories",
    image: "/images/sport-kits.png",
    link: "/collection",
  },
  {
    title: "Pets Food",
    subtitle: "12+ categories",
    image: "/images/pets-food.png",
    link: "/collection",
  },
  {
    title: "Toys",
    subtitle: "8+ categories",
    image: "/images/toys.png",
    link: "/collection",
  },
  {
    title: "Travel Kits",
    subtitle: "20+ categories",
    image: "/images/travel-kits.png",
    link: "/collection",
  },
  {
    title: "Beauty Products",
    subtitle: "10+ categories",
    image: "/images/beauty-products.png",
    link: "/collection",
  },
];

const ShopByDepartmentSection = () => {
  const scrollContainerRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const scroll = (direction) => {
    const container = scrollContainerRef.current;
    const containerWidth = container.offsetWidth;

    if (direction === "left") {
      container.scrollBy({ left: -containerWidth, behavior: "smooth" });
    } else {
      container.scrollBy({ left: containerWidth, behavior: "smooth" });
    }
  };

  return (
    <div className="w-full mt-20 ">
      {/* Heading and Arrows */}
      

      {/* Carousel */}
      <div
        ref={scrollContainerRef}
        className="flex overflow-x-auto no-scrollbar snap-x snap-mandatory"
      >
        {isMobile
          ? departments.map((item, index) => (
              <div
                key={index}
                className="flex-shrink-0 w-full px-4 snap-start"
              >
                <a
                  href={item.link}
                  className="flex flex-col items-center text-center group"
                >
                  <div className="w-full h-48 overflow-hidden rounded-none mb-4">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                </a>
              </div>
            ))
          : Array.from({ length: Math.ceil(departments.length / 6) }).map((_, groupIndex) => (
              <div
                key={groupIndex}
                className="flex-shrink-0 w-full flex justify-center gap-6 snap-start"
              >
                {departments
                  .slice(groupIndex * 6, groupIndex * 6 + 6)
                  .map((item, index) => (
                    <a
                      href={item.link}
                      key={index}
                      className="flex flex-col items-center text-center group w-1/6"
                    >
                      <div className="w-full h-48 overflow-hidden rounded-none mb-4">
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      </div>
                    </a>
                  ))}
              </div>
            ))}
      </div>
    </div>
  );
};

export default ShopByDepartmentSection;
