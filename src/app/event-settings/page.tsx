"use client";

import React from 'react';
import RegistrySettings from "@/components/RegistrySettings";

export default function EventSettingsPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header Image with Message Box */}
      <div className="relative w-full overflow-hidden mb-12">
      <img 
          src="images/bg3.png"
          alt="Bg3"
          className="w-full"
          style={{ maxHeight: '500px', objectFit: 'cover' }}
        />
        <button 
          className="absolute top-4 right-4 text-white bg-transparent border-none cursor-pointer"
          aria-label="Expand image"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 3h6v6"></path>
            <path d="M9 21H3v-6"></path>
            <path d="M21 3l-7 7"></path>
            <path d="M3 21l7-7"></path>
          </svg>
        </button>
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 bg-[rgba(182,227,229,0.85)] p-6 w-1/2 max-w-[500px] text-center text-gray-600 italic">
          Write your message here
        </div>
      </div>

      {/* Registry Settings Component */}
      <div className="container mx-auto px-4">
       
      </div>
    </div>
  );
} 