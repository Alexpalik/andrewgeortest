"use client";

import { useCheckout } from "@/app/CheckoutContext";
import {
  Popover,
  PopoverButton,
  PopoverPanel,
  Transition,
  Dialog,
  DialogPanel,
  DialogTitle,
} from "@/app/headlessui";
import { updateCartItem } from "@/app/lib/updateCartItems";
import Prices from "@/components/Prices";
import ButtonPrimary from "@/shared/Button/ButtonPrimary";
import ButtonSecondary from "@/shared/Button/ButtonSecondary";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function CartDropdown() {
  const { checkout, refreshCheckout } = useCheckout();
  const router = useRouter();
  const [isMobile, setIsMobile] = useState(false);
  const [registryCheckouts, setRegistryCheckouts] = useState<any[]>([]);
  const [loadingRegistryCart, setLoadingRegistryCart] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [checkoutToDelete, setCheckoutToDelete] = useState<any>(null);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    fetchRegistryCheckouts();
  }, []);

  useEffect(() => {
    const handleRegistryCartUpdate = (event: any) => {
      console.log('Registry cart updated:', event.detail);
      fetchRegistryCheckouts();
    };

    window.addEventListener('registryCartUpdated', handleRegistryCartUpdate);
    
    return () => {
      window.removeEventListener('registryCartUpdated', handleRegistryCartUpdate);
    };
  }, []);

  const handleDropdownOpen = () => {
    if (!isMobile) {
      fetchRegistryCheckouts();
    }
  };

  const fetchRegistryCheckouts = async () => {
    setLoadingRegistryCart(true);
    try {
      const token = sessionStorage.getItem(
        process.env.NEXT_PUBLIC_SALEOR_API_URL + "+saleor_auth_module_refresh_token"
      );
      
      if (!token) {
        setRegistryCheckouts([]);
        return;
      }

      // Fetch all user checkouts from the registry API
      const registryResponse = await fetch(`${process.env.NEXT_PUBLIC_REGISTRY_URL}/api/checkouts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({}) // Empty body to get all user checkouts
      });

      if (!registryResponse.ok) {
        throw new Error('Failed to fetch registry checkouts');
      }

      const registryData = await registryResponse.json();
      
      // If no checkouts for this user, return empty array
      if (!registryData || registryData.length === 0) {
        setRegistryCheckouts([]);
        return;
      }

      // Process each registry checkout
      const allRegistryCheckouts = await Promise.all(
        registryData.map(async (registryCheckout: any) => {
          try {
            if (!registryCheckout.web_checkout_id) {
              return null;
            }

            // Fetch the actual Saleor checkout data using the web_checkout_id
            const saleorQuery = `
              query GetCheckout($id: ID!) {
                checkout(id: $id) {
                  id
                  totalPrice {
                    gross {
                      amount
                      currency
                    }
                  }
                  lines {
                    id
                    quantity
                    totalPrice {
                      gross {
                        currency
                        amount
                      }
                    }
                    variant {
                      id
                      name
                      product {
                        id
                        name
                        slug
                        media {
                          url
                        }
                        pricing {
                          priceRange {
                            start {
                              gross {
                                amount
                                currency
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            `;

            const saleorResponse = await fetch(process.env.NEXT_PUBLIC_SALEOR_API_URL!, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                query: saleorQuery,
                variables: { id: registryCheckout.web_checkout_id }
              })
            });

            if (!saleorResponse.ok) {
              throw new Error('Failed to fetch Saleor checkout');
            }

            const saleorData = await saleorResponse.json();
            
            if (saleorData.errors) {
              console.error('Saleor GraphQL errors:', saleorData.errors);
              return null;
            }

            const saleorCheckout = saleorData.data?.checkout;
            
            if (!saleorCheckout) {
              return null;
            }

            // Combine registry info with Saleor checkout data
            return {
              registry_uuid: registryCheckout.registry?.uuid,
              creator: registryCheckout.registry?.creator || 'Registry Creator',
              lines: saleorCheckout.lines || [],
              totalPrice: saleorCheckout.totalPrice,
              web_checkout_id: registryCheckout.web_checkout_id,
              is_active: registryCheckout.is_active
            };

          } catch (error) {
            console.error(`Error fetching Saleor checkout for ${registryCheckout.web_checkout_id}:`, error);
            return null;
          }
        })
      );

      setRegistryCheckouts(allRegistryCheckouts.filter(Boolean));
    } catch (error) {
      console.error('Error fetching registry checkouts:', error);
      setRegistryCheckouts([]);
    } finally {
      setLoadingRegistryCart(false);
    }
  };

  const handleDeleteCheckout = async () => {
    if (!checkoutToDelete) return;

    try {
      const token = sessionStorage.getItem(
        process.env.NEXT_PUBLIC_SALEOR_API_URL + "+saleor_auth_module_refresh_token"
      );
      
      if (!token) return;

      const response = await fetch(`${process.env.NEXT_PUBLIC_REGISTRY_URL}/api/checkouts/${checkoutToDelete.web_checkout_id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        // Refresh the registry checkouts list
        fetchRegistryCheckouts();
        setShowDeleteModal(false);
        setCheckoutToDelete(null);
      } else {
        console.error('Failed to delete registry checkout');
      }
    } catch (error) {
      console.error('Error deleting registry checkout:', error);
    }
  };

  return (
    <>
      <Popover className="relative">
        {({ open, close }: { open: boolean; close: () => void }) => (
          <>
            {/* Cart Icon Button */}
            <PopoverButton
     className="h-10  sm:h-12 rounded-none flex items-center justify-center relative text-white focus:outline-none cursor-pointer"
     onClick={() => {
       if (!isMobile) handleDropdownOpen();
     }}
   >
     <Image src="/svg/cart2.svg" alt="Cart" width={24} height={24} />
     <span
       className="absolute -top-0.5 -right-2 bg-[#19A7CE] text-white text-xs  px-1 flex items-center justify-center"
       style={{
         minWidth: '18px',
         height: '18px',
         fontSize: '14px',
         fontWeight: 500,
         display: 'flex',
         alignItems: 'center',
         justifyContent: 'center',
       }}
     >
       {checkout?.lines?.length ?? 0}
     </span>
   </PopoverButton>

            {!isMobile && (
            <Transition
              enter="transition ease-out duration-200"
              enterFrom="opacity-0 translate-y-1"
              enterTo="opacity-100 translate-y-0"
              leave="transition ease-in duration-150"
              leaveFrom="opacity-100 translate-y-0"
              leaveTo="opacity-0 translate-y-1"
            >
              <PopoverPanel className="absolute z-10 w-screen max-w-xs sm:max-w-md px-4 mt-3.5 -right-28 sm:right-0 sm:px-0">
                <div className="overflow-hidden rounded-none shadow-lg ring-1 ring-black/5">
                  <div className="relative bg-white text-black">
                    <div className="max-h-[60vh] p-5 overflow-y-auto hiddenScrollbar">
                      <h3 className="text-xl  mb-4">Shopping cart</h3>

                      {/* Personal Cart Section */}
                      <div className="mb-6">
                        <h4 className="text-lg font-medium mb-3 text-gray-800 border-b border-gray-200 pb-2">
                          Personal Purchases
                        </h4>
                        <div className="divide-y divide-slate-100">
                          {checkout?.lines?.length ? (
                            checkout.lines.map((item: any, index: number) => (
                              <div key={index} className="flex py-5 last:pb-0">
                                {/* Product Image */}
                                <Link
                                  href={`/product/${item.variant.product.slug}`}
                                  onClick={close}
                                  className="relative h-24 w-20 flex-shrink-0 overflow-hidden rounded-none bg-slate-100"
                                >
                                  <Image
                                    fill
                                    src={item.variant.product.media[0]?.url || "/placeholder-image.jpg"}
                                    alt={item.variant.product.name}
                                    className="object-contain object-center"
                                  />
                                </Link>

                                <div className="ml-4 flex flex-1 flex-col">
                                  <div className="flex justify-between">
                                    <div>
                                      {/* Product Name */}
                                      <h3 className="text-base font-medium">
                                        <Link href={`/product/${item.variant.product.slug}`} onClick={close}>
                                          {item.variant.product.name}
                                        </Link>
                                      </h3>
                                      <p className="mt-1 text-sm text-slate-500">
                                        <span>{item.variant.name}</span>
                                        <span className="mx-2 border-l border-slate-200 h-4"></span>
                                        <span>{`Qty ${item.quantity}`}</span>
                                      </p>
                                    </div>
                                    {/* Price */}
                                    <Prices
                                      price={item.totalPrice?.gross?.amount || (item.quantity * item.variant.product.pricing.priceRange.start.gross.amount)}
                                      className="mt-0.5"
                                    />
                                  </div>

                                  {/* Remove Button */}
                                  <div className="flex justify-end mt-6">
                                    <button
                                      type="button"
                                      className="text-primary-600 font-medium"
                                      onClick={async () => {
                                        await updateCartItem(item.id, 0);
                                        refreshCheckout();
                                      }}
                                    >
                                      Remove
                                    </button>
                                  </div>
                                </div>
                              </div>
                            ))
                          ) : (
                            <p className="text-center py-5 text-gray-500">No personal items in cart.</p>
                          )}
                        </div>
                      </div>

                      {/* Personal Cart Buttons */}
                      {checkout?.lines?.length > 0 && (
                        <div className="flex space-x-2 mb-6">
                          <ButtonSecondary
                            href="/cart"
                            onClick={close}
                            className="flex-1 border border-slate-200"
                          >
                            View cart
                          </ButtonSecondary>
                          <ButtonPrimary
                            href="/checkout"
                            onClick={close}
                            className="flex-1"
                          >
                            Check out
                          </ButtonPrimary>
                        </div>
                      )}

                      {/* Registry Gifts Section */}
                      <div className="mb-6">
                        <h4 className="text-lg font-medium mb-3 text-gray-800 border-b border-gray-200 pb-2">
                          Registry Gifts
                        </h4>
                        {loadingRegistryCart ? (
                          <div className="text-center py-5">
                            <div className="inline-block animate-spin rounded-none h-6 w-6 border-b-2 border-primary-600"></div>
                            <p className="mt-2 text-sm text-gray-500">Loading registry items...</p>
                          </div>
                        ) : registryCheckouts.length > 0 ? (
                          <div className="space-y-6">
                            {registryCheckouts.map((regCheckout, regIndex) => (
                              <div key={regIndex} className="border border-gray-200 rounded-none p-4 bg-gray-50 relative">
                                {/* Delete Button */}
                                <button
                                  onClick={() => {
                                    setCheckoutToDelete(regCheckout);
                                    setShowDeleteModal(true);
                                  }}
                                  className="absolute top-2 right-2 w-6 h-6 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-200 rounded-none transition-colors"
                                  title="Remove registry checkout"
                                >
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                  </svg>
                                </button>

                                {/* Registry Creator Info */}
                                <div className="mb-3 pb-2 border-b border-gray-300 pr-8">
                                  <p className="text-sm font-medium text-gray-700">
                                    Gift for: <span className="text-primary-600">{regCheckout.creator || 'Registry Creator'}</span>
                                  </p>
                                </div>
                                
                                {/* Registry Items */}
                                <div className="divide-y divide-gray-200 mb-4">
                                  {regCheckout.lines?.length ? (
                                    regCheckout.lines.map((item: any, itemIndex: number) => (
                                      <div key={itemIndex} className="flex py-3 first:pt-0 last:pb-0">
                                        {/* Product Image */}
                                        <div className="relative h-16 w-14 flex-shrink-0 overflow-hidden rounded-none bg-white">
                                          <Image
                                            fill
                                            src={item.variant?.product?.media?.[0]?.url || "/placeholder-image.jpg"}
                                            alt={item.variant?.product?.name || "Product"}
                                            className="object-contain object-center"
                                          />
                                        </div>

                                        <div className="ml-3 flex flex-1 flex-col">
                                          <div className="flex justify-between">
                                            <div>
                                              <h5 className="text-sm font-medium">
                                                {item.variant?.product?.name || "Product Name"}
                                              </h5>
                                              <p className="mt-1 text-xs text-slate-500">
                                                <span>{item.variant?.name || "Variant"}</span>
                                                <span className="mx-2 border-l border-slate-200 h-3"></span>
                                                <span>{`Qty ${item.quantity || 1}`}</span>
                                              </p>
                                            </div>
                                            {/* Price */}
                                            <div className="text-sm font-medium">
                                              {item.totalPrice?.gross?.amount ? (
                                                <Prices
                                                  price={item.totalPrice.gross.amount}
                                                  className="mt-0.5"
                                                />
                                              ) : (
                                                <span className="text-gray-500">Price N/A</span>
                                              )}
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    ))
                                  ) : (
                                    <p className="text-center py-3 text-sm text-gray-500">No items for this registry.</p>
                                  )}
                                </div>

                                {/* Registry Checkout Button */}
                                {regCheckout.lines?.length > 0 && (
                                  <div className="pt-2 border-t border-gray-300">
                                    <ButtonPrimary
                                      onClick={() => {
                                        close();
                                        window.location.href = `/registry-checkout/${regCheckout.web_checkout_id}`;
                                      }}
                                      className="w-full text-sm py-2"
                                    >
                                      Registry Checkout
                                    </ButtonPrimary>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-center py-5 text-gray-500">No registry gifts in cart.</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </PopoverPanel>
            </Transition>
          )}
          </>
        )}
      </Popover>
      
      {/* Delete Confirmation Modal */}
      <Dialog 
        open={showDeleteModal} 
        onClose={() => setShowDeleteModal(false)}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-black/25" />
        <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
          <DialogPanel className="max-w-md space-y-4 bg-white p-6 rounded-none shadow-xl">
            <DialogTitle className="text-lg font-medium text-gray-900">
              Remove Registry Checkout
            </DialogTitle>
            <p className="text-sm text-gray-500">
              Are you sure you want to remove all items from this registry checkout for{' '}
              <span className="font-medium text-gray-900">
                {checkoutToDelete?.creator || 'this registry'}
              </span>? This action cannot be undone.
            </p>
            <div className="flex gap-4 justify-end">
              <ButtonSecondary
                onClick={() => {
                  setShowDeleteModal(false);
                  setCheckoutToDelete(null);
                }}
                className="px-4 py-2"
              >
                Cancel
              </ButtonSecondary>
              <ButtonPrimary
                onClick={handleDeleteCheckout}
                className="px-4 py-2 bg-red-600 hover:bg-red-700"
              >
                Remove
              </ButtonPrimary>
            </div>
          </DialogPanel>
        </div>
      </Dialog>
    </>
  );
}
