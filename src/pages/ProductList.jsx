import React, { useEffect, useState } from "react";
import { useProduct } from "../contexts/ProductContext";
import { useAuth } from "../contexts/AuthContext"; // Assuming you have an AuthContext
import ProductCard from "../components/ProductCard";
import AddProductModal from "../components/AddProductModal";

const ProductList = () => {
  const { products, fetchProducts, pagination,loading, error } = useProduct();
  const { user } = useAuth();
  const [page, setPage] = useState(1);
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  

  useEffect(() => {
    fetchProducts({ page, limit: 12 });
  }, [page]);
  
  

  const handleLoadMore = () => {
    setPage((prevPage) => prevPage + 1);
  };
  // console.log(user)
  const isAdmin = user && user.isAdmin;
  // console.log(isAdmin);

  return (
    <div className="container mx-auto px-4 py-28 lg:py-20">
      <div className="flex justify-between items-center mb-1.5">
        <h1 className="text-xl sm:text-xl md:text-xl lg:text-[21px] font-bold text-green-800 ">
          Our Products
        </h1>

        {isAdmin && (
          <button
            onClick={() => setShowAddProductModal(true)}
            className="bg-green-600 text-white px-2 py-2 rounded-lg hover:bg-green-700 transition"
          >
            Add New Product
          </button>
        )}
      </div>

      <div className="grid gap-5 grid-cols-[repeat(auto-fill,minmax(250px,1fr))] justify-center overflow-x-hidden">
        {products.length === 0 && (
          <div className="col-span-4 text-center">
            <p className="text-gray-500 pr-6 pt-5">{loading ? "Loading products..":"No products available"}</p>
          </div>
        )}
        {products
          .filter((product) => isAdmin || product.isActive) // Show all if admin, else only active ones
          .map((product) => (
            <ProductCard
              key={product._id}
              product={product}
              isAdmin={isAdmin}
            />
          ))}
      </div>
      {pagination.page < pagination.pages && (
        <div className="text-center mt-6">
          <button
            onClick={handleLoadMore}
            className="bg-green-700 text-white px-6 py-2 rounded hover:bg-green-600 transition"
          >
            Load More Products
          </button>
        </div>
      )}

      {showAddProductModal && (
        <AddProductModal onClose={() => setShowAddProductModal(false)} />
      )}
    </div>
  );
};

export default ProductList;
