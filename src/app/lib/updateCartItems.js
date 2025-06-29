// src/app/lib/saleorCart/updateCartItem.ts

const SALEOR_API_URL = process.env.NEXT_PUBLIC_SALEOR_API_URL
const API_TOKEN = process.env.API_TOKEN

export async function updateCartItem(lineId, quantity) {
  const checkoutId = sessionStorage.getItem("checkout_id")

  const mutation = `
    mutation CheckoutLinesUpdate($checkoutId: ID!, $lines: [CheckoutLineUpdateInput!]!) {
      checkoutLinesUpdate(
        checkoutId: $checkoutId
        lines: $lines
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
        lines: [{ quantity, lineId }]
      }
    })
  })

  const jsonResponse = await response.json()

  if (jsonResponse.errors) {
    console.error("Saleor API Error:", jsonResponse.errors)
    throw new Error(jsonResponse.errors[0].message)
  }

  return jsonResponse.data.checkoutLinesUpdate
}
