import React, { useState } from "react";
import Input from "@/shared/Input/Input";
import Textarea from "@/shared/Textarea/Textarea";
import ButtonPrimary from "@/shared/Button/ButtonPrimary";

const RegistryProductForm = ({ isOpen, onClose, onSubmit, initialValues = {} }) => {
  const [title, setTitle] = useState(initialValues.title || "");
  const [description, setDescription] = useState(initialValues.description || "");
  const [price, setPrice] = useState(initialValues.price || "");

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ title, description, price });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white dark:bg-slate-900 rounded-none shadow-lg p-6 w-full max-w-md">
        <h2 className="text-lg  mb-4">Add Product Details</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="registry-title" className="block text-sm font-medium mb-1">Title</label>
            <Input
              id="registry-title"
              label=""
              placeholder="Enter product title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="registry-description" className="block text-sm font-medium mb-1">Description</label>
            <Textarea
              id="registry-description"
              label=""
              placeholder="Enter product description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="registry-price" className="block text-sm font-medium mb-1">Price</label>
            <Input
              id="registry-price"
              label=""
              placeholder="Enter price (e.g. 49.99)"
              type="number"
              min="0"
              step="0.01"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
            />
          </div>
          <div className="flex justify-end gap-2">
            <ButtonPrimary type="submit">Submit</ButtonPrimary>
            <button type="button" className="text-gray-500 hover:underline" onClick={onClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegistryProductForm; 