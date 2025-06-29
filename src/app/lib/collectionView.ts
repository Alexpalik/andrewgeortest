const query = `
  query Products($first: Int!, $after: String, $channel: String!) {
    products(first: $first, after: $after, channel: $channel) {
      pageInfo {
        hasNextPage
        endCursor
      }
      edges {
        node {
          id
          name
          slug
          description
          category {
            id
            name
          }
          productType {
            id
            name
            metadata {
              key
              value
            }
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
        }
      }
    }
  }
`

// ---------- TypeScript Interfaces ----------

interface Price {
  amount: number;
  currency: string;
}

interface Pricing {
  onSale: boolean;
  priceRange: {
    start: {
      gross: Price;
    };
  };
  discount?: {
    gross: {
      amount: number;
    };
    currency: string;
  } | null;
}

interface Category {
  id: string;
  name: string;
}

interface Media {
  id: string;
  url: string;
}

interface Variant {
  id: string;
  name: string;
}

interface ProductType {
  id: string;
  name: string;
  metadata?: { key: string; value: string }[];
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  pricing: Pricing;
  description: string;
  category: Category;
  media: Media[];
  variants: Variant[];
  productType: ProductType;
  metafields?: any;
}

interface APIResponse {
  data: {
    products: {
      pageInfo: {
        hasNextPage: boolean;
        endCursor: string | null;
      };
      edges: {
        node: Product;
      }[];
    };
  };
}

// ---------- Fetch Function ----------

export async function fetchSaleorProducts(
  first: number,
  after: string | null = null,
  channel: string = "default-channel"
): Promise<{ products: Product[]; pageInfo: { hasNextPage: boolean; endCursor: string | null } }> {
  const response = await fetch(process.env.NEXT_PUBLIC_SALEOR_API_URL as string, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query,
      variables: { first, after, channel },
    }),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }

  const result: APIResponse = await response.json();

  // After fetching product types, log them
  console.log('Fetched product types:', result.data.products.edges.map(edge => edge.node.productType));

  return {
    products: result.data.products.edges.map(edge => edge.node),
    pageInfo: result.data.products.pageInfo,
  };
}

export default fetchSaleorProducts;
