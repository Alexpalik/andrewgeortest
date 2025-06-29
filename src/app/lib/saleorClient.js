"use client";

import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { SaleorProvider, useAuth, createSaleorClient } from "@saleor/sdk";
import { ApolloProvider, ApolloClient, createHttpLink, InMemoryCache, from } from "@apollo/client";
import { onError } from "@apollo/client/link/error";
import { RetryLink } from "@apollo/client/link/retry";
import { createSaleorAuthClient } from "@saleor/auth-sdk";

const SALEOR_API_URL = process.env.NEXT_PUBLIC_SALEOR_API_URL || "http://localhost:8000/graphql/";

// Create Saleor auth client
const saleorAuthClient = createSaleorAuthClient({
  saleorApiUrl: SALEOR_API_URL,
});

// Error handling link with retry logic
const errorLink = onError(({ graphQLErrors, networkError, operation, forward }) => {
  if (graphQLErrors) {
    graphQLErrors.forEach(({ message, locations, path }) => {
      console.error(
        `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
      );
    });
  }

  if (networkError) {
    console.error(`[Network error]: ${networkError}`);
    
    // Handle auth errors by clearing localStorage
    if (networkError.statusCode === 401) {
      if (typeof window !== 'undefined') {
        sessionStorage.removeItem('checkout_id');
        localStorage.clear();
      }
    }
  }
});

// Retry link for failed requests
const retryLink = new RetryLink({
  delay: {
    initial: 300,
    max: Infinity,
    jitter: true,
  },
  attempts: {
    max: 3,
    retryIf: (error, _operation) => !!error && error.statusCode !== 401,
  },
});

// HTTP link with optimized fetch
const httpLink = createHttpLink({
  uri: SALEOR_API_URL,
  fetch: saleorAuthClient.fetchWithAuth,
  fetchOptions: {
    keepalive: true,
  },
});

// Optimized InMemoryCache configuration
const cache = new InMemoryCache({
  // Enable garbage collection
  resultCaching: true,
  
  // Optimize cache policies
  typePolicies: {
    Product: {
      fields: {
        variants: {
          merge: false, // Replace array instead of merging
        },
        media: {
          merge: false,
        },
      },
    },
    Checkout: {
      fields: {
        lines: {
          merge: false,
        },
      },
    },
    Collection: {
      fields: {
        products: {
          // Implement cursor-based pagination
          keyArgs: ["filter", "sortBy"],
          merge(existing = [], incoming, { args: { after = 0 } }) {
            return after ? [...existing, ...incoming] : incoming;
          },
        },
      },
    },
    Query: {
      fields: {
        products: {
          // Optimize product queries with pagination
          keyArgs: ["filter", "sortBy", "channel"],
          merge(existing = [], incoming, { args: { after = 0 } }) {
            return after ? [...existing, ...incoming] : incoming;
          },
        },
      },
    },
  },
  
  // Prevent cache bloat
  possibleTypes: {},
  dataIdFromObject: (object) => {
    switch (object.__typename) {
      case 'Product':
      case 'ProductVariant':
      case 'Collection':
      case 'Category':
      case 'Checkout':
      case 'Order':
        return `${object.__typename}:${object.id}`;
      default:
        return null;
    }
  },
});

// Create optimized Apollo Client
export const apolloClient = new ApolloClient({
  link: from([errorLink, retryLink, httpLink]),
  cache,
  defaultOptions: {
    watchQuery: {
      errorPolicy: 'all',
      fetchPolicy: 'cache-and-network', // Balance between speed and freshness
      notifyOnNetworkStatusChange: true,
    },
    query: {
      errorPolicy: 'all',
      fetchPolicy: 'cache-first', // Prioritize cache for speed
    },
    mutate: {
      errorPolicy: 'all',
    },
  },
  
  // Enable query deduplication
  queryDeduplication: true,
  
  // Assume immutable cache (better performance)
  assumeImmutableResults: true,
});

// Export auth client for use in other files
export { saleorAuthClient };

// Prefetch critical data
export const prefetchCriticalData = async () => {
  try {
    // Prefetch commonly used data on app startup
    // This could include main navigation, popular products, etc.
    console.log('Prefetching critical data...');
  } catch (error) {
    console.error('Failed to prefetch critical data:', error);
  }
};

const App = () => {
  const { authenticated, user, signIn, signOut } = useAuth();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true); // Ensures this only runs in the browser
  }, []);

  const handleSignIn = async () => {
    const { data, dataError } = await signIn("admin@example.com", "admin");

    if (dataError) {
      console.error("Login failed:", dataError);
    } else if (data) {
      console.log("User signed in successfully:", data);
    }
  };

  if (!isClient) return null; // Avoids rendering on the server

  return (
    <div className="p-4">
      {authenticated && user ? (
        <div>
          <span>Signed in as {user.firstName}</span>
          <button onClick={signOut} className="ml-4 p-2 bg-red-500 text-white">
            Log Out
          </button>
        </div>
      ) : (
        <button onClick={handleSignIn} className="p-2 bg-blue-500 text-white">
          Sign In
        </button>
      )}
    </div>
  );
};

if (typeof window !== "undefined") {
  const rootElement = document.getElementById("root");

  if (rootElement) {
    const root = createRoot(rootElement);
    root.render(
      <SaleorProvider client={saleorAuthClient}>
        <ApolloProvider client={apolloClient}>
          <App />
        </ApolloProvider>
      </SaleorProvider>
    );
  }
}
