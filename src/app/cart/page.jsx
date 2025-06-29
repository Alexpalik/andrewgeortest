"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import NcInputNumber from "@/components/NcInputNumber";
import Prices from "@/components/Prices";
import ButtonPrimary from "@/shared/Button/ButtonPrimary";
import Image from "next/image";
import Link from "next/link";
import { useCheckout } from "@/app/CheckoutContext";
import { updateCartItem } from "@/app/lib/updateCartItems";
import { getCheckoutTotal } from "@/app/lib/checkoutHelpers";
import { addToCart } from "@/app/lib/saleorCart";
import { getCheckout } from "../lib/getCart";
import { CartPageSkeleton } from "@/components/LoadingSkeleton";

const CartPage = () => {
  const { checkout, refreshCheckout, loading } = useCheckout();
  const router = useRouter();
  const [cartTotal, setCartTotal] = useState(0);
  const [netAmount, setNetAmount] = useState("0.00");
  const [taxAmount, setTaxAmount] = useState("0.00");
  const [totalAmount, setTotalAmount] = useState("0.00");
  const [currency, setCurrency] = useState("USD"); 


  async function handleRemoveItem(lineId) {
    try {
      await updateCartItem(lineId, 0);
      await refreshCheckout();
      console.log("Item removed successfully!");
      if (checkout?.lines?.length <= 1) {
        router.push("/");
      }
    } catch (error) {
      console.error("Failed to remove item:", error);
    }
  }

  async function handleQuantityChange(lineId, variantId, newQuantity) {
    try {
      if (newQuantity > 0) {
        await updateCartItem(lineId, newQuantity);
      } else {
        await handleRemoveItem(lineId);
      }
      await refreshCheckout();
    } catch (error) {
      console.error("Failed to update quantity:", error);
    }
  }

  useEffect(() => {
    const fetchTotal = async () => {
      const checkoutId = sessionStorage.getItem("checkout_id");
      if (checkoutId) {
        const checkout = await getCheckout();
        if (checkout?.totalPrice) {
          setNetAmount(checkout.totalPrice.net.amount.toFixed(2));
          setTaxAmount(checkout.totalPrice.tax.amount.toFixed(2));
          setTotalAmount(checkout.totalPrice.gross.amount.toFixed(2));
          setCurrency(checkout.totalPrice.gross.currency);
        }
      }
    };
    fetchTotal();
  }, [checkout]);
  
  useEffect(() => {
    if (checkout?.lines?.length === 0) {
      router.push("/");
    }
  }, [checkout, router]);

  useEffect(() => {
    const fetchTotal = async () => {
      const checkoutId = sessionStorage.getItem("checkout_id");
      if (checkoutId) {
        const fetchedTotalAmount = await getCheckoutTotal(checkoutId);
        setCartTotal(isNaN(fetchedTotalAmount) ? 0 : fetchedTotalAmount);
      }
    };
    fetchTotal();
  }, [checkout]);

const renderProduct = (item, index) => {
  const { variant, quantity, id: lineId } = item;
  const { product } = variant;

  return (
    <div key={index} className="relative flex py-8 sm:py-10 xl:py-12 first:pt-0 last:pb-0">
      {/* Clickable Product Image */}
      <Link href={`/product/${product.slug}`} className="relative h-36 w-24 sm:w-32 flex-shrink-0 overflow-hidden rounded-none bg-slate-100">
        <Image
          fill
          src={product.media[0]?.url || "/placeholder-image.jpg"}
          alt={product.name}
          sizes="300px"
          className="h-full w-full object-contain object-center"
        />
      </Link>

      <div className="ml-3 sm:ml-6 flex flex-1 flex-col">
        <div>
          <div className="flex justify-between items-start">
            <div className="flex-[1.5]">
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
                  onChange={(newQuantity) => handleQuantityChange(lineId, variant.id, newQuantity)}
                />
                <Prices
                  contentClass="py-1 px-2 md:py-1.5 md:px-2.5 text-sm font-medium h-full"
                  price={item.totalPrice?.gross?.amount || (product.pricing.priceRange.start.gross.amount * quantity)}
                />
              </div>
            </div>
            <div className="hidden sm:block text-center relative">
              <NcInputNumber
                className="relative z-10"
                defaultValue={quantity}
                onChange={(newQuantity) => handleQuantityChange(lineId, variant.id, newQuantity)}
              />
            </div>
            <div className="hidden flex-1 sm:flex justify-end">
              <Prices
                price={item.totalPrice?.gross?.amount || (product.pricing.priceRange.start.gross.amount * quantity)}
                className="mt-0.5"
              />
            </div>
          </div>
        </div>
        <div className="flex mt-auto pt-4 items-end justify-between text-sm">
          <a
            href="#"
            className="relative z-10 flex items-center mt-3 font-medium text-primary-6000 hover:text-primary-500 text-sm"
            onClick={() => handleRemoveItem(lineId)}
          >
            <span>Remove</span>
          </a>
        </div>
      </div>
    </div>
  );
};

  if (loading) {
    return <CartPageSkeleton />;
  }

  return (
    <div className="nc-CartPage">
      <main className="container py-16 lg:pb-28 lg:pt-20 space-y-16">
        <div className="mb-12 sm:mb-16">
          <h2 className="block text-2xl sm:text-3xl lg:text-4xl ">Shopping Cart</h2>
        </div>
        <hr className="border-slate-200 dark:border-slate-700 my-10 xl:my-12" />
        <div className="flex flex-col lg:flex-row space-y-10 lg:space-y-0 lg:space-x-10">
          <div className="w-full lg:w-[60%] xl:w-[55%] divide-y divide-slate-200 dark:divide-slate-700 space-y-8">
            {checkout?.lines?.length > 0 ? (
              checkout.lines.map(renderProduct)
            ) : (
              <p className="text-center py-5 text-slate-500 dark:text-slate-400">Your cart is empty.</p>
            )}
          </div>
          <div className="flex-1">
            <div className="sticky top-28 space-y-8">
              <h3 className="text-lg ">Order Summary</h3>
              <div className="text-sm text-slate-500 dark:text-slate-400 divide-y divide-slate-200/70 dark:divide-slate-700/80">
                <div className="flex justify-between pb-4">
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
              </div>
              <ButtonPrimary href="/checkout" className="mt-8 w-full">Checkout</ButtonPrimary>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CartPage;
