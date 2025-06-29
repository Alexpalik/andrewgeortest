"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Prices from "@/components/Prices";
import ButtonPrimary from "@/shared/Button/ButtonPrimary";
import ButtonSecondary from "@/shared/Button/ButtonSecondary";
import { checkoutEmailUpdate, checkoutShippingAddressUpdate, checkoutBillingAddressUpdate, checkoutPaymentCreate, checkoutComplete, getCheckoutTotal } from "@/app/lib/checkoutHelpers";
import { parsePhoneNumber, isValidPhoneNumber } from 'libphonenumber-js';
import PhoneInput from '@/components/PhoneInput';
import { RegistryCheckoutPageSkeleton } from '@/components/LoadingSkeleton';
import { gql, useQuery, useMutation } from "@apollo/client";

// GraphQL query for user profile data
const GET_USER_PROFILE = gql`
  query GetUserProfile {
    me {
      id
      email
      firstName
      lastName
      defaultShippingAddress {
        streetAddress1
        streetAddress2
        city
        postalCode
        country {
          code
        }
        phone
      }
      defaultBillingAddress {
        streetAddress1
        streetAddress2
        city
        postalCode
        country {
          code
        }
        phone
      }
    }
  }
`;

// GraphQL mutations for gift card functionality
const ADD_GIFT_CARD_TO_CHECKOUT = gql`
  mutation AddGiftCardToCheckout($id: ID!, $promoCode: String!) {
    checkoutAddPromoCode(id: $id, promoCode: $promoCode) {
      checkout {
        id
        totalPrice {
          gross {
            amount
            currency
          }
        }
        discount {
          amount
          currency
        }
        giftCards {
          id
          displayCode
          currentBalance {
            amount
            currency
          }
        }
      }
      errors {
        field
        message
        code
      }
    }
  }
`;

const REMOVE_GIFT_CARD_FROM_CHECKOUT = gql`
  mutation RemoveGiftCardFromCheckout($id: ID!, $promoCode: String!) {
    checkoutRemovePromoCode(id: $id, promoCode: $promoCode) {
      checkout {
        id
        totalPrice {
          gross {
            amount
            currency
          }
        }
        discount {
          amount
          currency
        }
        giftCards {
          id
          displayCode
          currentBalance {
            amount
            currency
          }
        }
      }
      errors {
        field
        message
        code
      }
    }
  }
`;

interface RegistryCheckout {
  registry: {
    uuid: string;
    image: string;
    title: string;
    description: string;
    creator: string;
    shipping_address: {
      address_line_1: string;
      country: string;
      postal_code: string;
      city: string;
      notes: string;
    };
  };
  web_checkout_id: string;
  is_active: boolean;
}

interface CheckoutLine {
  id: string;
  quantity: number;
  totalPrice?: {
    gross: {
      amount: number;
      currency: string;
    };
  };
  variant: {
    id: string;
    name: string;
    product: {
      id: string;
      name: string;
      slug: string;
      media: Array<{ url: string }>;
      pricing: {
        priceRange: {
          start: {
            gross: {
              amount: number;
              currency: string;
            };
          };
        };
      };
    };
  };
}

interface SaleorCheckout {
  id: string;
  totalPrice: {
    gross: {
      amount: number;
      currency: string;
    };
  };
  lines: CheckoutLine[];
  discount?: {
    amount: number;
    currency: string;
  };
  giftCards?: Array<{
    id: string;
    displayCode: string;
    currentBalance: {
      amount: number;
      currency: string;
    };
  }>;
}

