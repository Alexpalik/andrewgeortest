"use client";

import Label from "@/components/Label/Label";
import React, { FC } from "react";
import ButtonPrimary from "@/shared/Button/ButtonPrimary";
import ButtonSecondary from "@/shared/Button/ButtonSecondary";
import Input from "@/shared/Input/Input";
import Radio from "@/shared/Radio/Radio";
import Select from "@/shared/Select/Select";
import { checkoutShippingAddressUpdate,checkoutBillingAddressUpdate } from "../lib/checkoutHelpers";

interface Props {
  isActive: boolean;
  onOpenActive: () => void;
  onCloseActive: () => void;
  shippingAddress: {
    firstName: string;
    lastName: string;
    streetAddress1: string;
    streetAddress2: string;
    city: string;
    postalCode: string;
    country: string;
    countryArea: string;
  };
  setShippingAddress: React.Dispatch<React.SetStateAction<{
    firstName: string;
    lastName: string;
    streetAddress1: string;
    streetAddress2: string;
    city: string;
    postalCode: string;
    country: string;
    countryArea: string;
  }>>;
}

const ShippingAddress: FC<Props> = ({ 
  isActive, 
  onCloseActive, 
  onOpenActive, 
  shippingAddress, 
  setShippingAddress 
}) => {
  const updateAddresses = async () => {
    try {
      // Assume you have an API endpoint to update the addresses
      const response = await fetch("/api/update-address", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          shippingAddress,
          billingAddress: shippingAddress, // Assuming billing is same as shipping, modify if needed
        }),
      });
  
      if (!response.ok) {
        throw new Error("Failed to update addresses");
      }
  
      console.log("Addresses updated successfully");
    } catch (error) {
      console.error("Error updating addresses:", error);
    }
  };
  
  const handleSaveAndNext = async () => {
    try {
      const checkoutId = sessionStorage.getItem('checkout_id'); 
  
      await checkoutShippingAddressUpdate(checkoutId, shippingAddress);
  
      await checkoutBillingAddressUpdate(checkoutId, shippingAddress);
  
      console.log("Shipping and Billing addresses updated successfully");
  
      onCloseActive();
    } catch (error) {
      console.error("Error updating addresses:", error);
    }
  };
  
  
  const renderShippingAddress = () => {
    const isShippingAddressComplete =
    shippingAddress.firstName.trim() !== "" &&
    shippingAddress.lastName.trim() !== "" &&
    shippingAddress.streetAddress1.trim() !== "" &&
    shippingAddress.city.trim() !== "" &&
    shippingAddress.postalCode.trim() !== "" &&
    shippingAddress.country.trim() !== "";
    return (
      <div className="border border-slate-200 dark:border-slate-700 rounded-none ">
        <div className="p-6 flex flex-col sm:flex-row items-start">
          <span className="hidden sm:block">
            <svg
              className="w-6 h-6 text-slate-700 dark:text-slate-400 mt-0.5"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12.1401 15.0701V13.11C12.1401 10.59 14.1801 8.54004 16.7101 8.54004H18.6701"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M5.62012 8.55005H7.58014C10.1001 8.55005 12.1501 10.59 12.1501 13.12V13.7701V17.25"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M7.14008 6.75L5.34009 8.55L7.14008 10.35"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M16.8601 6.75L18.6601 8.55L16.8601 10.35"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M9 22H15C20 22 22 20 22 15V9C22 4 20 2 15 2H9C4 2 2 4 2 9V15C2 20 4 22 9 22Z"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>

          <div className="sm:ml-8">
            <h3 className="text-slate-700 dark:text-slate-300 flex items-center">
              <span className="uppercase">SHIPPING ADDRESS</span>
              {isShippingAddressComplete && (
                <svg
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="2.5"
                  stroke="currentColor"
                  className="w-5 h-5 ml-3 text-green-500"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4.5 12.75l6 6 9-13.5"
                  />
                </svg>
              )}
            </h3>
            {/* <div className=" mt-1 text-sm">
              <span className="">
                {`St. Paul's Road, Norris, SD 57560, Dakota, USA`}
              </span>
            </div> */}
          </div>
          <button
            className="py-2 px-4 bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 mt-5 sm:mt-0 sm:ml-auto text-sm font-medium "
            onClick={onOpenActive}
          >
            Change
          </button>
        </div>
        <div
          className={`border-t border-slate-200 dark:border-slate-700 px-6 py-7 space-y-4 sm:space-y-6 ${
            isActive ? "block" : "hidden"
          }`}
        >
          {/* ============ */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-3">
              <div>
                <Label className="text-sm">First name</Label>
                <Input
                  className="mt-1.5"
                  value={shippingAddress.firstName}
                  onChange={(e) =>
                    setShippingAddress((prev) => ({
                      ...prev,
                      firstName: e.target.value,
                    }))
                  }
                />
              </div>
              <div>
                <Label className="text-sm">Last name</Label>
                <Input
                  className="mt-1.5"
                  value={shippingAddress.lastName}
                  onChange={(e) =>
                    setShippingAddress((prev) => ({
                      ...prev,
                      lastName: e.target.value,
                    }))
                  }
                />
              </div>
            </div>

            <div className="sm:flex space-y-4 sm:space-y-0 sm:space-x-3">
              <div className="flex-1">
                <Label className="text-sm">Address</Label>
                <Input
                  className="mt-1.5"
                  value={shippingAddress.streetAddress1}
                  onChange={(e) =>
                    setShippingAddress((prev) => ({
                      ...prev,
                      streetAddress1: e.target.value,
                    }))
                  }
                  type={"text"}
                />
              </div>
              <div className="sm:w-1/3">
                <Label className="text-sm">Apt, Suite</Label>
                <Input
                  className="mt-1.5"
                  value={shippingAddress.streetAddress2}
                  onChange={(e) =>
                    setShippingAddress((prev) => ({
                      ...prev,
                      streetAddress2: e.target.value,
                    }))
                  }
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-3">
              <div>
                <Label className="text-sm">City</Label>
                <Input
                  className="mt-1.5"
                  value={shippingAddress.city}
                  onChange={(e) =>
                    setShippingAddress((prev) => ({
                      ...prev,
                      city: e.target.value,
                    }))
                  }
                />
              </div>
              <div>
                <Label className="text-sm">Country Area (State/Province)</Label>
                <Input
                  className="mt-1.5"
                  value={shippingAddress.countryArea}
                  onChange={(e) =>
                    setShippingAddress((prev) => ({
                      ...prev,
                      countryArea: e.target.value,
                    }))
                  }
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-3">
              <div>
                <Label className="text-sm">Postal code</Label>
                <Input
                  className="mt-1.5"
                  value={shippingAddress.postalCode}
                  onChange={(e) =>
                    setShippingAddress((prev) => ({
                      ...prev,
                      postalCode: e.target.value,
                    }))
                  }
                />
              </div>
            </div>
          {/* ============ */}
          <div>
            <Label className="text-sm">Address type</Label>
            <div className="mt-1.5 grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
              <Radio
                label={`<span class="text-sm font-medium">Home <span class="font-light">(All Day Delivery)</span></span>`}
                id="Address-type-home"
                name="Address-type"
                defaultChecked
              />
              <Radio
                label={`<span class="text-sm font-medium">Office <span class="font-light">(Delivery <span class="font-medium">9 AM - 5 PM</span>)</span> </span>`}
                id="Address-type-office"
                name="Address-type"
              />
            </div>
          </div>

          {/* ============ */}
          <div className="flex flex-col sm:flex-row pt-6">
            <ButtonPrimary
              className="sm:!px-7 shadow-none"
              onClick={handleSaveAndNext}
            >
              Save and next to Payment
            </ButtonPrimary>
            <ButtonSecondary
              className="mt-3 sm:mt-0 sm:ml-3"
              onClick={onCloseActive}
            >
              Cancel
            </ButtonSecondary>
          </div>
        </div>
      </div>
    );
  };
  return renderShippingAddress();
};

export default ShippingAddress;
