import { useMutation, useQuery, useLazyQuery } from '@apollo/client';
import { 
  GET_CHECKOUT, 
  GET_CHECKOUT_MINIMAL, 
  GET_CHECKOUT_TOTAL 
} from './graphql/queries';
import { 
  CREATE_CHECKOUT,
  ADD_CHECKOUT_LINES,
  UPDATE_CHECKOUT_LINES,
  REMOVE_CHECKOUT_LINES,
  UPDATE_CHECKOUT_EMAIL,
  UPDATE_CHECKOUT_SHIPPING_ADDRESS,
  UPDATE_CHECKOUT_BILLING_ADDRESS,
  UPDATE_CHECKOUT_DELIVERY_METHOD,
  CREATE_CHECKOUT_PAYMENT,
  COMPLETE_CHECKOUT
} from './graphql/mutations';
import { apolloClient } from './saleorClient';

// ============== TYPES ==============

export interface CheckoutLineInput {
  quantity: number;
  variantId: string;
}

export interface CheckoutLineUpdateInput {
  lineId: string;
  quantity: number;
}

export interface AddressInput {
  firstName: string;
  lastName: string;
  companyName?: string;
  streetAddress1: string;
  streetAddress2?: string;
  city: string;
  cityArea?: string;
  postalCode: string;
  country: string;
  countryArea?: string;
  phone?: string;
}

// ============== CART/CHECKOUT HOOKS ==============

/**
 * Hook to get checkout data with optimized caching
 * Uses minimal fragment for better performance when full data isn't needed
 */
export function useCheckout(checkoutId: string | null, minimal = false) {
  const query = minimal ? GET_CHECKOUT_MINIMAL : GET_CHECKOUT;
  
  return useQuery(query, {
    variables: { id: checkoutId },
    skip: !checkoutId,
    errorPolicy: 'all',
    fetchPolicy: 'cache-first', // Prioritize cache for speed
    notifyOnNetworkStatusChange: true,
    // Refetch when coming back online
    returnPartialData: true,
  });
}

/**
 * Hook to get only checkout total (for price updates)
 */
export function useCheckoutTotal(checkoutId: string | null) {
  return useQuery(GET_CHECKOUT_TOTAL, {
    variables: { id: checkoutId },
    skip: !checkoutId,
    errorPolicy: 'all',
    fetchPolicy: 'cache-first',
    pollInterval: 0, // Don't poll automatically
  });
}

/**
 * Hook to create a new checkout
 */
export function useCreateCheckout() {
  return useMutation(CREATE_CHECKOUT, {
    errorPolicy: 'all',
    onCompleted: (data) => {
      if (data?.checkoutCreate?.checkout?.id) {
        // Store checkout ID in session storage
        sessionStorage.setItem('checkout_id', data.checkoutCreate.checkout.id);
      }
    },
    // Update cache to include the new checkout
    update: (cache, { data }) => {
      if (data?.checkoutCreate?.checkout) {
        const checkoutId = data.checkoutCreate.checkout.id;
        // Write the new checkout to cache
        cache.writeQuery({
          query: GET_CHECKOUT_MINIMAL,
          variables: { id: checkoutId },
          data: { checkout: data.checkoutCreate.checkout },
        });
      }
    },
  });
}

/**
 * Hook to add items to checkout with optimistic updates
 */
export function useAddToCart() {
  return useMutation(ADD_CHECKOUT_LINES, {
    errorPolicy: 'all',
    // Optimistic response for instant UI updates
    optimisticResponse: (vars) => ({
      checkoutLinesAdd: {
        __typename: 'CheckoutLinesAdd',
        checkout: null, // Will be filled by cache
        errors: [],
      },
    }),
    // Update cache after successful mutation
    update: (cache, { data }) => {
      if (data?.checkoutLinesAdd?.checkout) {
        // Update both minimal and full checkout queries in cache
        const checkoutId = data.checkoutLinesAdd.checkout.id;
        
        // Update minimal checkout cache
        cache.writeQuery({
          query: GET_CHECKOUT_MINIMAL,
          variables: { id: checkoutId },
          data: { checkout: data.checkoutLinesAdd.checkout },
        });
        
        // Invalidate full checkout to force refetch if needed
        cache.evict({
          id: cache.identify({ __typename: 'Checkout', id: checkoutId }),
          fieldName: 'lines',
        });
      }
    },
  });
}

/**
 * Hook to update cart item quantities
 */
export function useUpdateCartLines() {
  return useMutation(UPDATE_CHECKOUT_LINES, {
    errorPolicy: 'all',
    optimisticResponse: () => ({
      checkoutLinesUpdate: {
        __typename: 'CheckoutLinesUpdate',
        checkout: null,
        errors: [],
      },
    }),
  });
}

/**
 * Hook to remove items from cart
 */
export function useRemoveFromCart() {
  return useMutation(REMOVE_CHECKOUT_LINES, {
    errorPolicy: 'all',
    optimisticResponse: () => ({
      checkoutLinesDelete: {
        __typename: 'CheckoutLinesDelete',
        checkout: null,
        errors: [],
      },
    }),
  });
}

/**
 * Hook to update checkout email
 */
export function useUpdateCheckoutEmail() {
  return useMutation(UPDATE_CHECKOUT_EMAIL, {
    errorPolicy: 'all',
  });
}

/**
 * Hook to update shipping address
 */
export function useUpdateShippingAddress() {
  return useMutation(UPDATE_CHECKOUT_SHIPPING_ADDRESS, {
    errorPolicy: 'all',
  });
}

/**
 * Hook to update billing address
 */
export function useUpdateBillingAddress() {
  return useMutation(UPDATE_CHECKOUT_BILLING_ADDRESS, {
    errorPolicy: 'all',
  });
}

