"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import { parsePhoneNumber, isValidPhoneNumber } from 'libphonenumber-js';
import PhoneInput from '@/components/PhoneInput';

const AccountRegistries = () => {
  const [registries, setRegistries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newRegistry, setNewRegistry] = useState({
    title: "",
    address: "",
    country: "",
    postal_code: "",
    city: "",
    creator: "",
    closing_date: "",
    description: "",
    type: "",
    is_public: true,
    is_active: true,
    welcome_message: "",
    phone: "",
  });
  const [customType, setCustomType] = useState("");
  const [phoneError, setPhoneError] = useState(null);
  const [isPhoneValid, setIsPhoneValid] = useState(true);

  // Phone validation function
  const validatePhoneNumber = (phoneNumber, countryCode = 'GR') => {
    if (!phoneNumber.trim()) {
      setPhoneError(null);
      setIsPhoneValid(true);
      return true;
    }

    try {
      // Try to parse the phone number with the country code
      const parsed = parsePhoneNumber(phoneNumber, countryCode);
      
      if (parsed && parsed.isValid()) {
        setPhoneError(null);
        setIsPhoneValid(true);
        return true;
      } else {
        setPhoneError("Please enter a valid phone number for the selected country");
        setIsPhoneValid(false);
        return false;
      }
    } catch (error) {
      // If parsing fails, check if it's a valid phone number without country context
      if (isValidPhoneNumber(phoneNumber)) {
        setPhoneError(null);
        setIsPhoneValid(true);
        return true;
      } else {
        setPhoneError("Please enter a valid phone number");
        setIsPhoneValid(false);
        return false;
      }
    }
  };

  const fetchRegistries = async () => {
    try {
      setLoading(true);
      const token = sessionStorage.getItem(
        process.env.NEXT_PUBLIC_SALEOR_API_URL + "+saleor_auth_module_refresh_token"
      );
      if (!token) return;

      const response = await fetch(`${process.env.NEXT_PUBLIC_REGISTRY_URL}/api/registries/`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error("Failed to fetch registries");

      const data = await response.json();
      setRegistries(data);
    } catch (error) {
      console.error("Error fetching registries:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRegistries();
  }, []);

  const handleShare = async (uuid) => {
    try {
      const url = `${window.location.origin}/my-registries/${uuid}`;
      await navigator.clipboard.writeText(url);
      toast.success("Registry URL copied to clipboard!");
    } catch (err) {
      console.error("Failed to copy:", err);
      toast.error("Could not copy URL");
    }
  };

  const handleDeleteRegistry = async (uuid) => {
    const confirmed = window.confirm("Are you sure you want to delete this registry?");
    if (!confirmed) return;

    try {
      const token = sessionStorage.getItem(
        process.env.NEXT_PUBLIC_SALEOR_API_URL + "+saleor_auth_module_refresh_token"
      );

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_REGISTRY_URL}/api/registries/${uuid}/`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) throw new Error("Failed to delete registry");

      toast.success("Registry deleted successfully");
      setRegistries((prev) => prev.filter((r) => r.uuid !== uuid));
    } catch (error) {
      console.error("Error deleting registry:", error);
      toast.error("Could not delete registry");
    }
  };

  const handleCreateRegistry = async (e) => {
    e.preventDefault();
    const token = sessionStorage.getItem(
      process.env.NEXT_PUBLIC_SALEOR_API_URL + "+saleor_auth_module_refresh_token"
    );
    const form = e.target;
    const formData = new FormData();
    // Append text fields
    formData.append("title", newRegistry.title);
    formData.append("is_public", newRegistry.is_public ? "true" : "false");
    formData.append("is_active", newRegistry.is_active ? "true" : "false");
    if (newRegistry.closing_date) {
      formData.append("closing_date", new Date(newRegistry.closing_date).toISOString());
    }
    formData.append("bulk_shipment", "true");
    formData.append("notes", "");
    formData.append("creator", newRegistry.creator || "");
    formData.append("description", newRegistry.description || "");
    formData.append("type", newRegistry.type === "custom" ? customType : newRegistry.type);
    formData.append("welcome_message", newRegistry.welcome_message || "");
    // Append image file
    const fileInput = form.querySelector('input[name="image"]');
    if (fileInput?.files[0]) {
      formData.append("image", fileInput.files[0]);
    }
    // Construct shipping_address fields using dot notation for DRF
    formData.append("shipping_address.address_line_1", newRegistry.address);
    formData.append("shipping_address.city", newRegistry.city);
    formData.append("shipping_address.postal_code", newRegistry.postal_code);
    formData.append("shipping_address.country", newRegistry.country);
    formData.append("shipping_address.phone", newRegistry.phone);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_REGISTRY_URL}/api/registries/`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });
      if (!response.ok) throw new Error("Failed to create registry");
      toast.success("Registry created");
      setShowCreateModal(false);
      setNewRegistry({ title: "", address: "", country: "", postal_code: "", city: "", creator: "", closing_date: "", description: "", type: "", is_public: true, is_active: true, welcome_message: "", phone: "" });
      setPhoneError(null);
      setIsPhoneValid(true);
      fetchRegistries();
    } catch (error) {
      toast.error("Could not create registry");
      console.error(error);
    }
  };

  return (
    <div className="space-y-10 sm:space-y-12">
      {showCreateModal && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
        <div className="bg-white  p-6 w-full max-w-md shadow-xl">
          <h3 className="text-lg  mb-4">Create New Registry</h3>

          <form
            onSubmit={handleCreateRegistry}
            className="space-y-4"
          >
            <input
              required
              placeholder="Registry Title"
              value={newRegistry.title}
              onChange={(e) => setNewRegistry({ ...newRegistry, title: e.target.value })}
              className="w-full border rounded px-3 py-2"
            />
            <textarea
              placeholder="Description"
              value={newRegistry.description}
              onChange={(e) => setNewRegistry({ ...newRegistry, description: e.target.value })}
              className="w-full border px-3 py-2"
              rows={4}
            />
            <div className="space-y-1">
              <label htmlFor="registry-type" className="block text-sm font-medium text-gray-700">
                Registry Type
              </label>
              <select
                required
                id="registry-type"
                value={newRegistry.type}
                onChange={(e) => {
                  setNewRegistry({ ...newRegistry, type: e.target.value });
                  if (e.target.value !== "custom") setCustomType("");
                }}
                className="w-full border rounded px-3 py-2"
              >
                <option value="" disabled>Select Registry Type</option>
                <option value="baptism">Baptism</option>
                <option value="baby shower">Baby Shower</option>
                <option value="wedding">Wedding</option>
                <option value="custom">Custom</option>
              </select>
            </div>
            {newRegistry.type === "custom" && (
              <input
                required
                placeholder="Enter custom registry type"
                value={customType}
                onChange={(e) => setCustomType(e.target.value)}
                className="w-full border rounded px-3 py-2"
              />
            )}
            <input
              type="text"
              id="creator"
              name="creator"
              placeholder="Your name"
              value={newRegistry.creator || ""}
              onChange={(e) => setNewRegistry({ ...newRegistry, creator: e.target.value })}
              className="w-full border rounded px-3 py-2"
            />
            <input
              placeholder="Address"
              value={newRegistry.address}
              onChange={(e) => setNewRegistry({ ...newRegistry, address: e.target.value })}
              className="w-full border rounded px-3 py-2"
            />
            <input
              placeholder="City"
              value={newRegistry.city}
              onChange={(e) => setNewRegistry({ ...newRegistry, city: e.target.value })}
              className="w-full border rounded px-3 py-2"
            />
            <input
              placeholder="Postal Code"
              value={newRegistry.postal_code}
              onChange={(e) => setNewRegistry({ ...newRegistry, postal_code: e.target.value })}
              className="w-full border rounded px-3 py-2"
            />
            <select
              required
              value={newRegistry.country}
              onChange={(e) => setNewRegistry({ ...newRegistry, country: e.target.value })}
              className="w-full border rounded px-3 py-2"
            >
              <option value="" disabled>Select Country</option>
              <option value="GR">Greece (GR)</option>
              <option value="CY">Cyprus (CY)</option>
            </select>
            <div>
              <PhoneInput
                value={newRegistry.phone}
                onChange={(value) => {
                  const newPhone = value || "";
                  setNewRegistry({ ...newRegistry, phone: newPhone });
                  // Validate phone on change
                  validatePhoneNumber(newPhone, newRegistry.country || 'GR');
                }}
                onBlur={() => {
                  // Validate phone when user leaves the field
                  validatePhoneNumber(newRegistry.phone, newRegistry.country || 'GR');
                }}
                placeholder="Phone number"
                error={!isPhoneValid}
                defaultCountry={newRegistry.country === 'CY' ? 'CY' : 'GR'}
              />
              {phoneError && (
                <p className="mt-1 text-sm text-red-600">{phoneError}</p>
              )}
            </div>
            <div className="space-y-1">
              <label htmlFor="closing-date" className="block text-sm font-medium text-gray-700">
                Closing Date
              </label>
              <input
                type="datetime-local"
                id="closing-date"
                name="closing_date"
                className="w-full border rounded px-3 py-2"
                onChange={(e) => {
                  setNewRegistry({ ...newRegistry, closing_date: e.target.value });
                }}
              />
            </div>
            <div className="space-y-1">
              <label htmlFor="registry-image" className="block text-sm font-medium text-gray-700">
                Registry Image
              </label>
              <input
                type="file"
                id="registry-image"
                name="image"
                accept="image/*"
                className="w-full border rounded px-3 py-2"
              />
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="public-checkbox"
                  checked={newRegistry.is_public}
                  onChange={(e) => setNewRegistry({ ...newRegistry, is_public: e.target.checked })}
                  className="form-checkbox h-4 w-4 text-black"
                />
                <label htmlFor="public-checkbox" className="text-sm font-medium text-gray-700">
                  Public
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="active-checkbox"
                  checked={newRegistry.is_active}
                  onChange={(e) => setNewRegistry({ ...newRegistry, is_active: e.target.checked })}
                  className="form-checkbox h-4 w-4 text-black"
                />
                <label htmlFor="active-checkbox" className="text-sm font-medium text-gray-700">
                  Active
                </label>
              </div>
            </div>
            <input
              placeholder="Welcome Message"
              value={newRegistry.welcome_message}
              onChange={(e) => setNewRegistry({ ...newRegistry, welcome_message: e.target.value })}
              className="w-full border rounded px-3 py-2"
            />
            <div className="flex justify-end space-x-3 mt-4">
              <button
                type="button"
                onClick={() => {
                  setShowCreateModal(false);
                  setPhoneError(null);
                  setIsPhoneValid(true);
                }}
                className="px-4 py-2 rounded bg-gray-200 text-gray-800"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!isPhoneValid}
                className="px-4 py-2 rounded bg-black text-white hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                Create
              </button>
            </div>
          </form>
        </div>
      </div>
    )}  

      {loading ? (
        <div className="max-w-[100rem] mx-auto px-4 py-8">
          <div className="flex flex-col items-center justify-center mb-8">
            <img src="/logo/LOGO-GRANTDAYS-1475.png" alt="GrantDays Logo" style={{ height: '48px', marginBottom: '1.5rem' }} />
            <div className="w-64 h-2 bg-gray-200 rounded-none overflow-hidden mb-2 relative">
              <div className="absolute left-0 top-0 h-full bg-[#063B67] rounded-none animate-progressBar" style={{ width: '40%' }}></div>
            </div>
          </div>
        </div>
      ) : registries.length === 0 ? (
        <div className="text-center">
          <p className="mb-4 text-sm text-gray-600">No registries found</p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
          >
            Create New Registry
          </button>
        </div>
        
      ) : (
        <div className="space-y-6">
          {registries.map((registry) => (
            <div
              key={registry.uuid}
              className="flex items-center justify-between border  p-4 shadow-sm bg-white space-x-4"
            >
              <div className="w-16 h-16 border rounded overflow-hidden bg-gray-100 flex items-center justify-center">
                {registry.image ? (
                  <img
                    src={registry.image}
                    alt={registry.title}
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <span className="text-xs text-gray-500">No Image</span>
                )}
              </div>

              <div className="flex flex-col flex-grow min-w-0">
                <Link href={`/my-registries/${registry.uuid}`}>
                  <h3 className="text-lg  truncate">{registry.title}</h3>
                </Link>
                <p className="text-sm text-gray-500">
                  {new Date(registry.created_at).toLocaleDateString("en-GB")}
                </p>
              </div>

              <div className="flex items-center space-x-4">
                {/* Edit */}
                <Link href={`/my-registries/${registry.uuid}`}>
                  <button
                    onClick={() =>
                      sessionStorage.setItem(
                        `registry-${registry.uuid}`,
                        JSON.stringify(registry)
                      )
                    }
                    className="text-gray-600 hover:text-black mt-2"
                    title="Edit"
                  >
                    ✏️
                  </button>
                </Link>

                {/* Share */}
                <button
                  className="text-gray-600 hover:text-black"
                  title="Share"
                  onClick={() => handleShare(registry.uuid)}
                >
                  🔗
                </button>

                {/* Delete */}
                <button
                  className="text-red-500 hover:text-red-700"
                  title="Delete"
                  onClick={() => handleDeleteRegistry(registry.uuid)}
                >
                  ❌
                </button>
              </div>
            </div>
          ))}
          <div
            onClick={() => setShowCreateModal(true)}
            className="cursor-pointer flex items-center justify-center border-2 border-dashed border-gray-300  p-6 bg-white hover:bg-gray-50 transition"
          >
            <span className="text-sm text-gray-600">➕ Create New Registry</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default AccountRegistries;
