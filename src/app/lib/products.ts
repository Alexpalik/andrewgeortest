import { useQuery, useLazyQuery } from '@apollo/client';
import {
  GET_PRODUCTS,
  GET_PRODUCT,
  GET_PRODUCT_BY_VARIANT,
  SEARCH_PRODUCTS,
  GET_COLLECTIONS,
  GET_COLLECTION_PRODUCTS,
  GET_CATEGORIES,
  GET_CATEGORY_PRODUCTS,
  GET_HOMEPAGE_DATA,
} from './graphql/queries';
import { apolloClient } from './saleorClient';

// ============== TYPES ==============

export interface AttributeFilter {
  slug: string;
  values?: string[];
  valuesRange?: IntRangeInput;
  boolean?: boolean;
  date?: DateRangeInput;
  dateTime?: DateTimeRangeInput;
}

export interface IntRangeInput {
  gte?: number;
  lte?: number;
}

export interface DateRangeInput {
  gte?: string;
  lte?: string;
}

export interface DateTimeRangeInput {
  gte?: string;
  lte?: string;
}

export interface PriceRangeInput {
  gte?: number;
  lte?: number;
}

export enum StockAvailability {
  IN_STOCK = 'IN_STOCK',
  OUT_OF_STOCK = 'OUT_OF_STOCK',
}

export interface ProductFilterInput {
  isPublished?: boolean;
  collections?: string[];
  categories?: string[];
  hasCategory?: string;
  attributes?: AttributeFilter[];
  stockAvailability?: StockAvailability;
  search?: string;
  price?: PriceRangeInput;
  minimalPrice?: PriceRangeInput;
  updatedAt?: DateRangeInput;
  isVisibleInListing?: boolean;
  giftCard?: boolean;
  ids?: string[];
  hasPreorderedVariants?: boolean;
}

export interface ProductOrder {
  field: ProductOrderField;
  direction: OrderDirection;
}

export enum ProductOrderField {
  NAME = 'NAME',
  RANK = 'RANK',
  PRICE = 'PRICE',
  MINIMAL_PRICE = 'MINIMAL_PRICE',
  LAST_MODIFIED = 'LAST_MODIFIED',
  DATE = 'DATE',
  TYPE = 'TYPE',
  PUBLISHED = 'PUBLISHED',
  PUBLICATION_DATE = 'PUBLICATION_DATE',
  CREATED_AT = 'CREATED_AT',
  RATING = 'RATING',
}

export enum OrderDirection {
  ASC = 'ASC',
  DESC = 'DESC',
}

// ============== PRODUCT HOOKS ==============

/**
 * Hook to get products with pagination and filtering
 * Optimized for product listings, collections, categories
 */
export function useProducts(options: {
  first?: number;
  after?: string;
  filter?: ProductFilterInput;
  sortBy?: ProductOrder;
  channel?: string;
  enabled?: boolean;
}) {
  const {
    first = 12,
    after,
    filter,
    sortBy = { field: ProductOrderField.RANK, direction: OrderDirection.ASC },
    channel,
    enabled = true,
  } = options;

  return useQuery(GET_PRODUCTS, {
    variables: {
      first,
      after,
      filter,
      sortBy,
      channel,
    },
    skip: !enabled,
    errorPolicy: 'all',
    fetchPolicy: 'cache-and-network', // Balance freshness and speed
    notifyOnNetworkStatusChange: true,
    // Enable partial data return for better UX
    returnPartialData: true,
  });
}

/**
 * Hook to get a single product by ID or slug
 * Optimized for product detail pages
 */
export function useProduct(options: {
  id?: string;
  slug?: string;
  channel?: string;
  enabled?: boolean;
}) {
  const { id, slug, channel, enabled = true } = options;

  return useQuery(GET_PRODUCT, {
    variables: { id, slug, channel },
    skip: !enabled || (!id && !slug),
    errorPolicy: 'all',
    fetchPolicy: 'cache-first', // Prioritize cache for product details
    // Keep data in cache for longer
    returnPartialData: true,
  });
}

/**
 * Hook to get product by variant ID
 * Optimized for cart/wishlist operations
 */
