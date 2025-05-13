// src/contexts/ProductContext.jsx
import React, { createContext, useContext, useReducer } from "react";
import { productService } from "../services/productService";

// Initial state
const initialState = {
  products: [],
  currentProduct: null,
  loading: false,
  error: null,
  pagination: {
    total: 0,
    page: 1,
    limit: 10,
    pages: 0,
  },
};

// Action types
const ACTION_TYPES = {
  SET_LOADING: "SET_LOADING",
  SET_ERROR: "SET_ERROR",
  FETCH_PRODUCTS_SUCCESS: "FETCH_PRODUCTS_SUCCESS",
  FETCH_EXTRA_PRODUCTS_SUCCESS: "FETCH_EXTRA_PRODUCTS_SUCCESS",
  SET_CURRENT_PRODUCT: "SET_CURRENT_PRODUCT",
  CLEAR_CURRENT_PRODUCT: "CLEAR_CURRENT_PRODUCT",
  ADD_PRODUCT: "ADD_PRODUCT",
  UPDATE_PRODUCT: "UPDATE_PRODUCT",
  DELETE_PRODUCT: "DELETE_PRODUCT",
};

// Reducer function
const productReducer = (state, action) => {
  switch (action.type) {
    case ACTION_TYPES.SET_LOADING:
      return { ...state, loading: action.payload };
    case ACTION_TYPES.SET_ERROR:
      return { ...state, error: action.payload, loading: false };
    case ACTION_TYPES.FETCH_PRODUCTS_SUCCESS:
      return {
        ...state,
        products: action.payload.products,
        pagination: action.payload.pagination,
        loading: false,
        error: null,
    };
    case ACTION_TYPES.FETCH_EXTRA_PRODUCTS_SUCCESS:
      return {
        ...state,
        products: action.page === 1
          ? action.payload.products
          : [...state.products, ...action.payload.products],
        pagination: action.payload.pagination,
        loading: false,
        error: null,
    };
    case ACTION_TYPES.SET_CURRENT_PRODUCT:
      return { ...state, currentProduct: action.payload };
    case ACTION_TYPES.CLEAR_CURRENT_PRODUCT:
      return { ...state, currentProduct: null };
    case ACTION_TYPES.ADD_PRODUCT:
      return {
        ...state,
        products: [...state.products, action.payload],
        loading: false,
        error: null,
      };
    case ACTION_TYPES.UPDATE_PRODUCT:
      return {
        ...state,
        products: state.products.map((product) =>
          product._id === action.payload._id ? action.payload : product
        ),
        loading: false,
        error: null,
      };
    case ACTION_TYPES.DELETE_PRODUCT:
      return {
        ...state,
        products: state.products.filter(
          (product) => product._id !== action.payload
        ),
        loading: false,
        error: null,
      };
    default:
      return state;
  }
};

// Create context
const ProductContext = createContext();

// Provider component
export const ProductProvider = ({ children }) => {
  const [state, dispatch] = useReducer(productReducer, initialState);

  // Fetch products
  const fetchProducts = async (params = {}) => {
    dispatch({ type: ACTION_TYPES.SET_LOADING, payload: true });
      console.log(params);
    try {
      const response = await productService.getProducts(params);
      console.log(response);
  
      dispatch({
        type: params.page
          ? ACTION_TYPES.FETCH_EXTRA_PRODUCTS_SUCCESS  // for load more
          : ACTION_TYPES.FETCH_PRODUCTS_SUCCESS,       // for search or fresh load
        payload: response.data,
        page: params.page, // still useful for context if needed
      });
  
      return response.data;
    } catch (error) {
      dispatch({
        type: ACTION_TYPES.SET_ERROR,
        payload: error.response?.data?.error || "Failed to fetch products",
      });
      throw error;
    }
  };
  
  

  // Create product
  const createProduct = async (productData) => {
    dispatch({ type: ACTION_TYPES.SET_LOADING, payload: true });
    try {
      const response = await productService.createProduct(productData);
      dispatch({
        type: ACTION_TYPES.ADD_PRODUCT,
        payload: response.data,
      });
      return response.data;
    } catch (error) {
      dispatch({
        type: ACTION_TYPES.SET_ERROR,
        payload: error.response?.data?.error || "Failed to create product",
      });
      throw error;
    }
  };

  // Update product
  const updateProduct = async (productId, productData) => {
    dispatch({ type: ACTION_TYPES.SET_LOADING, payload: true });
    try {
      const response = await productService.updateProduct(
        productId,
        productData
      );
      dispatch({
        type: ACTION_TYPES.UPDATE_PRODUCT,
        payload: response.data,
      });
      return response.data;
    } catch (error) {
      dispatch({
        type: ACTION_TYPES.SET_ERROR,
        payload: error.response?.data?.error || "Failed to update product",
      });
      throw error;
    }
  };

  // Delete product
  const deleteProduct = async (productId) => {
    dispatch({ type: ACTION_TYPES.SET_LOADING, payload: true });
    try {
      await productService.deleteProduct(productId);
      dispatch({
        type: ACTION_TYPES.DELETE_PRODUCT,
        payload: productId,
      });
    } catch (error) {
      dispatch({
        type: ACTION_TYPES.SET_ERROR,
        payload: error.response?.data?.error || "Failed to delete product",
      });
      throw error;
    }
  };

  // Get product by ID
  const getProductById = async (productId) => {
    dispatch({ type: ACTION_TYPES.SET_LOADING, payload: true });
    dispatch({ type: ACTION_TYPES.CLEAR_CURRENT_PRODUCT }); // Optional: clear old data
  
    try {
      const response = await productService.getProductById(productId);
      console.log(response);
      dispatch({
        type: ACTION_TYPES.SET_CURRENT_PRODUCT,
        payload: response.data, // depends on your API shape
      });
  
      return response.data;
    } catch (error) {
      dispatch({
        type: ACTION_TYPES.SET_ERROR,
        payload: error.response?.error || "Failed to fetch product",
      });
      throw error;
    } finally {
      dispatch({ type: ACTION_TYPES.SET_LOADING, payload: false });
    }
  };
  
  // const getProductById = async (productId) => {
  //   dispatch({ type: ACTION_TYPES.SET_LOADING, payload: true });
  //   try {
  //     const response = await productService.getProductById(productId);
  //     dispatch({
  //       type: ACTION_TYPES.SET_CURRENT_PRODUCT,
  //       payload: response.data,
  //     });
  //     return response.data;
  //   } catch (error) {
  //     dispatch({
  //       type: ACTION_TYPES.SET_ERROR,
  //       payload: error.response?.data?.error || "Failed to fetch product",
  //     });
  //     throw error;
  //   }
  // };

  // Clear current product
  const clearCurrentProduct = () => {
    dispatch({ type: ACTION_TYPES.CLEAR_CURRENT_PRODUCT });
  };

  return (
    <ProductContext.Provider
      value={{
        ...state,
        fetchProducts,
        createProduct,
        updateProduct,
        deleteProduct,
        getProductById,
        clearCurrentProduct,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};

// Custom hook to use product context
export function useProduct() {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error("useProduct must be used within a ProductProvider");
  }
  return context;
}
