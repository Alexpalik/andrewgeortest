"use client";

import React, { useRef } from "react";
import Heading from "./Heading/Heading";

interface Item {
  name: string;
  desc: string;
  image: string;
}

const DiscoverMoreSlider: React.FC = () => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const items: Item[] = [
    {
      name: "Οικιακός Εξοπλισμός",
      desc: "Digital Gift Cards",
      image: "/images/minimalist-interior.jpg",
    },
    {
      name: "Οικιακός Εξοπλισμός",
      desc: "Digital Gift Cards",
      image: "/images/dish-house-decor.png",
    },
    {
      name: "Βρεφικά Παιδικά",
      desc: "Digital Gift Cards",
      image: "/images/baby-room.png",
    },
    {
      name: "Ηλεκτρονικά & Ψυχαγωγία",
      desc: "Electronics & Entertainment",
      image: "/images/electronics.jpg",
    },
    {
      name: "Αθλητισμός & Δραστηριότητες",
      desc: "Sports & Activities",
      image: "/images/sports.jpg",
    },
  ];

  const scroll = (direction: "left" | "right") => {
    const container = scrollContainerRef.current;
    if (!container) return;
    
    const isDesktop = window.innerWidth >= 1024;
    const scrollAmount = isDesktop 
      ? container.offsetWidth / 3 // Desktop: scroll by 1/3 container width (1 card)
      : container.offsetWidth; // Mobile: scroll by full container width
    
    if (direction === "left") {
      container.scrollBy({ left: -scrollAmount, behavior: "smooth" });
    } else {
      container.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  return (
    <div className="w-full">

      {/* Carousel Arrows */}
      <div className="flex justify-end mb-4 space-x-2">
        <button
          onClick={() => scroll("left")}
          className="w-12 h-12 rounded-full bg-white border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors"
          aria-label="Previous"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M19 12H5" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M12 19L5 12L12 5" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <button
          onClick={() => scroll("right")}
          className="w-12 h-12 rounded-full bg-white border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors"
          aria-label="Next"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M5 12H19" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M12 5L19 12L12 19" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>

      {/* MOBILE Carousel */}
      <div className="lg:hidden overflow-hidden">
        <div
          ref={scrollContainerRef}
          className="flex overflow-x-auto no-scrollbar snap-x snap-mandatory gap-[3.5rem]"
        >
        {items.map((item, index) => (
          <div
            key={index}
            className="flex-shrink-0 w-[calc(100vw-3rem)] max-w-sm snap-start relative group"
          >
            <img
              src={item.image}
              alt={item.name}
              className="w-full h-[350px] object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-20"></div>

            {/* Top Left: Heading and Subheading */}
            <div className="absolute left-5 top-5 text-white space-y-2">
              <p className="text-sm font-light uppercase tracking-wide" style={{ fontFamily: "'Gotham', Arial, sans-serif" }}>{item.desc}</p>
              <h3 className="text-2xl lg:text-3xl font-light leading-tight" style={{lineHeight: '1.1', fontFamily: "'Gotham', Arial, sans-serif"}}>
                {item.name.split(' ')[0]}<br />
                {item.name.split(' ').slice(1).join(' ')}
              </h3>
            </div>
            
            {/* Bottom Left: Button */}
            <div className="absolute left-5 bottom-5">
              <a
                href="/collection"
                className="inline-block bg-white text-[#063B67] text-sm font-medium px-4 py-2 hover:bg-gray-100 transition-colors"
                style={{ fontFamily: "'Gotham', Arial, sans-serif" }}
              >
                Show me all
              </a>
            </div>
          </div>
        ))}
        </div>
      </div>

      {/* DESKTOP Carousel */}
      <div className="hidden lg:block overflow-hidden ">
        <div
          ref={scrollContainerRef}
          className="flex overflow-x-auto no-scrollbar snap-x snap-mandatory gap-[2rem]"
          style={{ scrollSnapType: 'x mandatory' }}
        >
          {items.map((item, index) => (
            <div
              key={index}
              className="relative overflow-hidden rounded-none group flex-shrink-0 snap-start"
              style={{ width: 'calc((100% - 2rem) / 3)' }}
            >
            <img
              src={item.image}
              alt={item.name}
              className="w-full h-[350px] object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-20"></div>

            {/* Top Left: Heading and Subheading */}
            <div className="absolute left-5 top-5 text-white space-y-2">
              <p className="text-sm font-light uppercase tracking-wide" style={{ fontFamily: "'Gotham', Arial, sans-serif" }}>{item.desc}</p>
              <h3 className="text-2xl lg:text-3xl font-light leading-tight" style={{lineHeight: '1.1', fontFamily: "'Gotham', Arial, sans-serif"}}>
                {item.name.split(' ')[0]}<br />
                {item.name.split(' ').slice(1).join(' ')}
              </h3>
            </div>
            
            {/* Bottom Left: Button */}
            <div className="absolute left-5 bottom-5">
              <a
                href="/collection"
                className="inline-block bg-white text-[#063B67] text-sm font-medium px-4 py-2 hover:bg-gray-100 transition-colors"
                style={{ fontFamily: "'Gotham', Arial, sans-serif" }}
              >
                Show me all
              </a>
            </div>
                      </div>
          ))}
          </div>
        </div>
      </div>
  );
};

export default DiscoverMoreSlider;
