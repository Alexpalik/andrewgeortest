"use client"
export const fetchProductInfo = async (productId: string) => {
    try {
      const response = await fetch(process.env.NEXT_PUBLIC_SALEOR_API_URL as string, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: `
            query ProductDetails($id: ID!) {
              product(id: $id) {
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
          `,
          variables: { id: productId },
        }),
      });
  
      if (!response.ok) {
        throw new Error("Failed to fetch product details");
      }
  
      const data = await response.json();
      return data.data.product;
    } catch (error) {
      console.error("Error fetching product details:", error);
      return null;
    }
  };
  