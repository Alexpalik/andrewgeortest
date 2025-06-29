"use client";

import React from "react";
import ButtonPrimary from "@/shared/Button/ButtonPrimary";
import Image from "next/image";
import Link from "next/link";

const ThankYouPage = () => {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300">
      <div className="max-w-lg text-center">
        {/* <Image
          src="/images/thank-you.svg" // Use your own thank you image
          alt="Thank You"
          width={200}
          height={200}
          className="mx-auto mb-8"
        /> */}

        <h1 className="text-3xl sm:text-4xl font-bold mb-4">Thank You!</h1>
        <p className="text-lg sm:text-xl mb-6">
          Your order has been successfully placed.
        </p>
        {/* <p className="text-sm text-slate-500 dark:text-slate-400 mb-8">
          A confirmation email with your order details has been sent to you.
        </p> */}

        <ButtonPrimary onClick={() => (window.location.href = "/")}>
          Continue Shopping
        </ButtonPrimary>
      </div>
    </div>
  );
};

export default ThankYouPage;
