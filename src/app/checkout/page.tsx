"use client";

import Label from "@/components/Label/Label";
import NcInputNumber from "@/components/NcInputNumber";
import Prices from "@/components/Prices";
import { useState } from "react";
import ButtonPrimary from "@/shared/Button/ButtonPrimary";
import Input from "@/shared/Input/Input";
import ContactInfo from "./ContactInfo";
import PaymentMethod from "./PaymentMethod";
import ShippingAddress from "./ShippingAddress";
import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";
import { getCheckout } from "../lib/getCart";
import { getCheckoutTotal,checkoutPaymentCreate, checkoutBillingAddressUpdate,checkoutComplete,checkoutDeliveryMethodUpdate,checkoutEmailUpdate,checkoutShippingAddressUpdate } from "../lib/checkoutHelpers";
import { CartPageSkeleton } from "@/components/LoadingSkeleton";
import { useSaleorAuthContext } from "@saleor/auth-sdk/react";
import { gql, useQuery } from "@apollo/client";
import toast from "react-hot-toast";

// GraphQL Query to fetch user profile data
const GET_USER_PROFILE = gql`
  query GetUserProfile {
    me {
      id
      email
      firstName
      lastName
      defaultShippingAddress {
        firstName
        lastName
        streetAddress1
        streetAddress2
        city
        postalCode
        country {
          code
          country
        }
        phone
      }
      defaultBillingAddress {
        firstName
        lastName
        streetAddress1
        streetAddress2
        city
        postalCode
        country {
          code
          country
        }
        phone
      }
    }
  }
`;

