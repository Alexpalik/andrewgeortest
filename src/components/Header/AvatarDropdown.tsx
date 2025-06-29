"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from 'next/image';
import authSync from "@/utils/authSync";

export default function AvatarDropdown() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Check login status
  useEffect(() => {
    // Initial check
    setIsLoggedIn(authSync.isAuthenticated());
    
    // Listen for auth changes across tabs
    const unsubscribe = authSync.addListener((isAuth: boolean) => {
      setIsLoggedIn(isAuth);
    });

    // Also listen for the legacy authChange event for backward compatibility
    const handleAuthChange = () => {
      setIsLoggedIn(authSync.isAuthenticated());
    };

    window.addEventListener("authChange", handleAuthChange);

    return () => {
      unsubscribe();
      window.removeEventListener("authChange", handleAuthChange);
    };
  }, []);

  const handleClick = () => {
    if (isLoggedIn) {
      router.push("/account");
    } else {
      router.push("/login");
    }
  };

  return (
    <button
      className="h-10 sm:w-12 sm:h-12 rounded-none text-white focus:outline-none flex items-center justify-center hover:bg-white hover:bg-opacity-10 transition-colors"
      onClick={handleClick}
      aria-label={isLoggedIn ? "My Account" : "Login"}
    >
      <Image src="/svg/account.svg" alt="Account" width={22} height={22} />
    </button>
  );
}
