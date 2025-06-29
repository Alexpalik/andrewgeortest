"use client";

const PRODUCT_QUERY = `
  query ProductBySlug($slug: String!, $channel: String!) {
    product(slug: $slug, channel: $channel) {
      id
      name
      slug
      description
      category {
        id
        name
      }
      pricing {
        onSale
        priceRange {
          start {
            gross {
              amount
              currency
            }
          }
        }
        discount {
          gross {
            amount
          }
          currency
        }
      }
      media {
        id
        url
      }
      variants {
        id
        name
      }
      metafields
      productType {
        id
        name
        metadata {
          key
          value
        }
      }
    }
  }
`;

export const fetchSaleorProductBySlug = async (slug: string) => {
  const response = await fetch(process.env.NEXT_PUBLIC_SALEOR_API_URL as string, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: PRODUCT_QUERY,
      variables: { slug, channel: "default-channel" },
    }),
  });

  const result = await response.json();

  if (!result.data?.product) {
    throw new Error("Product not found");
  }

  return result.data.product;
};
