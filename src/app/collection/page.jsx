"use client"
import React, { useEffect, useState } from "react"
import Pagination from "@/shared/Pagination/Pagination"
import ButtonPrimary from "@/shared/Button/ButtonPrimary"
import SectionSliderCollections from "@/components/SectionSliderLargeProduct"
import SectionPromo1 from "@/components/SectionPromo1"
import ProductCard from "@/components/ProductCard"
import TabFilters from "@/components/TabFilters"
import { fetchSaleorProducts } from "@/app/lib/collectionView"
import { fetchWishlist } from "@/app/lib/fetchWishlist"
import { useRef } from "react";
import CollapsibleSidebarFilters from "@/components/CollapsibleSidebarFilters"

const PageCollection = () => {
  const [products, setProducts] = useState([])
  const [wishlist, setWishlist] = useState(new Set()) 
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [pageInfo, setPageInfo] = useState({
    hasNextPage: false,
    endCursor: null
  })
  const [first] = useState(12)
  const loadMoreRef = useRef(null);
  const wishlistFetched = useRef(false);
  const [variantMap, setVariantMap] = useState({})

  const handleVariantChange = (productId, variantIndex) => {
    setVariantMap((prev) => ({
      ...prev,
      [productId]: variantIndex,
    }))
  }
  
  useEffect(() => {
    if (wishlistFetched.current) return; 
    wishlistFetched.current = true; 
  
    const loadWishlist = async () => {
      try {
        const wishlistProductIds = await fetchWishlist();
        setWishlist(new Set(wishlistProductIds.map(String)));
      } catch (err) {
        console.error("Error fetching wishlist:", err);
      }
    };
  
    loadWishlist();
  }, []);
  
  useEffect(() => {
    if (!pageInfo.hasNextPage || loading) return;

    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting) {
          setTimeout(() => {
            handleLoadMore();
          }, 800);
        }
      },
      { threshold: 1.0 }
    );

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    return () => {
      if (loadMoreRef.current) {
        observer.unobserve(loadMoreRef.current);
      }
    };
  }, [pageInfo, loading]);


  const loadProducts = async (after = null, filters = {}) => {
    setLoading(true)
    try {
      const { products: fetchedProducts, pageInfo } = await fetchSaleorProducts(first, after)

      let filteredProducts = fetchedProducts

      if (filters.categories && filters.categories.size > 0) {
        filteredProducts = filteredProducts.filter(p => filters.categories?.has(p.category.name))
      }

      if (filters.colors && filters.colors.size > 0) {
        filteredProducts = filteredProducts.filter(p => p.variants.some(v => filters.colors?.has(v.name)))
      }

      if (filters.priceRange) {
        const [minPrice, maxPrice] = filters.priceRange
        filteredProducts = filteredProducts.filter(
          p => p.pricing.priceRange.start.gross.amount >= minPrice &&
            p.pricing.priceRange.start.gross.amount <= maxPrice
        )
      }

      setProducts(prevProducts => after ? [...prevProducts, ...filteredProducts] : filteredProducts)
      setVariantMap((prev) => {
        const map = {}
        fetchedProducts.forEach(p => map[p.id] = 0)
        return map
      })
      setPageInfo(pageInfo)
    } catch (err) {
      console.error("Error fetching Saleor products:", err)
      setError(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadProducts()
  }, [])

  const handleLoadMore = () => {
    if (pageInfo.hasNextPage && pageInfo.endCursor) {
      loadProducts(pageInfo.endCursor)
    }
  }

  if (error) {
    return <div>Error loading products: {error.message}</div>
  }

  return (
    <div className="nc-PageCollection">
      <div className="container py-16 lg:pb-28 lg:pt-20 space-y-16 sm:space-y-20 lg:space-y-28">
        <div className="space-y-10 lg:space-y-14">
          <div className="max-w-screen-sm">
            <h2 className="block text-2xl sm:text-3xl lg:text-4xl ">
              All Products
            </h2>
            <span className="block mt-4 text-neutral-500 dark:text-neutral-400 text-sm sm:text-base">
              We not only help you design exceptional products, but also make it
              easy for you to share your designs with more like-minded people.
            </span>
          </div>

          <hr className="border-slate-200 dark:border-slate-700" />

          <main>
          <div className="flex flex-col lg:flex-row mt-8 lg:mt-10">
              <div className="lg:w-1/3 xl:w-1/4 pr-4">
                <CollapsibleSidebarFilters />
              </div>
              <div className="flex-shrink-0 mb-10 lg:mb-0 lg:mx-4 "></div>
              <div className="flex-1">
              <div className="flex justify-end mb-6">
                  <select
                    className="border border-gray-300 rounded-none px-3 py-2 text-sm text-slate-800"
                    onChange={(e) => {
                      const value = e.target.value;
                      const sorted = [...products].sort((a, b) => {
                        if (value === "price_asc") {
                          return a.pricing.priceRange.start.gross.amount - b.pricing.priceRange.start.gross.amount;
                        } else if (value === "price_desc") {
                          return b.pricing.priceRange.start.gross.amount - a.pricing.priceRange.start.gross.amount;
                        } else {
                          return 0;
                        }
                      });
                      setProducts(sorted);
                    }}
                  >
                    <option value="">Sort order</option>
                    <option value="price_asc">Price: Low to High</option>
                    <option value="price_desc">Price: High to Low</option>
                  </select>
                </div>

                <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-x-8 gap-y-10">
                  {products.map((item, index) => (
                    <ProductCard 
                      key={index}
                      data={item}
                      isLiked={wishlist.has(String(item.id))}
                      variantActive={variantMap[item.id] || 0}
                      onVariantChange={(index) => handleVariantChange(item.id, index)}
                    />
                  ))}
                </div>
              </div>
            </div>
            {pageInfo.hasNextPage && (
                <div
                  ref={loadMoreRef}
                  className="mt-12 h-16 flex justify-center items-center"
                >
                  {loading && (
                    <div className="animate-spin rounded-none h-10 w-10 border-t-2 border-b-2 border-primary-500" />
                  )}
                </div>
            )}
          </main>
        </div>
        <hr className="border-slate-200 dark:border-slate-700" />
        <SectionSliderCollections />
        <hr className="border-slate-200 dark:border-slate-700" />
        <SectionPromo1 />
      </div>
    </div>
  )
}

export default PageCollection
