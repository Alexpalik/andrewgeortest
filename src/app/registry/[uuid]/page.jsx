"use client"

import { useEffect, useState, useRef } from "react"
import { useParams, useRouter } from "next/navigation"
import { fetchProductInfo } from "@/app/lib/fetchProductById"
import ProductCard from "@/components/ProductCard"
import CollapsibleSidebarFilters from "@/components/CollapsibleSidebarFilters"
import { fetchWishlist } from "@/app/lib/fetchWishlist"
import toast from "react-hot-toast"
import LoadingSpinner from "@/components/LoadingSpinner"
import { useAuthModal } from "@/hooks/useAuthModal"
import AuthModal from "@/components/AuthModal"
import NcModal from "@/shared/NcModal/NcModal"
import ButtonPrimary from "@/shared/Button/ButtonPrimary"
import ButtonSecondary from "@/shared/Button/ButtonSecondary"
import { GuestRegistryPageSkeleton } from "@/components/LoadingSkeleton"

// Simple circular progress chart component (same as RegistrySettings)
const CircularProgress = ({ percentage, label, value, color = "#3B82F6" }) => {
  const radius = 30;
  const circumference = 2 * Math.PI * radius;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-20 h-20">
        <svg
          className="w-20 h-20 transform -rotate-90"
          viewBox="0 0 70 70"
        >
          <circle
            cx="35"
            cy="35"
            r={radius}
            stroke="#E5E7EB"
            strokeWidth="6"
            fill="none"
          />
          <circle
            cx="35"
            cy="35"
            r={radius}
            stroke={color}
            strokeWidth="6"
            fill="none"
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-300"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xs ">{value}</span>
        </div>
      </div>
      <p className="text-xs text-gray-600 mt-2 text-center">{label}</p>
    </div>
  );
};