const RegistryCheckoutPage = () => {
  const { checkoutId } = useParams();
  const router = useRouter();

  // State/Province options for different countries
  const getStateOptions = (countryCode: string) => {
    const states: { [key: string]: { code: string; name: string }[] } = {
      GR: [
        { code: 'ATT', name: 'Attica' },
        { code: 'CEN-MAC', name: 'Central Macedonia' },
        { code: 'CRE', name: 'Crete' },
        { code: 'EAS-MAC', name: 'Eastern Macedonia and Thrace' },
        { code: 'EPI', name: 'Epirus' },
        { code: 'ION', name: 'Ionian Islands' },
        { code: 'NOR-AEG', name: 'North Aegean' },
        { code: 'PEL', name: 'Peloponnese' },
        { code: 'SOU-AEG', name: 'South Aegean' },
        { code: 'THE', name: 'Thessaly' },
        { code: 'WES-GRE', name: 'Western Greece' },
        { code: 'WES-MAC', name: 'Western Macedonia' },
        { code: 'CEN-GRE', name: 'Central Greece' }
      ],
      CY: [
        { code: 'FAM', name: 'Famagusta' },
        { code: 'KYR', name: 'Kyrenia' },
        { code: 'LAR', name: 'Larnaca' },
        { code: 'LIM', name: 'Limassol' },
        { code: 'NIC', name: 'Nicosia' },
        { code: 'PAP', name: 'Paphos' }
      ]
    };
    return states[countryCode] || [];
  };

  // Phone validation function
  const validatePhoneNumber = (phoneNumber: string, countryCode: string = 'GR') => {
    if (!phoneNumber.trim()) {
      setPhoneError(null);
      setIsPhoneValid(true);
      return true;
    }

    try {
      // Try to parse the phone number with the country code
      const parsed = parsePhoneNumber(phoneNumber, countryCode as any);
      
      if (parsed && parsed.isValid()) {
        setPhoneError(null);
        setIsPhoneValid(true);
        return true;
      } else {
        setPhoneError("Please enter a valid phone number for the selected country");
        setIsPhoneValid(false);
        return false;
      }
    } catch (error) {
      // If parsing fails, check if it's a valid phone number without country context
      if (isValidPhoneNumber(phoneNumber)) {
        setPhoneError(null);
        setIsPhoneValid(true);
        return true;
      } else {
        setPhoneError("Please enter a valid phone number");
        setIsPhoneValid(false);
        return false;
      }
    }
  };
  const [registryCheckout, setRegistryCheckout] = useState<RegistryCheckout | null>(null);
  const [saleorCheckout, setSaleorCheckout] = useState<SaleorCheckout | null>(null);
  const [registryData, setRegistryData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userDataLoaded, setUserDataLoaded] = useState(false);
  
  // Checkout form states
  const [email, setEmail] = useState("");
  const [shippingAddress, setShippingAddress] = useState({
    firstName: "",
    lastName: "",
    streetAddress1: "",
    streetAddress2: "",
    city: "",
    postalCode: "",
    country: "",
    countryArea: "",
    phone: ""
  });
  const [billingAddress, setBillingAddress] = useState({
    firstName: "",
    lastName: "",
    streetAddress1: "",
    streetAddress2: "",
    city: "",
    postalCode: "",
    country: "",
    countryArea: "",
    phone: ""
  });
  const [cardNumber, setCardNumber] = useState("");
  const [processing, setProcessing] = useState(false);
  
  // Phone validation states
  const [phoneError, setPhoneError] = useState<string | null>(null);
  const [isPhoneValid, setIsPhoneValid] = useState(true);

  // Gift card states
  const [giftCardCode, setGiftCardCode] = useState("");
  const [giftCardError, setGiftCardError] = useState<string | null>(null);
  const [giftCardLoading, setGiftCardLoading] = useState(false);

  // Gift card mutations
  const [addGiftCard] = useMutation(ADD_GIFT_CARD_TO_CHECKOUT);
  const [removeGiftCard] = useMutation(REMOVE_GIFT_CARD_FROM_CHECKOUT);

  // Fetch user profile data
  const { data: userProfileData } = useQuery(GET_USER_PROFILE, {
    onCompleted: (data) => {
      if (data?.me && !userDataLoaded) {
        const user = data.me;
        
        // Auto-fill email
        if (user.email && !email) {
          setEmail(user.email);
        }
        
        // Auto-fill billing address from user's default billing or shipping address
        const billingAddr = user.defaultBillingAddress || user.defaultShippingAddress;
        if (billingAddr && !billingAddress.firstName && !billingAddress.lastName) {
          setBillingAddress({
            firstName: user.firstName || "",
            lastName: user.lastName || "",
            streetAddress1: billingAddr.streetAddress1 || "",
            streetAddress2: billingAddr.streetAddress2 || "",
            city: billingAddr.city || "",
            postalCode: billingAddr.postalCode || "",
            country: billingAddr.country?.code || "",
            countryArea: "",
            phone: billingAddr.phone || ""
          });
          
          // Validate the auto-filled phone number
          if (billingAddr.phone) {
            validatePhoneNumber(billingAddr.phone, billingAddr.country?.code || 'GR');
          }
        }
        
        setUserDataLoaded(true);
      }
    },
    onError: (error) => {
      console.error("Error fetching user profile:", error);
      // If there's an authentication error, redirect to login
      if (error.graphQLErrors?.some(err => err.extensions?.code === 'InvalidTokenError')) {
        router.push("/login");
      }
    }
  });

  useEffect(() => {
    fetchCheckoutData();
  }, [checkoutId]);

  const fetchCheckoutData = async () => {
    setLoading(true);
    try {
      const token = sessionStorage.getItem(
        process.env.NEXT_PUBLIC_SALEOR_API_URL + "+saleor_auth_module_refresh_token"
      );

      if (!token) {
        router.push('/login');
        return;
      }

      // Fetch all user checkouts from registry API
      const registryResponse = await fetch(`${process.env.NEXT_PUBLIC_REGISTRY_URL}/api/checkouts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({})
      });

      if (!registryResponse.ok) {
        throw new Error('Failed to fetch registry checkouts');
      }

      const registryData = await registryResponse.json();
      
      // Find the specific checkout
      const targetCheckout = registryData.find((checkout: RegistryCheckout) => 
        checkout.web_checkout_id === checkoutId
      );

      if (!targetCheckout) {
        setError('Checkout not found');
        return;
      }

      setRegistryCheckout(targetCheckout);

      // Fetch full registry data to get shipping address
      const fullRegistryResponse = await fetch(`${process.env.NEXT_PUBLIC_REGISTRY_URL}/api/registry/${targetCheckout.registry.uuid}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!fullRegistryResponse.ok) {
        throw new Error('Failed to fetch registry data');
      }

      const fullRegistry = await fullRegistryResponse.json();
      setRegistryData(fullRegistry);

      // Auto-populate shipping address from registry data
      if (fullRegistry.shipping_address) {
        setShippingAddress({
          firstName: fullRegistry.creator?.split(' ')[0] || "",
          lastName: fullRegistry.creator?.split(' ').slice(1).join(' ') || "",
          streetAddress1: fullRegistry.shipping_address.address_line_1 || "",
          streetAddress2: "",
          city: fullRegistry.shipping_address.city || "",
          postalCode: fullRegistry.shipping_address.postal_code || "",
          country: fullRegistry.shipping_address.country === "Greece" ? "GR" : fullRegistry.shipping_address.country || "",
          countryArea: "",
          phone: ""
        });
      }

      // Fetch Saleor checkout data
      const saleorQuery = `
        query GetCheckout($id: ID!) {
          checkout(id: $id) {
            id
            email
            totalPrice {
              gross {
                amount
                currency
              }
            }
            discount {
              amount
              currency
            }
            giftCards {
              id
              displayCode
              currentBalance {
                amount
                currency
              }
            }
            shippingAddress {
              firstName
              lastName
              streetAddress1
              streetAddress2
              city
              postalCode
              country {
                code
              }
              phone
            }
            billingAddress {
              firstName
              lastName
              streetAddress1
              streetAddress2
              city
              postalCode
              country {
                code
              }
              phone
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
          'Authorization': process.env.API_TOKEN!
        },
        body: JSON.stringify({
          query: saleorQuery,
          variables: { id: checkoutId }
        })
      });

      if (!saleorResponse.ok) {
        throw new Error('Failed to fetch Saleor checkout');
      }

      const saleorData = await saleorResponse.json();
      
      if (saleorData.errors) {
        console.error('Saleor GraphQL errors:', saleorData.errors);
        throw new Error('Failed to load checkout data');
      }

      const checkout = saleorData.data?.checkout;
      if (!checkout) {
        throw new Error('Checkout not found in Saleor');
      }

      setSaleorCheckout(checkout);

      // Pre-fill form data if available (but don't override user profile data)
      if (checkout.email && !email && !userDataLoaded) {
        setEmail(checkout.email);
      }
      if (checkout.shippingAddress) {
        setShippingAddress({
          firstName: checkout.shippingAddress.firstName || "",
          lastName: checkout.shippingAddress.lastName || "",
          streetAddress1: checkout.shippingAddress.streetAddress1 || "",
          streetAddress2: checkout.shippingAddress.streetAddress2 || "",
          city: checkout.shippingAddress.city || "",
          postalCode: checkout.shippingAddress.postalCode || "",
          country: checkout.shippingAddress.country?.code || "",
          countryArea: checkout.shippingAddress.countryArea || "",
          phone: checkout.shippingAddress.phone || ""
        });
      }
      // Only fill billing address from Saleor checkout if user profile data hasn't been loaded
      if (checkout.billingAddress && !userDataLoaded && !billingAddress.firstName && !billingAddress.lastName) {
        setBillingAddress({
          firstName: checkout.billingAddress.firstName || "",
          lastName: checkout.billingAddress.lastName || "",
          streetAddress1: checkout.billingAddress.streetAddress1 || "",
          streetAddress2: checkout.billingAddress.streetAddress2 || "",
          city: checkout.billingAddress.city || "",
          postalCode: checkout.billingAddress.postalCode || "",
          country: checkout.billingAddress.country?.code || "",
          countryArea: checkout.billingAddress.countryArea || "",
          phone: checkout.billingAddress.phone || ""
        });
      }

    } catch (error) {
      console.error('Error fetching checkout data:', error);
      setError(error instanceof Error ? error.message : 'Failed to load checkout');
    } finally {
      setLoading(false);
    }
  };

  const handleApplyGiftCard = async () => {
    if (!giftCardCode.trim() || !saleorCheckout) return;

    console.log('Applying gift card:', giftCardCode.trim(), 'to checkout:', saleorCheckout.id);
    setGiftCardLoading(true);
    setGiftCardError(null);

    try {
      const result = await addGiftCard({
        variables: {
          id: saleorCheckout.id,
          promoCode: giftCardCode.trim()
        }
      });

      console.log('Gift card application result:', result);

      if (result.data?.checkoutAddPromoCode?.errors?.length > 0) {
        const error = result.data.checkoutAddPromoCode.errors[0];
        console.error('Gift card application error:', error);
        setGiftCardError(error.message || 'Invalid gift card code');
      } else if (result.data?.checkoutAddPromoCode?.checkout) {
        // Update checkout data with new totals and gift cards
        console.log('Gift card applied successfully, updating checkout data');
        setSaleorCheckout(result.data.checkoutAddPromoCode.checkout);
        setGiftCardCode("");
        setGiftCardError(null);
      } else {
        console.error('Unexpected response structure:', result);
        setGiftCardError('Unexpected response from server');
      }
    } catch (error) {
      console.error('Error applying gift card:', error);
      setGiftCardError('Failed to apply gift card. Please try again.');
    } finally {
      setGiftCardLoading(false);
    }
  };

  const handleRemoveGiftCard = async (giftCardCode: string) => {
    if (!saleorCheckout) return;

    setGiftCardLoading(true);

    try {
      const result = await removeGiftCard({
        variables: {
          id: saleorCheckout.id,
          promoCode: giftCardCode
        }
      });

      if (result.data?.checkoutRemovePromoCode?.checkout) {
        // Update checkout data
        setSaleorCheckout(result.data.checkoutRemovePromoCode.checkout);
      }
    } catch (error) {
      console.error('Error removing gift card:', error);
    } finally {
      setGiftCardLoading(false);
    }
  };

  const handleCompleteOrder = async () => {
    if (!saleorCheckout || !registryCheckout) return;

    setProcessing(true);
    try {
      // Update email
      if (email) {
        await checkoutEmailUpdate(saleorCheckout.id, email);
      }

      // Update shipping address (auto-filled from registry)
      await checkoutShippingAddressUpdate(saleorCheckout.id, shippingAddress);

      // Update billing address
      await checkoutBillingAddressUpdate(saleorCheckout.id, billingAddress);

      // Get total amount
      const totalAmount = await getCheckoutTotal(saleorCheckout.id);

      // Create payment
      await checkoutPaymentCreate(saleorCheckout.id, totalAmount, cardNumber);

      // Complete checkout
      const order = await checkoutComplete(saleorCheckout.id);

      if (order.order) {
        // Redirect to thank you page
        window.location.href = `/thank-you`;
      } else {
        throw new Error('Failed to complete order');
      }

    } catch (error) {
      console.error('Error completing order:', error);
      setError(error instanceof Error ? error.message : 'Failed to complete order');
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return <RegistryCheckoutPageSkeleton />;
  }

  if (error || !registryCheckout || !saleorCheckout) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Checkout Not Found</h1>
          <p className="text-gray-600 mb-6">{error || 'The requested checkout could not be found.'}</p>
          <ButtonSecondary onClick={() => router.push('/cart')}>
            Return to Cart
          </ButtonSecondary>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Back Button */}
      <div className="mb-6">
        <button
          onClick={() => router.back()}
          className="text-sm text-primary-600  hover:underline"
        >
          ← Back
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column - Registry Information & Items */}
        <div className="space-y-6">
          {/* Registry Header */}
          <div className="bg-white rounded-none border p-6">
            <div className="flex items-start space-x-4">
              {registryCheckout.registry.image && (
                <div className="w-20 h-20 flex-shrink-0 overflow-hidden rounded-none">
                  <Image
                    src={registryCheckout.registry.image}
                    alt={registryCheckout.registry.title}
                    width={80}
                    height={80}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div className="flex-1">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                  {registryCheckout.registry.title}
                </h1>
                <p className="text-sm text-gray-600 mb-2">
                  Created by: <span className="font-medium text-primary-600">{registryCheckout.registry.creator}</span>
                </p>
                {registryCheckout.registry.description && (
                  <p className="text-sm text-gray-700">{registryCheckout.registry.description}</p>
                )}
              </div>
            </div>
          </div>

          {/* Cart Items */}
          <div className="bg-white rounded-none border p-6">
            <h2 className="text-xl  mb-4">Your Registry Gifts</h2>
            <div className="space-y-4">
              {saleorCheckout.lines.map((item, index) => (
                <div key={index} className="flex items-center space-x-4 p-4 border rounded-none">
                  <div className="w-16 h-16 flex-shrink-0 overflow-hidden rounded-none bg-gray-100">
                    <Image
                      src={item.variant.product.media[0]?.url || "/placeholder-image.jpg"}
                      alt={item.variant.product.name}
                      width={64}
                      height={64}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{item.variant.product.name}</h3>
                    <p className="text-sm text-gray-600">
                      {item.variant.name} • Qty {item.quantity}
                    </p>
                  </div>
                  <div className="text-right">
                    <Prices
                      price={item.totalPrice?.gross?.amount || (item.quantity * item.variant.product.pricing.priceRange.start.gross.amount)}
                      className="font-medium"
                    />
                  </div>
                </div>
              ))}
            </div>
            
            {/* Applied Gift Cards */}
            {saleorCheckout.giftCards && saleorCheckout.giftCards.length > 0 && (
              <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-none">
                <h4 className="text-sm font-medium text-green-800 mb-2">Applied Gift Cards:</h4>
                {saleorCheckout.giftCards.map((giftCard) => (
                  <div key={giftCard.id} className="flex justify-between items-center text-sm">
                    <span className="text-green-700">
                      Gift Card: ****{giftCard.displayCode.slice(-4)}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-green-700">
                        Balance: {giftCard.currentBalance.currency} {giftCard.currentBalance.amount}
                      </span>
                      <button
                        onClick={() => handleRemoveGiftCard(giftCard.displayCode)}
                        disabled={giftCardLoading}
                        className="text-red-600 hover:text-red-800 text-xs underline"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Discount Applied */}
            {saleorCheckout.discount && saleorCheckout.discount.amount > 0 && (
              <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-none">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-blue-700 font-medium">Discount Applied:</span>
                  <span className="text-blue-700">
                    -{saleorCheckout.discount.currency} {saleorCheckout.discount.amount}
                  </span>
                </div>
              </div>
            )}

            {/* Total */}
            <div className="mt-6 pt-4 border-t">
              <div className="flex justify-between items-center">
                <span className="text-lg ">Total:</span>
                <Prices
                  price={saleorCheckout.totalPrice.gross.amount}
                  className="text-lg font-bold text-primary-600"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Checkout Form */}
        <div className="space-y-6">
          <div className="bg-white rounded-none border p-6">
            <h2 className="text-xl  mb-6">Checkout Information</h2>
            
            {/* Contact Information */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-medium">Contact Information</h3>
                {userProfileData?.me && (
                  <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full">
                    Auto-filled from account
                  </span>
                )}
              </div>
              <input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-none focus:outline-none focus:ring-2 focus:ring-primary-500"
                required
              />
            </div>

            {/* Billing Address */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-medium">Billing Address</h3>
                {userProfileData?.me && (userProfileData.me.defaultBillingAddress || userProfileData.me.defaultShippingAddress) && (
                  <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full">
                    Auto-filled from account
                  </span>
                )}
              </div>
              <div className="grid grid-cols-2 gap-3 mb-3">
                <input
                  type="text"
                  placeholder="First name"
                  value={billingAddress.firstName}
                  onChange={(e) => setBillingAddress({...billingAddress, firstName: e.target.value})}
                  className="px-3 py-2 border border-gray-300 rounded-none focus:outline-none focus:ring-2 focus:ring-primary-500"
                  required
                />
                <input
                  type="text"
                  placeholder="Last name"
                  value={billingAddress.lastName}
                  onChange={(e) => setBillingAddress({...billingAddress, lastName: e.target.value})}
                  className="px-3 py-2 border border-gray-300 rounded-none focus:outline-none focus:ring-2 focus:ring-primary-500"
                  required
                />
              </div>
              <input
                type="text"
                placeholder="Street address"
                value={billingAddress.streetAddress1}
                onChange={(e) => setBillingAddress({...billingAddress, streetAddress1: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-none focus:outline-none focus:ring-2 focus:ring-primary-500 mb-3"
                required
              />
              <input
                type="text"
                placeholder="Apartment, suite, etc. (optional)"
                value={billingAddress.streetAddress2}
                onChange={(e) => setBillingAddress({...billingAddress, streetAddress2: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-none focus:outline-none focus:ring-2 focus:ring-primary-500 mb-3"
              />
              <input
                type="text"
                placeholder="City"
                value={billingAddress.city}
                onChange={(e) => setBillingAddress({...billingAddress, city: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-none focus:outline-none focus:ring-2 focus:ring-primary-500 mb-3"
                required
              />
              <div className="grid grid-cols-2 gap-3 mb-3">
                <div>
                  <select
                    value={billingAddress.country}
                    onChange={(e) => setBillingAddress({...billingAddress, country: e.target.value, countryArea: ""})}
                    className={`px-3 py-2 border rounded-none focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white w-full ${
                      !billingAddress.country ? 'border-red-300 bg-red-50' : 'border-gray-300'
                    }`}
                    required
                  >
                    <option value="">Select Country *</option>
                    <option value="GR">Greece</option>
                    <option value="CY">Cyprus</option>
                  </select>
                  {!billingAddress.country && (
                    <p className="text-xs text-red-600 mt-1">Country is required</p>
                  )}
                </div>
                <div>
                  {getStateOptions(billingAddress.country).length > 0 ? (
                    <select
                      value={billingAddress.countryArea}
                      onChange={(e) => setBillingAddress({...billingAddress, countryArea: e.target.value})}
                      className={`px-3 py-2 border rounded-none focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white w-full ${
                        !billingAddress.countryArea ? 'border-red-300 bg-red-50' : 'border-gray-300'
                      }`}
                      required
                    >
                      <option value="">Select State/Province *</option>
                      {getStateOptions(billingAddress.country).map((state) => (
                        <option key={state.code} value={state.code}>
                          {state.name}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type="text"
                      placeholder="State/Province *"
                      value={billingAddress.countryArea}
                      onChange={(e) => setBillingAddress({...billingAddress, countryArea: e.target.value})}
                      className={`px-3 py-2 border rounded-none focus:outline-none focus:ring-2 focus:ring-primary-500 w-full ${
                        !billingAddress.countryArea ? 'border-red-300 bg-red-50' : 'border-gray-300'
                      }`}
                      required
                    />
                  )}
                  {!billingAddress.countryArea && (
                    <p className="text-xs text-red-600 mt-1">State/Province is required</p>
                  )}
                </div>
              </div>
              <input
                type="text"
                placeholder="Postal code"
                value={billingAddress.postalCode}
                onChange={(e) => setBillingAddress({...billingAddress, postalCode: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-none focus:outline-none focus:ring-2 focus:ring-primary-500 mb-3"
                required
              />
              <div>
                <PhoneInput
                  value={billingAddress.phone}
                  onChange={(value) => {
                    const newPhone = value || "";
                    setBillingAddress({...billingAddress, phone: newPhone});
                    // Validate phone on change
                    validatePhoneNumber(newPhone, billingAddress.country);
                  }}
                  onBlur={() => {
                    // Validate phone when user leaves the field
                    validatePhoneNumber(billingAddress.phone, billingAddress.country);
                  }}
                  placeholder="Phone number"
                  error={!isPhoneValid}
                  defaultCountry={billingAddress.country === 'CY' ? 'CY' : 'GR'}
                />
                {phoneError && (
                  <p className="mt-1 text-sm text-red-600">{phoneError}</p>
                )}
              </div>
            </div>

            {/* Gift Card Section */}
            <div className="mb-6">
              <h3 className="text-lg font-medium mb-3">Gift Card</h3>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Enter gift card code"
                  value={giftCardCode}
                  onChange={(e) => setGiftCardCode(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleApplyGiftCard();
                    }
                  }}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-none focus:outline-none focus:ring-2 focus:ring-primary-500"
                  disabled={giftCardLoading}
                />
                <button
                  type="button"
                  onClick={handleApplyGiftCard}
                  disabled={!giftCardCode.trim() || giftCardLoading}
                  className="px-4 py-2 bg-primary-600 text-white rounded-none hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {giftCardLoading ? (
                    <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  ) : (
                    'Apply'
                  )}
                </button>
              </div>
              {giftCardError && (
                <p className="mt-2 text-sm text-red-600">{giftCardError}</p>
              )}
              <p className="text-xs text-gray-500 mt-1">
                Enter your gift card code to apply it to your order
              </p>
            </div>

            {/* Payment Information */}
            <div className="mb-6">
              <h3 className="text-lg font-medium mb-3">Payment Information</h3>
              <input
                type="text"
                placeholder="Card number (use 4111111111111111 for testing)"
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-none focus:outline-none focus:ring-2 focus:ring-primary-500"
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                For testing, use: 4111111111111111
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                {error}
              </div>
            )}

            {/* Required Fields Notice */}
            {(processing || !email || !billingAddress.firstName || !billingAddress.lastName || !billingAddress.streetAddress1 || !billingAddress.city || !billingAddress.postalCode || !billingAddress.country || !billingAddress.countryArea || !cardNumber || !isPhoneValid) && (
              <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded">
                <p className="text-sm text-yellow-800">
                  <strong>Please complete all required fields:</strong>
                </p>
                <ul className="text-xs text-yellow-700 mt-1 space-y-1">
                  {!email && <li>• Email address</li>}
                  {!billingAddress.firstName && <li>• First name</li>}
                  {!billingAddress.lastName && <li>• Last name</li>}
                  {!billingAddress.streetAddress1 && <li>• Street address</li>}
                  {!billingAddress.city && <li>• City</li>}
                  {!billingAddress.country && <li>• Country</li>}
                  {!billingAddress.countryArea && <li>• State/Province</li>}
                  {!billingAddress.postalCode && <li>• Postal code</li>}
                  {!isPhoneValid && <li>• Valid phone number</li>}
                  {!cardNumber && <li>• Card number</li>}
                </ul>
              </div>
            )}

            {/* Complete Order Button */}
            <ButtonPrimary
              onClick={handleCompleteOrder}
              disabled={processing || !email || !billingAddress.firstName || !billingAddress.lastName || !billingAddress.streetAddress1 || !billingAddress.city || !billingAddress.postalCode || !billingAddress.country || !billingAddress.countryArea || !cardNumber || !isPhoneValid}
              className="w-full"
            >
              {processing ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </span>
              ) : (
                `Complete Order • ${saleorCheckout.totalPrice.gross.currency} ${saleorCheckout.totalPrice.gross.amount}`
              )}
            </ButtonPrimary>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegistryCheckoutPage; 