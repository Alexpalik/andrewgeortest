"use client";
import { useEffect, useState } from "react";
import WishlistsProductCard from "../../../components/WishLIstProductCard";
import { fetchProductInfo } from "@/app/lib/fetchWishListById";

const AccountSavelists = () => {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchWishlist = async () => {
    try {
      setLoading(true);
      const token = sessionStorage.getItem(
        process.env.NEXT_PUBLIC_SALEOR_API_URL + "+saleor_auth_module_refresh_token"
      );
      if (!token) return;

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_REGISTRY_URL}/api/wishlist/`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (!response.ok) throw new Error("Failed to fetch wishlist");

      const wishlistData = await response.json();
      console.log("Raw Wishlist Data:", wishlistData);

      const productDetails = await Promise.all(
        wishlistData.map(async (item) => {
          const product = await fetchProductInfo(item.product_web_id);
          console.log(`Fetching Product ID ${item.product_web_id}:`, product);
          if (!product) {
            console.warn(`No product found for ID: ${item.product_web_id}`);
            return null;
          }
          // Ensure product has a unique identifier (e.g. id or product_web_id)
          return { ...product, isLiked: true };
        })
      );

      const filteredProducts = productDetails.filter((product) => product !== null);
      console.log("Filtered Wishlist:", filteredProducts);
      setWishlist(filteredProducts);
    } catch (error) {
      console.error("Error fetching wishlist:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

  // Remove a product from state immediately without re-fetching.
  const handleRemoveFromWishlist = async (productId) => {
    try {
      const token = sessionStorage.getItem(
        process.env.NEXT_PUBLIC_SALEOR_API_URL + "+saleor_auth_module_refresh_token"
      );
      if (!token) return;

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_REGISTRY_URL}/api/wishlist/modify/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            action: "remove",
            product_web_id: productId,
          }),
        }
      );

      if (!response.ok) throw new Error("Failed to remove product from wishlist");

      console.log(`Product ${productId} removed from wishlist`);

      setWishlist((prevWishlist) =>
        prevWishlist.filter((product) => product.id !== productId)
      );
    } catch (error) {
      console.error("Error removing product from wishlist:", error);
    }
  };

  return (
    <div className="space-y-10 sm:space-y-12">

      <div className="grid grid-cols-1 gap-6 md:gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {loading ? (
          <p>Loading wishlist...</p>
        ) : wishlist.length > 0 ? (
          wishlist.map((product) => (
              <WishlistsProductCard
                key={product.id} // or product.product_web_id if that's your unique field
                data={product}
                isLiked={product.isLiked}
                onRemove={() =>
                  setWishlist((prev) =>
                    prev.filter((p) => p.id !== product.id)
                  )
                }
            />
          ))
        ) : (
          <p>No saved products.</p>
        )}
      </div>
    </div>
  );
};

export default AccountSavelists;
