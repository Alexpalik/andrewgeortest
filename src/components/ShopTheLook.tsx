"use client";

import React, { useState, useEffect } from "react";
import Heading from "./Heading/Heading"; // 👈 Import your Heading component!

const ShopTheLookSection = () => {
  const [activeDot, setActiveDot] = useState<number | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return null;

  const dots = [
    {
      id: 1,
      top: "40%",
      left: "25%",
      product: {
        title: "Living Room Wallpaper",
        link: "/collection",
      },
    },
    {
      id: 2,
      top: "72%",
      left: "40%",
      product: {
        title: "Wooden Coffee Table",
        link: "/collection",
      },
    },
    {
      id: 3,
      top: "35%",
      left: "75%",
      product: {
        title: "Green Indoor Plant",
        link: "/collection",
      },
    },
  ];

  const handleDotClick = (id: number) => {
    setActiveDot(activeDot === id ? null : id);
  };

  return (
    <div className="w-full py-16 hidden md:block ">
      {/* Updated Heading */}
      <Heading 
        className="text-[#063B67] mb-8" 
        fontClass="text-3xl md:text-4xl"
        style={{ fontFamily: "'Gotham', Arial, sans-serif" }}
      >
        Shop the look
      </Heading>

      <div className="relative w-full aspect-[16/9] overflow-hidden">
        <img
          src="/images/shop-the-look-room.png"
          alt="Shop the look"
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* Render Dots */}
        {dots.map((dot) => (
          <div
            key={dot.id}
            className="absolute"
            style={{ top: dot.top, left: dot.left }}
          >
            <button
              className="w-5 h-5 bg-[#063B67] border-2 border-white shadow-md"
              onClick={() => handleDotClick(dot.id)}
            />

            {/* Popup */}
            {activeDot === dot.id && (
              <div className="absolute top-6 left-1/2 -translate-x-1/2 bg-white shadow-xl  p-3 w-40 md:w-48 z-50 text-center">
                <a
                  href={dot.product.link}
                  className="text-[#063B67] text-sm  block"
                  style={{ fontFamily: "'Gotham', Arial, sans-serif" }}
                >
                  {dot.product.title}
                </a>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ShopTheLookSection;
