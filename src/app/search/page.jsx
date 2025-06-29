"use client"
import React, { useState, useEffect, Suspense, startTransition } from "react"
import Pagination from "@/shared/Pagination/Pagination"
import ButtonPrimary from "@/shared/Button/ButtonPrimary"
import SectionSliderCollections from "@/components/SectionSliderLargeProduct"
import SectionPromo1 from "@/components/SectionPromo1"
import Input from "@/shared/Input/Input"
import ButtonCircle from "@/shared/Button/ButtonCircle"
import ProductCard from "@/components/ProductCard"
import TabFilters from "@/components/TabFilters"
import { fetchSaleorProducts } from "@/app/lib/collectionView"
import { useRouter } from "next/navigation"

// Product List Component with Suspense
const ProductList = ({ searchQuery, filters, handleLoadMore, pageInfo }) => {
  const [products, setProducts] = useState([])
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)
  const [first] = useState(12)

  const loadProducts = async (after = null, newFilters = filters) => {
    setLoading(true)
    try {
      const { products: fetchedProducts, pageInfo } = await fetchSaleorProducts(
        first,
        after
      )

      let filteredProducts = fetchedProducts

      // Apply Filters
      if (newFilters.categories && newFilters.categories.size > 0) {
        filteredProducts = filteredProducts.filter(p =>
          newFilters.categories?.has(p.category.name)
        )
      }
      if (newFilters.colors && newFilters.colors.size > 0) {
        filteredProducts = filteredProducts.filter(p =>
          p.variants.some(v => newFilters.colors?.has(v.name))
        )
      }
      if (newFilters.priceRange) {
        const [minPrice, maxPrice] = newFilters.priceRange
        filteredProducts = filteredProducts.filter(
          p =>
            p.pricing.priceRange.start.gross.amount >= minPrice &&
            p.pricing.priceRange.start.gross.amount <= maxPrice
        )
      }
      if (searchQuery) {
        filteredProducts = filteredProducts.filter(p =>
          p.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
      }

      setProducts(prevProducts =>
        after ? [...prevProducts, ...filteredProducts] : filteredProducts
      )
    } catch (err) {
      console.error("Error fetching Saleor products:", err)
      setError(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadProducts()
  }, [searchQuery, filters])

  if (error) {
    return <div>Error loading products: {error.message}</div>
  }

  if (loading) {
    return <p className="text-center">Loading products...</p>
  }

  return (
    <>
      {!loading && products.length === 0 && (
        <p className="text-center">No products found.</p>
      )}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-10 mt-8 lg:mt-10">
        {products.map((item, index) => (
          <ProductCard data={item} key={index} />
        ))}
      </div>

      {pageInfo.hasNextPage && (
        <div className="flex flex-col mt-12 lg:mt-16 space-y-5 sm:space-y-0 sm:space-x-3 sm:flex-row sm:justify-between sm:items-center">
          <Pagination />
          <ButtonPrimary onClick={handleLoadMore} loading={loading}>
            Show more
          </ButtonPrimary>
        </div>
      )}
    </>
  )
}

const PageSearch = () => {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [filters, setFilters] = useState({})
  const [pageInfo, setPageInfo] = useState({
    hasNextPage: false,
    endCursor: null
  })

  // Sync URL Query with State
  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search)
    const query = queryParams.get("query") || ""
    setSearchQuery(query)
  }, [])

  const handleSearchSubmit = e => {
    e.preventDefault()
    const form = e.target
    const input = form.querySelector("input[name='search']")
    const queryValue = input.value
    setSearchQuery(queryValue)

    // Update URL with query parameter using Next.js Router
    startTransition(() => {
      const params = new URLSearchParams(window.location.search)
      params.set("query", queryValue)
      router.push(`${window.location.pathname}?${params}`)
    })
  }

  const handleApplyFilters = appliedFilters => {
    setFilters(appliedFilters)
  }

  return (
    <div className={`nc-PageSearch`} data-nc-id="PageSearch">
      <div
        className={`nc-HeadBackgroundCommon h-24 2xl:h-28 top-0 left-0 right-0 w-full bg-primary-50 dark:bg-neutral-800/20`}
      />
      <div className="container">
        <header className="max-w-2xl mx-auto -mt-10 flex flex-col lg:-mt-7">
          <form className="relative w-full" onSubmit={handleSearchSubmit}>
            <label
              htmlFor="search-input"
              className="text-neutral-500 dark:text-neutral-300"
            >
              <span className="sr-only">Search all products</span>
              <Input
                className="shadow-lg border-0 dark:border"
                id="search-input"
                type="search"
                placeholder="Type your keywords"
                sizeClass="pl-14 py-5 pr-5 md:pl-16"
                rounded="rounded-none"
                name="search"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
              <ButtonCircle
                className="absolute right-2.5 top-1/2 transform -translate-y-1/2"
                size=" w-11 h-11"
                type="submit"
              >
                <i className="las la-arrow-right text-xl"></i>
              </ButtonCircle>
            </label>
          </form>
        </header>
      </div>

      <div className="container py-16 mt-10 mb-10 lg:pb-28 lg:pt-20 space-y-16 lg:space-y-28">
        <main>
          <TabFilters onApplyFilters={handleApplyFilters} />

          <Suspense fallback={<p className="text-center">Loading products...</p>}>
            <ProductList
              searchQuery={searchQuery}
              filters={filters}
              handleLoadMore={() => {}}
              pageInfo={pageInfo}
            />
          </Suspense>
        </main>

        <hr className="border-slate-200 dark:border-slate-700" />
        <SectionSliderCollections />
        <hr className="border-slate-200 dark:border-slate-700" />

        <SectionPromo1 />
      </div>
    </div>
  )
}

export default PageSearch
