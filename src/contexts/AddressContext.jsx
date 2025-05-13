// src/contexts/AddressContext.jsx
import React, { createContext, useState, useContext, useCallback } from "react";
import { addressService } from "../services/addressService";

// Create the Address Context
const AddressContext = createContext();

// Address Context Provider Component
export const AddressProvider = ({ children }) => {
  const [addresses, setAddresses] = useState([]);
  const [defaultAddressIndex, setDefaultAddressIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch Addresses
  const fetchAddresses = useCallback(async () => {
    try {
      setLoading(true);
      const response = await addressService.getAddresses();

      if (response.success) {
        setAddresses(response.data || []);
        setDefaultAddressIndex(response.defaultAddressIndex || 0);
        setError(null);
      } else {
        setError(response.message || "Failed to fetch addresses");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch addresses");
      setAddresses([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Add Address
  const addAddress = useCallback(async (addressData) => {
    try {
      setLoading(true);
      const response = await addressService.addAddress(addressData);

      if (response.success) {
        setAddresses(response.data || []);
        setDefaultAddressIndex(response.defaultAddressIndex || 0);
        setError(null);
      } else {
        setError(response.message || "Failed to add address");
        throw new Error(response.message || "Failed to add address");
      }

      return response;
    } catch (err) {
      setError(
        err.response?.data?.message || err.message || "Failed to add address"
      );
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Update Address
  const updateAddress = useCallback(async (index, addressData) => {
    try {
      setLoading(true);
      const response = await addressService.updateAddress(index, addressData);

      if (response.success) {
        setAddresses(response.data || []);
        setDefaultAddressIndex(response.defaultAddressIndex || 0);
        setError(null);
      } else {
        setError(response.message || "Failed to update address");
        throw new Error(response.message || "Failed to update address");
      }

      return response;
    } catch (err) {
      setError(
        err.response?.data?.message || err.message || "Failed to update address"
      );
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Delete Address
  const deleteAddress = useCallback(async (index) => {
    try {
      setLoading(true);
      const response = await addressService.deleteAddress(index);

      if (response.success) {
        setAddresses(response.data || []);
        setDefaultAddressIndex(response.defaultAddressIndex || 0);
        setError(null);
      } else {
        setError(response.message || "Failed to delete address");
        throw new Error(response.message || "Failed to delete address");
      }

      return response;
    } catch (err) {
      setError(
        err.response?.data?.message || err.message || "Failed to delete address"
      );
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Set Default Address
  const setDefaultAddress = useCallback(async (index) => {
    try {
      setLoading(true);
      const response = await addressService.setDefaultAddress(index);

      if (response.success) {
        setAddresses(response.data || []);
        setDefaultAddressIndex(response.defaultAddressIndex || 0);
        setError(null);
      } else {
        setError(response.message || "Failed to set default address");
        throw new Error(response.message || "Failed to set default address");
      }

      return response;
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to set default address"
      );
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Context value
  const value = {
    addresses,
    defaultAddressIndex,
    loading,
    error,
    fetchAddresses,
    addAddress,
    updateAddress,
    deleteAddress,
    setDefaultAddress,
  };

  return (
    <AddressContext.Provider value={value}>{children}</AddressContext.Provider>
  );
};

// Custom hook to use the Address Context
export function useAddress() {
  const context = useContext(AddressContext);
  if (!context) {
    throw new Error("useAddress must be used within an AddressProvider");
  }
  return context;
}
