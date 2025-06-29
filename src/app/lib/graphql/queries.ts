import { gql } from '@apollo/client';
import {
  PRODUCT_MINIMAL_FRAGMENT,
  PRODUCT_FRAGMENT,
  CHECKOUT_FRAGMENT,
  CHECKOUT_MINIMAL_FRAGMENT,
  COLLECTION_FRAGMENT,
  ORDER_FRAGMENT,
  USER_FRAGMENT,
  MONEY_FRAGMENT,
} from './fragments';

// ============== PRODUCT QUERIES ==============

// Get products with pagination (optimized for listings)
export const GET_PRODUCTS = gql`
  query GetProducts(
    $first: Int = 12
    $after: String
    $filter: ProductFilterInput
    $sortBy: ProductOrder
    $channel: String
  ) {
    products(
      first: $first
      after: $after
      filter: $filter
      sortBy: $sortBy
      channel: $channel
    ) {
      edges {
        node {
          ...ProductMinimal
        }
        cursor
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
      totalCount
    }
  }
  ${PRODUCT_MINIMAL_FRAGMENT}
`;

// Get single product by ID or slug (optimized for product pages)
export const GET_PRODUCT = gql`
  query GetProduct($id: ID, $slug: String, $channel: String) {
    product(id: $id, slug: $slug, channel: $channel) {
      ...Product
    }
  }
  ${PRODUCT_FRAGMENT}
`;

// Get product by variant ID (optimized for cart/wishlist)
export const GET_PRODUCT_BY_VARIANT = gql`
  query GetProductByVariant($id: ID!) {
    productVariant(id: $id) {
      id
      name
      product {
        ...ProductMinimal
      }
    }
  }
  ${PRODUCT_MINIMAL_FRAGMENT}
`;

// Search products (optimized for search results)
export const SEARCH_PRODUCTS = gql`
  query SearchProducts(
    $query: String!
    $first: Int = 12
    $after: String
    $channel: String
  ) {
    products(
      first: $first
      after: $after
      filter: { search: $query }
      channel: $channel
    ) {
      edges {
        node {
          ...ProductMinimal
        }
        cursor
      }
      pageInfo {
        hasNextPage
        endCursor
      }
      totalCount
    }
  }
  ${PRODUCT_MINIMAL_FRAGMENT}
`;

// ============== COLLECTION QUERIES ==============

// Get collections (optimized for navigation)
export const GET_COLLECTIONS = gql`
  query GetCollections($first: Int = 20, $channel: String) {
    collections(first: $first, channel: $channel) {
      edges {
        node {
          ...Collection
        }
      }
    }
  }
  ${COLLECTION_FRAGMENT}
`;

// Get collection with products
export const GET_COLLECTION_PRODUCTS = gql`
  query GetCollectionProducts(
    $id: ID!
    $first: Int = 12
    $after: String
    $sortBy: ProductOrder
    $channel: String
  ) {
    collection(id: $id, channel: $channel) {
      ...Collection
      products(first: $first, after: $after, sortBy: $sortBy) {
        edges {
          node {
            ...ProductMinimal
          }
          cursor
        }
        pageInfo {
          hasNextPage
          endCursor
        }
        totalCount
      }
    }
  }
  ${COLLECTION_FRAGMENT}
  ${PRODUCT_MINIMAL_FRAGMENT}
`;

// ============== CHECKOUT QUERIES ==============

// Get checkout (optimized for checkout pages)
export const GET_CHECKOUT = gql`
  query GetCheckout($id: ID!) {
    checkout(id: $id) {
      ...Checkout
    }
  }
  ${CHECKOUT_FRAGMENT}
`;

// Get checkout minimal (optimized for cart preview/header)
export const GET_CHECKOUT_MINIMAL = gql`
  query GetCheckoutMinimal($id: ID!) {
    checkout(id: $id) {
      ...CheckoutMinimal
    }
  }
  ${CHECKOUT_MINIMAL_FRAGMENT}
`;

// Get checkout total only (for price updates)
export const GET_CHECKOUT_TOTAL = gql`
  query GetCheckoutTotal($id: ID!) {
    checkout(id: $id) {
      id
      totalPrice {
        gross {
          ...Money
        }
      }
      subtotalPrice {
        gross {
          ...Money
        }
      }
    }
  }
  ${MONEY_FRAGMENT}
`;

