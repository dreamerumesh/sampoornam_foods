import React, { useEffect, useState, useCallback } from "react";
import { useProduct } from "../contexts/ProductContext";
import { useAuth } from "../contexts/AuthContext"; // Assuming you have an AuthContext
import ProductCard from "../components/ProductCard";
import AddProductModal from "../components/AddProductModal";
import useInfiniteScroll from "../hooks/useInfiniteScroll";

const ProductList = () => {
  const { products, fetchProducts, pagination, loading, error } = useProduct();
  const { user } = useAuth();
  const [page, setPage] = useState(1);
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  // Initial load
  useEffect(() => {
    fetchProducts({ page: 1, limit: 12 });
    setPage(1);
  }, []);

  // Infinite scroll handler
  const handleLoadMore = useCallback(async () => {
    if (isLoadingMore || !pagination || page >= pagination.pages) return;
    
    setIsLoadingMore(true);
    const nextPage = page + 1;
    
    try {
      await fetchProducts({ page: nextPage, limit: 12 });
      setPage(nextPage);
    } catch (error) {
      console.error('Failed to load more products:', error);
    } finally {
      setIsLoadingMore(false);
    }
  }, [page, pagination, isLoadingMore, fetchProducts]);

  // Check if there are more products to load
  const hasMore = pagination && page < pagination.pages;

  // Use infinite scroll hook
  const { targetRef } = useInfiniteScroll(hasMore, isLoadingMore, handleLoadMore);
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
        {products.length === 0 && !loading && (
          <div className="col-span-4 text-center">
            <p className="text-gray-500 pr-6 pt-5">No products available</p>
          </div>
        )}
        
        {/* Initial loading state */}
        {products.length === 0 && loading && (
          <div className="col-span-4 text-center">
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
              <span className="ml-2 text-gray-500">Loading products...</span>
            </div>
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

      {/* Infinite scroll trigger element */}
      {hasMore && (
        <div ref={targetRef} className="text-center mt-6 py-4">
          {isLoadingMore && (
            <div className="flex justify-center items-center">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-600"></div>
              <span className="ml-2 text-gray-500">Loading more products...</span>
            </div>
          )}
        </div>
      )}

      {/* End of products message */}
      {!hasMore && products.length > 0 && (
        <div className="text-center mt-6 py-4">
          <p className="text-gray-500">You've reached the end of our products!</p>
        </div>
      )}

      {showAddProductModal && (
        <AddProductModal onClose={() => setShowAddProductModal(false)} />
      )}
    </div>
  );
};

export default ProductList;
