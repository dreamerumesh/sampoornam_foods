// src/services/historyService.js
import axiosInstance from '../utils/axiosConfig';

export const historyService = {
  // Get order history
  getOrderHistory: async () => {
    const response = await axiosInstance.get('/history');
    //console.log('orders response ',response.data);
    return response.data;
  },

  // Get All order history
  getAllOrderHistory: async () => {
    const response = await axiosInstance.get('/history/admin/orders');
    //console.log(response.data);
    return response.data;
  },

  // Place a new order
  placeOrder: async (address) => {
    //console.log("Address being sent to backend in history service:", address);
    const response = await axiosInstance.post('/history/place-order', { address: address });
    //console.log(response.data);
    return response;
  },

  // Check if an order can be cancelled
  checkCancelEligibility: async (orderId) => {
    const response = await axiosInstance.get(`/history/${orderId}/can-cancel`);
    return response.data;
  },

  // Cancel an order
  cancelOrder: async (orderId) => {
    const response = await axiosInstance.put(`/history/${orderId}/cancel`);
    return response.data;
  },
  // Cancel an order by Admin
  cancelOrderByAdmin: async (orderId) => {
    const response = await axiosInstance.put(`/history/admin/${orderId}/cancel`);
    return response.data;
  },
  // Update an order by Admin
  updateOrderByAdmin: async (orderId) => {
    const response = await axiosInstance.put(`/history/admin/${orderId}/delivery`);
    return response.data;
  }
};