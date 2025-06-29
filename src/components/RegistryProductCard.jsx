"use client";

import React, { useState, useEffect } from "react";
import Prices from "./Prices";
import { StarIcon, TrashIcon } from "@heroicons/react/24/solid";
import Link from "next/link";
import NcImage from "@/shared/NcImage/NcImage";
import ProductStatus from "./ProductStatus";
import DOMPurify from "dompurify";
import { fetchProductInfo } from "@/app/lib/fetchProductById";
import toast from "react-hot-toast";
import NcModal from "@/shared/NcModal/NcModal";
import ButtonPrimary from "@/shared/Button/ButtonPrimary";
import ButtonSecondary from "@/shared/Button/ButtonSecondary";

const RegistryProductCard = ({ data, className = "", registryUuid, onDeleted }) => {
  const variant_id = typeof data === "string" ? data : data.variant_id;
  const [product, setProduct] = useState(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isDonationModalOpen, setIsDonationModalOpen] = useState(false);
  const [donationAmount, setDonationAmount] = useState(10);

  const isVirtual = data.is_virtual;
  const customTitle = data.virtual_product_title;
  const customDescription = data.virtual_product_description;
  const customPrice = data.virtual_product_price;
  const customCurrency = data.virtual_product_price_currency;

  const isGroupGifting = data.is_group_gifting;
  
  // Debug logging to see what data is available
  console.log('RegistryProductCard data:', data);
  console.log('remaining_group_gifting_balance:', data.remaining_group_gifting_balance);
  console.log('is_group_gifting:', data.is_group_gifting);
  
  const maxDonation = data.remaining_group_gifting_balance && data.remaining_group_gifting_balance > 0
    ? parseFloat(data.remaining_group_gifting_balance)
    : data.is_virtual && data.virtual_product_price
      ? parseFloat(data.virtual_product_price)
      : (product && product.pricing && product.pricing.priceRange && product.pricing.priceRange.start && product.pricing.priceRange.start.gross
          ? product.pricing.priceRange.start.gross.amount
          : 100); // Default fallback
          
  console.log('Calculated maxDonation:', maxDonation);

  useEffect(() => {
    const loadProduct = async () => {
      if (!variant_id) return;
      const fetchedProduct = await fetchProductInfo(variant_id);
      setProduct(fetchedProduct);
    };
    loadProduct();
  }, [variant_id]);

  if (!product) return <div></div>;

  const {
    name,
    pricing,
    description,
    status,
    media,
    rating,
    numberOfReviews,
    slug,
  } = product;

  const handleDelete = async () => {
    try {
      const token = sessionStorage.getItem(
        process.env.NEXT_PUBLIC_SALEOR_API_URL + "+saleor_auth_module_refresh_token"
      );

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_REGISTRY_URL}/api/registries/${registryUuid}/products/${variant_id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) throw new Error("Failed to remove product");

      toast.success("Product removed from registry.");
      onDeleted?.(variant_id);
    } catch (error) {
      console.error("Error removing product:", error);
      toast.error("Could not remove product.");
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
    <div
      className={`nc-ProductCard flex items-center border p-4 hover:bg-gray-50 transition ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image */}
      <div className="w-32 h-32 flex-shrink-0 overflow-hidden border bg-white">
        <Link href={`/product/${slug}`}>
          <NcImage
            src={media?.[0]?.url || "/placeholder-image.jpg"}
            width={128}
            height={128}
            className="object-cover w-full h-full"
            alt="product"
          />
        </Link>
        <ProductStatus status={status} />
      </div>

      {/* Info */}
      <div className="flex flex-col justify-between flex-grow pl-6">
        <div onClick={() => (window.location.href = `/product/${slug}`)} style={{ cursor: "pointer" }}>
          <h2 className="text-lg ">{isVirtual ? customTitle : name}</h2>
          <div className="text-sm text-gray-500 mt-1">
            {isVirtual
              ? customDescription
              : renderDescription(description)}
          </div>
        </div>

        <div className="flex items-center justify-between mt-4">
          {isVirtual ? (
            <span className="text-lg font-medium text-slate-700 dark:text-slate-300">
              {customPrice} {customCurrency}
            </span>
          ) : (
            <Prices price={pricing?.priceRange?.start.gross.amount} />
          )}
          <div className="flex items-center">
            <StarIcon className="w-5 h-5 text-amber-400" />
            <span className="text-sm text-gray-500 ml-1">
              ({numberOfReviews || 0} reviews)
            </span>
          </div>
        </div>

        {/* Remove and Donate Buttons */}
        <div className="flex justify-end mt-4 gap-2">
          {data.is_purchased ? (
            <div className="flex flex-col items-end">
              <button
                disabled
                className="px-4 py-2 text-xs bg-green-100 text-green-700 cursor-not-allowed border border-green-200"
              >
                Already Purchased
              </button>
              <span className="text-xs text-green-600 mt-1">
                This item has been purchased!
              </span>
            </div>
          ) : isGroupGifting ? (
            data.remaining_group_gifting_balance && data.remaining_group_gifting_balance > 0 ? (
              <ButtonPrimary
                className="px-4 py-2 text-xs"
                onClick={() => setIsDonationModalOpen(true)}
              >
                Κάνε Δωρεά
              </ButtonPrimary>
            ) : (
              <div className="flex flex-col items-end">
                <button
                  disabled
                  className="px-4 py-2 text-xs bg-gray-300 text-gray-500 cursor-not-allowed"
                >
                  Fully Funded
                </button>
                <span className="text-xs text-green-600 mt-1">
                  This group gift has been fully funded!
                </span>
              </div>
            )
          ) : (
            <button
              onClick={handleDelete}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white text-xs hover:bg-red-700 transition"
            >
              <TrashIcon className="w-4 h-4" />
              Remove from registry
            </button>
          )}
        </div>
        {/* Donation Modal */}
        {isDonationModalOpen && (
          <NcModal
            isOpenProp={isDonationModalOpen}
            onCloseModal={() => setIsDonationModalOpen(false)}
            modalTitle={"Κάνε Δωρεά"}
            contentExtraClass="max-w-md"
            renderContent={() => (
              <div className="flex flex-col items-center gap-6">
                <div className="w-full">
                  <label htmlFor="donation-slider" className="block text-sm font-medium mb-2 text-center">Επίλεξε ποσό δωρεάς</label>
                  <input
                    id="donation-slider"
                    type="range"
                    min={0.01}
                    max={Number(maxDonation).toFixed(2)}
                    step={0.01}
                    value={donationAmount}
                    onChange={e => setDonationAmount(Number(e.target.value))}
                    className="w-full accent-blue-600"
                  />
                  <div className="text-center mt-2 text-lg ">{Number(donationAmount).toFixed(2)} €</div>
                </div>
                <div className="flex gap-4 justify-center">
                  <ButtonPrimary onClick={async () => {
                    console.log('RegistryProductCard donation button clicked!');
                    console.log('Donation amount:', donationAmount);
                    console.log('Registry UUID:', registryUuid);
                    console.log('Variant ID:', variant_id);
                    
                    try {
                      const token = sessionStorage.getItem(
                        process.env.NEXT_PUBLIC_SALEOR_API_URL + "+saleor_auth_module_refresh_token"
                      );
                      
                      console.log('Token found:', !!token);
                      
                      if (!token) {
                        toast.error('Please login to make a donation');
                        return;
                      }

                      const body = {
                        registry_uuid: registryUuid,
                        variant_id: variant_id,
                        quantity: 1,
                        gift_contribution_amount: donationAmount
                      };

                      console.log('Sending donation request with body:', body);

                      const response = await fetch(`${process.env.NEXT_PUBLIC_REGISTRY_URL}/api/cart-add/`, {
                        method: 'POST',
                        headers: {
                          'Content-Type': 'application/json',
                          'Authorization': `Bearer ${token}`
                        },
                        body: JSON.stringify(body)
                      });

                      console.log('Donation response status:', response.status);

                      if (!response.ok) {
                        const errorText = await response.text();
                        console.error('Donation failed with response:', errorText);
                        throw new Error('Failed to add donation to cart');
                      }

                      const result = await response.json();
                      console.log('Donation success:', result);
                      
                      setIsDonationModalOpen(false);
                      toast.success(`Δωρεά ${donationAmount}€ καταχωρήθηκε!`);
                      
                      // Dispatch cart update events
                      window.dispatchEvent(new CustomEvent('registryCartUpdated', {
                        detail: { 
                          registry_uuid: registryUuid, 
                          variantId: variant_id,
                          checkoutId: result.checkout_id 
                        }
                      }));
                    } catch (error) {
                      console.error('Error adding donation:', error);
                      toast.error('Failed to add donation. Please try again.');
                    }
                  }}>
                    Κάνε Δωρεά
                  </ButtonPrimary>
                  <ButtonSecondary onClick={() => setIsDonationModalOpen(false)}>
                    Ακύρωση
                  </ButtonSecondary>
                </div>
              </div>
            )}
          />
        )}
      </div>
    </div>
  );
};

export default RegistryProductCard;