// Enhanced ProductCard with Add to Cart button
const RegistryProductCard = ({ data, isLiked, variantActive = 0, onVariantChange, onAddToCart, addingToCart }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isDonationModalOpen, setIsDonationModalOpen] = useState(false);
  const [donationAmount, setDonationAmount] = useState(10);

  // Robust logic for donation max value
  const isGroupGifting = data.is_group_gifting;
  
  // Debug logging to see what data is available
  console.log('Registry page RegistryProductCard data:', data);
  console.log('remaining_group_gifting_balance:', data.remaining_group_gifting_balance);
  console.log('is_group_gifting:', data.is_group_gifting);
  
  const maxDonation = data.remaining_group_gifting_balance && data.remaining_group_gifting_balance > 0
    ? parseFloat(data.remaining_group_gifting_balance)
    : data.is_virtual && data.virtual_product_price
      ? parseFloat(data.virtual_product_price)
      : (data.pricing && data.pricing.priceRange && data.pricing.priceRange.start && data.pricing.priceRange.start.gross
          ? data.pricing.priceRange.start.gross.amount
          : 100); // Default fallback
          
  console.log('Registry page calculated maxDonation:', maxDonation);

  return (
    <div
      className="nc-ProductCard relative flex flex-col bg-transparent"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative flex-shrink-0 bg-slate-50 dark:bg-slate-300 overflow-hidden z-1 group">
        <div className="block">
          <div className="flex aspect-w-11 aspect-h-12 w-full h-0 relative">
            <img
              src={data.media?.[0]?.url || "/placeholder-image.jpg"}
              className="object-cover w-full h-full drop-shadow-xl absolute inset-0"
              alt="product"
            />
          </div>
        </div>

        {/* Add to Cart or Donation Button - positioned at bottom of image */}
        <div className={`absolute bottom-2 left-2 right-2 transition-opacity duration-200 ${
          isHovered ? 'opacity-100' : 'opacity-0'
        }`}>
          <div className="flex justify-end mt-4 gap-2">
            {data.is_purchased ? (
              <div className="w-full text-center">
                <button
                  disabled
                  className="w-full py-2 px-3 text-sm font-medium bg-green-100 text-green-700 cursor-not-allowed border border-green-200"
                >
                  Already Purchased
                </button>
                <div className="text-xs text-green-600 mt-1">
                  This item has been purchased!
                </div>
              </div>
            ) : isGroupGifting ? (
              data.remaining_group_gifting_balance && data.remaining_group_gifting_balance > 0 ? (
                <ButtonPrimary
                  className="w-full py-2 px-3 text-sm font-medium"
                  onClick={() => setIsDonationModalOpen(true)}
                >
                  Κάνε Δωρεά
                </ButtonPrimary>
              ) : (
                <div className="w-full text-center">
                  <button
                    disabled
                    className="w-full py-2 px-3 text-sm font-medium bg-gray-300 text-gray-500 cursor-not-allowed"
                  >
                    Fully Funded
                  </button>
                  <div className="text-xs text-green-600 mt-1">
                    This group gift has been fully funded!
                  </div>
                </div>
              )
            ) : (
              <button
                onClick={() => {
                  const variantId = data.registryVariantId || data.variants?.[variantActive]?.id || data.variants?.[0]?.id;
                  if (variantId) {
                    onAddToCart(variantId);
                  }
                }}
                disabled={addingToCart}
                className="w-full text-white py-2 px-3 text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ backgroundColor: '#063B67' }}
                onMouseEnter={e => e.target.style.backgroundColor = '#0A4A7A'}
                onMouseLeave={e => e.target.style.backgroundColor = '#063B67'}
              >
                {addingToCart ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    ΠΡΟΣΘΗΚΗ ΣΤΟ ΚΑΛΑΘΙ
                  </span>
                ) : (
                  'ΠΡΟΣΘΗΚΗ ΣΤΟ ΚΑΛΑΘΙ'
                )}
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="space-y-4 px-2.5 pb-2.5">
        <div className="text-center mt-4">
          <h2 className="text-base  transition-colors hover:text-primary-600">
            {data.name}
          </h2>
          <div className="mt-1 text-lg font-medium text-slate-700 dark:text-slate-300">
            ${data.pricing?.priceRange?.start?.gross?.amount || 0}
          </div>
        </div>
      </div>

      {/* Donation Modal */}
      {isDonationModalOpen && (
        <NcModal
          isOpenProp={isDonationModalOpen}
          onCloseModal={() => setIsDonationModalOpen(false)}
          modalTitle={"Κάνε Δωρεά"}
          contentExtraClass="max-w-md"
          renderContent={() => (
            <div className="flex flex-col items-center gap-6">
              <div className="w-full">
                <label htmlFor="donation-slider" className="block text-sm font-medium mb-2 text-center">Επίλεξε ποσό δωρεάς</label>
                <input
                  id="donation-slider"
                  type="range"
                  min={0.01}
                  max={Number(maxDonation).toFixed(2)}
                  step={0.01}
                  value={donationAmount}
                  onChange={e => setDonationAmount(Number(e.target.value))}
                  className="w-full accent-blue-600"
                />
                <div className="text-center mt-2 text-lg ">{Number(donationAmount).toFixed(2)} €</div>
              </div>
              <div className="flex gap-4 justify-center">
                <ButtonPrimary onClick={() => {
                  console.log('Donation button clicked!');
                  console.log('Donation amount:', donationAmount);
                  console.log('Registry variant ID:', data.registryVariantId);
                  
                  // Use the same addToCart function but with gift contribution amount
                  onAddToCart(data.registryVariantId, donationAmount);
                  setIsDonationModalOpen(false);
                }}>
                  Κάνε Δωρεά
                </ButtonPrimary>
                <ButtonSecondary onClick={() => setIsDonationModalOpen(false)}>
                  Ακύρωση
                </ButtonSecondary>
              </div>
            </div>
          )}
        />
      )}
    </div>
  );
};

