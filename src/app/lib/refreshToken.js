"use client";

import { gql } from "@apollo/client";

const REFRESH_TOKEN_MUTATION = gql`
  mutation RefreshToken($refreshToken: String!) {
    tokenRefresh(refreshToken: $refreshToken) {
      token
      refreshToken
      errors {
        field
        message
      }
    }
  }
`;

export const refreshAccessToken = async (client) => {
  const refreshTokenKey =
    process.env.NEXT_PUBLIC_SALEOR_API_URL + "+saleor_auth_module_refresh_token";
  const tokenKey =
    process.env.NEXT_PUBLIC_SALEOR_API_URL + "+saleor_auth_module_token";

  const storedRefreshToken = sessionStorage.getItem(refreshTokenKey);

  if (!storedRefreshToken) {
    console.error("No refresh token found.");
    return null;
  }

  try {
    const { data } = await client.mutate({
      mutation: REFRESH_TOKEN_MUTATION,
      variables: { refreshToken: storedRefreshToken },
    });

    if (data.tokenRefresh.errors.length > 0) {
      console.error("Refresh token failed:", data.tokenRefresh.errors);
      return null;
    }

    localStorage.setItem(tokenKey, data.tokenRefresh.token);
    sessionStorage.setItem(refreshTokenKey, data.tokenRefresh.refreshToken);

    return data.tokenRefresh.token;
  } catch (error) {
    console.error("Token refresh error:", error);
    return null;
  }
};
