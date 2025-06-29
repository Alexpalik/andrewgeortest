"use client";

// Reusable Loading Skeleton Components
export const SkeletonBox = ({ className = "", width = "100%", height = "20px" }) => (
  <div 
    className={`bg-gray-200 animate-pulse rounded ${className}`}
    style={{ width, height }}
  />
);

export const SkeletonCircle = ({ size = "20px", className = "" }) => (
  <div 
    className={`bg-gray-200 animate-pulse rounded-none ${className}`}
    style={{ width: size, height: size }}
  />
);

export const SkeletonText = ({ lines = 3, className = "" }) => (
  <div className={`space-y-2 ${className}`}>
    {Array.from({ length: lines }).map((_, i) => (
      <SkeletonBox 
        key={i} 
        height="16px" 
        width={i === lines - 1 ? "75%" : "100%"}
      />
    ))}
  </div>
);

// Product Card Skeleton
export const ProductCardSkeleton = ({ className = "" }) => (
  <div className={`border rounded-none p-4 ${className}`}>
    <SkeletonBox height="200px" className="mb-4" />
    <SkeletonText lines={2} />
    <div className="flex justify-between items-center mt-4">
      <SkeletonBox width="60px" height="20px" />
      <SkeletonBox width="80px" height="32px" />
    </div>
  </div>
);

// Registry Product Card Skeleton
export const RegistryProductCardSkeleton = ({ className = "" }) => (
  <div className={`flex items-center border p-4 ${className}`}>
    <SkeletonBox width="128px" height="128px" className="flex-shrink-0" />
    <div className="flex flex-col justify-between flex-grow pl-6">
      <div>
        <SkeletonBox height="24px" width="200px" className="mb-2" />
        <SkeletonText lines={2} />
      </div>
      <div className="flex items-center justify-between mt-4">
        <SkeletonBox width="80px" height="20px" />
        <div className="flex items-center gap-2">
          <SkeletonCircle size="20px" />
          <SkeletonBox width="60px" height="16px" />
        </div>
      </div>
      <div className="flex justify-end mt-4">
        <SkeletonBox width="100px" height="32px" />
      </div>
    </div>
  </div>
);

// Circular Progress Skeleton
export const CircularProgressSkeleton = ({ className = "" }) => (
  <div className={`flex flex-col items-center ${className}`}>
    <SkeletonCircle size="96px" className="mb-3" />
    <SkeletonBox width="120px" height="16px" />
  </div>
);

// Registry Page Skeleton
export const RegistryPageSkeleton = () => (
  <div className="min-h-screen bg-white">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header Skeleton */}
      <div className="text-center mb-8">
        <SkeletonBox width="300px" height="32px" className="mx-auto mb-4" />
        <SkeletonBox width="200px" height="20px" className="mx-auto" />
      </div>

      {/* Stats Charts Skeleton */}
      <div className="text-center mb-12">
        <div className="flex justify-center items-start gap-8 sm:gap-16 flex-wrap">
          <CircularProgressSkeleton />
          <CircularProgressSkeleton />
        </div>
      </div>

      {/* Filters and Products Section */}
      <div className="flex flex-col lg:flex-row gap-4 lg:gap-0">
        {/* Sidebar Skeleton */}
        <div className="lg:w-1/3 xl:w-1/4 lg:pr-4">
          <div className="space-y-4">
            <SkeletonBox height="40px" />
            <SkeletonBox height="120px" />
            <SkeletonBox height="80px" />
          </div>
        </div>
        
        {/* Products Grid Skeleton */}
        <div className="flex-1 lg:pl-4">
          <div className="flex justify-end mb-6">
            <SkeletonBox width="200px" height="40px" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-x-8 sm:gap-y-10">
            {Array.from({ length: 6 }).map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>
    </div>
  </div>
);

