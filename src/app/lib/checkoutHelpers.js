const SALEOR_API_URL = process.env.NEXT_PUBLIC_SALEOR_API_URL
const API_TOKEN = process.env.API_TOKEN
/**
 * Update Email on Checkout
 * @param checkoutId - The Checkout ID
 * @param email - Customer Email
 * @returns Checkout Email Update Response
 */
export async function checkoutEmailUpdate(checkoutId, email) {
  const mutation = `
    mutation CheckoutEmailUpdate($checkoutId: ID!, $email: String!) {
      checkoutEmailUpdate(id: $checkoutId, email: $email) {
        checkout {
          id
          email
        }
        errors {
          field
          message
        }
      }
    }
  `

  const response = await fetch(SALEOR_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: API_TOKEN
    },
    body: JSON.stringify({
      query: mutation,
      variables: {
        checkoutId,
        email
      }
    })
  })

  const jsonResponse = await response.json()
  if (jsonResponse.errors) {
    console.error("Saleor API Error:", jsonResponse.errors)
    throw new Error(jsonResponse.errors[0].message)
  }

  return jsonResponse.data.checkoutEmailUpdate
}

/**
 * Update Shipping Address on Checkout
 * @param checkoutId - The Checkout ID
 * @param shippingAddress - Address Input
 * @returns Shipping Address Update Response
 */
export async function checkoutShippingAddressUpdate(
  checkoutId,
  shippingAddress
) {
  const mutation = `
      mutation CheckoutShippingAddressUpdate($checkoutId: ID!, $shippingAddress: AddressInput!) {
        checkoutShippingAddressUpdate(
          id: $checkoutId
          shippingAddress: $shippingAddress
        ) {
          checkout {
            id
            shippingAddress {
              id
              city
              phone
              postalCode
              companyName
              cityArea
              streetAddress1
              streetAddress2
              countryArea
              country {
                country
                code
              }
              firstName
              lastName
            }
          }
          errors {
            field
            message
          }
        }
      }
    `

  const response = await fetch(SALEOR_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: API_TOKEN
    },
    body: JSON.stringify({
      query: mutation,
      variables: {
        checkoutId,
        shippingAddress
      }
    })
  })

  const jsonResponse = await response.json()
  if (jsonResponse.errors) {
    console.error("Saleor API Error:", jsonResponse.errors)
    throw new Error(jsonResponse.errors[0].message)
  }

  return jsonResponse.data.checkoutShippingAddressUpdate
}

/**
 * Update Delivery Method on Checkout
 * @param checkoutId - The Checkout ID
 * @param deliveryMethodId - The Delivery Method ID
 * @returns Delivery Method Update Response
 */
export async function checkoutDeliveryMethodUpdate(
  checkoutId,
  deliveryMethodId
) {
  const mutation = `
      mutation CheckoutDeliveryMethodUpdate($checkoutId: ID!, $deliveryMethodId: ID!) {
        checkoutDeliveryMethodUpdate(
          id: $checkoutId
          deliveryMethodId: $deliveryMethodId
        ) {
          checkout {
            deliveryMethod {
              ...on Warehouse {
                id
                name
              }
              ... on ShippingMethod {
                id
                name
              }
            }
          }
          errors {
            field
            message
          }
        }
      }
    `

  const response = await fetch(SALEOR_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: API_TOKEN
    },
    body: JSON.stringify({
      query: mutation,
      variables: {
        checkoutId,
        deliveryMethodId
      }
    })
  })

  const jsonResponse = await response.json()
  if (jsonResponse.errors) {
    console.error("Saleor API Error:", jsonResponse.errors)
    throw new Error(jsonResponse.errors[0].message)
  }

  return jsonResponse.data.checkoutDeliveryMethodUpdate
}

/**
 * Complete Checkout in Saleor
 * @param checkoutId - The Checkout ID
 * @returns Order Details
 */
