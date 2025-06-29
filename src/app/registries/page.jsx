"use client";

import { useState, useEffect, useTransition } from "react";
import { useRouter } from "next/navigation";
import { RegistriesSearchPageSkeleton } from "@/components/LoadingSkeleton";

const RegistriesSearchPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [registries, setRegistries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const fetchRegistries = async (query = "") => {
    try {
      setLoading(true);
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_REGISTRY_URL}/api/registry/search/?q=${encodeURIComponent(query)}`
      );
      if (!res.ok) throw new Error("Failed to fetch registries");
  
      const data = await res.json();
      console.log("Registry search response:", data); 
  
      setRegistries(Array.isArray(data) ? data : data.results || []);
    } catch (error) {
      console.error("Error fetching registries:", error);
    } finally {
      setLoading(false);
    }
  };
  

  useEffect(() => {
    fetchRegistries(""); // Initial load with empty query
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    startTransition(() => {
      fetchRegistries(searchQuery);
    });
  };

  if (loading) {
    return <RegistriesSearchPageSkeleton />;
  }

  return (
    <div className="min-h-screen flex flex-col">
        <div style={{maxWidth: "100rem"}} className="mx-auto px-6 py-12 space-y-12">
        {/* Search Form */}
        <header className="max-w-xl mx-auto text-center">
            <h1 className="text-3xl font-bold mb-6">Search Gift Registries</h1>
            <form onSubmit={handleSearch} className="flex w-full">
                <input
                type="search"
                placeholder="Search registries by title, creator or description"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-grow px-4 py-3 border border-gray-300 focus:outline-none"
                />
                <button
                type="submit"
                className="px-6 bg-[#063B67] text-white hover:bg-opacity-90"
                >
                Search
                </button>
            </form>
        </header>

        {/* List */}
        {registries.length === 0 ? (
            <p className="text-center text-gray-500">No registries found.</p>
        ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {registries.map((registry) => (
                <div
                key={registry.uuid}
                className="border p-4 bg-white flex flex-col"
            >
                {/* Image */}
                <div className="w-full h-48 bg-gray-100 border overflow-hidden mb-4">
                {registry.image ? (
                    <img
                    src={registry.image}
                    alt={registry.title}
                    className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-xs text-gray-500">
                    No Image
                    </div>
                )}
                </div>
            
                {/* Info */}
                <div className="flex-1 space-y-1">
                <h3 className="text-lg ">{registry.title}</h3>
                <p className="text-sm text-gray-600">By {registry.creator || "Unknown"}</p>
                {registry.description && (
                    <p className="text-sm text-gray-700 mt-2 line-clamp-3">
                    {registry.description}
                    </p>
                )}
                </div>
            
                <div className="mt-4">
                <a
                    href={`/registry/${registry.uuid}`}
                    className="inline-block bg-[#063B67] text-white px-4 py-2 hover:bg-opacity-90"
                >
                    View Registry
                </a>
                </div>
            </div>
            ))}
            </div>
        )}
        </div>
    </div>
  );
};

export default RegistriesSearchPage;
