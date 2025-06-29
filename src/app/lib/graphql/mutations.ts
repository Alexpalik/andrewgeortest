import { gql } from '@apollo/client';
import {
  CHECKOUT_FRAGMENT,
  CHECKOUT_MINIMAL_FRAGMENT,
  ADDRESS_FRAGMENT,
  ERROR_FRAGMENT,
  USER_FRAGMENT,
  MONEY_FRAGMENT,
} from './fragments';

// ============== CHECKOUT MUTATIONS ==============

// Create checkout (optimized)
export const CREATE_CHECKOUT = gql`
  mutation CreateCheckout(
    $email: String
    $lines: [CheckoutLineInput!]!
    $channel: String
  ) {
    checkoutCreate(
      input: {
        email: $email
        lines: $lines
        channel: $channel
      }
    ) {
      checkout {
        ...CheckoutMinimal
      }
      errors {
        ...Error
      }
    }
  }
  ${CHECKOUT_MINIMAL_FRAGMENT}
  ${ERROR_FRAGMENT}
`;

// Add items to checkout (optimized)
export const ADD_CHECKOUT_LINES = gql`
  mutation AddCheckoutLines(
    $checkoutId: ID!
    $lines: [CheckoutLineInput!]!
  ) {
    checkoutLinesAdd(checkoutId: $checkoutId, lines: $lines) {
      checkout {
        ...CheckoutMinimal
      }
      errors {
        ...Error
      }
    }
  }
  ${CHECKOUT_MINIMAL_FRAGMENT}
  ${ERROR_FRAGMENT}
`;

// Update checkout lines (optimized)
export const UPDATE_CHECKOUT_LINES = gql`
  mutation UpdateCheckoutLines(
    $checkoutId: ID!
    $lines: [CheckoutLineUpdateInput!]!
  ) {
    checkoutLinesUpdate(checkoutId: $checkoutId, lines: $lines) {
      checkout {
        ...CheckoutMinimal
      }
      errors {
        ...Error
      }
    }
  }
  ${CHECKOUT_MINIMAL_FRAGMENT}
  ${ERROR_FRAGMENT}
`;

// Remove lines from checkout (optimized)
export const REMOVE_CHECKOUT_LINES = gql`
  mutation RemoveCheckoutLines(
    $checkoutId: ID!
    $lineIds: [ID!]!
  ) {
    checkoutLinesDelete(checkoutId: $checkoutId, lineIds: $lineIds) {
      checkout {
        ...CheckoutMinimal
      }
      errors {
        ...Error
      }
    }
  }
  ${CHECKOUT_MINIMAL_FRAGMENT}
  ${ERROR_FRAGMENT}
`;

// Update checkout email (optimized)
export const UPDATE_CHECKOUT_EMAIL = gql`
  mutation UpdateCheckoutEmail($checkoutId: ID!, $email: String!) {
    checkoutEmailUpdate(id: $checkoutId, email: $email) {
      checkout {
        id
        email
      }
      errors {
        ...Error
      }
    }
  }
  ${ERROR_FRAGMENT}
`;

// Update shipping address (optimized)
export const UPDATE_CHECKOUT_SHIPPING_ADDRESS = gql`
  mutation UpdateCheckoutShippingAddress(
    $checkoutId: ID!
    $shippingAddress: AddressInput!
  ) {
    checkoutShippingAddressUpdate(
      id: $checkoutId
      shippingAddress: $shippingAddress
    ) {
      checkout {
        id
        shippingAddress {
          ...Address
        }
      }
      errors {
        ...Error
      }
    }
  }
  ${ADDRESS_FRAGMENT}
  ${ERROR_FRAGMENT}
`;

