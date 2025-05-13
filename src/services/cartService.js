// src/services/cartService.js
import axiosInstance from '../utils/axiosConfig';

const cartService = {
  // Get user's cart
  getCart: () => {
    return axiosInstance.get('/cart');
  },

  // Add item to cart
  addToCart: (productId, quantity = 1) => {
    return axiosInstance.post('/cart', { productId, quantity });
  },

  // Update cart item quantity
  updateCartItem: (itemId, quantity) => {
    console.log("Updating cart item:", itemId, quantity);

    return axiosInstance.put( '/cart',{itemId, quantity });
  },

  // Remove item from cart
  removeCartItem: (itemId) => {
    return axiosInstance.delete(`/cart/${itemId}`);
  },

  // Save item for later
  saveForLater: (itemId) => {
    return axiosInstance.put(`/cart/${itemId}/save-for-later`);
  },

  // Move item to cart from saved for later
  moveToCart: (itemId) => {
    return axiosInstance.put(`/cart/${itemId}/move-to-cart`);
  },

  // Clear cart
  clearCart: () => {
    return axiosInstance.delete('/cart');
  }
};

export default cartService;