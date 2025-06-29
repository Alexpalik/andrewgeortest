"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import RegistrySettings from "@/components/RegistrySettings";
import { RegistryPageSkeleton } from "@/components/LoadingSkeleton";

const RegistryPage = () => {
  const { uuid } = useParams();
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

  if (loading) {
    return <RegistryPageSkeleton />;
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
      <RegistrySettings />
    </div>
  );
};

export default RegistryPage; 