/**
 * Hook to update delivery method
 */
export function useUpdateDeliveryMethod() {
  return useMutation(UPDATE_CHECKOUT_DELIVERY_METHOD, {
    errorPolicy: 'all',
  });
}

/**
 * Hook to create payment
 */
export function useCreatePayment() {
  return useMutation(CREATE_CHECKOUT_PAYMENT, {
    errorPolicy: 'all',
  });
}

/**
 * Hook to complete checkout
 */
export function useCompleteCheckout() {
  return useMutation(COMPLETE_CHECKOUT, {
    errorPolicy: 'all',
    onCompleted: (data) => {
      if (data?.checkoutComplete?.order) {
        // Clear checkout ID on successful order
        sessionStorage.removeItem('checkout_id');
        
        // Clear checkout from cache
        apolloClient.cache.evict({ fieldName: 'checkout' });
        apolloClient.cache.gc();
      }
    },
  });
}

// ============== UTILITY FUNCTIONS ==============

/**
 * Get stored checkout ID from session storage
 */
export function getStoredCheckoutId(): string | null {
  if (typeof window === 'undefined') return null;
  return sessionStorage.getItem('checkout_id');
}

/**
 * Create a new checkout or add to existing one
 */
export async function addToCartOptimized(
  variantId: string, 
  quantity: number, 
  email?: string
): Promise<{ success: boolean; checkoutId?: string; errors?: any[] }> {
  try {
    const existingCheckoutId = getStoredCheckoutId();
    
    if (existingCheckoutId) {
      // Add to existing checkout
      const { data, errors } = await apolloClient.mutate({
        mutation: ADD_CHECKOUT_LINES,
        variables: {
          checkoutId: existingCheckoutId,
          lines: [{ variantId, quantity }],
        },
      });
      
      if (data?.checkoutLinesAdd?.checkout) {
        return { success: true, checkoutId: existingCheckoutId };
      }
      
      if (data?.checkoutLinesAdd?.errors?.length > 0) {
        return { success: false, errors: data.checkoutLinesAdd.errors };
      }
    }
    
    // Create new checkout
    const { data, errors } = await apolloClient.mutate({
      mutation: CREATE_CHECKOUT,
      variables: {
        email,
        lines: [{ variantId, quantity }],
        channel: process.env.NEXT_PUBLIC_SALEOR_CHANNEL || 'default-channel',
      },
    });
    
    if (data?.checkoutCreate?.checkout) {
      const checkoutId = data.checkoutCreate.checkout.id;
      sessionStorage.setItem('checkout_id', checkoutId);
      return { success: true, checkoutId };
    }
    
    return { 
      success: false, 
      errors: data?.checkoutCreate?.errors || ['Failed to create checkout'] 
    };
    
  } catch (error) {
    console.error('Error adding to cart:', error);
    return { success: false, errors: [error] };
  }
}

/**
 * Update cart item quantity with optimistic updates
 */
export async function updateCartItemOptimized(
  lineId: string, 
  quantity: number
): Promise<{ success: boolean; errors?: any[] }> {
  try {
    const checkoutId = getStoredCheckoutId();
    if (!checkoutId) {
      return { success: false, errors: ['No checkout found'] };
    }
    
    const { data } = await apolloClient.mutate({
      mutation: UPDATE_CHECKOUT_LINES,
      variables: {
        checkoutId,
        lines: [{ lineId, quantity }],
      },
    });
    
    if (data?.checkoutLinesUpdate?.checkout) {
      return { success: true };
    }
    
    return { 
      success: false, 
      errors: data?.checkoutLinesUpdate?.errors || ['Failed to update item'] 
    };
    
  } catch (error) {
    console.error('Error updating cart item:', error);
    return { success: false, errors: [error] };
  }
}

/**
 * Remove item from cart
 */
export async function removeFromCartOptimized(
  lineId: string
): Promise<{ success: boolean; errors?: any[] }> {
  try {
    const checkoutId = getStoredCheckoutId();
    if (!checkoutId) {
      return { success: false, errors: ['No checkout found'] };
    }
    
    const { data } = await apolloClient.mutate({
      mutation: REMOVE_CHECKOUT_LINES,
      variables: {
        checkoutId,
        lineIds: [lineId],
      },
    });
    
    if (data?.checkoutLinesDelete?.checkout) {
      return { success: true };
    }
    
    return { 
      success: false, 
      errors: data?.checkoutLinesDelete?.errors || ['Failed to remove item'] 
    };
    
  } catch (error) {
    console.error('Error removing from cart:', error);
    return { success: false, errors: [error] };
  }
}

/**
 * Get checkout total (cached)
 */
export async function getCheckoutTotalOptimized(
  checkoutId: string
): Promise<{ amount: number; currency: string } | null> {
  try {
    const { data } = await apolloClient.query({
      query: GET_CHECKOUT_TOTAL,
      variables: { id: checkoutId },
      fetchPolicy: 'cache-first', // Use cache when available
    });
    
    if (data?.checkout?.totalPrice?.gross) {
      return {
        amount: parseFloat(data.checkout.totalPrice.gross.amount),
        currency: data.checkout.totalPrice.gross.currency,
      };
    }
    
    return null;
  } catch (error) {
    console.error('Error getting checkout total:', error);
    return null;
  }
}

/**
 * Clear cart and remove from cache
 */
export function clearCart(): void {
  sessionStorage.removeItem('checkout_id');
  
  // Clear checkout data from Apollo cache
  apolloClient.cache.evict({ fieldName: 'checkout' });
  apolloClient.cache.gc(); // Garbage collect
} 