// Update billing address (optimized)
export const UPDATE_CHECKOUT_BILLING_ADDRESS = gql`
  mutation UpdateCheckoutBillingAddress(
    $checkoutId: ID!
    $billingAddress: AddressInput!
  ) {
    checkoutBillingAddressUpdate(
      id: $checkoutId
      billingAddress: $billingAddress
    ) {
      checkout {
        id
        billingAddress {
          ...Address
        }
      }
      errors {
        ...Error
      }
    }
  }
  ${ADDRESS_FRAGMENT}
  ${ERROR_FRAGMENT}
`;

// Update delivery method (optimized)
export const UPDATE_CHECKOUT_DELIVERY_METHOD = gql`
  mutation UpdateCheckoutDeliveryMethod(
    $checkoutId: ID!
    $deliveryMethodId: ID!
  ) {
    checkoutDeliveryMethodUpdate(
      id: $checkoutId
      deliveryMethodId: $deliveryMethodId
    ) {
      checkout {
        id
        deliveryMethod {
          ... on Warehouse {
            id
            name
          }
          ... on ShippingMethod {
            id
            name
            price {
              ...Money
            }
          }
        }
      }
      errors {
        ...Error
      }
    }
  }
  ${MONEY_FRAGMENT}
  ${ERROR_FRAGMENT}
`;

// Create payment (optimized)
export const CREATE_CHECKOUT_PAYMENT = gql`
  mutation CreateCheckoutPayment(
    $checkoutId: ID!
    $amount: PositiveDecimal!
    $gateway: String!
    $token: String!
  ) {
    checkoutPaymentCreate(
      checkoutId: $checkoutId
      input: {
        amount: $amount
        gateway: $gateway
        token: $token
      }
    ) {
      payment {
        id
        gateway
        token
        isActive
        chargeStatus
      }
      errors {
        ...Error
      }
    }
  }
  ${ERROR_FRAGMENT}
`;

// Complete checkout (optimized)
export const COMPLETE_CHECKOUT = gql`
  mutation CompleteCheckout($checkoutId: ID!) {
    checkoutComplete(id: $checkoutId) {
      order {
        id
        number
        status
        total {
          gross {
            ...Money
          }
        }
      }
      errors {
        ...Error
      }
    }
  }
  ${MONEY_FRAGMENT}
  ${ERROR_FRAGMENT}
`;

// ============== USER MUTATIONS ==============

// Register user (optimized)
export const REGISTER_USER = gql`
  mutation RegisterUser(
    $email: String!
    $password: String!
    $firstName: String
    $lastName: String
    $redirectUrl: String!
  ) {
    accountRegister(
      input: {
        email: $email
        password: $password
        firstName: $firstName
        lastName: $lastName
        redirectUrl: $redirectUrl
      }
    ) {
      user {
        ...User
      }
      errors {
        ...Error
      }
      requiresConfirmation
    }
  }
  ${USER_FRAGMENT}
  ${ERROR_FRAGMENT}
`;

// Login user (optimized)
export const LOGIN_USER = gql`
  mutation LoginUser($email: String!, $password: String!) {
    tokenCreate(email: $email, password: $password) {
      token
      refreshToken
      csrfToken
      user {
        ...User
      }
      errors {
        ...Error
      }
    }
  }
  ${USER_FRAGMENT}
  ${ERROR_FRAGMENT}
`;

// Refresh token (optimized)
export const REFRESH_TOKEN = gql`
  mutation RefreshToken($refreshToken: String!) {
    tokenRefresh(refreshToken: $refreshToken) {
      token
      errors {
        ...Error
      }
    }
  }
  ${ERROR_FRAGMENT}
`;

// Logout user (optimized)
export const LOGOUT_USER = gql`
  mutation LogoutUser {
    tokenDeactivateAll {
      errors {
        ...Error
      }
    }
  }
  ${ERROR_FRAGMENT}
`;

// Update user (optimized)
export const UPDATE_USER = gql`
  mutation UpdateUser(
    $firstName: String
    $lastName: String
  ) {
    accountUpdate(
      input: {
        firstName: $firstName
        lastName: $lastName
      }
    ) {
      user {
        ...User
      }
      errors {
        ...Error
      }
    }
  }
  ${USER_FRAGMENT}
  ${ERROR_FRAGMENT}
`;

