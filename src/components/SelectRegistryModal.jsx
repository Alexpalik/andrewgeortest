"use client";

import React, { useEffect, useState } from "react";
import { Dialog } from "@headlessui/react";
import toast from "react-hot-toast";
import LoadingSpinner from "./LoadingSpinner";

const SelectRegistryModal = ({ isOpen, onClose, onSelect }) => {
  const [registries, setRegistries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isOpen) return;

    const fetchRegistries = async () => {
      setLoading(true);

      const tokenKey = process.env.NEXT_PUBLIC_SALEOR_API_URL + "+saleor_auth_module_refresh_token";
      const token = sessionStorage.getItem(tokenKey);

      if (!token) {
        toast.error("You must be logged in to view your registries.");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_REGISTRY_URL}/api/registries/`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) throw new Error("Failed to fetch registries");

        const data = await response.json();
        setRegistries(data);
      } catch (error) {
        toast.error("Error fetching registries.");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchRegistries();
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black bg-opacity-30" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="bg-white p-6 shadow-xl w-full max-w-md relative">
          <Dialog.Title className="text-lg font-medium mb-4">Select a Registry</Dialog.Title>

          {loading ? (
            <div className="py-8">
              <LoadingSpinner size="md" text="Loading registries..." />
            </div>
          ) : registries.length === 0 ? (
            <p>You don't have any registries yet.</p>
          ) : (
            <ul className="space-y-3">
              {registries.map((registry) => (
                <li key={registry.uuid}>
                  <button
                    onClick={() => onSelect(registry.uuid)}
                    className="w-full text-left border p-3 hover:bg-gray-100"
                  >
                    <div className="">{registry.title}</div>
                    <div className="text-xs text-gray-500">
                      Created: {new Date(registry.created_at).toLocaleDateString()}
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default SelectRegistryModal;