export async function checkoutComplete(checkoutId) {
  const mutation = `
      mutation CheckoutComplete($checkoutId: ID!) {
        checkoutComplete(id: $checkoutId) {
          order {
            id
            status
          }
          errors {
            field
            message
          }
        }
      }
    `

  const response = await fetch(SALEOR_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: API_TOKEN
    },
    body: JSON.stringify({
      query: mutation,
      variables: {
        checkoutId
      }
    })
  })

  const jsonResponse = await response.json()
  if (jsonResponse.errors) {
    console.error("Saleor API Error:", jsonResponse.errors)
    throw new Error(jsonResponse.errors[0].message)
  }

  return jsonResponse.data.checkoutComplete
}

export async function checkoutBillingAddressUpdate(checkoutId, billingAddress) {
  const mutation = `
      mutation CheckoutBillingAddressUpdate($checkoutId: ID!, $billingAddress: AddressInput!) {
        checkoutBillingAddressUpdate(
          id: $checkoutId
          billingAddress: $billingAddress
        ) {
          checkout {
            id
            billingAddress {
              id
              city
              phone
              postalCode
              companyName
              cityArea
              streetAddress1
              streetAddress2
              countryArea
              country {
                code
              }
              firstName
              lastName
            }
          }
          errors {
            field
            message
          }
        }
      }
    `

  const response = await fetch(SALEOR_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: API_TOKEN
    },
    body: JSON.stringify({
      query: mutation,
      variables: {
        checkoutId,
        billingAddress
      }
    })
  })

  const jsonResponse = await response.json()
  if (jsonResponse.errors) {
    console.error("Saleor API Error:", jsonResponse.errors)
    throw new Error(jsonResponse.errors[0].message)
  }

  return jsonResponse.data.checkoutBillingAddressUpdate
}

export async function getCheckoutTotal(checkoutId) {
  const query = `
      query GetCheckoutTotal($checkoutId: ID!) {
        checkout(id: $checkoutId) {
          totalPrice {
            gross {
              amount
              currency
            }
          }
        }
      }
    `

  const response = await fetch(SALEOR_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: API_TOKEN
    },
    body: JSON.stringify({
      query,
      variables: {
        checkoutId
      }
    })
  })

  const jsonResponse = await response.json()
  if (jsonResponse.errors) {
    console.error("Saleor API Error:", jsonResponse.errors)
    throw new Error(jsonResponse.errors[0].message)
  }

  const amount = jsonResponse.data.checkout.totalPrice.gross.amount
  const currency = jsonResponse.data.checkout.totalPrice.gross.currency

  // Round to 2 decimals to avoid rounding errors
  const roundedAmount = parseFloat(amount).toFixed(2)

  console.log("Rounded Total Amount:", roundedAmount)
  console.log("Currency:", currency)

  return roundedAmount
}

export async function checkoutPaymentCreate(checkoutId, amount, cardNumber) {
  console.log("Creating Payment with Amount:", amount)
  console.log("Using Card Number:", cardNumber)

  if (parseFloat(amount) <= 0) {
    throw new Error("Invalid amount for payment. It must be greater than zero.")
  }

  const mutation = `
      mutation CheckoutPaymentCreate($checkoutId: ID!, $amount: PositiveDecimal!, $token: String!) {
        checkoutPaymentCreate(
          checkoutId: $checkoutId
          input: {
            amount: $amount
            gateway: "mirumee.payments.dummy"
            token: $token
          }
        ) {
          payment {
            id
            gateway
            token
          }
          errors {
            field
            message
          }
        }
      }
    `

  const response = await fetch(SALEOR_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: API_TOKEN
    },
    body: JSON.stringify({
      query: mutation,
      variables: {
        checkoutId,
        amount,
        token: cardNumber // Use dynamic card number
      }
    })
  })

  const jsonResponse = await response.json()
  if (jsonResponse.errors) {
    console.error("Saleor API Error:", jsonResponse.errors)
    throw new Error(jsonResponse.errors[0].message)
  }

  if (jsonResponse.data.checkoutPaymentCreate.errors.length > 0) {
    console.error(
      "Payment Creation Error:",
      jsonResponse.data.checkoutPaymentCreate.errors
    )
    throw new Error(jsonResponse.data.checkoutPaymentCreate.errors[0].message)
  }

  return jsonResponse.data.checkoutPaymentCreate.payment
}
