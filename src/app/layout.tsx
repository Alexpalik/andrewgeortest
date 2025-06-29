"use client"

import { Open_Sans, Source_Serif_4 } from "next/font/google";
import "./globals.css";
import "@/fonts/line-awesome-1.3.0/css/line-awesome.css";
import "@/styles/index.scss";
import "rc-slider/assets/index.css";
import Footer from "@/shared/Footer/Footer";
import SiteHeader from "@/app/SiteHeader";
import CommonClient from "./CommonClient";
import { CheckoutProvider } from "./CheckoutContext";
import { apolloClient } from "./lib/saleorClient"
import { ApolloProvider } from "@apollo/client";
import { SaleorAuthProvider } from "@saleor/auth-sdk/react";
import { createSaleorAuthClient } from "@saleor/auth-sdk";
import { useEffect } from "react";
import { validateCart } from "@/utils/validateCart";

const openSans = Open_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-open-sans",
  weight: ["300", "400", "500", "600", "700"],
});

const sourceSerif = Source_Serif_4({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-source-serif",
  weight: ["200", "300", "400", "500", "600", "700"],
});

const saleorAuthClient = createSaleorAuthClient({
  saleorApiUrl: process.env.NEXT_PUBLIC_SALEOR_API_URL!,
});

export default function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: any;
}) {

  // useEffect(() => {
  //   validateCart();
  // }, []);

  return (
    <html lang="en" dir="" className={`${openSans.variable} ${sourceSerif.variable} overflow-x-hidden`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      </head>
      <body className="bg-white text-base dark:bg-neutral-900 text-neutral-900 dark:text-neutral-200 font-sans overflow-x-hidden">
        <SaleorAuthProvider client={saleorAuthClient}>
          <ApolloProvider client={apolloClient}>
            <CheckoutProvider>
              <SiteHeader />
              {children}
              <Footer />
            </CheckoutProvider>
          </ApolloProvider>
        </SaleorAuthProvider>
        <CommonClient />
      </body>
    </html>
  );
}
