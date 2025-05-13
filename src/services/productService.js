// src/services/productService.js
import axiosInstance from '../utils/axiosConfig';

export const productService = {
  // Create a new product
  createProduct: async (productData) => {
    const response = await axiosInstance.post('/products', productData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  },

  // Get all products with optional filters
  getProducts: async (params = {}) => {
    const response = await axiosInstance.get('/products', { params });
    return response.data;
  },

  // Get a single product by ID
  getProductById: async (productId) => {
    const response = await axiosInstance.get(`/products/${productId}`);
    return response.data;
  },

  // Update a product
  updateProduct: async (productId, productData) => {
    const response = await axiosInstance.put(`/products/${productId}`, productData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  },

  // Delete a product
  deleteProduct: async (productId) => {
    const response = await axiosInstance.delete(`/products/${productId}`);
    return response.data;
  },

  // Get product image
  getProductImage: async (imageId) => {
    const response = await axiosInstance.get(`/products/image/${imageId}`, {
      responseType: 'blob'
    });
    return response.data;
  }
};