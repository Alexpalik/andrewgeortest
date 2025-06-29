const SEARCH_QUERY = `
  query SearchProducts($query: String!, $channel: String!) {
    products(filter: { search: $query }, channel: $channel, first: 10) {
      edges {
        node {
          id
          name
          slug
          description
          pricing {
            priceRange {
              start {
                gross {
                  amount
                  currency
                }
              }
            }
          }
          media {
            url
          }
        }
      }
    }
  }
`;

export const fetchSaleorSearchResults = async (query: string) => {
  const response = await fetch(process.env.NEXT_PUBLIC_SALEOR_API_URL as string, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_SALEOR_API_TOKEN}`,
    },
    body: JSON.stringify({
      query: SEARCH_QUERY,
      variables: {
        query,
        channel: "default-channel",
      },
    }),
  });

  const result = await response.json();

  if (result.errors) {
    console.error("GraphQL error:", result.errors);
    return [];
  }

  return result.data.products.edges.map((edge: any) => edge.node);
};
