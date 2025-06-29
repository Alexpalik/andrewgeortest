"use client";

import Label from "@/components/Label/Label";
import React, { FC, useEffect, useState } from "react";
import ButtonPrimary from "@/shared/Button/ButtonPrimary";
import ButtonSecondary from "@/shared/Button/ButtonSecondary";
import Input from "@/shared/Input/Input";
import Select from "@/shared/Select/Select";
import Textarea from "@/shared/Textarea/Textarea";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useSaleorAuthContext } from "@saleor/auth-sdk/react";
import { gql, useMutation, useQuery } from "@apollo/client";
import authSync from "@/utils/authSync";

// GraphQL Queries and Mutations
const GET_USER_PROFILE = gql`
  query GetUserProfile {
    me {
      id
      email
      firstName
      lastName
      defaultShippingAddress {
        id
        firstName
        lastName
        streetAddress1
        streetAddress2
        city
        postalCode
        country {
          code
          country
        }
        phone
      }
      defaultBillingAddress {
        id
        firstName
        lastName
        streetAddress1
        streetAddress2
        city
        postalCode
        country {
          code
          country
        }
        phone
      }
      addresses {
        id
        firstName
        lastName
        streetAddress1
        streetAddress2
        city
        postalCode
        country {
          code
          country
        }
        phone
      }
    }
  }
`;

const UPDATE_ACCOUNT = gql`
  mutation AccountUpdate($input: AccountInput!) {
    accountUpdate(input: $input) {
      user {
        id
        firstName
        lastName
      }
      errors {
        field
        message
      }
    }
  }
`;

const CHANGE_PASSWORD = gql`
  mutation PasswordChange($oldPassword: String!, $newPassword: String!) {
    passwordChange(oldPassword: $oldPassword, newPassword: $newPassword) {
      user {
        id
      }
      errors {
        field
        message
      }
    }
  }
`;

const CREATE_ADDRESS = gql`
  mutation AccountAddressCreate($input: AddressInput!, $type: AddressTypeEnum) {
    accountAddressCreate(input: $input, type: $type) {
      address {
        id
        firstName
        lastName
        streetAddress1
        streetAddress2
        city
        postalCode
        country {
          code
          country
        }
        phone
      }
      errors {
        field
        message
      }
    }
  }
`;

const UPDATE_ADDRESS = gql`
  mutation AccountAddressUpdate($id: ID!, $input: AddressInput!) {
    accountAddressUpdate(id: $id, input: $input) {
      address {
        id
        firstName
        lastName
        streetAddress1
        streetAddress2
        city
        postalCode
        country {
          code
          country
        }
        phone
      }
      errors {
        field
        message
      }
    }
  }
`;

const SET_DEFAULT_ADDRESS = gql`
  mutation AccountSetDefaultAddress($id: ID!, $type: AddressTypeEnum!) {
    accountSetDefaultAddress(id: $id, type: $type) {
      user {
        id
        defaultShippingAddress {
          id
        }
        defaultBillingAddress {
          id
        }
      }
      errors {
        field
        message
      }
    }
  }
`;

interface Address {
  id?: string;
  firstName?: string;
  lastName?: string;
  streetAddress1?: string;
  streetAddress2?: string;
  city?: string;
  postalCode?: string;
  country?: {
    code: string;
    country: string;
  };
  phone?: string;
}

interface UserData {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  defaultShippingAddress?: Address;
  defaultBillingAddress?: Address;
  addresses?: Address[];
}

