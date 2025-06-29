// src/app/lib/saleorCart/getCart.ts

const SALEOR_API_URL = process.env.NEXT_PUBLIC_SALEOR_API_URL
const API_TOKEN = process.env.API_TOKEN

export async function getCheckout() {
  const checkoutId = sessionStorage.getItem("checkout_id") // Fetch from localStorage

  if (!checkoutId) {
    console.error("No checkout ID found in localStorage.")
    return null
  }

  const QUERY = `
    query GetCheckout($id: ID!) {
      checkout(id: $id) {
        id
        totalPrice {
          net {
            amount
          }
          tax {
            amount
          }
          gross {
            amount
            currency
          }
        }
        lines {
          id
          quantity
          totalPrice {
            gross {
              currency
              amount
            }
          }
          variant {
            id
            name
            product {
              id
              name
              slug
              media {
                url
              }
              pricing {
                priceRange {
                  start {
                    gross {
                      amount
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  `

  try {
    const response = await fetch(SALEOR_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: API_TOKEN
      },
      body: JSON.stringify({
        query: QUERY,
        variables: { id: checkoutId } // Pass the correct checkout ID
      })
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const { data, errors } = await response.json()
    if (errors) {
      console.error("GraphQL errors:", errors)
      return null
    }

    return data.checkout
  } catch (error) {
    console.error("Error fetching checkout:", error)
    return null
  }
}