// Change password (optimized)
export const CHANGE_PASSWORD = gql`
  mutation ChangePassword($oldPassword: String!, $newPassword: String!) {
    passwordChange(oldPassword: $oldPassword, newPassword: $newPassword) {
      user {
        id
        email
      }
      errors {
        ...Error
      }
    }
  }
  ${ERROR_FRAGMENT}
`;

// Request password reset (optimized)
export const REQUEST_PASSWORD_RESET = gql`
  mutation RequestPasswordReset($email: String!, $redirectUrl: String!) {
    requestPasswordReset(email: $email, redirectUrl: $redirectUrl) {
      errors {
        ...Error
      }
    }
  }
  ${ERROR_FRAGMENT}
`;

// Confirm password reset (optimized)
export const CONFIRM_PASSWORD_RESET = gql`
  mutation ConfirmPasswordReset(
    $token: String!
    $email: String!
    $password: String!
  ) {
    setPassword(token: $token, email: $email, password: $password) {
      user {
        ...User
      }
      errors {
        ...Error
      }
    }
  }
  ${USER_FRAGMENT}
  ${ERROR_FRAGMENT}
`;

// ============== ADDRESS MUTATIONS ==============

// Create address (optimized)
export const CREATE_ADDRESS = gql`
  mutation CreateAddress($input: AddressInput!) {
    accountAddressCreate(input: $input) {
      address {
        ...Address
      }
      errors {
        ...Error
      }
    }
  }
  ${ADDRESS_FRAGMENT}
  ${ERROR_FRAGMENT}
`;

// Update address (optimized)
export const UPDATE_ADDRESS = gql`
  mutation UpdateAddress($id: ID!, $input: AddressInput!) {
    accountAddressUpdate(id: $id, input: $input) {
      address {
        ...Address
      }
      errors {
        ...Error
      }
    }
  }
  ${ADDRESS_FRAGMENT}
  ${ERROR_FRAGMENT}
`;

// Delete address (optimized)
export const DELETE_ADDRESS = gql`
  mutation DeleteAddress($id: ID!) {
    accountAddressDelete(id: $id) {
      errors {
        ...Error
      }
    }
  }
  ${ERROR_FRAGMENT}
`;

// Set default address (optimized)
export const SET_DEFAULT_ADDRESS = gql`
  mutation SetDefaultAddress($id: ID!, $type: AddressTypeEnum!) {
    accountSetDefaultAddress(id: $id, type: $type) {
      user {
        id
        defaultShippingAddress {
          id
        }
        defaultBillingAddress {
          id
        }
      }
      errors {
        ...Error
      }
    }
  }
  ${ERROR_FRAGMENT}
`;

// ============== WISHLIST MUTATIONS ==============

// Add to wishlist (if using Saleor's wishlist)
export const ADD_TO_WISHLIST = gql`
  mutation AddToWishlist($productId: ID!, $variantId: ID) {
    wishlistAddProduct(productId: $productId, variantId: $variantId) {
      wishlistItem {
        id
        product {
          id
          name
        }
        variant {
          id
          name
        }
      }
      errors {
        ...Error
      }
    }
  }
  ${ERROR_FRAGMENT}
`;

// Remove from wishlist (if using Saleor's wishlist)
export const REMOVE_FROM_WISHLIST = gql`
  mutation RemoveFromWishlist($wishlistItemId: ID!) {
    wishlistRemoveProduct(wishlistItemId: $wishlistItemId) {
      errors {
        ...Error
      }
    }
  }
  ${ERROR_FRAGMENT}
`;

// ============== NEWSLETTER MUTATIONS ==============

// Subscribe to newsletter (optimized)
export const SUBSCRIBE_NEWSLETTER = gql`
  mutation SubscribeNewsletter($email: String!) {
    # This would depend on your specific newsletter setup
    # This is a placeholder for newsletter subscription
  }
`; 