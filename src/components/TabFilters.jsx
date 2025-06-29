"use client"
import React, { useEffect, useState } from "react"
import { Popover, PopoverButton, PopoverPanel } from "@/app/headlessui"
import ButtonPrimary from "@/shared/Button/ButtonPrimary"
import Checkbox from "@/shared/Checkbox/Checkbox"
import Slider from "rc-slider"
import { ChevronDownIcon } from "@heroicons/react/24/outline"
import { fetchSaleorProducts } from "@/app/lib/collectionView"

const TabFilters = ({ onApplyFilters }) => {
  const [filters, setFilters] = useState({
    categories: [],
    colors: [],
    sizes: [],
    priceRange: [0, 500] // Default price range
  })

  const [selectedFilters, setSelectedFilters] = useState({
    categories: new Set(),
    colors: new Set(),
    sizes: new Set(),
    priceRange: [0, 500]
  })


  useEffect(() => {
    async function fetchFilters() {
      try {
        const { products } = await fetchSaleorProducts(100) // Fetch all products
        const categories = Array.from(
          new Set(products.map(p => p.category.name))
        )
        const colors = Array.from(
          new Set(products.map(p => p.variants.map(v => v.name)).flat())
        )
        const sizes = ["XS", "S", "M", "L", "XL"] // If sizes exist as variant options
        const prices = products.map(
          p => p.pricing.priceRange.start.gross.amount
        )
        const minPrice = Math.min(...prices)
        const maxPrice = Math.max(...prices)

        setFilters({
          categories,
          colors,
          sizes,
          priceRange: [minPrice, maxPrice]
        })

        setSelectedFilters(prev => ({
          ...prev,
          priceRange: [minPrice, maxPrice]
        }))
      } catch (error) {
        console.error("Error fetching filters:", error)
      }
    }
    fetchFilters()
  }, [])

  const handleCheckboxChange = (type, value) => {
    setSelectedFilters(prev => {
      const newSet = new Set(prev[type])
      newSet.has(value) ? newSet.delete(value) : newSet.add(value)
      return { ...prev, [type]: newSet }
    })
  }

  const handlePriceChange = range => {
    setSelectedFilters(prev => ({ ...prev, priceRange: range }))
  }

  const applyFilters = close => {
    onApplyFilters(selectedFilters)
    close() // Close the dropdown after applying filters
  }

  return (
    <div className="flex lg:space-x-4">
      {/* Category Filter */}
      <Popover className="relative">
        {({ open, close }) => (
          <>
            <PopoverButton
              className={`flex items-center justify-center px-4 py-2 text-sm rounded-none border focus:outline-none select-none
               ${
                 open
                   ? "!border-primary-500"
                   : "border-neutral-300 dark:border-neutral-700"
               }
                ${
                  selectedFilters.categories.size
                    ? "!border-primary-500 bg-primary-50 text-primary-900"
                    : "border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:border-neutral-400 dark:hover:border-neutral-500"
                }
                `}
            >
              <span>Categories</span>
              <ChevronDownIcon className="w-4 h-4 ml-3" />
            </PopoverButton>
            <PopoverPanel className="absolute z-40 w-screen max-w-sm px-4 mt-3 left-0 sm:px-0 lg:max-w-md">
              <div className="overflow-hidden rounded-none shadow-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700">
                <div className="relative flex flex-col px-5 py-6 space-y-5">
                  {filters.categories.map(category => (
                    <Checkbox
                      key={category}
                      name={category}
                      label={category}
                      defaultChecked={selectedFilters.categories.has(category)}
                      onChange={checked =>
                        handleCheckboxChange("categories", category)
                      }
                    />
                  ))}
                </div>
                <div className="p-5 bg-neutral-50 dark:bg-neutral-900 dark:border-t dark:border-neutral-800 flex items-center justify-between">
                  <ButtonPrimary onClick={() => applyFilters(close)}>
                    Apply
                  </ButtonPrimary>
                </div>
              </div>
            </PopoverPanel>
          </>
        )}
      </Popover>

      {/* Price Range Filter */}
      <Popover className="relative">
        {({ open, close }) => (
          <>
            <PopoverButton
              className={`flex items-center justify-center px-4 py-2 text-sm rounded-none border border-primary-500 bg-primary-50 text-primary-900 focus:outline-none`}
            >
              <span>
                Price: ${selectedFilters.priceRange[0]} - $
                {selectedFilters.priceRange[1]}
              </span>
              <ChevronDownIcon className="w-4 h-4 ml-3" />
            </PopoverButton>
            <PopoverPanel className="absolute z-40 w-screen max-w-sm px-4 mt-3 left-0 sm:px-0">
              <div className="overflow-hidden rounded-none shadow-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700">
                <div className="relative flex flex-col px-5 py-6 space-y-8">
                  <span className="font-medium">Price range</span>
                  <Slider
                    range
                    className="text-primary-500"
                    min={filters.priceRange[0]}
                    max={filters.priceRange[1]}
                    value={selectedFilters.priceRange}
                    allowCross={false}
                    onChange={value => handlePriceChange(value)}
                  />
                  <div className="flex justify-between text-sm mt-2">
                    <span>${selectedFilters.priceRange[0]}</span>
                    <span>${selectedFilters.priceRange[1]}</span>
                  </div>
                </div>
                <div className="p-5 bg-neutral-50 dark:bg-neutral-900 dark:border-t dark:border-neutral-800 flex items-center justify-between">
                  <ButtonPrimary onClick={() => applyFilters(close)}>
                    Apply
                  </ButtonPrimary>
                </div>
              </div>
            </PopoverPanel>
          </>
        )}
      </Popover>

      {/* Color Filter */}
      {/* <Popover className="relative">
        {({ open, close }) => (
          <>
            <PopoverButton
              className={`flex items-center justify-center px-4 py-2 text-sm rounded-none border focus:outline-none select-none
              ${open ? "!border-primary-500" : ""}
                ${
                  selectedFilters.colors.size
                    ? "!border-primary-500 bg-primary-50 text-primary-900"
                    : "border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:border-neutral-400 dark:hover:border-neutral-500"
                }
                `}
            >
              <span>Colors</span>
              <ChevronDownIcon className="w-4 h-4 ml-3" />
            </PopoverButton>
            <PopoverPanel className="absolute z-40 w-screen max-w-sm px-4 mt-3 left-0 sm:px-0 lg:max-w-sm">
              <div className="overflow-hidden rounded-2xl shadow-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700">
                <div className="relative flex flex-col px-5 py-6 space-y-5">
                  {filters.colors.map((color) => (
                    <Checkbox
                      key={color}
                      name={color}
                      label={color}
                      defaultChecked={selectedFilters.colors.has(color)}
                      onChange={(checked) => handleCheckboxChange("colors", color)}
                    />
                  ))}
                </div>
                <div className="p-5 bg-neutral-50 dark:bg-neutral-900 dark:border-t dark:border-neutral-800 flex items-center justify-between">
                  <ButtonPrimary onClick={() => applyFilters(close)}>Apply</ButtonPrimary>
                </div>
              </div>
            </PopoverPanel>
          </>
        )}
      </Popover> */}
    </div>
  )
}

export default TabFilters
