export const fetchProductInfo = async (variantId: string) => {
  try {
    const response = await fetch(process.env.NEXT_PUBLIC_SALEOR_API_URL as string, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: `
          query ProductFromVariant($id: ID!) {
            productVariant(id: $id) {
              id
              name
              product {
                id
                name
                slug
                description
                pricing {
                  priceRange {
                    start {
                      gross {
                        amount
                      }
                    }
                  }
                }
                media {
                  url
                }
                rating
              }
            }
          }
        `,
        variables: { id: variantId },
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to fetch product details from variant");
    }

    const data = await response.json();
    return data.data.productVariant?.product || null;
  } catch (error) {
    console.error("Error fetching product details:", error);
    return null;
  }
};
