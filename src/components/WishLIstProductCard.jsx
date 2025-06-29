"use client";
import React, { useState, useEffect } from "react";
import LikeButton from "./LikeButton";
import Prices from "./Prices";
import { StarIcon } from "@heroicons/react/24/solid";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import Link from "next/link";
import NcImage from "@/shared/NcImage/NcImage";
import ProductStatus from "./ProductStatus";
import DOMPurify from "dompurify";

const WishlistsProductCard = ({ className = "", data, onRemove }) => {
  const { name, pricing, description, status, media, rating, id, numberOfReviews, slug } = data;
  const router = useRouter();
  const [isLiked, setIsLiked] = useState(true);

  // Optional: This function checks if the product is in the wishlist.
  // (You may remove this if the parent already sets isLiked.)
  const fetchWishlist = async () => {
    try {
      const token = sessionStorage.getItem(
        process.env.NEXT_PUBLIC_SALEOR_API_URL + "+saleor_auth_module_refresh_token"
      );
      if (!token) return;

      const response = await fetch(`${process.env.NEXT_PUBLIC_REGISTRY_URL}/api/wishlist/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error("Failed to fetch wishlist");

      const wishlistData = await response.json();
      const isInWishlist = wishlistData.some((item) => item.product_web_id === id);
      setIsLiked(isInWishlist);
    } catch (error) {
      console.error("Error fetching wishlist:", error);
    }
  };

  useEffect(() => {
    fetchWishlist();

    window.addEventListener("storage", fetchWishlist);
    return () => {
      window.removeEventListener("storage", fetchWishlist);
    };
  }, [id]);

  const handleWishlistToggle = async () => {
    const action = isLiked ? "remove" : "add";

    // If we're removing, immediately call onRemove to update the parent state.
    if (action === "remove" && typeof onRemove === "function") {
      onRemove();
    }

    try {
      const token = sessionStorage.getItem(
        process.env.NEXT_PUBLIC_SALEOR_API_URL + "+saleor_auth_module_refresh_token"
      );
      if (!token) return;

      const response = await fetch(`${process.env.NEXT_PUBLIC_REGISTRY_URL}/api/wishlist/modify/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          action,
          product_web_id: id,
        }),
      });

      if (!response.ok) throw new Error("Failed to update wishlist");

      if (action === "add") {
        toast.success("Added to wishlist!");
      } else {
        toast.success("Removed from wishlist.");
      }
      setIsLiked(action === "add");
    } catch (error) {
      console.error("Error updating wishlist:", error);
      toast.error("Could not update wishlist.");
      // Optionally: if removal fails, you might want to revert UI changes.
    }
  };

  const renderDescription = (description) => {
    try {
      const parsedDescription = JSON.parse(description);
      if (parsedDescription.blocks && Array.isArray(parsedDescription.blocks)) {
        return parsedDescription.blocks.map((block, index) => (
          <p
            key={index}
            dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(block.data.text),
            }}
          />
        ));
      }
    } catch (error) {
      return <p>{DOMPurify.sanitize(description)}</p>;
    }
    return <p>No description available.</p>;
  };

  return (
    <div className={`nc-ProductCard relative flex flex-col bg-transparent ${className}`}>
      <div className="relative flex-shrink-0 bg-slate-50 dark:bg-slate-300 rounded-3xl overflow-hidden z-1 group">
        <Link href={`/product/${slug}`} className="block">
          <NcImage
            containerClassName="flex aspect-w-11 aspect-h-12 w-full h-0"
            src={media?.[0]?.url || "/placeholder-image.jpg"}
            className="object-cover w-full h-full drop-shadow-xl"
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1200px) 50vw, 40vw"
            alt="product"
          />
        </Link>
        <ProductStatus status={status} />
        <LikeButton
          className="absolute top-3 end-3 z-10"
          liked={isLiked}
          onClick={handleWishlistToggle}
        />
      </div>

      <div className="space-y-4 px-2.5 pt-5 pb-2.5">
        <div
          style={{ cursor: "pointer" }}
          onClick={() => (window.location.href = `/product/${slug}`)}
        >
          <h2 className="nc-ProductCard__title text-base  transition-colors">
            {name}
          </h2>
          <div className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            {renderDescription(description)}
          </div>
        </div>

        <div className="flex justify-between items-end">
          <Prices price={pricing?.priceRange?.start.gross.amount} />
          <div className="flex items-center mb-0.5">
            <StarIcon className="w-5 h-5 pb-[1px] text-amber-400" />
            <span className="text-sm ms-1 text-slate-500 dark:text-slate-400">
              {rating || ""} ({numberOfReviews || 0} reviews)
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WishlistsProductCard;
