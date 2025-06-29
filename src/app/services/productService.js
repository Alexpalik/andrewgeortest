
import { PRODUCTS_QUERY } from '../lib/queries';

export async function fetchProducts() {
  const { data } = await saleorClient.query({ query: PRODUCTS_QUERY });
  return data.products; // adjust based on Saleor's response shape
}
