"use client";

import React, { FC, ReactNode } from "react";
import ButtonPrimary from "@/shared/Button/ButtonPrimary";
import ButtonSecondary from "@/shared/Button/ButtonSecondary";
import Image from "next/image";
import heroImage from "@/images/your-dining-room-hero.jpg"; // Replace this with your real image path
// You can import it properly after you save it locally

export interface SectionHeroProps {
  className?: string;
}

const SectionHero: FC<SectionHeroProps> = ({ className = "" }) => {
  return (
    <div className={`nc-SectionHero relative bg-white ${className}`} data-nc-id="SectionHero">
      <div className="flex flex-col lg:flex-row space-y-10 lg:space-y-0 lg:space-x-10 lg:items-center container py-14 lg:py-20">
        
        {/* LEFT TEXT */}
        <div className="w-full max-w-2xl space-y-6">
          <p className="text-[#063B67] text-lg ">
            Γιατί κάθε Event θέλει τη λίστα δώρων του
          </p>
          <h2 className="text-[#063B67] text-4xl md:text-5xl  leading-tight" style={{ fontFamily: "'Source Serif 4', serif", fontWeight: 200 }}>
            Όλα όσα χρειάζεσαι σε μία all-in-one πλατφόρμα λίστας δώρων
          </h2>

          <div className="pt-12 flex flex-col sm:flex-row gap-4 mt-36">
            <ButtonPrimary
              href="/"
              className="bg-[#063B67] hover:bg-[#063B67] text-white px-6 py-3 rounded-none text-base "
            >
              ΦΤΙΑΞΕ ΤΗ ΛΙΣΤΑ ΣΟΥ
            </ButtonPrimary>
            <ButtonSecondary
              href="/"
              className="bg-[#86D3D3] hover:bg-[#86D3D3] text-black px-6 py-3 rounded-none text-base "
            >
              ΑΝΑΖΗΤΗΣΕ ΜΙΑ ΛΙΣΤΑ
            </ButtonSecondary>
          </div>
        </div>

        {/* RIGHT IMAGE */}
        <div className="flex-grow">
          <Image
            className="w-full h-auto object-cover"
            src={heroImage}
            alt="Hero"
            sizes="(max-width: 768px) 100vw, 50vw"
            priority
          />
        </div>

      </div>
    </div>
  );
};

export default SectionHero;
