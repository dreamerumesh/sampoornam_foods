import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { toast, Toaster } from "react-hot-toast";
import {
  ChevronLeft,
  ChevronRight,
  Minus,
  Plus,
  ShoppingCart,
  Edit,
  XCircle,
  Trash2
} from "lucide-react";
import { useProduct } from "../contexts/ProductContext";
import axiosInstance from "../utils/axiosConfig";
import AddProductModal from "../components/AddProductModal";
import { useAuth } from "../contexts/AuthContext";
import {useCart} from "../contexts/CartContext";
import { useNavigate } from 'react-router-dom';



const ProductDetail = () => {
  const { user } = useAuth();
  const isAdmin = user && user.isAdmin;
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  // const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const { updateProduct,loading } = useProduct();
  const { getProductById ,currentProduct , deleteProduct } = useProduct();

  const [productStatusUpdated, setProductStatusUpdated] = useState(false);
  const [productChangesUpdated, setProductChangesUpdated] = useState(false);

  const {addToCart} = useCart();
  
  // Refs to track if toast has been shown for certain actions
  const addToCartToastShown = useRef(false);
  const statusToastShown = useRef(false);
  const productDetailRef = useRef(null);
  
  // Fetch product data on component mount
  useEffect(() => {
    const loadProduct = async () => {
      try {
        const productData = await getProductById(productId);
        // console.log("productData",productData);
        // console.log("currentProduct",currentProduct);
        setProduct(productData);
        
        // Reset toast flags when product data is refreshed
        addToCartToastShown.current = false;
        statusToastShown.current = false;
      } catch (err) {
        setError("Failed to load product data");
        console.error(err);
      }
    };

    loadProduct();
  }, [productId, productStatusUpdated, productChangesUpdated]);
  
  // Separate useEffect that runs when loading state changes from true to false
  useEffect(() => {
    if (!loading && product) {
      // Scroll to top after product is loaded and component is rendered
      setTimeout(() => {
        window.scrollTo(0, 0);
      }, 100);
    }
  }, [loading, product]);

  //console.log(loading);
  // Handle quantity changes
  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const increaseQuantity = () => {
    if (product && quantity < product.stock) {
      setQuantity(quantity + 1);
    }
  };

  // Handle add to cart
  const handleAddToCart = async () => {
    if (addToCartToastShown.current) return;
    
    try{
      if (!user) {
        // Redirect to login or show login modal
        window.location.href = "/login";
        return;
      }
      
      addToCartToastShown.current = true;
      const response = await addToCart(productId, quantity);
      //console.log(response);
      
      // Reset the flag after a short delay to allow subsequent attempts
      setTimeout(() => {
        addToCartToastShown.current = false;
      }, 2000);
    }
    catch(err){
      console.log(err);
      addToCartToastShown.current = false;
    }
    // Here you would typically add the product to the cart in your state management
  };

  // Handle admin actions
  const handleEdit = () => {
    //toast(`Changes are Updated`);
    // Implement edit functionality
  };

const [isToggling, setIsToggling] = useState(false);

const handleDeactivate = async () => {
  if (isToggling || statusToastShown.current) return; // prevent multiple clicks and toasts

  try {
    setIsToggling(true); // disable button
    statusToastShown.current = true;
    const toggledStatus = !product.isActive;

    await updateProduct(productId, {
      ...product,
      isActive: toggledStatus,
    });

    setProductStatusUpdated(prev => !prev);
    
    // Reset the flag after a short delay
    setTimeout(() => {
      statusToastShown.current = false;
    }, 2000);
  } catch (error) {
    console.error("Failed to toggle product status", error);
    statusToastShown.current = false;
  } finally {
    setIsToggling(false); // re-enable button
  }
};

  

  // Format the date for display
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Handle image carousel navigation
  const nextImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === product.images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? product.images.length - 1 : prevIndex - 1
    );
  };

  // Show loading state
  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 mt-16 flex justify-center">
        <div className="text-xl font-medium text-gray-600">
          Loading product details...
        </div>
      </div>
    );
  }

  // Show error state
  if (error || !product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 mt-20 lg:mt-12 flex justify-center">
        <div className="text-xl font-medium text-red-600">
          {error || "Product not found"}
        </div>
      </div>
    );
  }

  return (
    <>
    <Toaster position="top-right" expand={true} richColors />
    <div ref={productDetailRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mt-20 lg:mt-12">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="md:flex">
          {/* Image Section */}
          <div className="md:w-1/2  relative">
            {/* Main displayed image */}
            <div className="relative h-64 bg-gray-100">
              <img
                //src={`/api/assets/${product.images[currentImageIndex].fileId}`}
                src={`${axiosInstance.defaults.baseURL}/products/image/${product.images[currentImageIndex].fileId}`}
                alt={product.name}
                className="w-full h-full object-contain"
              />

              {/* Navigation arrows */}
              {product.images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/70 rounded-full p-2 hover:bg-white"
                  >
                    <ChevronLeft size={24} />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/70 rounded-full p-2 hover:bg-white"
                  >
                    <ChevronRight size={24} />
                  </button>
                </>
              )}
            </div>

            {/* Image thumbnails */}
            {product.images.length > 1 && (
              <div className="mt-3 flex space-x-2 overflow-x-auto pb-2 px-4">
                {product.images.map((image, index) => (
                  <div
                    key={image._id}
                    className={`relative w-16 h-16 flex-shrink-0 cursor-pointer border-2 rounded-md ${
                      index === currentImageIndex
                        ? "border-green-500"
                        : "border-gray-200"
                    }`}
                    onClick={() => setCurrentImageIndex(index)}
                  >
                    <img
                      //src={`/api/assets/${image.fileId}`}
                      src={`${axiosInstance.defaults.baseURL}/products/image/${image.fileId}`}
                      alt={`${product.name} thumbnail ${index + 1}`}
                      className="w-full h-full object-contain"
                    />
                    {image.isMain && (
                      <span className="absolute bottom-0 right-0 bg-green-500 text-white text-xs px-1 rounded-tl-md">
                        Main
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Product Info Section */}
          <div className="md:w-1/2 p-6">
            <div className="space-y-1">
              {/* Product Name */}
              <p className="text-xl font-bold text-gray-900">{product.name}</p>

              {/* Price and Unit */}
              <div className="text-xl font-bold text-blue-600">
                <span className="font-bold text-green-700">
                  ₹{product.price} / {product.size} {product.unit}
                </span>
              </div>
            </div>

            <div className="mt-4">
              <p className="text-gray-700">{product.description}</p>
            </div>

            <div className="mt-6 border-t border-gray-200 pt-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Category:</span>
                <span className="font-medium capitalize">
                  {product.category}
                </span>
              </div>

              <div className="mt-2 flex items-center justify-between text-sm">
                <span className="text-gray-600">Size:</span>
                <span className="font-medium">
                  {product.size} {product.unit}
                </span>
              </div>

              {/* <div className="mt-2 flex items-center justify-between text-sm">
                <span className="text-gray-600">Delivery By:</span>
                <span className="font-medium">{formatDate(product.deliveryDate)}</span>
              </div> */}

              {/* <div className="mt-2 flex items-center justify-between text-sm">
                <span className="text-gray-600">Stock:</span>
                <span className={`font-medium ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {product.stock > 0 ? `${product.stock} available` : 'Out of stock'}
                </span>
              </div> */}
            </div>

            {/* User Actions */}
            {!isAdmin ? (
              <div className="mt-8">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center border border-gray-300 rounded-md">
                    <button
                      onClick={decreaseQuantity}
                      disabled={quantity <= 1}
                      className="px-3 py-1 disabled:opacity-50"
                    >
                      <Minus size={20} />
                    </button>
                    <input
                      type="number"
                      value={quantity}
                      onChange={(e) =>
                        setQuantity(
                          Math.max(
                            1,
                            Math.min(
                              product.stock,
                              parseInt(e.target.value) || 1
                            )
                          )
                        )
                      }
                      className="w-12 text-center border-none focus:ring-0"
                      min="1"
                    />
                    <button
                      onClick={increaseQuantity}
                      disabled={quantity >= product.stock}
                      className="px-3 py-1 disabled:opacity-50"
                    >
                      <Plus size={20} />
                    </button>
                  </div>

                  <div className="text-lg font-semibold">
                    Total: ₹{(product.price * quantity).toFixed(2)}
                  </div>
                </div>

                <button
                  onClick={handleAddToCart}
                  disabled={product.stock <= 0}
                  className={`w-full flex items-center justify-center py-2 px-1 rounded-md ${
                    product.stock > 0
                      ? "bg-green-600 hover:bg-green-700 text-white "
                      : "bg-gray-400 cursor-not-allowed text-gray-200"
                  }`}
                >
                  <ShoppingCart className="mr-2" size={20} />
                  {product.stock > 0 ? "Add to Cart" : "Out of Stock"}
                </button>
              </div>
            ) : (<div>
              <div className="mt-8 flex flex-row w-full justify-between space-x-4">
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center justify-center py-2 px-3 sm:px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md flex-1 min-w-[120px]"
                >
                  <Edit className="mr-2" size={18} />
                  Edit
                </button>
                <button
                  type="button"
                  onClick={handleDeactivate}
                  disabled={isToggling}
                  className={`flex items-center justify-center py-2 px-3 sm:px-4 rounded-md flex-1 min-w-[120px] ${
                    product.isActive
                      ? "bg-amber-600 hover:bg-amber-700 text-white"
                      : "bg-emerald-600 hover:bg-emerald-700 text-white"
                  }`}
                >
                  <XCircle className="mr-2" size={18} />
                  {product.isActive ? "Deactivate" : (loading ? "Activating" : "Activate")}
                </button>
              </div>
              <div className="mt-2 flex justify-center">
                <button
                  onClick={async () => {
                    try {
                      await deleteProduct(productId);
                      navigate("/");
                    } catch (err) {
                      console.error("Failed to delete product:", err);
                    }
                  }}
                  
                  className="flex items-center justify-center py-2 px-3 sm:px-4 bg-rose-600 hover:bg-rose-700 text-white rounded-md w-1/2"
                >
                  <Trash2 className="mr-2" size={18} />
                  Delete
                </button>
              </div>
            </div>)}
          </div>
        </div>
      </div>
      {isEditing && (
        <AddProductModal
          onClose={() => {
            setIsEditing(false);
            setProductStatusUpdated((prev) => !prev);
            handleEdit();
          }}
          initialProduct={product}
        />
      )}
    </div>
    </>
  );
};

export default ProductDetail;