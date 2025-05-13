import React, { useState } from "react";
import { useProduct } from "../contexts/ProductContext";
import { Toaster, toast } from "react-hot-toast";

const AddProductModal = ({ onClose, initialProduct = null }) => {
  const { createProduct, updateProduct,loading } = useProduct();
  const [deletedImages, setDeletedImages] = useState([]);

  //console.log(loading);

  const [productData, setProductData] = useState(
    initialProduct || {
      name: "",
      description: "",
      price: "",
      unit: "kg",
      category: "",
      isActive: true,
      featured: false,
      stock: 1000,
      size: 1,
      orderBefore: "",
      deliveryDate: "",
      images: [],
    }
  );

  const handleInputChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (files) {
      setProductData((prev) => ({ ...prev, images: Array.from(files) }));
    } else if (type === "checkbox") {
      setProductData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setProductData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleDeleteCheckbox = (fileId) => {
    setDeletedImages((prev) =>
      prev.includes(fileId)
        ? prev.filter((id) => id !== fileId)
        : [...prev, fileId]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();

    Object.entries(productData).forEach(([key, value]) => {
      if (key === "images") {
        value.forEach((file) => {
          formData.append("images", file);
        });
      } else {
        formData.append(key, value);
      }
      if (deletedImages.length > 0) {
        formData.append("deletedImages", deletedImages.join(","));
      }
    });

    try {
      if (initialProduct) {
        //console.log("Edit product function is called");
        await updateProduct(initialProduct._id, formData); // You may need to update this logic
        toast.success("Product updated successfully");

      } else {
        //console.log(formData);
        await createProduct(formData);
        toast.success("Product created successfully");
        //onsole.log("Create product function is called");

      }
      onClose();
    } catch (error) {
      toast.error("Failed to save product");
      console.error("Failed to save product", error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-[90vw] lg:max-w-[50vw] overflow-y-auto max-h-[90vh]">
        <h2 className="text-2xl font-bold mb-4">
         {initialProduct ? "Edit Product" : "Add New Product"}
        </h2>
        <form onSubmit={handleSubmit} className="w-full">
          {/* Basic fields */}
          {["name", "description", "price", "stock", "size"].map((field) => (
            <div className="mb-4" key={field}>
              {field === "description" ? (
                <>
                  <label className="block mb-2 capitalize">{field}</label>
                  <textarea
                    name={field}
                    value={productData[field]}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-3 py-2 border rounded"
                    required
                  />
                </>
              ) : (
                <div className="flex flex-row items-center space-x-4">
                  <label className="capitalize mb-1 sm:mb-0 sm:w-32 shrink-0">
                    {field}
                  </label>
                  <input
                    type={
                      ["price", "stock", "size"].includes(field)
                        ? "number"
                        : "text"
                    }
                    name={field}
                    value={productData[field]}
                    onChange={handleInputChange}
                    className="flex-1 px-3 py-2 border rounded w-full"
                    required={[
                      "name",
                      "description",
                      "price",
                      "category",
                    ].includes(field)}
                  />
                </div>
              )}
            </div>
          ))}

          <div className="flex flex-row space-x-4 mb-4">
            {/* Category */}
            <div className="w-1/2">
              <label className="block mb-2">Category</label>
              <select
                name="category"
                value={productData.category}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded"
                required
              >
                <option value="">Select a category</option>
                <option value="Sweets">Sweets</option>
                <option value="Namkeen">Namkeen</option>
                <option value="Chips">Chips</option>
                <option value="Breakfast Items">Breakfast Items</option>
                <option value="Snacky Nuts">Snacky Nuts</option>
              </select>
            </div>

            {/* Unit */}
            <div className="w-1/2">
              <label className="block mb-2">Unit</label>
              <select
                name="unit"
                value={productData.unit}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded"
                required
              >
                <option value="kg">Kg</option>
                <option value="g">g</option>
                <option value="L">L</option>
                <option value="ml">ml</option>
                <option value="pieces">Pieces</option>
                <option value="packs">Pack</option>
                <option value="inch">Inch</option>
              </select>
            </div>
          </div>

          {/* Dates */}
          <div className="flex flex-row space-x-4 mb-4">
            <div className="w-1/2">
              <label className="block mb-2">Order Before</label>
              <input
                type="date"
                name="orderBefore"
                value={productData.orderBefore}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded"
              />
            </div>
            <div className="w-1/2">
              <label className="block mb-2">Delivery Date</label>
              <input
                type="date"
                name="deliveryDate"
                value={productData.deliveryDate}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded"
              />
            </div>
          </div>

          {/* Checkboxes */}
          <div className="flex space-x-4 mb-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                name="isActive"
                checked={productData.isActive}
                onChange={handleInputChange}
                className="mr-2"
              />
              Active
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                name="featured"
                checked={productData.featured}
                onChange={handleInputChange}
                className="mr-2"
              />
              Featured
            </label>
          </div>

          {/* File Upload */}
          {initialProduct?.images?.length > 0 && (
            <div className="mb-4">
              <label className="block mb-2 font-semibold">
                Existing Images
              </label>
              <label className="block mb-1 ">Select Images To Remove</label>
              <label className="block mb-1 text-sm text-gray-500">Don't Select All Images Minimum 1 Required</label>
              {initialProduct.images.map((img, idx) => (
                <div key={img._id} className="flex items-center mb-1">
                  <input
                    type="checkbox"
                    id={`delete-img-${img._id}`}
                    onChange={() => handleDeleteCheckbox(img.fileId)}
                    className="mr-2"
                  />
                  <label htmlFor={`delete-img-${img._id}`} className="text-sm">
                    {img.filename}
                  </label>
                </div>
              ))}
            </div>
          )}

          <div className="mb-4">
            <label className="block mb-2">Add New Product Images</label>
            <input
              type="file"
              name="images"
              accept="image/*"
              multiple
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded"
              required={!initialProduct}
            />
          </div>

          <div className="flex justify-between">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-300 text-gray-700 px-4 py-2 rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-800"
            >
              {loading
                  ? (initialProduct ? "Updating ..." : "Adding ...")
                  : (initialProduct ? "Update Product" : "Add Product")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProductModal;
