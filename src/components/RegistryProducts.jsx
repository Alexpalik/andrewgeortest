"use client";

import { useEffect, useState } from "react";
import RegistryProductCard from "@/components/RegistryProductCard";
import { useParams } from "next/navigation";

const RegistryProducts = () => {
  const { uuid } = useParams();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      const token = sessionStorage.getItem(
        process.env.NEXT_PUBLIC_SALEOR_API_URL + "+saleor_auth_module_refresh_token"
      );
      if (!token) return;

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_REGISTRY_URL}/api/registries/${uuid}/products/`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const data = await res.json();
      setProducts(data);
    };

    fetchProducts();
  }, [uuid]);

  if (!products.length) {
    return <p>No products in this registry.</p>;
  }

  return (
    <div className="flex flex-col gap-6">
      {products.map((product) => (
        <RegistryProductCard
          key={product.web_variant_id}
          data={product}
          registryUuid={uuid}
          onDeleted={(deletedVariantId) => {
            setProducts((prev) =>
              prev.filter((p) => p.web_variant_id !== deletedVariantId)
            );
          }}
        />
      ))}
    </div>
  );
};

export default RegistryProducts;
