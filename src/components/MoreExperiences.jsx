"use client";

import React, { useEffect, useRef, useState } from "react";
import Heading from "./Heading/Heading";

const MoreExperiencesSection = () => {
  const scrollContainerRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Check window width only once when component mounts
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

  const items = [
    {
      name: "Ταξίδια & Εμπειρίες",
      desc: "Digital Gift Cards",
      image: "/images/basilica-santa-maria.png",
    },
    {
      name: "Χρηματικά Δώρα",
      desc: "Digital Gift Cards",
      image: "/images/money.png",
    },
    {
      name: "Ταξίδια & Εμπειρίες",
      desc: "Digital Gift Cards",
      image: "/images/basilica-santa-maria.png",
    },
    {
      name: "Χρηματικά Δώρα",
      desc: "Digital Gift Cards",
      image: "/images/money.png",
    },
  ];

  return (
    <div className="w-full mt-20 ">
      {/* Heading and Arrows */}
      <div className="flex justify-between items-center mb-4">
        <Heading 
          className="text-[#063B67]" 
          fontClass="text-3xl md:text-4xl"
          style={{ fontFamily: "'Gotham', Arial, sans-serif" }}
        >
          More Experiences
        </Heading>
        <div className="flex space-x-2">
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
      </div>

      {/* Carousel */}
      <div
        ref={scrollContainerRef}
        className="flex overflow-x-auto no-scrollbar snap-x snap-mandatory"
      >
        {isMobile
          ? // Mobile: one item per slide
            items.map((item, index) => (
              <div
                key={index}
                className="flex-shrink-0 w-full snap-start"
              >
                <div className="relative w-full h-[450px] overflow-hidden rounded-none group">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
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
                    <button className="inline-block bg-white text-[#063B67] text-sm font-medium px-4 py-2 hover:bg-gray-100 transition-colors" style={{ fontFamily: "'Gotham', Arial, sans-serif" }}>
                      Show me all
                    </button>
                  </div>
                </div>
              </div>
            ))
          : // Desktop: two items per slide
            Array.from({ length: Math.ceil(items.length / 2) }).map((_, groupIndex) => (
              <div
                key={groupIndex}
                className="flex-shrink-0 w-full flex justify-center gap-8 snap-start"
              >
                {items
                  .slice(groupIndex * 2, groupIndex * 2 + 2)
                  .map((item, index) => (
                    <div
                      key={index}
                      className="relative w-1/2 h-[450px] overflow-hidden rounded-none group"
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
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
                        <button className="inline-block bg-white text-[#063B67] text-sm font-medium px-4 py-2 hover:bg-gray-100 transition-colors" style={{ fontFamily: "'Gotham', Arial, sans-serif" }}>
                          Show me all
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            ))}
      </div>
    </div>
  );
};

export default MoreExperiencesSection;
