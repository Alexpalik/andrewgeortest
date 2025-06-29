"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import HeaderLogged from "@/components/Header/HeaderLogged";
import Header from "@/components/Header/Header";
import { useThemeMode } from "@/hooks/useThemeMode";
import authSync from "@/utils/authSync";

const SiteHeader = () => {
  useThemeMode();
  const pathname = usePathname();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Initial check
    setIsAuthenticated(authSync.isAuthenticated());
    
    // Listen for auth changes across tabs
    const unsubscribe = authSync.addListener((isAuth: boolean) => {
      setIsAuthenticated(isAuth);
    });

    // Also listen for the legacy authChange event for backward compatibility
    const handleAuthChange = () => {
      setIsAuthenticated(authSync.isAuthenticated());
    };

    window.addEventListener("authChange", handleAuthChange);

    return () => {
      unsubscribe();
      window.removeEventListener("authChange", handleAuthChange);
    };
  }, []);

  return isAuthenticated ? <HeaderLogged /> : <Header />;
};

export default SiteHeader;