// Guest Registry Skeleton
export const GuestRegistryPageSkeleton = () => (
  <div>
    {/* Cover Image Skeleton */}
    <div className="relative mb-12 md:mb-16">
      <div className="block md:hidden">
        <SkeletonBox height="50vh" />
      </div>
      <div className="hidden md:block">
        <SkeletonBox height="25vh" />
      </div>
      
      {/* Greeting Message Skeleton */}
      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 w-[70vw] max-w-[300px] md:w-[40vw] md:max-w-[600px] md:min-w-[400px]">
        <SkeletonBox height="90px" className="md:h-[120px]" />
      </div>
    </div>

    {/* Main Content */}
    <div className="max-w-[100rem] mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-12">
      {/* Registry Title */}
      <div className="text-center mb-6 sm:mb-8">
        <SkeletonBox width="300px" height="32px" className="mx-auto" />
      </div>
      
      {/* Stats Charts */}
      <div className="text-center mb-8">
        <div className="flex justify-center gap-3 sm:gap-6 flex-wrap">
          {Array.from({ length: 4 }).map((_, i) => (
            <CircularProgressSkeleton key={i} />
          ))}
        </div>
      </div>

      {/* Products Section */}
      <div className="flex flex-col lg:flex-row gap-4 lg:gap-0">
        <div className="lg:w-1/3 xl:w-1/4 lg:pr-4">
          <SkeletonBox height="200px" />
        </div>
        <div className="flex-1">
          <div className="flex justify-end mb-4 sm:mb-6">
            <SkeletonBox width="200px" height="40px" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-x-8 sm:gap-y-10">
            {Array.from({ length: 8 }).map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>
    </div>
  </div>
);

// Cart Page Skeleton
export const CartPageSkeleton = () => (
  <div className="container mx-auto px-4 py-8">
    <SkeletonBox width="200px" height="32px" className="mb-8" />
    
    <div className="space-y-4">
      {Array.from({ length: 3 }).map((_, i) => (
        <RegistryProductCardSkeleton key={i} />
      ))}
    </div>
    
    {/* Cart Summary */}
    <div className="mt-8 p-6 border rounded-none">
      <SkeletonBox width="150px" height="24px" className="mb-4" />
      <div className="space-y-2">
        <div className="flex justify-between">
          <SkeletonBox width="80px" height="16px" />
          <SkeletonBox width="60px" height="16px" />
        </div>
        <div className="flex justify-between">
          <SkeletonBox width="60px" height="16px" />
          <SkeletonBox width="60px" height="16px" />
        </div>
        <hr className="my-4" />
        <div className="flex justify-between">
          <SkeletonBox width="80px" height="20px" />
          <SkeletonBox width="80px" height="20px" />
        </div>
      </div>
      <SkeletonBox width="100%" height="48px" className="mt-6" />
    </div>
  </div>
);

// My Registries List Skeleton
export const MyRegistriesListSkeleton = () => (
  <div className="container mx-auto px-4 py-8">
    <SkeletonBox width="250px" height="32px" className="mb-8" />
    
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="border rounded-none overflow-hidden">
          <SkeletonBox height="200px" />
          <div className="p-4">
            <SkeletonBox height="24px" className="mb-2" />
            <SkeletonText lines={2} />
            <div className="flex justify-between items-center mt-4">
              <SkeletonBox width="80px" height="16px" />
              <SkeletonBox width="100px" height="32px" />
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

// Registries Search Page Skeleton
export const RegistriesSearchPageSkeleton = () => (
  <div className="min-h-screen flex flex-col">
    <div className="max-w-6xl mx-auto px-6 py-12">
      {/* Registry Cards Grid Skeleton */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="border p-6 bg-white flex flex-col min-h-[400px]">
            {/* Image Skeleton */}
            <SkeletonBox height="200px" className="mb-4 w-full" />
            
            {/* Info Skeleton */}
            <div className="flex-1 space-y-2">
              <SkeletonBox height="28px" className="mb-2 w-full" />
              <SkeletonBox width="60%" height="16px" className="mb-2" />
              <SkeletonText lines={3} />
            </div>
            
            {/* Button Skeleton */}
            <div className="mt-4">
              <SkeletonBox width="140px" height="40px" />
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

// Registry Checkout Page Skeleton
export const RegistryCheckoutPageSkeleton = () => (
  <div className="min-h-screen bg-gray-50 py-8">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Back Button */}
      <div className="mb-6">
        <SkeletonBox width="80px" height="20px" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column - Registry Info & Items */}
        <div className="space-y-6">
          {/* Registry Header */}
          <div className="bg-white rounded-none border p-6">
            <div className="flex items-start space-x-4">
              <SkeletonBox width="80px" height="80px" />
              <div className="flex-1">
                <SkeletonBox height="24px" className="mb-2" />
                <SkeletonBox width="60%" height="16px" />
              </div>
            </div>
          </div>

          {/* Registry Items */}
          <div className="bg-white rounded-none border p-6">
            <SkeletonBox width="150px" height="24px" className="mb-6" />
            
            <div className="space-y-4">
              {Array.from({ length: 2 }).map((_, i) => (
                <div key={i} className="flex items-center space-x-4 py-4 border-b border-gray-100">
                  <SkeletonBox width="80px" height="80px" />
                  <div className="flex-1">
                    <SkeletonBox height="20px" className="mb-2" />
                    <SkeletonBox width="70%" height="16px" className="mb-2" />
                    <SkeletonBox width="40%" height="16px" />
                  </div>
                  <SkeletonBox width="60px" height="20px" />
                </div>
              ))}
            </div>
            
            {/* Total */}
            <div className="mt-6 pt-4 border-t">
              <div className="flex justify-between items-center">
                <SkeletonBox width="60px" height="24px" />
                <SkeletonBox width="80px" height="24px" />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Checkout Form */}
        <div className="space-y-6">
          <div className="bg-white rounded-none border p-6">
            <SkeletonBox width="200px" height="24px" className="mb-6" />
            
            {/* Contact Information */}
            <div className="mb-6">
              <SkeletonBox width="150px" height="20px" className="mb-3" />
              <SkeletonBox height="40px" />
            </div>

            {/* Billing Address */}
            <div className="mb-6">
              <SkeletonBox width="120px" height="20px" className="mb-3" />
              <div className="grid grid-cols-2 gap-3 mb-3">
                <SkeletonBox height="40px" />
                <SkeletonBox height="40px" />
              </div>
              <SkeletonBox height="40px" className="mb-3" />
              <SkeletonBox height="40px" className="mb-3" />
              <SkeletonBox height="40px" className="mb-3" />
              <div className="grid grid-cols-2 gap-3 mb-3">
                <SkeletonBox height="40px" />
                <SkeletonBox height="40px" />
              </div>
              <SkeletonBox height="40px" className="mb-3" />
              <SkeletonBox height="40px" />
            </div>

            {/* Payment Information */}
            <div className="mb-6">
              <SkeletonBox width="150px" height="20px" className="mb-3" />
              <SkeletonBox height="40px" className="mb-2" />
              <SkeletonBox width="200px" height="12px" />
            </div>

            {/* Complete Order Button */}
            <SkeletonBox height="48px" className="w-full" />
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default {
  SkeletonBox,
  SkeletonCircle,
  SkeletonText,
  ProductCardSkeleton,
  RegistryProductCardSkeleton,
  CircularProgressSkeleton,
  RegistryPageSkeleton,
  GuestRegistryPageSkeleton,
  CartPageSkeleton,
  MyRegistriesListSkeleton,
  RegistriesSearchPageSkeleton,
  RegistryCheckoutPageSkeleton
}; 