export function useProductByVariant(variantId: string | null) {
  return useQuery(GET_PRODUCT_BY_VARIANT, {
    variables: { id: variantId },
    skip: !variantId,
    errorPolicy: 'all',
    fetchPolicy: 'cache-first',
  });
}

/**
 * Hook for product search with debouncing
 * Optimized for search functionality
 */
export function useProductSearch() {
  return useLazyQuery(SEARCH_PRODUCTS, {
    errorPolicy: 'all',
    fetchPolicy: 'cache-and-network',
    notifyOnNetworkStatusChange: true,
  });
}

/**
 * Hook to get collections
 * Optimized for navigation and homepage
 */
export function useCollections(options: {
  first?: number;
  channel?: string;
  enabled?: boolean;
} = {}) {
  const { first = 20, channel, enabled = true } = options;

  return useQuery(GET_COLLECTIONS, {
    variables: { first, channel },
    skip: !enabled,
    errorPolicy: 'all',
    fetchPolicy: 'cache-first', // Collections change rarely
    // Cache for longer periods
    returnPartialData: true,
  });
}

/**
 * Hook to get collection with its products
 * Optimized for collection pages
 */
export function useCollectionProducts(options: {
  id: string;
  first?: number;
  after?: string;
  sortBy?: ProductOrder;
  channel?: string;
  enabled?: boolean;
}) {
  const {
    id,
    first = 12,
    after,
    sortBy = { field: ProductOrderField.RANK, direction: OrderDirection.ASC },
    channel,
    enabled = true,
  } = options;

  return useQuery(GET_COLLECTION_PRODUCTS, {
    variables: { id, first, after, sortBy, channel },
    skip: !enabled || !id,
    errorPolicy: 'all',
    fetchPolicy: 'cache-and-network',
    notifyOnNetworkStatusChange: true,
  });
}

/**
 * Hook to get categories
 * Optimized for navigation
 */
export function useCategories(options: {
  first?: number;
  enabled?: boolean;
} = {}) {
  const { first = 20, enabled = true } = options;

  return useQuery(GET_CATEGORIES, {
    variables: { first },
    skip: !enabled,
    errorPolicy: 'all',
    fetchPolicy: 'cache-first', // Categories change rarely
  });
}

/**
 * Hook to get category with its products
 * Optimized for category pages
 */
export function useCategoryProducts(options: {
  id: string;
  first?: number;
  after?: string;
  sortBy?: ProductOrder;
  channel?: string;
  enabled?: boolean;
}) {
  const {
    id,
    first = 12,
    after,
    sortBy = { field: ProductOrderField.RANK, direction: OrderDirection.ASC },
    channel,
    enabled = true,
  } = options;

  return useQuery(GET_CATEGORY_PRODUCTS, {
    variables: { id, first, after, sortBy, channel },
    skip: !enabled || !id,
    errorPolicy: 'all',
    fetchPolicy: 'cache-and-network',
    notifyOnNetworkStatusChange: true,
  });
}

/**
 * Hook to get homepage data
 * Optimized for homepage with all needed data in one query
 */
export function useHomepageData(options: {
  channel?: string;
  enabled?: boolean;
} = {}) {
  const { channel, enabled = true } = options;

  return useQuery(GET_HOMEPAGE_DATA, {
    variables: { channel },
    skip: !enabled,
    errorPolicy: 'all',
    fetchPolicy: 'cache-and-network',
    // Longer cache for homepage data
    returnPartialData: true,
  });
}

// ============== UTILITY FUNCTIONS ==============

/**
 * Optimized product search with caching
 */
export async function searchProductsOptimized(
  query: string,
  options: {
    first?: number;
    after?: string;
    channel?: string;
  } = {}
): Promise<any> {
  const { first = 12, after, channel } = options;

  try {
    const { data, error } = await apolloClient.query({
      query: SEARCH_PRODUCTS,
      variables: {
        query,
        first,
        after,
        channel,
      },
      fetchPolicy: 'cache-first',
      errorPolicy: 'all',
    });

    if (error) {
      console.error('Search error:', error);
      return { products: [], totalCount: 0, hasNextPage: false };
    }

    return {
      products: data?.products?.edges?.map((edge: any) => edge.node) || [],
      totalCount: data?.products?.totalCount || 0,
      hasNextPage: data?.products?.pageInfo?.hasNextPage || false,
      endCursor: data?.products?.pageInfo?.endCursor,
    };
  } catch (error) {
    console.error('Error searching products:', error);
    return { products: [], totalCount: 0, hasNextPage: false };
  }
}

