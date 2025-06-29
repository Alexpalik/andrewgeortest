"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import GuestList from "@/components/GuestList";
import RegistryProducts from "@/components/RegistryProducts";
import RegistrySettings from "@/components/RegistrySettings";

const AccountRegistryPage = () => {
  const { uuid } = useParams();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("products");
  const [registry, setRegistry] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchRegistry = async () => {
    try {
      setLoading(true);
      const token = sessionStorage.getItem(
        process.env.NEXT_PUBLIC_SALEOR_API_URL + "+saleor_auth_module_refresh_token"
      );
      if (!token) return;

      const response = await fetch(`${process.env.NEXT_PUBLIC_REGISTRY_URL}/api/registries/${uuid}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error("Failed to fetch registry");

      const data = await response.json();
      setRegistry(data);
    } catch (error) {
      console.error("Error fetching registry:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (uuid) {
      fetchRegistry();
    }
  }, [uuid]);

  const renderContent = () => {
    if (activeTab === "products") {
      return <RegistryProducts />;
    }
    if (activeTab === "guests") {
      return <GuestList />;
    }
    if (activeTab === "settings") {
      return <RegistrySettings />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center">
          <img src="/logo/LOGO-GRANTDAYS-1475.png" alt="GrantDays Logo" style={{ height: '48px', marginBottom: '1.5rem' }} />
          <div className="w-64 h-2 bg-gray-200 rounded-none overflow-hidden mb-2 relative">
            <div className="absolute left-0 top-0 h-full bg-[#063B67] rounded-none animate-progressBar" style={{ width: '40%' }}></div>
          </div>
        </div>
      </div>
    );
  }

  if (!registry) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Registry not found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Back Button */}
      <div className="border-b border-gray-200 px-4 py-3">
        <button
          onClick={() => router.push("/account-registry")}
          className="text-sm text-gray-600 hover:text-black flex items-center"
        >
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Registries
        </button>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Registries</h1>
          <p className="text-gray-600">{registry.title}</p>
        </div>

        {/* Navigation Tabs */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab("products")}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === "products"
                  ? "border-gray-900 text-gray-900"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Products
            </button>
            <button
              onClick={() => setActiveTab("guests")}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === "guests"
                  ? "border-gray-900 text-gray-900"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Guests
            </button>
            <button
              onClick={() => setActiveTab("settings")}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === "settings"
                  ? "border-gray-900 text-gray-900"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Settings
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        <div className="mt-8">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default AccountRegistryPage;