// ============== USER QUERIES ==============

// Get current user
export const GET_USER = gql`
  query GetUser {
    me {
      ...User
      addresses {
        id
        firstName
        lastName
        streetAddress1
        city
        postalCode
        country {
          code
          country
        }
        isDefaultShippingAddress
        isDefaultBillingAddress
      }
    }
  }
  ${USER_FRAGMENT}
`;

// Get user orders
export const GET_USER_ORDERS = gql`
  query GetUserOrders($first: Int = 10, $after: String) {
    me {
      id
      orders(first: $first, after: $after) {
        edges {
          node {
            ...Order
          }
          cursor
        }
        pageInfo {
          hasNextPage
          endCursor
        }
      }
    }
  }
  ${ORDER_FRAGMENT}
`;

// ============== CATEGORY QUERIES ==============

// Get categories (optimized for navigation)
export const GET_CATEGORIES = gql`
  query GetCategories($first: Int = 20) {
    categories(first: $first) {
      edges {
        node {
          id
          name
          slug
          level
          parent {
            id
            name
          }
          children(first: 10) {
            edges {
              node {
                id
                name
                slug
              }
            }
          }
        }
      }
    }
  }
`;

// Get category with products
export const GET_CATEGORY_PRODUCTS = gql`
  query GetCategoryProducts(
    $id: ID!
    $first: Int = 12
    $after: String
    $sortBy: ProductOrder
    $channel: String
  ) {
    category(id: $id) {
      id
      name
      slug
      description
      seoTitle
      seoDescription
      products(first: $first, after: $after, sortBy: $sortBy, channel: $channel) {
        edges {
          node {
            ...ProductMinimal
          }
          cursor
        }
        pageInfo {
          hasNextPage
          endCursor
        }
        totalCount
      }
    }
  }
  ${PRODUCT_MINIMAL_FRAGMENT}
`;

// ============== SHIPPING QUERIES ==============

// Get shipping methods for checkout
export const GET_SHIPPING_METHODS = gql`
  query GetShippingMethods($checkoutId: ID!) {
    checkout(id: $checkoutId) {
      id
      shippingMethods {
        id
        name
        price {
          ...Money
        }
        minimumOrderPrice {
          ...Money
        }
        maximumOrderPrice {
          ...Money
        }
      }
    }
  }
  ${MONEY_FRAGMENT}
`;

// ============== PAYMENT QUERIES ==============

// Get payment gateways
export const GET_PAYMENT_GATEWAYS = gql`
  query GetPaymentGateways($checkoutId: ID!) {
    checkout(id: $checkoutId) {
      id
      availablePaymentGateways {
        id
        name
        config {
          field
          value
        }
      }
    }
  }
`;

// ============== WISHLIST QUERIES ==============

// Get wishlist (if using Saleor's wishlist feature)
export const GET_WISHLIST = gql`
  query GetWishlist {
    me {
      id
      wishlistItems(first: 50) {
        edges {
          node {
            id
            product {
              ...ProductMinimal
            }
            variant {
              id
              name
            }
          }
        }
      }
    }
  }
  ${PRODUCT_MINIMAL_FRAGMENT}
`;

// ============== HOMEPAGE QUERIES ==============

// Get homepage data (optimized for homepage)
export const GET_HOMEPAGE_DATA = gql`
  query GetHomepageData($channel: String) {
    # Featured collections
    collections(first: 6, channel: $channel) {
      edges {
        node {
          ...Collection
        }
      }
    }
    
    # Featured products
    products(first: 8, filter: { isFeatured: true }, channel: $channel) {
      edges {
        node {
          ...ProductMinimal
        }
      }
    }
    
    # New arrivals
    newProducts: products(
      first: 8
      sortBy: { field: CREATED_AT, direction: DESC }
      channel: $channel
    ) {
      edges {
        node {
          ...ProductMinimal
        }
      }
    }
  }
  ${COLLECTION_FRAGMENT}
  ${PRODUCT_MINIMAL_FRAGMENT}
`; 