const GuestRegistryLandingPage = () => {
  const { uuid } = useParams()
  const router = useRouter()
  const [registry, setRegistry] = useState(null)
  const [transformedProducts, setTransformedProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [productLoading, setProductLoading] = useState(false)
  const [addingToCart, setAddingToCart] = useState({})
  const [wishlist, setWishlist] = useState(new Set())
  const [variantMap, setVariantMap] = useState({})
  const wishlistFetched = useRef(false)

  // Auth modal hooks
  const authModal = useAuthModal()

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

  const addToCart = async (variantId, giftContributionAmount = null) => {
    console.log('addToCart called with variantId:', variantId, 'giftContributionAmount:', giftContributionAmount);
    setAddingToCart(prev => ({ ...prev, [variantId]: true }))
    
    try {
      const token = sessionStorage.getItem(
        process.env.NEXT_PUBLIC_SALEOR_API_URL + "+saleor_auth_module_refresh_token"
      );
      
      if (!token) {
        console.log('No token found, showing auth modal');
        setAddingToCart(prev => ({ ...prev, [variantId]: false }))
        authModal.requireAuth(() => {
          // After successful login, retry adding to cart
          addToCart(variantId, giftContributionAmount);
        });
        return
      }

      const body = {
        registry_uuid: uuid,
        variant_id: variantId,
        quantity: 1
      }

      // Add gift contribution amount if provided (for donations)
      if (giftContributionAmount !== null) {
        body.gift_contribution_amount = giftContributionAmount;
      }

      console.log('Sending add to cart request with body:', body);

      const response = await fetch(`${process.env.NEXT_PUBLIC_REGISTRY_URL}/api/cart-add/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(body)
      })

      console.log('Add to cart response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Add to cart failed with response:', errorText);
        if (response.status === 403) {
          authModal.requireAuth(() => {
            // After successful login, retry adding to cart
            addToCart(variantId, giftContributionAmount);
          });
          return
        }
        throw new Error(`Failed to add to cart: ${response.status} - ${errorText}`)
      }

      const result = await response.json();
      console.log('Add to cart success:', result);
      
      // Check if the response includes checkout information
      if (result.checkout_id) {
        console.log('Checkout ID from response:', result.checkout_id);
      }
      
      // Show appropriate success message
      if (giftContributionAmount !== null) {
        toast.success(`Δωρεά ${giftContributionAmount}€ καταχωρήθηκε!`);
      } else {
        toast.success('Added to cart successfully!');
      }
      
      // Immediate event dispatch for quick feedback
      window.dispatchEvent(new CustomEvent('registryCartUpdated', {
        detail: { 
          registry_uuid: uuid, 
          variantId,
          checkoutId: result.checkout_id,
          immediate: true
        }
      }))
      
      // Small delay to ensure backend has processed the addition
      setTimeout(() => {
        // Dispatch custom event to refresh cart dropdown
        window.dispatchEvent(new CustomEvent('registryCartUpdated', {
          detail: { 
            registry_uuid: uuid, 
            variantId,
            checkoutId: result.checkout_id 
          }
        }))
        
        // Also dispatch a more generic cart update event as backup
        window.dispatchEvent(new CustomEvent('cartUpdated'))
        
        // Force cart dropdown to refresh by clicking it programmatically if needed
        console.log('Dispatched cart update events');
      }, 500)

    } catch (error) {
      console.error('Error adding to cart:', error)
      if (giftContributionAmount !== null) {
        toast.error('Failed to add donation. Please try again.');
      } else {
        toast.error('Failed to add to cart. Please try again.');
      }
    } finally {
      setAddingToCart(prev => ({ ...prev, [variantId]: false }))
    }
  }

  useEffect(() => {
    const fetchRegistry = async () => {
      try {
        setLoading(true)
        setProductLoading(true)
        
        const res = await fetch(
          `https://gd-registry-sandbox.ddns.net/api/registry/${uuid}`
        )
        if (!res.ok) throw new Error("Failed to fetch registry")
        const data = await res.json()
        setRegistry(data)

        // Transform products to match RegistrySettings format
        const transformed = [];
        const variantMapTemp = {};

        for (const registryProduct of data.products) {
          try {
            const productInfo = await fetchProductInfo(registryProduct.web_variant_id);
            if (productInfo) {
              const transformedProduct = {
                id: productInfo.id,
                name: productInfo.name,
                slug: productInfo.slug,
                description: productInfo.description || "",
                media: productInfo.media || [],
                pricing: productInfo.pricing,
                variants: productInfo.variants || [],
                variantType: "default",
                status: productInfo.status || "ACTIVE",
                rating: productInfo.rating || 4.5,
                numberOfReviews: productInfo.numberOfReviews || 0,
                sizes: productInfo.sizes || [],
                // Store the original registry variant ID for cart operations
                registryVariantId: registryProduct.web_variant_id,
                // Merge registry fields
                is_group_gifting: registryProduct.is_group_gifting,
                is_virtual: registryProduct.is_virtual,
                virtual_product_title: registryProduct.virtual_product_title,
                virtual_product_description: registryProduct.virtual_product_description,
                virtual_product_price: registryProduct.virtual_product_price,
                virtual_product_price_currency: registryProduct.virtual_product_price_currency,
                group_gifting_balance: registryProduct.group_gifting_balance,
                remaining_group_gifting_balance: registryProduct.remaining_group_gifting_balance,
                over_group_gifting_balance: registryProduct.over_group_gifting_balance,
                group_gifting_balance_currency: registryProduct.group_gifting_balance_currency,
                quantity: registryProduct.quantity,
                purchased_quantity: registryProduct.purchased_quantity,
              };
              transformed.push(transformedProduct);
              variantMapTemp[transformedProduct.id] = 0;
            }
          } catch (error) {
            console.error("Error fetching product info:", error);
          }
        }

        setTransformedProducts(transformed);
        setVariantMap(variantMapTemp);
        
      } catch (error) {
        console.error("Error fetching guest registry:", error)
      } finally {
        setLoading(false)
        setProductLoading(false)
      }
    }

    if (uuid) fetchRegistry()
  }, [uuid])

  // Calculate statistics (same as RegistrySettings)
  const calculateStats = () => {
    if (!transformedProducts.length) {
      return {
        range1: { count: 0, total: 0, percentage: 0 }, // €0-150
        range2: { count: 0, total: 0, percentage: 0 }, // €150-250
        range3: { count: 0, total: 0, percentage: 0 }, // €250+
        giftCards: { count: 0, percentage: 0 }
      };
    }

    const totalProducts = transformedProducts.length;
    let range1Count = 0; // €0-150
    let range2Count = 0; // €150-250
    let range3Count = 0; // €250+
    let giftCardCount = 0;

    transformedProducts.forEach(product => {
      const price = product.pricing?.priceRange?.start?.gross?.amount || 0;
      
      if (product.name?.toLowerCase().includes('gift card') || 
          product.name?.toLowerCase().includes('δωροκάρτα')) {
        giftCardCount++;
      } else if (price <= 150) {
        range1Count++;
      } else if (price <= 250) {
        range2Count++;
      } else {
        range3Count++;
      }
    });

    return {
      range1: { 
        count: range1Count, 
        total: totalProducts, 
        percentage: totalProducts > 0 ? Math.round((range1Count / totalProducts) * 100) : 0 
      },
      range2: { 
        count: range2Count, 
        total: totalProducts, 
        percentage: totalProducts > 0 ? Math.round((range2Count / totalProducts) * 100) : 0 
      },
      range3: { 
        count: range3Count, 
        total: totalProducts, 
        percentage: totalProducts > 0 ? Math.round((range3Count / totalProducts) * 100) : 0 
      },
      giftCards: { 
        count: giftCardCount, 
        percentage: totalProducts > 0 ? Math.round((giftCardCount / totalProducts) * 100) : 0 
      }
    };
  };

  const stats = calculateStats();

  if (loading || !registry) {
    return <GuestRegistryPageSkeleton />
  }

  return (
    <div>
      {/* Auth Modal */}
      <AuthModal
        isOpen={authModal.isOpen}
        onClose={authModal.hideAuthModal}
        defaultTab={authModal.defaultTab}
        onSuccess={authModal.onSuccessCallback}
      />

      {/* Cover Image Section with Overlay Message - Full Width at Top */}
      <div className="relative mb-12 md:mb-16">
        {/* Cover Image - Responsive aspect ratios */}
        <div className="relative w-full overflow-visible">
          {/* Mobile aspect ratio container */}
          <div 
            className="block md:hidden relative w-full overflow-hidden"
            style={{ aspectRatio: '2 / 1' }}
          >
            {registry.image ? (
              <img
                src={registry.image}
                alt="Registry Cover"
                className="w-full h-full object-cover"
              />
            ) : (
              <div
                className="w-full h-full bg-cover bg-center"
                style={{
                  backgroundImage: "url('https://cdn11.bigcommerce.com/s-fw54kk4zpe/images/stencil/2560w/image-manager/aboutus-2.png')"
                }}
              />
            )}
          </div>

          {/* Desktop aspect ratio container */}
          <div 
            className="hidden md:block relative w-full overflow-hidden"
            style={{ aspectRatio: '4 / 1' }}
          >
            {registry.image ? (
              <img
                src={registry.image}
                alt="Registry Cover"
                className="w-full h-full object-cover"
              />
            ) : (
              <div
                className="w-full h-full bg-cover bg-center"
                style={{
                  backgroundImage: "url('https://cdn11.bigcommerce.com/s-fw54kk4zpe/images/stencil/2560w/image-manager/aboutus-2.png')"
                }}
              />
            )}
          </div>

          {/* Greeting Message Box - Mobile */}
          <div className="block md:hidden absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 w-[70vw] max-w-[300px] min-w-[200px] z-50">
            <div className="mx-2">
              <div 
                className="w-full p-4 shadow-lg"
                style={{ 
                  backgroundColor: '#DCE4D2',
                  height: '90px'
                }}
              >
                <div className="w-full h-full flex items-center justify-center">
                  <p className="text-gray-700 text-sm text-center font-serif leading-relaxed">
                    {registry.welcome_message || "Welcome to our registry!"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Greeting Message Box - Desktop */}
          <div className="hidden md:block absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/3 w-[40vw] max-w-[600px] min-w-[400px] z-2ååå">
            <div className="mx-6">
              <div 
                className="w-full p-6 shadow-lg"
                style={{ 
                  backgroundColor: '#DCE4D2',
                  height: '120px'
                }}
              >
                <div className="w-full h-full flex items-center justify-center">
                  <p className="text-gray-700 text-lg text-center font-serif leading-relaxed">
                    {registry.welcome_message || "Welcome to our registry!"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content - Contained */}
      <div className="max-w-[100rem] mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-12 relative z-10">
        <div className="">
          <div className="space-y-6 sm:space-y-8 py-6 sm:py-8">
            {/* Registry Statistics */}
            <div className="mb-6 sm:mb-8">
              <div className="text-center mb-6 sm:mb-8">
                <h3 className="text-xl sm:text-2xl font-medium text-gray-900">{registry.title}</h3>
              </div>
              
              {/* Stats Charts */}
              <div className="text-center">
                <div className="flex justify-center gap-3 sm:gap-6 flex-wrap">
                  <CircularProgress 
                    percentage={stats.range1.percentage}
                    value={`${stats.range1.count}/${stats.range1.total}`}
                    label="€0 - €150"
                    color="#9CA3AF"
                  />
                  <CircularProgress 
                    percentage={stats.range2.percentage}
                    value={`${stats.range2.count}/${stats.range2.total}`}
                    label="€150 - €250"
                    color="#9CA3AF"
                  />
                  <CircularProgress 
                    percentage={stats.range3.percentage}
                    value={`${stats.range3.count}/${stats.range3.total}`}
                    label="€250+"
                    color="#9CA3AF"
                  />
                  <CircularProgress 
                    percentage={stats.giftCards.percentage}
                    value={`${stats.giftCards.percentage}%`}
                    label="Δωροκάρτες"
                    color="#22D3EE"
                  />
                </div>
              </div>
            </div>

            {/* Products Section with Filters */}
            <div className="flex flex-col lg:flex-row gap-4 lg:gap-0">
              <div className="lg:w-1/3 xl:w-1/4 lg:pr-4">
                <CollapsibleSidebarFilters />
              </div>
              <div className="flex-shrink-0 mb-4 lg:mb-0 lg:mx-4"></div>
              <div className="flex-1">
                <div className="flex justify-end mb-4 sm:mb-6">
                  <select
                    className="border border-gray-300 px-3 py-2 text-xs sm:text-sm text-slate-800 w-full sm:w-auto"
                    onChange={(e) => {
                      const value = e.target.value;
                      const sorted = [...transformedProducts].sort((a, b) => {
                        if (value === "price_asc") {
                          return a.pricing.priceRange.start.gross.amount - b.pricing.priceRange.start.gross.amount;
                        } else if (value === "price_desc") {
                          return b.pricing.priceRange.start.gross.amount - a.pricing.priceRange.start.gross.amount;
                        } else {
                          return 0;
                        }
                      });
                      setTransformedProducts(sorted);
                    }}
                  >
                    <option value="">Ταξινόμηση</option>
                    <option value="price_asc">Τιμή: Χαμηλή προς Υψηλή</option>
                    <option value="price_desc">Τιμή: Υψηλή προς Χαμηλή</option>
                  </select>
                </div>

                {productLoading ? (
                  <div className="flex justify-center items-center py-8">
                    <LoadingSpinner size="md" text="Loading products..." />
                  </div>
                ) : transformedProducts.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-x-8 sm:gap-y-10">
                    {transformedProducts.map((item, index) => {
                      const currentVariantId = item.registryVariantId || item.variants?.[variantMap[item.id] || 0]?.id || item.variants?.[0]?.id;
                      return (
                        <RegistryProductCard 
                          key={item.id}
                          data={{
                            ...item,
                            name: item.is_virtual ? item.virtual_product_title : item.name,
                            pricing: item.is_virtual
                              ? {
                                  ...item.pricing,
                                  priceRange: {
                                    ...item.pricing?.priceRange,
                                    start: {
                                      ...item.pricing?.priceRange?.start,
                                      gross: {
                                        ...item.pricing?.priceRange?.start?.gross,
                                        amount: item.virtual_product_price,
                                      },
                                    },
                                  },
                                }
                              : item.pricing,
                          }}
                          isLiked={wishlist.has(String(item.id))}
                          variantActive={variantMap[item.id] || 0}
                          onVariantChange={(index) => handleVariantChange(item.id, index)}
                          onAddToCart={addToCart}
                          addingToCart={addingToCart[currentVariantId]}
                        />
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500 text-sm sm:text-base">Δεν υπάρχουν προϊόντα σε αυτή τη λίστα ακόμα.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default GuestRegistryLandingPage
