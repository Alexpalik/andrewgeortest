export async function createCheckout(variantId, quantity) {
  const mutation = `
      mutation CheckoutCreate($variantId: ID!, $quantity: Int!) {
        checkoutCreate(
          input: {
            channel: "default-channel"
            lines: { quantity: $quantity, variantId: $variantId }
            billingAddress: {
              firstName: "test"
              lastName: "test"
              streetAddress1: "test"
              city: "thessaloniki"
              postalCode: "57013"
              country: GR
            }
          }
        ) {
          checkout {
            id
            lines {
              id
              quantity
              variant {
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

  const SALEOR_API_URL = process.env.NEXT_PUBLIC_SALEOR_API_URL
  const API_TOKEN = process.env.API_TOKEN
  const response = await fetch(SALEOR_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: API_TOKEN
    },
    body: JSON.stringify({
      query: mutation,
      variables: { variantId, quantity }
    })
  })

  const jsonResponse = await response.json()

  if (jsonResponse.errors) {
    console.error("Saleor API Error:", jsonResponse.errors)
    throw new Error(jsonResponse.errors[0].message)
  }

  // Save the new checkout ID locally
  sessionStorage.setItem(
    "checkout_id",
    jsonResponse.data.checkoutCreate.checkout.id
  )

  return jsonResponse.data.checkoutCreate
}
