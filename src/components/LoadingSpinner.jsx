"use client";

import React from "react";

const LoadingSpinner = ({ 
  size = "md", 
  color = "primary", 
  text, 
  className = "" 
}) => {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-6 h-6", 
    lg: "w-8 h-8",
    xl: "w-12 h-12"
  };

  const colorClasses = {
    primary: "border-blue-600",
    gray: "border-gray-600",
    white: "border-white"
  };

  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <div className="relative">
        <div className={`${sizeClasses[size]} border-4 border-gray-200 rounded-none`}></div>
        <div className={`absolute top-0 left-0 ${sizeClasses[size]} border-4 border-transparent ${colorClasses[color]} border-t-current rounded-none animate-spin`}></div>
      </div>
      {text && (
        <p className="mt-2 text-sm text-gray-500">{text}</p>
      )}
    </div>
  );
};

export default LoadingSpinner; 