"use client";

import React, { FC } from "react";
import Image from "next/image";

export interface SectionPromo3Props {
  className?: string;
}

const SectionPromo3: FC<SectionPromo3Props> = ({ className = "" }) => {
  return (
    <div className={`relative py-16 ${className}`}>
      <div className=" mx-auto flex flex-col lg:flex-row items-center bg-[#F9FAFB] rounded-none overflow-hidden">
        {/* LEFT TEXT SECTION */}
        <div className="w-full lg:w-1/2 px-8 lg:px-24 xl:px-32 py-12 flex flex-col justify-center">
          <h2 className=" text-4xl text-[#063B67] mb-6" style={{ fontFamily: "'Source Serif 4', serif", fontWeight: 350 }}>
            Γιατί να κάνεις τη λίστα σου εδώ
          </h2>
          <p className="text-[#6B7280] text-base mb-8" style={{ fontFamily: "'Gotham', Arial, sans-serif" }}>
            Register to receive news about the latest, savings combos, discount codes...
          </p>

          <ul className="space-y-6">
            <li className="flex items-start gap-4">
              <div className="bg-[#86D3D3] text-[#063B67]   px-3 py-1 text-sm" style={{ fontFamily: "'Gotham', Arial, sans-serif" }}>
                01
              </div>
              <p className="text-[#4B5563] text-base" style={{ fontFamily: "'Gotham', Arial, sans-serif" }}>
                Smart filtering and suggestions make it easy to find
              </p>
            </li>
            <li className="flex items-start gap-4">
              <div className="bg-[#86D3D3] text-[#063B67]   px-3 py-1 text-sm" style={{ fontFamily: "'Gotham', Arial, sans-serif" }}>
                02
              </div>
              <p className="text-[#4B5563] text-base" style={{ fontFamily: "'Gotham', Arial, sans-serif" }}>
                Easily select the correct items and add them to the cart
              </p>
            </li>
            <li className="flex items-start gap-4">
              <div className="bg-[#86D3D3] text-[#063B67]   px-3 py-1 text-sm" style={{ fontFamily: "'Gotham', Arial, sans-serif" }}>
                03
              </div>
              <p className="text-[#4B5563] text-base" style={{ fontFamily: "'Gotham', Arial, sans-serif" }}>
                The carrier will confirm and ship quickly to you
              </p>
            </li>
          </ul>
        </div>

        {/* RIGHT IMAGE SECTION */}
        <div className="w-full lg:w-1/2 h-full">
          <Image
            src="/images/shopping.png"
            alt="shopping"
            width={830}
            height={604}
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </div>
  );
};

export default SectionPromo3;
