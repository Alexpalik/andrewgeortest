import { gql } from '@apollo/client';

// Money fragment - used everywhere prices are displayed
export const MONEY_FRAGMENT = gql`
  fragment Money on Money {
    amount
    currency
  }
`;

// Price range fragment
export const PRICE_RANGE_FRAGMENT = gql`
  fragment PriceRange on TaxedMoneyRange {
    start {
      gross {
        ...Money
      }
      net {
        ...Money
      }
    }
    stop {
      gross {
        ...Money
      }
      net {
        ...Money
      }
    }
  }
  ${MONEY_FRAGMENT}
`;

// Product media fragment
export const PRODUCT_MEDIA_FRAGMENT = gql`
  fragment ProductMedia on ProductMedia {
    id
    url(size: 1024)
    alt
    type
  }
`;

// Product variant fragment - minimal fields for listings
export const PRODUCT_VARIANT_MINIMAL_FRAGMENT = gql`
  fragment ProductVariantMinimal on ProductVariant {
    id
    name
    sku
    quantityAvailable
    pricing {
      price {
        gross {
          ...Money
        }
      }
    }
  }
  ${MONEY_FRAGMENT}
`;

// Product variant fragment - full fields for product pages
export const PRODUCT_VARIANT_FRAGMENT = gql`
  fragment ProductVariant on ProductVariant {
    id
    name
    sku
    quantityAvailable
    attributes {
      attribute {
        id
        name
        slug
      }
      values {
        id
        name
        slug
      }
    }
    pricing {
      price {
        gross {
          ...Money
        }
        net {
          ...Money
        }
      }
    }
    media {
      ...ProductMedia
    }
  }
  ${MONEY_FRAGMENT}
  ${PRODUCT_MEDIA_FRAGMENT}
`;

// Product fragment - minimal for listings/cards
export const PRODUCT_MINIMAL_FRAGMENT = gql`
  fragment ProductMinimal on Product {
    id
    name
    slug
    thumbnail(size: 512) {
      url
      alt
    }
    pricing {
      priceRange {
        ...PriceRange
      }
    }
    category {
      id
      name
    }
  }
  ${PRICE_RANGE_FRAGMENT}
`;

// Product fragment - full for product pages  
export const PRODUCT_FRAGMENT = gql`
  fragment Product on Product {
    id
    name
    slug
    description
    seoTitle
    seoDescription
    rating
    media {
      ...ProductMedia
    }
    category {
      id
      name
      slug
    }
    collections {
      id
      name
      slug
    }
    pricing {
      priceRange {
        ...PriceRange
      }
    }
    attributes {
      attribute {
        id
        name
        slug
      }
      values {
        id
        name
        slug
      }
    }
    variants {
      ...ProductVariant
    }
    isAvailableForPurchase
    availableForPurchase
  }
  ${PRODUCT_MEDIA_FRAGMENT}
  ${PRICE_RANGE_FRAGMENT}
  ${PRODUCT_VARIANT_FRAGMENT}
`;

// Address fragment
export const ADDRESS_FRAGMENT = gql`
  fragment Address on Address {
    id
    firstName
    lastName
    companyName
    streetAddress1
    streetAddress2
    city
    cityArea
    postalCode
    country {
      code
      country
    }
    countryArea
    phone
  }
`;

// Checkout line fragment
export const CHECKOUT_LINE_FRAGMENT = gql`
  fragment CheckoutLine on CheckoutLine {
    id
    quantity
    variant {
      ...ProductVariantMinimal
      product {
        ...ProductMinimal
      }
    }
    totalPrice {
      gross {
        ...Money
      }
    }
  }
  ${PRODUCT_VARIANT_MINIMAL_FRAGMENT}
  ${PRODUCT_MINIMAL_FRAGMENT}
`;

// Checkout fragment - minimal for cart preview
export const CHECKOUT_MINIMAL_FRAGMENT = gql`
  fragment CheckoutMinimal on Checkout {
    id
    totalPrice {
      gross {
        ...Money
      }
    }
    lines {
      id
      quantity
      variant {
        id
        name
        product {
          id
          name
          slug
          thumbnail(size: 256) {
            url
            alt
          }
        }
      }
    }
  }
  ${MONEY_FRAGMENT}
`;

// Checkout fragment - full for checkout pages
export const CHECKOUT_FRAGMENT = gql`
  fragment Checkout on Checkout {
    id
    email
    shippingAddress {
      ...Address
    }
    billingAddress {
      ...Address
    }
    lines {
      ...CheckoutLine
    }
    shippingMethods {
      id
      name
      price {
        ...Money
      }
    }
    availablePaymentGateways {
      id
      name
      config {
        field
        value
      }
    }
    totalPrice {
      gross {
        ...Money
      }
      net {
        ...Money
      }
      tax {
        ...Money
      }
    }
    subtotalPrice {
      gross {
        ...Money
      }
    }
  }
  ${ADDRESS_FRAGMENT}
  ${CHECKOUT_LINE_FRAGMENT}
  ${MONEY_FRAGMENT}
`;

// Collection fragment
export const COLLECTION_FRAGMENT = gql`
  fragment Collection on Collection {
    id
    name
    slug
    description
    seoTitle
    seoDescription
    backgroundImage {
      url
      alt
    }
  }
`;

// User fragment
export const USER_FRAGMENT = gql`
  fragment User on User {
    id
    email
    firstName
    lastName
    isActive
    dateJoined
  }
`;

// Order fragment
export const ORDER_FRAGMENT = gql`
  fragment Order on Order {
    id
    number
    status
    created
    total {
      gross {
        ...Money
      }
    }
    lines {
      id
      quantity
      variant {
        ...ProductVariantMinimal
        product {
          ...ProductMinimal
        }
      }
    }
  }
  ${MONEY_FRAGMENT}
  ${PRODUCT_VARIANT_MINIMAL_FRAGMENT}
  ${PRODUCT_MINIMAL_FRAGMENT}
`;

// Error fragment
export const ERROR_FRAGMENT = gql`
  fragment Error on Error {
    field
    message
    code
  }
`; 