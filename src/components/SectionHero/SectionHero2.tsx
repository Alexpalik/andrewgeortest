"use client";

import React, { useEffect, useRef } from "react";
import ButtonPrimary from "@/shared/Button/ButtonPrimary";
import ButtonSecondary from "@/shared/Button/ButtonSecondary";
import { HERO2_DEMO_DATA as DATA } from "./data";
 
export interface SectionHero2Props {
  className?: string;
}

const SectionHero2: React.FC<SectionHero2Props> = ({ className = "" }) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const item = DATA[0]; // Only first item content

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const interval = setInterval(() => {
      const containerWidth = container.offsetWidth;
      container.scrollBy({ left: containerWidth, behavior: "smooth" });

      if (container.scrollLeft + container.clientWidth >= container.scrollWidth) {
        setTimeout(() => {
          container.scrollTo({ left: 0, behavior: "smooth" });
        }, 500);
      }
    }, 5000); 

    return () => clearInterval(interval);
  }, []);

  return (
    <div className={`relative w-full ${className}`}>
      {/* Carousel */}
      <div
        ref={scrollContainerRef}
        className="flex overflow-x-auto no-scrollbar snap-x snap-mandatory"
      >
        {[...Array(3)].map((_, index) => (
          <div
            key={index}
            className="flex-shrink-0 w-full relative min-h-[700px] snap-start"
          >
            {/* Background Image */}
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: "url('/images/dining-room.png')",
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
              }}
            />
            {/* Black overlay */}
            <div className="absolute inset-0 bg-black/20" />

            {/* Content */}
            <div className="relative w-full min-h-[700px] flex items-center justify-start px-6 sm:px-12 py-20 container">
              <div className="max-w-2xl space-y-6 text-[#063B67] font-serif">
                <p className="text-[#063B67] text-lg">{item.subHeading}</p>
                <h2
                  className="text-[#063B67] text-4xl sm:text-5xl leading-tight"
                  dangerouslySetInnerHTML={{ __html: item.heading }}
                />
                <div className="flex flex-col sm:flex-row gap-4 mt-36">
                  <ButtonPrimary
                    href="/collection"
                    className="!bg-[#063B67] !hover:bg-[#063B67] text-white px-6 py-3 rounded-none font-serif"
                  >
                    ΦΤΙΑΞΕ ΤΗ ΛΙΣΤΑ ΣΟΥ
                  </ButtonPrimary>

                  <ButtonSecondary
                    href="/collection"
                    className="!bg-[#61C5C3] hover:!bg-[#61C5C3] text-white hover:text-[#063B67] border border-[#61C5C3] px-6 py-3 rounded-none font-serif"
                  >
                    ΑΝΑΖΗΤΗΣΕ ΜΙΑ ΛΙΣΤΑ
                  </ButtonSecondary>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SectionHero2;
