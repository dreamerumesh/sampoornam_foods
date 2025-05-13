// src/pages/Cart.jsx
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../contexts/CartContext";
import { useAuth } from "../contexts/AuthContext";
import { Save } from "lucide-react";
import toast from 'react-hot-toast';
import { Toaster } from 'react-hot-toast';

const Cart = () => {
  const navigate = useNavigate();
  const {
    items,
    savedForLater,
    total,
    loading,
    error,
    fetchCart,
    updateCartItem,
    removeCartItem,
    saveForLater: saveItemForLater,
    moveToCart,
  } = useCart();
  const { user } = useAuth();

  const [isCheckingOut, setIsCheckingOut] = useState(false);

  useEffect(() => {
    fetchCart();
  }, []);

  // useEffect(() => {
  //   console.log("Updated items after fetch:", items);
  // }, [items]);

  const handleQuantityChange = async (itemId, newQuantity) => {
    if (newQuantity < 1) return;

    try {
      //console.log("Updating quantity for item:", itemId, "to", newQuantity);
      await updateCartItem(itemId, newQuantity);
    } catch (error) {
      console.error("Failed to update quantity:", error);
    }
  };

  const handleRemoveItem = async (itemId) => {
    try {
      await removeCartItem(itemId);
      toast.success("Item removed successfully!");
    } catch (error) {
      console.toast("Failed to remove item:");
    }
  };

  const handleSaveForLater = async (itemId) => {
    try {
      console.log("Saving item for later:", itemId);
      await saveItemForLater(itemId);
    } catch (error) {
      toast.error("Item Alread saved for later");
    }
  };

  const handleMoveToCart = async (itemId) => {
    try {
      console.log("Move to cart id", itemId);
      await moveToCart(itemId);
    } catch (error) {
      toast.error("Failed to move item to cart:");
    }
  };

  const handleCheckout = () => {
    setIsCheckingOut(true);
    // In a real application, this would navigate to checkout
    setTimeout(() => {
      navigate("/address");
    }, 1000);
  };

  console.log("items ", items);
  console.log("saved of later items",savedForLater);
  if (loading && items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center">
            <div className="mt-12">
              <div className="animate-pulse flex flex-col items-center">
                <div className="h-12 bg-gray-200 rounded-lg w-1/2 mb-4"></div>
                <div className="h-64 bg-gray-200 rounded-lg w-full mb-6"></div>
                <div className="h-12 bg-gray-200 rounded-lg w-1/3"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    if (!user) {
      return (
        <div className="min-h-screen bg-gray-50 pt-24 pb-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-black-600">
                Your Cart is empty
              </h2>
              <p className="mt-2 text-lg text-gray-600"></p>
              <Link
                to="/login"
                className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Sign in to your account
              </Link>
            </div>
          </div>
        </div>
      );
    } 
  }

  const cartIsEmpty = items.length === 0;
  const savedIsEmpty = savedForLater.length === 0;

  return (
    <div className="min-h-screen bg-green-50 pt-6 pb-12 px-4 sm:px-6 lg:px-8">
      <Toaster position="top-right" reverseOrder={false} />
      <div className="max-w-6xl mx-auto">
        <h1 className="text-xl font-bold text-gray-900 mb-1 mt-8">Your Cart</h1>

        {cartIsEmpty ? (
          <div className="bg-white shadow-md rounded-lg p-6 mb-8">
            <div className="text-center py-12">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-16 w-16 mx-auto text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
              </svg>
              <h2 className="mt-4 text-xl font-medium text-gray-900">
                Your cart is empty
              </h2>
              <p className="mt-2 text-gray-500">
                Looks like you haven't added any items to your cart yet.
              </p>
              <Link
                to="/"
                className="mt-6 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 ">
              <div className="bg-white shadow-md rounded-lg overflow-hidden mb-6">
                <div className="px-4 py-3 sm:px-6 bg-gray-50 border-b border-gray-200">
                  <h2 className="text-lg font-medium text-gray-900">
                    Shopping Cart ({items.length} items)
                  </h2>
                </div>
                <ul className="divide-y divide-gray-300">
                  {items.map((item) => (
                    <li
                      key={item._id}
                      className="p-3 sm:p-4 hover:bg-gray-50 transition-colors duration-150"
                    >
                      <div className="flex flex-col lg:flex-row items-start sm:items-center w-full">
                        <Link
                          to={`/product/${item.product._id}`}
                          className="flex-1 w-full block"
                        >
                          <div className="flex-1 w-full">
                            <div className="w-full p-2 flex flex-col space-y-1">
                              <span className="text-[20px] text-green-700 hover:text-green-800 hover:text-xl">
                                {item.product.name}
                              </span>
                              <span className="text-md font-bold text-gray-900 mt-1">
                                ₹{item.product.price.toFixed(2)} /
                                {` ${item.product.size} ${item.product.unit}`}
                              </span>
                              {/* {item.inStock ? (
                              <span className="text-sm text-green-600 mt-1">In Stock</span>
                            ) : (
                              <span className="text-sm text-red-600 mt-1">Out of Stock</span>
                            )} */}
                            </div>
                          </div>
                        </Link>
                        <div className="mt-4 sm:mt-0 flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
                          <div className="flex items-center border border-gray-300 rounded-md">
                            <button
                              onClick={() =>
                                handleQuantityChange(
                                  item._id,
                                  item.quantity - 1
                                )
                              }
                              disabled={item.quantity <= 1}
                              className="px-3 py-1 text-gray-600 hover:bg-red-500 disabled:opacity-50"
                            >
                              -
                            </button>
                            <span className="px-3 py-1 text-center w-10">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() =>
                                handleQuantityChange(
                                  item._id,
                                  item.quantity + 1
                                )
                              }
                              className="px-3 py-1 text-gray-600 hover:bg-green-200"
                            >
                              +
                            </button>
                          </div>
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleSaveForLater(item._id)}
                              className="text-md text-green-600 border border-green-400 px-3 py-1  shadow-sm text-sm font-medium rounded-md bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                            >
                              
                              Save for later
                            </button>
                            <span className="text-gray-300">|</span>
                            <button
                              onClick={() => handleRemoveItem(item._id)}
                              className="text-md text-red-550 border border-red-400 px-3 py-1 rounded hover:text-red-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-800"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="md:col-span-1 ">
              <div className="shadow-md rounded-lg p-6 sticky top-4">
                <h2 className="text-lg font-medium text-gray-900 mb-4">
                  Order Summary
                </h2>
                <div className="space-y-2 border-b border-gray-200 pb-4 mb-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">
                      Items (
                      {items.reduce((acc, item) => acc + item.quantity, 0)}):
                    </span>
                    <span className="text-gray-900 font-medium">
                      ₹{total.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping:</span>
                    <span className="text-gray-900 font-medium">₹0.00</span>
                  </div>
                </div>
                <div className="flex justify-between mb-6">
                  <span className="text-lg font-bold text-gray-900">
                    Order Total:
                  </span>
                  <span className="text-lg font-bold text-gray-900">
                    ₹{total.toFixed(2)}
                  </span>
                </div>
                <button
                  onClick={handleCheckout}
                  disabled={isCheckingOut}
                  className="w-full py-3 px-2  bg-yellow-400 hover:bg-yellow-500 text-black font-medium rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-300 flex justify-center items-center"
                >
                  {isCheckingOut ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-black"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Processing...
                    </>
                  ) : (
                    "Proceed to Checkout"
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Saved For Later Section */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Saved For Later ({savedForLater.length})
          </h2>

          {savedIsEmpty ? (
            <div className="bg-white shadow-md rounded-lg p-6">
              <div className="text-center py-8">
                <p className="text-gray-500">
                  You don't have any items saved for later.
                </p>
              </div>
            </div>
          ) : (
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
              <ul className="divide-y divide-gray-200">
                {savedForLater.map((item) => (
                  <li
                    key={item._id}
                    className="p-4 sm:p-6 hover:bg-gray-50 transition-colors duration-150"
                  >
                    <div className="flex flex-col sm:flex-row items-start sm:items-center w-full">
                      <Link
                        to={`/product/${item.product._id}`}
                        className="flex-1 w-full block"
                      >
                        <div className="flex-1 w-full">
                          <div className="w-full p-2 flex flex-col space-y-1">
                            <span className="text-[20px] font-medium text-green-700 hover:text-green-800 hover:text-xl">
                              {item.product.name}
                            </span>
                            <span className="text-md font-bold text-gray-900 mt-1">
                              ₹{item.product.price.toFixed(2)} /
                              {` ${item.product.size} ${item.product.unit}`}
                            </span>
                            {/* {item.inStock ? (
                              <span className="text-sm text-green-600 mt-1">In Stock</span>
                            ) : (
                              <span className="text-sm text-red-600 mt-1">Out of Stock</span>
                            )} */}
                          </div>
                        </div>
                      </Link>
                      <div className="mt-4 sm:mt-0 flex space-x-4">
                        <button
                          onClick={() => handleMoveToCart(item._id)}
                          className="inline-flex items-center px-3 py-1 border border-green-400 text-sm font-medium rounded-md text-green-600 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                        >
                          Move to Cart
                        </button>
                        <button
                          onClick={() => handleRemoveItem(item._id)}
                          className="text-sm text-red-600 border border-red-400 px-3 py-2 rounded hover:text-red-800"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Cart;
