"use client";
import React, { useState } from "react";

const LikeSaveBtns = () => {
  const [isLiked, setIsLiked] = useState(false);

  return (
    <div className="flow-root">
      <div className="flex text-neutral-700 dark:text-neutral-300 text-sm -mx-3 -my-1.5">
        <span className="py-1.5 px-3 flex  hover:bg-neutral-100 dark:hover:bg-neutral-800 cursor-pointer">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
            />
          </svg>
          <span className="hidden sm:block ml-2">Share</span>
        </span>
        <span
          className={`py-1.5 px-3 flex  hover:bg-neutral-100 dark:hover:bg-neutral-800 cursor-pointer `}
          onClick={() => setIsLiked(!isLiked)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={`h-5 w-5 ${isLiked ? "text-red-500" : ""}`}
            fill={isLiked ? "currentColor" : `none`}
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            />
          </svg>
          <span className="hidden sm:block ml-2">Save</span>
        </span>
      </div>
    </div>
  );
};

export default LikeSaveBtns;
