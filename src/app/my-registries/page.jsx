"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { MyRegistriesListSkeleton } from "@/components/LoadingSkeleton";

const MyRegistriesPage = () => {
  const router = useRouter();
  const [registries, setRegistries] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRegistries = async () => {
    try {
      setLoading(true);
      const token = sessionStorage.getItem(
        process.env.NEXT_PUBLIC_SALEOR_API_URL + "+saleor_auth_module_refresh_token"
      );
      if (!token) {
        router.push("/login");
        return;
      }

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

  if (loading) {
    return <MyRegistriesListSkeleton />;
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Main Content */}
      <div className="max-w-[100rem] mx-auto px-4 py-8">
        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Registries</h1>
          <p className="text-gray-600">Manage your gift registries and settings</p>
        </div>

        {/* Registries Grid */}
        {registries.length === 0 ? (
          <div className="text-center py-12">
            <div className="mx-auto h-12 w-12 text-gray-400 mb-4">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No registries yet</h3>
            <p className="text-gray-600 mb-6">Create your first registry to get started</p>
            <button className="bg-blue-600 text-white px-6 py-3 rounded-none hover:bg-blue-700 transition-colors">
              Create Registry
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {registries.map((registry) => (
              <div
                key={registry.uuid}
                className="bg-white border border-gray-200 rounded-none overflow-hidden hover:shadow-lg transition-shadow"
              >
                {registry.image && (
                  <img
                    src={registry.image}
                    alt={registry.title}
                    className="w-full h-48 object-cover"
                  />
                )}
                <div className="p-6">
                  <h3 className="text-lg  text-gray-900 mb-2">{registry.title}</h3>
                  {registry.description && (
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">{registry.description}</p>
                  )}
                  
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <span className={`px-2 py-1 rounded-none text-xs font-medium ${
                      registry.is_active 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {registry.is_active ? 'Active' : 'Inactive'}
                    </span>
                    {registry.closing_date && (
                      <span>
                        Ends: {new Date(registry.closing_date).toLocaleDateString()}
                      </span>
                    )}
                  </div>

                  <div className="flex space-x-2">
                    <Link
                      href={`/my-registries/${registry.uuid}`}
                      className="flex-1 bg-gray-900 text-white text-center px-4 py-2 rounded-none hover:bg-gray-800 transition-colors text-sm"
                    >
                      Manage
                    </Link>
                    <Link
                      href={`/registry/${registry.uuid}`}
                      className="flex-1 bg-gray-900 text-white text-center px-4 py-2 rounded-none hover:bg-gray-800 transition-colors text-sm"
                    >
                      View
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyRegistriesPage;