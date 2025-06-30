'use client'

import React, { useState, useEffect } from 'react'
import styles from './page.module.css'
import Link from 'next/link'
import { HeartIcon, MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { ClockIcon } from '@heroicons/react/24/solid'
import { apolloClient } from '@/app/lib/saleorClient'
import { GET_PRODUCTS } from '@/app/lib/graphql/queries'
import LikeButton from '@/components/LikeButton'
import { fetchWishlist } from '@/app/lib/fetchWishlist'
import { ProductOrderField, OrderDirection, ProductOrder } from '@/app/lib/products'
import { ProductCardSkeleton } from '@/components/LoadingSkeleton'

interface Product {
  id: string;
  name: string;
  slug?: string;
  pricing?: {
    priceRange?: {
      start?: {
        gross?: {
          amount: number;
        };
      };
    };
  };
  description?: string;
  media?: Array<{
    url: string;
  }>;
  metadata?: Array<{
    key: string;
    value: string;
  }>;
}

export default function TravelExperiences() {
  const [travelAmount, setTravelAmount] = useState('')
  const [sortOrder, setSortOrder] = useState('')
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const [wishlist, setWishlist] = useState<Set<string>>(new Set())
  const [pageInfo, setPageInfo] = useState({
    hasNextPage: false,
    endCursor: null
  })
  
  // Fetch travel products
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true)
      try {
        // Use the travel category filter if available, or use a tag/attribute related to travel
        const response = await apolloClient.query({
          query: GET_PRODUCTS,
          variables: {
            first: 12,
            filter: {
              search: "travel"  // Search for travel-related products
              // You can also use specific categories or collections if they exist:
              // categories: ["travel", "experiences"]
            },
            sortBy: getSortOrder(sortOrder)
          }
        })

        if (response.data?.products?.edges) {
          const fetchedProducts = response.data.products.edges.map((edge: any) => edge.node)
          setProducts(fetchedProducts)
          setPageInfo(response.data.products.pageInfo)
        }
      } catch (err) {
        console.error("Error fetching travel products:", err)
        setError(err instanceof Error ? err : new Error('Unknown error occurred'))
      } finally {
        setLoading(false)
      }
    }

    // Fetch wishlist items
    const loadWishlist = async () => {
      try {
        const wishlistProductIds = await fetchWishlist()
        setWishlist(new Set(wishlistProductIds.map(String)))
      } catch (err) {
        console.error("Error fetching wishlist:", err)
      }
    }

    fetchProducts()
    loadWishlist()
  }, [sortOrder])

  // Helper function to convert UI sort order to GraphQL sort parameters
  const getSortOrder = (uiSortOrder: string): ProductOrder => {
    switch (uiSortOrder) {
      case 'price_asc':
        return { field: ProductOrderField.PRICE, direction: OrderDirection.ASC }
      case 'price_desc':
        return { field: ProductOrderField.PRICE, direction: OrderDirection.DESC }
      case 'name_asc':
        return { field: ProductOrderField.NAME, direction: OrderDirection.ASC }
      case 'name_desc':
        return { field: ProductOrderField.NAME, direction: OrderDirection.DESC }
      default:
        return { field: ProductOrderField.RANK, direction: OrderDirection.ASC }
    }
  }

  // Fallback to mock data if no products are found
  const fallbackProducts = products.length > 0 ? products : [
    {
      id: '1',
      name: 'ΡΩΜΗ-ΦΛΩΡΕΝΤΙΑ-ΒΑΤΙΚΑΝΟ',
      pricing: { priceRange: { start: { gross: { amount: 1500 } } } },
      media: [{ url: '/images/collections/1.png' }],
      description: 'Απολαυστικός γύρος στις τρεις μικρές γειτονικές χώρες με τον τεράστιο ευρωπαϊκό χαρακτήρα!',
      metadata: [{ key: 'duration', value: '6' }]
    },
    {
      id: '2',
      name: 'ΜΠΑΛΙ',
      pricing: { priceRange: { start: { gross: { amount: 1500 } } } },
      media: [{ url: '/images/collections/2.png' }],
      description: 'Απολαυστικός γύρος στις τρεις μικρές γειτονικές χώρες με τον τεράστιο ευρωπαϊκό χαρακτήρα!',
      metadata: [{ key: 'duration', value: '6' }]
    },
    {
      id: '3',
      name: 'ΠΑΡΙΣΙ-ΝΤΙΣΝΕΫΛΑΝΤ',
      pricing: { priceRange: { start: { gross: { amount: 1500 } } } },
      media: [{ url: '/images/collections/3.png' }],
      description: 'Απολαυστικός γύρος στις τρεις μικρές γειτονικές χώρες με τον τεράστιο ευρωπαϊκό χαρακτήρα!',
      metadata: [{ key: 'duration', value: '6' }]
    },
    {
      id: '4',
      name: 'ΡΩΜΗ-ΦΛΩΡΕΝΤΙΑ-ΒΑΤΙΚΑΝΟ',
      pricing: { priceRange: { start: { gross: { amount: 1500 } } } },
      media: [{ url: '/images/collections/4.png' }],
      description: 'Απολαυστικός γύρος στις τρεις μικρές γειτονικές χώρες με τον τεράστιο ευρωπαϊκό χαρακτήρα!',
      metadata: [{ key: 'duration', value: '6' }]
    }
  ]

  // Get product duration from metadata if available
  const getProductDuration = (product: Product): string => {
    if (product.metadata) {
      const durationMeta = product.metadata.find(meta => meta.key === 'duration')
      if (durationMeta) return durationMeta.value
    }
    return '6' // Default duration
  }

  // Handle wishlist toggle
  const handleWishlistToggle = async (productId: string) => {
    // Implementation would go here - similar to ProductCard.jsx
    console.log('Toggle wishlist for product:', productId)
  }

  return (
    <main>
      {/* Hero Banner */}
      <div className={styles.pageBanner}>
        <img 
          src="/images/hero-image-travel-packages 1.png" 
          alt="Travel Experiences Banner"
        />
      </div>

      {/* Header Section */}
      <section className={styles.headerSection}>
        <div className={styles.container}>
          <h1 className={styles.mainTitle}>Ταξίδια & Εμπειρίες</h1>
          <p className={styles.subtitle}>
            Bon Voyage!
          </p>
          <p className={styles.subtitle}>
            Εδώ μπορείς να αναζητήσεις, δωρίσεις προτάσεις, να κάνεις κράτηση ταξιδιού ή να
            συμπληρώσεις την καλύτερη ιδέα για το ταξίδι που ονειρεύεσαι!
          </p>
        </div>
      </section>

      {/* Travel Packages Section */}
      <section className={styles.packagesSection}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>Έτοιμα πακέτα</h2>
          
          <div className={styles.sortOrder}>
            <select 
              className={styles.sortOrderSelect}
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
            >
              <option value="">Sort order</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="name_asc">Name: A to Z</option>
              <option value="name_desc">Name: Z to A</option>
            </select>
          </div>
          
          {loading ? (
            <div className={styles.packageGrid}>
              {[1, 2, 3, 4].map((item) => (
                <div key={item} className={styles.packageCard}>
                  <ProductCardSkeleton />
                </div>
              ))}
            </div>
          ) : error ? (
            <p>Error loading travel packages. Please try again later.</p>
          ) : (
            <div className={styles.packageGrid}>
              {fallbackProducts.map((product) => (
                <div key={product.id} className={styles.packageCard}>
                  <div className={styles.packageImage}>
                    <img 
                      src={product.media?.[0]?.url || '/images/collections/1.png'} 
                      alt={product.name} 
                    />
                    <div className={styles.packageActions}>
                      <LikeButton 
                        liked={wishlist.has(String(product.id))}
                        className={styles.wishlistButton}
                        onClick={() => handleWishlistToggle(product.id)}
                      />
                      <button className={styles.quickViewButton}>
                        <XMarkIcon width={16} height={16} />
                      </button>
                    </div>
                  </div>
                  <div className={styles.packageContent}>
                    <h3 className={styles.packageTitle}>{product.name}</h3>
                    <p className={styles.packagePrice}>
                      από {product.pricing?.priceRange?.start?.gross?.amount || 0}€
                    </p>
                    <p className={styles.packageDescription}>
                      {product.description || 'Απολαυστικός γύρος στις τρεις μικρές γειτονικές χώρες με τον τεράστιο ευρωπαϊκό χαρακτήρα!'}
                    </p>
                    <div className={styles.packageDuration}>
                      <span className={styles.durationIcon}>
                        <ClockIcon width={16} height={16} />
                      </span>
                      <span>{getProductDuration(product)} Ημέρες</span>
                    </div>
                    <div className={styles.packageButtons}>
                      <button className={styles.addToCartButton}>ΠΡΟΣΘΗΚΗ ΣΤΟ ΚΑΛΑΘΙ</button>
                      <button className={styles.addToListButton}>ΠΡΟΣΘΗΚΗ ΣΤΗ ΛΙΣΤΑ</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* My Trip Section */}
      <section className={styles.packagesSection}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>Έτοιμα πακέτα</h2>
          
          <div className={styles.myTripSection} style={{background:"#F5F5F5", padding:'60px'}}>
            <div className={styles.myTripContent}>
              <h3 className={styles.myTripTitle}>Το ταξίδι μου <span className={styles.myTripSubtitle}>(δώσε όνομα στο ταξίδι σου)</span></h3>
              <p className={styles.myTripText}>
                Εξερεύνησε, οργάνωσε, κάνε τον προϋπολογισμό σου και αποφάσισε το ταξίδι που θα ήθελες να προσθέσεις στη λίστα σου
              </p>
              <p className={styles.myTripNote}>
                Όρισε την αξία του ταξιδιού σου σύμφωνα με τις ενδεικτικές τιμές της ASK 2 TRAVEL.
              </p>
              <input 
                type="text" 
                className={styles.myTripInput}
                placeholder="συμπλήρωσε εδώ το επιθυμητό ποσό για το ταξίδι σου"
                value={travelAmount}
                onChange={(e) => setTravelAmount(e.target.value)}
              />
            </div>
            
            <div className={styles.myTripImage}>
              <img src="/images/collections/3.png" alt="Paris" />
              <div className={styles.navigationButtons}>
                <button className={styles.navButton}>←</button>
                <button className={styles.navButton}>→</button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
} 