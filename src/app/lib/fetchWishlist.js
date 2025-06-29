"use client";

export const fetchWishlist = async () => {
  try {
    const token = sessionStorage.getItem(
      process.env.NEXT_PUBLIC_SALEOR_API_URL + "+saleor_auth_module_refresh_token"
    );

    if (!token) return [];

    const response = await fetch(`${process.env.NEXT_PUBLIC_REGISTRY_URL}/api/wishlist/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) throw new Error("Failed to fetch wishlist");

    const data = await response.json();

    return data.map((item) => {
      const parts = item.product_web_id.split(":"); 
      return parts.length > 1 ? parts[1] : item.product_web_id;
    });
  } catch (error) {
    console.error("Error fetching wishlist:", error);
    return [];
  }
};
