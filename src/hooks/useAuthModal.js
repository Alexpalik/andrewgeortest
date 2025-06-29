"use client";

import { useState, useCallback } from "react";
import authSync from "@/utils/authSync";

export const useAuthModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [defaultTab, setDefaultTab] = useState("login");
  const [onSuccessCallback, setOnSuccessCallback] = useState(null);

  const showAuthModal = useCallback((options = {}) => {
    const { tab = "login", onSuccess } = options;
    
    setDefaultTab(tab);
    setOnSuccessCallback(onSuccess ? () => onSuccess : null);
    setIsOpen(true);
  }, []);

  const hideAuthModal = useCallback(() => {
    setIsOpen(false);
    setOnSuccessCallback(null);
  }, []);

  const showLoginModal = useCallback((onSuccess) => {
    showAuthModal({ tab: "login", onSuccess });
  }, [showAuthModal]);

  const showSignupModal = useCallback((onSuccess) => {
    showAuthModal({ tab: "signup", onSuccess });
  }, [showAuthModal]);

  const showForgotPasswordModal = useCallback((onSuccess) => {
    showAuthModal({ tab: "forgot", onSuccess });
  }, [showAuthModal]);

  // Check if user is authenticated
  const isAuthenticated = useCallback(() => {
    if (typeof window === "undefined") return false;
    return authSync.isAuthenticated();
  }, []);

  // Show auth modal if not authenticated, otherwise execute callback
  const requireAuth = useCallback((callback, options = {}) => {
    if (isAuthenticated()) {
      if (callback) callback();
    } else {
      showAuthModal({
        tab: options.tab || "login",
        onSuccess: callback
      });
    }
  }, [isAuthenticated, showAuthModal]);

  return {
    // State
    isOpen,
    defaultTab,
    onSuccessCallback,
    
    // Actions
    showAuthModal,
    hideAuthModal,
    showLoginModal,
    showSignupModal,
    showForgotPasswordModal,
    
    // Utilities
    isAuthenticated,
    requireAuth
  };
}; 