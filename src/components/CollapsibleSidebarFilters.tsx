"use client";

import React, { useState } from "react";
import SidebarFilters from "./SidebarFilters";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/outline";

const CollapsibleSidebarFilters = () => {
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  return (
    <div className="w-full">
      {/* Mobile Filter Toggle Button */}
      <div className="lg:hidden mb-4">
        <button
          onClick={() => setIsFiltersOpen(!isFiltersOpen)}
          className="w-full flex items-center justify-between px-4 py-3 bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-50 transition-colors"
        >
          <span className="text-sm font-medium text-gray-900">
            Filters
          </span>
          {isFiltersOpen ? (
            <ChevronUpIcon className="w-5 h-5 text-gray-500" />
          ) : (
            <ChevronDownIcon className="w-5 h-5 text-gray-500" />
          )}
        </button>
      </div>

      {/* Filters Content */}
      <div className={`
        lg:block
        ${isFiltersOpen ? 'block' : 'hidden lg:block'}
        transition-all duration-300 ease-in-out
      `}>
        <div className="lg:sticky lg:top-4">
          <SidebarFilters />
        </div>
      </div>
    </div>
  );
};

export default CollapsibleSidebarFilters; 