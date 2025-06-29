"use client";

import React, { createContext, useContext } from "react";
import { useAuthModal } from "@/hooks/useAuthModal";
import AuthModal from "@/components/AuthModal";

const AuthModalContext = createContext();

export const AuthModalProvider = ({ children }) => {
  const authModal = useAuthModal();

  return (
    <AuthModalContext.Provider value={authModal}>
      {children}
      <AuthModal
        isOpen={authModal.isOpen}
        onClose={authModal.hideAuthModal}
        defaultTab={authModal.defaultTab}
        onSuccess={authModal.onSuccessCallback}
      />
    </AuthModalContext.Provider>
  );
};

export const useAuthModalContext = () => {
  const context = useContext(AuthModalContext);
  if (!context) {
    throw new Error("useAuthModalContext must be used within an AuthModalProvider");
  }
  return context;
}; 