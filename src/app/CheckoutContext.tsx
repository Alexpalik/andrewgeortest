"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { getCheckout } from "./lib/getCart";

interface CheckoutContextProps {
  checkout: any;
  refreshCheckout: () => void;
}

const CheckoutContext = createContext<CheckoutContextProps | undefined>(undefined);

export const CheckoutProvider = ({ children }: { children: React.ReactNode }) => {
  const [checkout, setCheckout] = useState<any>(null);

  const fetchCheckout = async () => {
    const fetchedCheckout = await getCheckout();
    setCheckout(fetchedCheckout);
  };

  useEffect(() => {
    fetchCheckout();
  }, []);

  const refreshCheckout = () => {
    fetchCheckout();
  };

  return (
    <CheckoutContext.Provider value={{ checkout, refreshCheckout }}>
      {children}
    </CheckoutContext.Provider>
  );
};

export const useCheckout = () => {
  const context = useContext(CheckoutContext);
  if (context === undefined) {
    throw new Error("useCheckout must be used within a CheckoutProvider");
  }
  return context;
};