const CheckoutPage = () => {
  const [netAmount, setNetAmount] = useState("0.00");
  const [taxAmount, setTaxAmount] = useState("0.00");
  const [currency, setCurrency] = useState("EUR"); 
  const [userDataLoaded, setUserDataLoaded] = useState(false);

  const [tabActive, setTabActive] = useState<
    "ContactInfo" | "ShippingAddress" | "PaymentMethod"
  >("ContactInfo");

  const [cartItems, setCartItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalAmount, setTotalAmount] = useState("0.00");
  const [contactInfo, setContactInfo] = useState({
    phoneNumber: "",
    email: "",
  });
  const [shippingAddress, setShippingAddress] = useState({
    firstName: "",
    lastName: "",
    streetAddress1: "",
    streetAddress2: "",
    city: "",
    postalCode: "",
    country: "GR", 
    countryArea: "",
  });
  const [billingAddress, setBillingAddress] = useState({
    firstName: "",
    lastName: "",
    streetAddress1: "",
    streetAddress2: "",
    city: "",
    postalCode: "",
    country: "GR", 
    countryArea: "",
  });
  const [cardNumber, setCardNumber] = useState("");

  // GraphQL query to fetch user profile
  const { data: userData, loading: userLoading } = useQuery(GET_USER_PROFILE, {
    onCompleted: (data) => {
      if (data?.me && !userDataLoaded) {
        const userProfile = data.me;
        
        // Auto-fill contact info
        setContactInfo(prev => ({
          ...prev,
          email: userProfile.email || prev.email,
          phoneNumber: userProfile.defaultShippingAddress?.phone || userProfile.defaultBillingAddress?.phone || prev.phoneNumber,
        }));

        // Auto-fill shipping address from user's default shipping address
        if (userProfile.defaultShippingAddress) {
          const addr = userProfile.defaultShippingAddress;
          setShippingAddress(prev => ({
            ...prev,
            firstName: addr.firstName || userProfile.firstName || prev.firstName,
            lastName: addr.lastName || userProfile.lastName || prev.lastName,
            streetAddress1: addr.streetAddress1 || prev.streetAddress1,
            streetAddress2: addr.streetAddress2 || prev.streetAddress2,
            city: addr.city || prev.city,
            postalCode: addr.postalCode || prev.postalCode,
            country: addr.country?.code || prev.country,
            countryArea: prev.countryArea,
          }));
        } else if (userProfile.firstName || userProfile.lastName) {
          // At least fill in the name fields if no address is available
          setShippingAddress(prev => ({
            ...prev,
            firstName: userProfile.firstName || prev.firstName,
            lastName: userProfile.lastName || prev.lastName,
          }));
        }

        // Auto-fill billing address from user's default billing address
        if (userProfile.defaultBillingAddress) {
          const billingAddr = userProfile.defaultBillingAddress;
          setBillingAddress(prev => ({
            ...prev,
            firstName: billingAddr.firstName || userProfile.firstName || prev.firstName,
            lastName: billingAddr.lastName || userProfile.lastName || prev.lastName,
            streetAddress1: billingAddr.streetAddress1 || prev.streetAddress1,
            streetAddress2: billingAddr.streetAddress2 || prev.streetAddress2,
            city: billingAddr.city || prev.city,
            postalCode: billingAddr.postalCode || prev.postalCode,
            country: billingAddr.country?.code || prev.country,
            countryArea: prev.countryArea,
          }));
        } else if (userProfile.defaultShippingAddress) {
          // If no billing address, use shipping address as fallback
          const addr = userProfile.defaultShippingAddress;
          setBillingAddress(prev => ({
            ...prev,
            firstName: addr.firstName || userProfile.firstName || prev.firstName,
            lastName: addr.lastName || userProfile.lastName || prev.lastName,
            streetAddress1: addr.streetAddress1 || prev.streetAddress1,
            streetAddress2: addr.streetAddress2 || prev.streetAddress2,
            city: addr.city || prev.city,
            postalCode: addr.postalCode || prev.postalCode,
            country: addr.country?.code || prev.country,
            countryArea: prev.countryArea,
          }));
        } else if (userProfile.firstName || userProfile.lastName) {
          // At least fill in the name fields for billing
          setBillingAddress(prev => ({
            ...prev,
            firstName: userProfile.firstName || prev.firstName,
            lastName: userProfile.lastName || prev.lastName,
          }));
        }

        // Show success message for auto-fill
        if (userProfile.defaultShippingAddress || userProfile.defaultBillingAddress) {
          toast.success("Addresses auto-filled from your account!", {
            duration: 3000,
            position: 'top-right',
          });
        } else if (userProfile.firstName || userProfile.lastName) {
          toast.success("Name auto-filled from your account!", {
            duration: 3000,
            position: 'top-right',
          });
        }
        
        setUserDataLoaded(true);
      }
    },
    onError: (error) => {
      console.error("Error fetching user profile:", error);
      // Don't show error toast for unauthenticated users
      if (userData?.me) {
        toast.error("Failed to load your account information");
      }
    }
  });

  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const checkout = await getCheckout();
        if (checkout?.lines) {
          setCartItems(checkout.lines);
        }
  
        if (checkout?.totalPrice) {
          setNetAmount(checkout.totalPrice.net.amount.toFixed(2));
          setTaxAmount(checkout.totalPrice.tax.amount.toFixed(2));
          setTotalAmount(checkout.totalPrice.gross.amount.toFixed(2));
          setCurrency(checkout.totalPrice.gross.currency);
        }
      } catch (err) {
        console.error("Error fetching cart:", err);
        setError("Failed to load cart items.");
      } finally {
        setLoading(false);
      }
    };
  
    fetchCartItems();
  }, []);
  
  
  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const checkout = await getCheckout();
        if (checkout?.lines) {
          setCartItems(checkout.lines);
        }
  
        // Fetch total amount from Saleor
        const checkoutId = sessionStorage.getItem("checkout_id");
        if (checkoutId) {
          const fetchedTotalAmount = await getCheckoutTotal(checkoutId);
          setTotalAmount(fetchedTotalAmount);
        }
      } catch (err) {
        console.error("Error fetching cart:", err);
        setError("Failed to load cart items.");
      } finally {
        setLoading(false);
      }
    };
  
    fetchCartItems();
  }, []);
  

  const handleScrollToEl = (id: string) => {
    const element = document.getElementById(id);
    setTimeout(() => {
      element?.scrollIntoView({ behavior: "smooth" });
    }, 80);
  };

  const handleConfirmOrder = async () => {
    const checkoutId = sessionStorage.getItem("checkout_id");
    if (!checkoutId) {
      alert("Checkout not found.");
      return;
    }
  
    try {
      
      await checkoutShippingAddressUpdate(checkoutId, {
        firstName: shippingAddress.firstName,
        lastName: shippingAddress.lastName,
        streetAddress1: shippingAddress.streetAddress1,
        streetAddress2: shippingAddress.streetAddress2,
        city: shippingAddress.city,
        phone : contactInfo.phoneNumber,
        postalCode: shippingAddress.postalCode,
        country: shippingAddress.country,
        countryArea: shippingAddress.countryArea,
        // firstName: 'test',
        // lastName: 'test',
        // streetAddress1: 'test',
        // city: 'thessaloniki',
        // postalCode: '57013',
        // country: 'GR',
      });

      await checkoutBillingAddressUpdate(checkoutId, {
        firstName: billingAddress.firstName,
        lastName: billingAddress.lastName,
        streetAddress1: billingAddress.streetAddress1,
        streetAddress2: billingAddress.streetAddress2,
        city: billingAddress.city,
        phone : contactInfo.phoneNumber,
        postalCode: billingAddress.postalCode,
        country: billingAddress.country,
        countryArea: billingAddress.countryArea,
      });

      await checkoutEmailUpdate(checkoutId, contactInfo.email);
  
      // later on make it dynamic
      await checkoutDeliveryMethodUpdate(checkoutId, "U2hpcHBpbmdNZXRob2Q6MQ==");
  
      const totalAmount = await getCheckoutTotal(checkoutId);
      console.log("Total Amount to be Paid:", totalAmount);
  
      await checkoutPaymentCreate(checkoutId, totalAmount, cardNumber)
  

      const completeResponse = await checkoutComplete(checkoutId);
  
      if (completeResponse.errors.length > 0) {
        alert("Error completing checkout. Please try again.");
        return;
      }
  
      // alert("Order created successfully!");
      localStorage.removeItem("checkout_id");
      window.location.href = "/thank-you";
    } catch (error) {
      console.error("Order Creation Error:", error);
      alert("An error occurred while processing your order.");
    }
  };

  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const checkout = await getCheckout();
        if (checkout?.lines) {
          setCartItems(checkout.lines);
        }
      } catch (err) {
        console.error("Error fetching cart:", err);
        setError("Failed to load cart items.");
      } finally {
      }
    };
  
    fetchCartItems();
  }, []);
  