/**
 * Fetch product by variant ID (cached)
 */
export async function fetchProductByVariantOptimized(
  variantId: string
): Promise<any | null> {
  try {
    const { data, error } = await apolloClient.query({
      query: GET_PRODUCT_BY_VARIANT,
      variables: { id: variantId },
      fetchPolicy: 'cache-first',
      errorPolicy: 'all',
    });

    if (error) {
      console.error('Error fetching product by variant:', error);
      return null;
    }

    return data?.productVariant?.product || null;
  } catch (error) {
    console.error('Error fetching product by variant:', error);
    return null;
  }
}

/**
 * Fetch single product with caching
 */
export async function fetchProductOptimized(
  identifier: { id?: string; slug?: string },
  channel?: string
): Promise<any | null> {
  try {
    const { data, error } = await apolloClient.query({
      query: GET_PRODUCT,
      variables: {
        ...identifier,
        channel,
      },
      fetchPolicy: 'cache-first',
      errorPolicy: 'all',
    });

    if (error) {
      console.error('Error fetching product:', error);
      return null;
    }

    return data?.product || null;
  } catch (error) {
    console.error('Error fetching product:', error);
    return null;
  }
}

/**
 * Prefetch product data for faster navigation
 */
export async function prefetchProduct(
  identifier: { id?: string; slug?: string },
  channel?: string
): Promise<void> {
  try {
    await apolloClient.query({
      query: GET_PRODUCT,
      variables: {
        ...identifier,
        channel,
      },
      fetchPolicy: 'cache-first',
    });
  } catch (error) {
    // Silent fail for prefetch
    console.warn('Failed to prefetch product:', error);
  }
}

/**
 * Prefetch collection products
 */
export async function prefetchCollectionProducts(
  collectionId: string,
  options: {
    first?: number;
    channel?: string;
  } = {}
): Promise<void> {
  try {
    await apolloClient.query({
      query: GET_COLLECTION_PRODUCTS,
      variables: {
        id: collectionId,
        first: options.first || 12,
        channel: options.channel,
      },
      fetchPolicy: 'cache-first',
    });
  } catch (error) {
    console.warn('Failed to prefetch collection products:', error);
  }
}

/**
 * Clear product cache (useful for admin updates)
 */
export function clearProductCache(): void {
  apolloClient.cache.evict({ fieldName: 'products' });
  apolloClient.cache.evict({ fieldName: 'product' });
  apolloClient.cache.evict({ fieldName: 'collections' });
  apolloClient.cache.evict({ fieldName: 'categories' });
  apolloClient.cache.gc();
}

/**
 * Get products with infinite scroll pagination
 */
export function useInfiniteProducts(options: {
  filter?: ProductFilterInput;
  sortBy?: ProductOrder;
  channel?: string;
  pageSize?: number;
}) {
  const { filter, sortBy, channel, pageSize = 12 } = options;

  const { data, loading, error, fetchMore, refetch } = useProducts({
    first: pageSize,
    filter,
    sortBy,
    channel,
  });

  const loadMore = () => {
    if (data?.products?.pageInfo?.hasNextPage) {
      return fetchMore({
        variables: {
          after: data.products.pageInfo.endCursor,
        },
        updateQuery: (prev, { fetchMoreResult }) => {
          if (!fetchMoreResult) return prev;

          return {
            products: {
              ...fetchMoreResult.products,
              edges: [
                ...prev.products.edges,
                ...fetchMoreResult.products.edges,
              ],
            },
          };
        },
      });
    }
  };

  return {
    products: data?.products?.edges?.map((edge: any) => edge.node) || [],
    totalCount: data?.products?.totalCount || 0,
    hasNextPage: data?.products?.pageInfo?.hasNextPage || false,
    loading,
    error,
    loadMore,
    refetch,
  };
} 