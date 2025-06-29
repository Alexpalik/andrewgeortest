export async function addCartItem(variantId: string, quantity: number) {
    const checkoutId = sessionStorage.getItem("checkout_id");
  
    const mutation = `
      mutation CheckoutLinesAdd($checkoutId: ID!, $lines: [CheckoutLineInput!]!) {
        checkoutLinesAdd(
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
    `;

    const SALEOR_API_URL = "https://store-vkfwp8gm.eu.saleor.cloud/graphql/";
const API_TOKEN = `Bearer 83626966bb3d4699b5ed6d8319584880.9c4oYwYYZPaQ3uPb4iPmy9iahMIRfSsu2q2tJvJ1RMwJM9oF`;
  
    const response = await fetch(SALEOR_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: API_TOKEN,
      },
      body: JSON.stringify({
        query: mutation,
        variables: {
          checkoutId,
          lines: [{ quantity, variantId }],
        },
      }),
    });
  
    const jsonResponse = await response.json();
  
    if (jsonResponse.errors) {
      console.error("Saleor API Error:", jsonResponse.errors);
      throw new Error(jsonResponse.errors[0].message);
    }
  
    return jsonResponse.data.checkoutLinesAdd;
  }
  