const renderProduct = (item: any, index: number) => {
  const { variant, quantity } = item;
  const { product } = variant;

  return (
    <div key={index} className="relative flex py-7 first:pt-0 last:pb-0">
      <Link href={`/product/${product.slug}`} className="relative h-36 w-24 sm:w-28 flex-shrink-0 overflow-hidden rounded-none bg-slate-100">
        <Image
          src={product.media[0]?.url || "/placeholder-image.jpg"}
          fill
          alt={product.name}
          className="h-full w-full object-contain object-center"
          sizes="150px"
        />
      </Link>

      <div className="ml-3 sm:ml-6 flex flex-1 flex-col">
        <div>
          <div className="flex justify-between ">
            <div className="flex-[1.5] ">
              {/* Clickable Product Name */}
              <h3 className="text-base ">
                <Link href={`/product/${product.slug}`}>{product.name}</Link>
              </h3>
              <div className="mt-1.5 sm:mt-2.5 flex text-sm text-slate-600 dark:text-slate-300">
                <div className="flex items-center space-x-1.5">
                  <span>{variant.name}</span>
                  <span className="mx-2 border-l border-slate-200 dark:border-slate-700 h-4"></span>
                  <span>{`Qty ${quantity}`}</span>
                </div>
              </div>
              <div className="mt-3 flex justify-between w-full sm:hidden relative">
                <NcInputNumber
                  className="relative z-10"
                  defaultValue={quantity}
                />
                <Prices
                  contentClass="py-1 px-2 md:py-1.5 md:px-2.5 text-sm font-medium h-full"
                  price={item.totalPrice?.gross?.amount || (product.pricing.priceRange.start.gross.amount * quantity)}
                />
              </div>
            </div>
            <div className="hidden flex-1 sm:flex justify-end">
              <Prices
                price={item.totalPrice?.gross?.amount || (product.pricing.priceRange.start.gross.amount * quantity)}
                className="mt-0.5"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

  

  const renderLeft = () => {
    return (
      <div className="space-y-8">
        {/* Show auto-fill indicator for logged in users */}
        {userData?.me && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-green-800">
                  Auto-filled from your account
                </p>
                <p className="text-sm text-green-700">
                  Your saved address and contact information has been automatically loaded.
                </p>
              </div>
            </div>
          </div>
        )}

        <div id="ContactInfo" className="scroll-mt-24">
         <ContactInfo
            isActive={tabActive === "ContactInfo"}
            onOpenActive={() => {
              setTabActive("ContactInfo");
              handleScrollToEl("ContactInfo");
            }}
            onCloseActive={() => {
              setTabActive("ShippingAddress");
              handleScrollToEl("ShippingAddress");
            }}
            contactInfo={contactInfo} // Pass state
            setContactInfo={setContactInfo} // Pass updater
          />
        </div>

        <div id="ShippingAddress" className="scroll-mt-24">
         <ShippingAddress
            isActive={tabActive === "ShippingAddress"}
            onOpenActive={() => {
              setTabActive("ShippingAddress");
              handleScrollToEl("ShippingAddress");
            }}
            onCloseActive={() => {
              setTabActive("PaymentMethod");
              handleScrollToEl("PaymentMethod");
            }}
            shippingAddress={shippingAddress} // Pass state
            setShippingAddress={setShippingAddress} // Pass updater
          />
        </div>

        <div id="PaymentMethod" className="scroll-mt-24">
         <PaymentMethod
            isActive={tabActive === "PaymentMethod"}
            onOpenActive={() => {
              setTabActive("PaymentMethod");
              handleScrollToEl("PaymentMethod");
            }}
            onCloseActive={() => setTabActive("PaymentMethod")}
            cardNumber={cardNumber} // Pass state
            setCardNumber={setCardNumber} // Pass updater
            billingAddress={billingAddress} // Pass billing address state
            setBillingAddress={setBillingAddress} // Pass billing address updater
            shippingAddress={shippingAddress} // Pass shipping address for "same as shipping" option
          />
        </div>
      </div>
    );
  };

  if (loading) {
    return <CartPageSkeleton />;
  }

  return (
    <div className="nc-CheckoutPage">
      <main className="container py-16 lg:pb-28 lg:pt-20 ">
        <div className="mb-16">
          <h2 className="block text-2xl sm:text-3xl lg:text-4xl  ">
            Checkout
          </h2>
          <div className="block mt-3 sm:mt-5 text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-400">
            <Link href={"/"} className="">
              Homepage
            </Link>
            <span className="text-xs mx-1 sm:mx-1.5">/</span>
            <Link href={"/collection-2"} className="">
              Clothing Categories
            </Link>
            <span className="text-xs mx-1 sm:mx-1.5">/</span>
            <span className="underline">Checkout</span>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row">
          <div className="flex-1">{renderLeft()}</div>

          <div className="flex-shrink-0 border-t lg:border-t-0 lg:border-l border-slate-200 dark:border-slate-700 my-10 lg:my-0 lg:mx-10 xl:lg:mx-14 2xl:mx-16 "></div>

          <div className="w-full lg:w-[36%] ">
            <h3 className="text-lg ">Order summary</h3>
           
            <div className="mt-8 divide-y divide-slate-200/70 dark:divide-slate-700 ">
              {error && <p className="text-red-500">{error}</p>}
              {cartItems.length > 0 ? (
                cartItems.map(renderProduct)
              ) : (
                <p className="text-center py-5 text-slate-500 dark:text-slate-400">
                  Your cart is empty.
                </p>
              )}
            </div>


            <div className="mt-10 pt-6 text-sm text-slate-500 dark:text-slate-400 border-t border-slate-200/70 dark:border-slate-700 ">
              {/* <div>
                <Label className="text-sm">Discount code</Label>
                <div className="flex mt-1.5">
                  <Input sizeClass="h-10 px-4 py-3" className="flex-1" />
                  <button className="text-neutral-700 dark:text-neutral-200 border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-100 rounded-2xl px-4 ml-3 font-medium text-sm bg-neutral-200/70 dark:bg-neutral-700 dark:hover:bg-neutral-800 w-24 flex justify-center items-center transition-colors">
                    Apply
                  </button>
                </div>
              </div> */}

              <div className="mt-4 flex justify-between py-2.5">
                <span>Subtotal</span>
                <span className=" text-slate-900 dark:text-slate-200">
                  {netAmount} {currency}
                </span>
              </div>
              <div className="flex justify-between py-2.5">
                <span>Tax (VAT)</span>
                <span className=" text-slate-900 dark:text-slate-200">
                  {taxAmount} {currency}
                </span>
              </div>
              <div className="flex justify-between py-2.5">
                  <span>Shipping Cost</span>
                  <span className=" text-slate-900 dark:text-slate-200">
                    FREE
                  </span>
              </div>
              <div className="flex justify-between  text-slate-900 dark:text-slate-200 text-base pt-4">
                <span>Order total</span>
                <span>{totalAmount} {currency}</span>
              </div>

              {/* <div className="flex justify-between py-2.5">
                <span>Tax estimate</span>
                <span className=" text-slate-900 dark:text-slate-200">
                  $24.90
                </span>
              </div> */}
            </div>
            <ButtonPrimary onClick={handleConfirmOrder} className="mt-8 w-full">Confirm order</ButtonPrimary>
            <div className="mt-5 text-sm text-slate-500 dark:text-slate-400 flex items-center justify-center">
              <p className="block relative pl-5">
                <svg
                  className="w-4 h-4 absolute -left-1 top-0.5"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <path
                    d="M12 22C17.5 22 22 17.5 22 12C22 6.5 17.5 2 12 2C6.5 2 2 6.5 2 12C2 17.5 6.5 22 12 22Z"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M12 8V13"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M11.9945 16H12.0035"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                Learn more{` `}
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  href="##"
                  className="text-slate-900 dark:text-slate-200 underline font-medium"
                >
                  Taxes
                </a>
                <span>
                  {` `}and{` `}
                </span>
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  href="##"
                  className="text-slate-900 dark:text-slate-200 underline font-medium"
                >
                  Shipping
                </a>
                {` `} infomation
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CheckoutPage;
