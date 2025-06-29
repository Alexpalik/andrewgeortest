// lib/saleorAuth.ts
import { createSaleorAuthClient } from "@saleor/auth-sdk";
import { getNextServerCookiesStorage } from "@saleor/auth-sdk/next/server";

export const getServerAuthClient = () => {
  const nextServerCookiesStorage = getNextServerCookiesStorage();

  return createSaleorAuthClient({
    saleorApiUrl: process.env.NEXT_PUBLIC_SALEOR_API_URL,
    refreshTokenStorage: nextServerCookiesStorage,
    accessTokenStorage: nextServerCookiesStorage,
  });
};
