// src/services/addressService.js
import axiosInstance from "../utils/axiosConfig";

export const addressService = {
  // Get all addresses
  getAddresses: async () => {
    const response = await axiosInstance.get("/address");
    return response.data;
  },

  // Add a new address
  addAddress: async (addressData) => {
    const response = await axiosInstance.post("/address", addressData);
    return response.data;
  },

  // Update an existing address
  updateAddress: async (index, addressData) => {
    const response = await axiosInstance.put(`/address/${index}`, addressData);
    return response.data;
  },

  // Delete an address
  deleteAddress: async (index) => {
    const response = await axiosInstance.delete(`/address/${index}`);
    return response.data;
  },

  // Set default address
  setDefaultAddress: async (index) => {
    const response = await axiosInstance.put(`/address/default/${index}`);
    return response.data;
  },
};