const AccountPage = () => {
  const router = useRouter();
  const { signOut } = useSaleorAuthContext();
  const [activeTab, setActiveTab] = useState("personal");
  const [saving, setSaving] = useState(false);
  
  // Form states
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    about: ""
  });
  
  const [shippingAddress, setShippingAddress] = useState<Address>({
    firstName: "",
    lastName: "",
    streetAddress1: "",
    streetAddress2: "",
    city: "",
    postalCode: "",
    country: { code: "GR", country: "Greece" },
    phone: ""
  });
  
  const [billingAddress, setBillingAddress] = useState<Address>({
    firstName: "",
    lastName: "",
    streetAddress1: "",
    streetAddress2: "",
    city: "",
    postalCode: "",
    country: { code: "GR", country: "Greece" },
    phone: ""
  });
  
  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  const [updatingPassword, setUpdatingPassword] = useState(false);

  // GraphQL hooks
  const { data, loading, error, refetch } = useQuery(GET_USER_PROFILE, {
    onCompleted: (data) => {
      if (data?.me) {
        const user = data.me;
        
        // Populate personal info
        setFormData({
          firstName: user.firstName || "",
          lastName: user.lastName || "",
          email: user.email || "",
          about: ""
        });
        
        // Populate shipping address
        if (user.defaultShippingAddress) {
          setShippingAddress({
            id: user.defaultShippingAddress.id,
            firstName: user.defaultShippingAddress.firstName || "",
            lastName: user.defaultShippingAddress.lastName || "",
            streetAddress1: user.defaultShippingAddress.streetAddress1 || "",
            streetAddress2: user.defaultShippingAddress.streetAddress2 || "",
            city: user.defaultShippingAddress.city || "",
            postalCode: user.defaultShippingAddress.postalCode || "",
            country: user.defaultShippingAddress.country || { code: "GR", country: "Greece" },
            phone: user.defaultShippingAddress.phone || ""
          });
        }
        
        // Populate billing address
        if (user.defaultBillingAddress) {
          setBillingAddress({
            id: user.defaultBillingAddress.id,
            firstName: user.defaultBillingAddress.firstName || "",
            lastName: user.defaultBillingAddress.lastName || "",
            streetAddress1: user.defaultBillingAddress.streetAddress1 || "",
            streetAddress2: user.defaultBillingAddress.streetAddress2 || "",
            city: user.defaultBillingAddress.city || "",
            postalCode: user.defaultBillingAddress.postalCode || "",
            country: user.defaultBillingAddress.country || { code: "GR", country: "Greece" },
            phone: user.defaultBillingAddress.phone || ""
          });
        }
      }
    },
    onError: (error) => {
      console.error("Error fetching user data:", error);
      if (error.graphQLErrors?.some(err => err.extensions?.code === 'InvalidTokenError')) {
        router.push("/login");
      } else {
        toast.error("Failed to load user data");
      }
    }
  });

  const [updateAccount] = useMutation(UPDATE_ACCOUNT, {
    onCompleted: (data) => {
      if (data?.accountUpdate?.user) {
        toast.success("Personal information updated successfully!");
        refetch();
      } else if (data?.accountUpdate?.errors?.length > 0) {
        const errorMessages = data.accountUpdate.errors.map((err: any) => err.message).join(", ");
        toast.error(`Update failed: ${errorMessages}`);
      }
    },
    onError: (error) => {
      console.error("Error updating account:", error);
      toast.error("Error updating account");
    }
  });

  const [createAddress] = useMutation(CREATE_ADDRESS, {
    onCompleted: (data) => {
      if (data?.accountAddressCreate?.address) {
        toast.success("Address created successfully!");
        refetch();
      } else if (data?.accountAddressCreate?.errors?.length > 0) {
        const errorMessages = data.accountAddressCreate.errors.map((err: any) => err.message).join(", ");
        toast.error(`Address creation failed: ${errorMessages}`);
      }
    },
    onError: (error) => {
      console.error("Error creating address:", error);
      toast.error("Error creating address");
    }
  });

  const [updateAddress] = useMutation(UPDATE_ADDRESS, {
    onCompleted: (data) => {
      if (data?.accountAddressUpdate?.address) {
        toast.success("Address updated successfully!");
        refetch();
      } else if (data?.accountAddressUpdate?.errors?.length > 0) {
        const errorMessages = data.accountAddressUpdate.errors.map((err: any) => err.message).join(", ");
        toast.error(`Address update failed: ${errorMessages}`);
      }
    },
    onError: (error) => {
      console.error("Error updating address:", error);
      toast.error("Error updating address");
    }
  });

  const [setDefaultAddress] = useMutation(SET_DEFAULT_ADDRESS, {
    onCompleted: (data) => {
      if (data?.accountSetDefaultAddress?.user) {
        toast.success("Default address updated successfully!");
        refetch();
      } else if (data?.accountSetDefaultAddress?.errors?.length > 0) {
        const errorMessages = data.accountSetDefaultAddress.errors.map((err: any) => err.message).join(", ");
        toast.error(`Setting default address failed: ${errorMessages}`);
      }
    },
    onError: (error) => {
      console.error("Error setting default address:", error);
      toast.error("Error setting default address");
    }
  });

  const [changePassword] = useMutation(CHANGE_PASSWORD, {
    onCompleted: (data) => {
      if (data?.passwordChange?.user) {
        toast.success("Password updated successfully!");
        setPasswordData({
          oldPassword: "",
          newPassword: "",
          confirmPassword: ""
        });
      } else if (data?.passwordChange?.errors?.length > 0) {
        const errorMessages = data.passwordChange.errors.map((err: any) => err.message).join(", ");
        toast.error(`Password update failed: ${errorMessages}`);
      }
    },
    onError: (error) => {
      console.error("Error updating password:", error);
      toast.error("Error updating password");
    }
  });

  // Redirect if not authenticated
  useEffect(() => {
    if (!loading && !data?.me) {
      router.push("/login");
    }
  }, [loading, data?.me, router]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleShippingAddressChange = (field: string, value: string) => {
    setShippingAddress(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleBillingAddressChange = (field: string, value: string) => {
    setBillingAddress(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePasswordChange = (field: string, value: string) => {
    setPasswordData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePersonalInfoSave = async () => {
    setSaving(true);
    try {
      await updateAccount({
        variables: {
          input: {
            firstName: formData.firstName,
            lastName: formData.lastName
          }
        }
      });
    } finally {
      setSaving(false);
    }
  };

  const handleAddressSave = async (addressType: "shipping" | "billing") => {
    setSaving(true);
    try {
      const addressData = addressType === "shipping" ? shippingAddress : billingAddress;
      const addressInput = {
        firstName: addressData.firstName,
        lastName: addressData.lastName,
        streetAddress1: addressData.streetAddress1,
        streetAddress2: addressData.streetAddress2 || "",
        city: addressData.city,
        postalCode: addressData.postalCode,
        country: addressData.country?.code || "GR",
        phone: addressData.phone || ""
      };

      if (addressData.id) {
        // Update existing address
        await updateAddress({
          variables: {
            id: addressData.id,
            input: addressInput
          }
        });
      } else {
        // Create new address and set as default
        const result = await createAddress({
          variables: {
            input: addressInput,
            type: addressType.toUpperCase()
          }
        });
        
        if (result.data?.accountAddressCreate?.address?.id) {
          await setDefaultAddress({
            variables: {
              id: result.data.accountAddressCreate.address.id,
              type: addressType.toUpperCase()
            }
          });
        }
      }
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordUpdate = async () => {
    if (!passwordData.oldPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      toast.error("Please fill in all password fields");
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }

    if (passwordData.newPassword.length < 8) {
      toast.error("New password must be at least 8 characters long");
      return;
    }

    setUpdatingPassword(true);
    try {
      await changePassword({
        variables: {
          oldPassword: passwordData.oldPassword,
          newPassword: passwordData.newPassword
        }
      });
    } finally {
      setUpdatingPassword(false);
    }
  };

  const handleLogout = async () => {
    try {
      // Sign out from Saleor Auth SDK
      await signOut();
      
      // Clear tokens from authSync (which clears both localStorage and sessionStorage)
      authSync.removeToken();
      
      // Show success message
      toast.success("Logged out successfully");
      
      // Redirect to home page
      router.push("/");
    } catch (error) {
      console.error("Error during logout:", error);
      toast.error("Error logging out");
    }
  };

  const countries = [
    { code: "GR", name: "Greece" },
    { code: "CY", name: "Cyprus" },
    { code: "US", name: "United States" },
    { code: "GB", name: "United Kingdom" },
    { code: "DE", name: "Germany" },
    { code: "FR", name: "France" },
    { code: "IT", name: "Italy" },
    { code: "ES", name: "Spain" }
  ];

  if (loading) {
    return (
      <div className="nc-AccountPage">
        <div className="space-y-10 sm:space-y-12">
          <h2 className="text-2xl sm:text-3xl">Account Information</h2>
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          </div>
        </div>
      </div>
    );
  }

  const renderPersonalInfo = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label>First Name</Label>
          <Input 
            className="mt-1.5" 
            value={formData.firstName}
            onChange={(e) => handleInputChange("firstName", e.target.value)}
            placeholder="Enter your first name"
          />
        </div>

        <div>
          <Label>Last Name</Label>
          <Input 
            className="mt-1.5" 
            value={formData.lastName}
            onChange={(e) => handleInputChange("lastName", e.target.value)}
            placeholder="Enter your last name"
          />
        </div>
      </div>

      <div>
        <Label>Email</Label>
        <div className="mt-1.5 flex">
          <span className="inline-flex items-center px-2.5 rounded-none-2xl border border-r-0 border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400 text-sm">
            <i className="text-2xl las la-envelope"></i>
          </span>
          <Input
            className="!rounded-none-none"
            value={formData.email}
            placeholder="example@email.com"
            disabled
            title="Email cannot be changed"
          />
        </div>
      </div>

      {/* Password Change Section */}
      <div className="border-t pt-8 mt-8">
        <h4 className="text-lg font-medium text-gray-900 mb-6">Change Password</h4>
        
        <div className="space-y-6">
          <div>
            <Label>Current Password</Label>
            <div className="mt-1.5 flex">
              <span className="inline-flex items-center px-2.5 rounded-none-2xl border border-r-0 border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400 text-sm">
                <i className="text-2xl las la-lock"></i>
              </span>
              <Input
                className="!rounded-none-none"
                type="password"
                value={passwordData.oldPassword}
                onChange={(e) => handlePasswordChange("oldPassword", e.target.value)}
                placeholder="Enter current password"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label>New Password</Label>
              <div className="mt-1.5 flex">
                <span className="inline-flex items-center px-2.5 rounded-none-2xl border border-r-0 border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400 text-sm">
                  <i className="text-2xl las la-key"></i>
                </span>
                <Input
                  className="!rounded-none-none"
                  type="password"
                  value={passwordData.newPassword}
                  onChange={(e) => handlePasswordChange("newPassword", e.target.value)}
                  placeholder="Enter new password"
                />
              </div>
            </div>

            <div>
              <Label>Confirm New Password</Label>
              <div className="mt-1.5 flex">
                <span className="inline-flex items-center px-2.5 rounded-none-2xl border border-r-0 border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400 text-sm">
                  <i className="text-2xl las la-check-circle"></i>
                </span>
                <Input
                  className="!rounded-none-none"
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={(e) => handlePasswordChange("confirmPassword", e.target.value)}
                  placeholder="Confirm new password"
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <ButtonPrimary 
              onClick={handlePersonalInfoSave}
              disabled={saving}
            >
              {saving ? "Updating..." : "Update Personal Info"}
            </ButtonPrimary>
            
            <ButtonPrimary 
              onClick={handlePasswordUpdate}
              disabled={updatingPassword}
              className="bg-red-600 hover:bg-red-700 focus:ring-red-500"
            >
              {updatingPassword ? "Updating Password..." : "Update Password"}
            </ButtonPrimary>
          </div>

          <div className="text-sm text-gray-600 bg-gray-50 p-4 rounded-none">
            <p className="font-medium mb-2">Password Requirements:</p>
            <ul className="space-y-1 text-xs">
              <li>• At least 8 characters long</li>
              <li>• Must be different from your current password</li>
              <li>• Should contain a mix of letters, numbers, and symbols for better security</li>
            </ul>
          </div>
        </div>
      </div>


    </div>
  );

  const renderAddressForm = (addressType: "shipping" | "billing") => {
    const address = addressType === "shipping" ? shippingAddress : billingAddress;
    const handleChange = addressType === "shipping" ? handleShippingAddressChange : handleBillingAddressChange;
    
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label>First Name</Label>
            <Input 
              className="mt-1.5" 
              value={address.firstName || ""}
              onChange={(e) => handleChange("firstName", e.target.value)}
              placeholder="Enter first name"
            />
          </div>

          <div>
            <Label>Last Name</Label>
            <Input 
              className="mt-1.5" 
              value={address.lastName || ""}
              onChange={(e) => handleChange("lastName", e.target.value)}
              placeholder="Enter last name"
            />
          </div>
        </div>

        <div>
          <Label>Street Address</Label>
          <Input 
            className="mt-1.5" 
            value={address.streetAddress1 || ""}
            onChange={(e) => handleChange("streetAddress1", e.target.value)}
            placeholder="Enter street address"
          />
        </div>

        <div>
          <Label>Apartment, suite, etc. (optional)</Label>
          <Input 
            className="mt-1.5" 
            value={address.streetAddress2 || ""}
            onChange={(e) => handleChange("streetAddress2", e.target.value)}
            placeholder="Apartment, suite, etc."
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <Label>City</Label>
            <Input 
              className="mt-1.5" 
              value={address.city || ""}
              onChange={(e) => handleChange("city", e.target.value)}
              placeholder="Enter city"
            />
          </div>

          <div>
            <Label>Postal Code</Label>
            <Input 
              className="mt-1.5" 
              value={address.postalCode || ""}
              onChange={(e) => handleChange("postalCode", e.target.value)}
              placeholder="Enter postal code"
            />
          </div>

          <div>
            <Label>Country</Label>
            <Select
              className="mt-1.5"
              value={address.country?.code || "GR"}
              onChange={(e) => {
                const selectedCountry = countries.find(c => c.code === e.target.value);
                if (selectedCountry) {
                  const updatedAddress = addressType === "shipping" ? shippingAddress : billingAddress;
                  const setAddress = addressType === "shipping" ? setShippingAddress : setBillingAddress;
                  setAddress({
                    ...updatedAddress,
                    country: { code: selectedCountry.code, country: selectedCountry.name }
                  });
                }
              }}
            >
              {countries.map(country => (
                <option key={country.code} value={country.code}>
                  {country.name}
                </option>
              ))}
            </Select>
          </div>
        </div>

        <div>
          <Label>Phone Number</Label>
          <div className="mt-1.5 flex">
            <span className="inline-flex items-center px-2.5 rounded-none-2xl border border-r-0 border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400 text-sm">
              <i className="text-2xl las la-phone"></i>
            </span>
            <Input
              className="!rounded-none-none"
              value={address.phone || ""}
              onChange={(e) => handleChange("phone", e.target.value)}
              placeholder="Enter phone number"
            />
          </div>
        </div>

        <div className="pt-4">
          <ButtonPrimary 
            onClick={() => handleAddressSave(addressType)}
            disabled={saving}
          >
            {saving ? "Saving..." : `Save ${addressType === "shipping" ? "Shipping" : "Billing"} Address`}
          </ButtonPrimary>
        </div>
      </div>
    );
  };

  return (
    <div className="nc-AccountPage">
      <div className="space-y-10 sm:space-y-12">
        <h2 className="text-2xl sm:text-3xl">Account Information</h2>
        
        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab("personal")}
              className={`whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === "personal"
                  ? "border-primary-500 text-primary-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Personal Information
            </button>
            <button
              onClick={() => setActiveTab("shipping")}
              className={`whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === "shipping"
                  ? "border-primary-500 text-primary-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Shipping Address
            </button>
            <button
              onClick={() => setActiveTab("billing")}
              className={`whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === "billing"
                  ? "border-primary-500 text-primary-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Billing Address
            </button>
            <button
              onClick={handleLogout}
              className="whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm border-transparent text-red-600 hover:text-red-800 hover:border-red-300"
            >
              Log Out
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        <div className="mt-8">
          {activeTab === "personal" && renderPersonalInfo()}
          {activeTab === "shipping" && renderAddressForm("shipping")}
          {activeTab === "billing" && renderAddressForm("billing")}
        </div>
      </div>
    </div>
  );
};

export default AccountPage;
