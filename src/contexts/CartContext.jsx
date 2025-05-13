// src/contexts/CartContext.jsx
import React, { createContext, useReducer, useContext } from "react";
import cartService from "../services/cartService";
import { useEffect } from "react";
// Initial state for the cart
const initialState = {
  items: [],
  savedForLater: [],
  total: 0,
  loading: false,
  error: null,
};

// Action types
const CART_ACTIONS = {
  FETCH_CART_REQUEST: "FETCH_CART_REQUEST",
  FETCH_CART_SUCCESS: "FETCH_CART_SUCCESS",
  FETCH_CART_FAILURE: "FETCH_CART_FAILURE",
  ADD_TO_CART_REQUEST: "ADD_TO_CART_REQUEST",
  ADD_TO_CART_SUCCESS: "ADD_TO_CART_SUCCESS",
  ADD_TO_CART_FAILURE: "ADD_TO_CART_FAILURE",
  UPDATE_CART_ITEM_REQUEST: "UPDATE_CART_ITEM_REQUEST",
  UPDATE_CART_ITEM_SUCCESS: "UPDATE_CART_ITEM_SUCCESS",
  UPDATE_CART_ITEM_FAILURE: "UPDATE_CART_ITEM_FAILURE",
  REMOVE_CART_ITEM_REQUEST: "REMOVE_CART_ITEM_REQUEST",
  REMOVE_CART_ITEM_SUCCESS: "REMOVE_CART_ITEM_SUCCESS",
  REMOVE_CART_ITEM_FAILURE: "REMOVE_CART_ITEM_FAILURE",
  SAVE_FOR_LATER_REQUEST: "SAVE_FOR_LATER_REQUEST",
  SAVE_FOR_LATER_SUCCESS: "SAVE_FOR_LATER_SUCCESS",
  SAVE_FOR_LATER_FAILURE: "SAVE_FOR_LATER_FAILURE",
  MOVE_TO_CART_REQUEST: "MOVE_TO_CART_REQUEST",
  MOVE_TO_CART_SUCCESS: "MOVE_TO_CART_SUCCESS",
  MOVE_TO_CART_FAILURE: "MOVE_TO_CART_FAILURE",
  CLEAR_CART_REQUEST: "CLEAR_CART_REQUEST",
  CLEAR_CART_SUCCESS: "CLEAR_CART_SUCCESS",
  CLEAR_CART_FAILURE: "CLEAR_CART_FAILURE",
};

// Reducer function
const cartReducer = (state, action) => {
  switch (action.type) {
    case CART_ACTIONS.FETCH_CART_REQUEST:
    case CART_ACTIONS.ADD_TO_CART_REQUEST:
    case CART_ACTIONS.UPDATE_CART_ITEM_REQUEST:
    case CART_ACTIONS.REMOVE_CART_ITEM_REQUEST:
    case CART_ACTIONS.SAVE_FOR_LATER_REQUEST:
    case CART_ACTIONS.MOVE_TO_CART_REQUEST:
    case CART_ACTIONS.CLEAR_CART_REQUEST:
      return { ...state, loading: true, error: null };

    case CART_ACTIONS.FETCH_CART_SUCCESS:
    case CART_ACTIONS.ADD_TO_CART_SUCCESS:
    case CART_ACTIONS.UPDATE_CART_ITEM_SUCCESS:
    case CART_ACTIONS.REMOVE_CART_ITEM_SUCCESS:
    case CART_ACTIONS.SAVE_FOR_LATER_SUCCESS:
    case CART_ACTIONS.MOVE_TO_CART_SUCCESS:
    case CART_ACTIONS.CLEAR_CART_SUCCESS:
      return {
        ...state,
        loading: false,
        items: action.payload.data.items,
        savedForLater: action.payload.data.savedForLater,
        total: action.payload.data.total,
        error: null,
      };

    case CART_ACTIONS.FETCH_CART_FAILURE:
    case CART_ACTIONS.ADD_TO_CART_FAILURE:
    case CART_ACTIONS.UPDATE_CART_ITEM_FAILURE:
    case CART_ACTIONS.REMOVE_CART_ITEM_FAILURE:
    case CART_ACTIONS.SAVE_FOR_LATER_FAILURE:
    case CART_ACTIONS.MOVE_TO_CART_FAILURE:
    case CART_ACTIONS.CLEAR_CART_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    default:
      return state;
  }
};

// Create context
const CartContext = createContext();

// Provider component
export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  // Cart actions
  const fetchCart = async () => {
    dispatch({ type: CART_ACTIONS.FETCH_CART_REQUEST });
    try {
      const response = await cartService.getCart();
      //console.log('Response:', response.data);
      dispatch({
        type: CART_ACTIONS.FETCH_CART_SUCCESS,
        payload: response.data,
      });
    } catch (error) {
      dispatch({
        type: CART_ACTIONS.FETCH_CART_FAILURE,
        payload: error.response?.data?.message || "Failed to fetch cart",
      });
    }
  };

  const addToCart = async (productId, quantity = 1) => {
    dispatch({ type: CART_ACTIONS.ADD_TO_CART_REQUEST });
    try {
      const response = await cartService.addToCart(productId, quantity);
      dispatch({
        type: CART_ACTIONS.ADD_TO_CART_SUCCESS,
        payload: response.data,
      });
      return response.data;
    } catch (error) {
      dispatch({
        type: CART_ACTIONS.ADD_TO_CART_FAILURE,
        payload: error.response?.data?.message || "Failed to add to cart",
      });
      throw error;
    }
  };

  const updateCartItem = async (itemId, quantity) => {
    //console.log("cart context",itemId)
    dispatch({ type: CART_ACTIONS.UPDATE_CART_ITEM_REQUEST });
    try {
      const response = await cartService.updateCartItem(itemId, quantity);
      dispatch({
        type: CART_ACTIONS.UPDATE_CART_ITEM_SUCCESS,
        payload: response.data,
      });
    } catch (error) {
      dispatch({
        type: CART_ACTIONS.UPDATE_CART_ITEM_FAILURE,
        payload: error.response?.data?.message || "Failed to update cart item",
      });
      throw error;
    }
  };

  const removeCartItem = async (itemId) => {
    dispatch({ type: CART_ACTIONS.REMOVE_CART_ITEM_REQUEST });
    try {
      const response = await cartService.removeCartItem(itemId);
      dispatch({
        type: CART_ACTIONS.REMOVE_CART_ITEM_SUCCESS,
        payload: response.data,
      });
    } catch (error) {
      dispatch({
        type: CART_ACTIONS.REMOVE_CART_ITEM_FAILURE,
        payload: error.response?.data?.message || "Failed to remove cart item",
      });
      throw error;
    }
  };

  const saveForLater = async (itemId) => {
    dispatch({ type: CART_ACTIONS.SAVE_FOR_LATER_REQUEST });
    try {
      const response = await cartService.saveForLater(itemId);
      dispatch({
        type: CART_ACTIONS.SAVE_FOR_LATER_SUCCESS,
        payload: response.data,
      });
    } catch (error) {
      dispatch({
        type: CART_ACTIONS.SAVE_FOR_LATER_FAILURE,
        payload:
          error.response?.data?.message || "Failed to save item for later",
      });
      throw error;
    }
  };

  const moveToCart = async (itemId) => {
    dispatch({ type: CART_ACTIONS.MOVE_TO_CART_REQUEST });
    try {
      const response = await cartService.moveToCart(itemId);
      dispatch({
        type: CART_ACTIONS.MOVE_TO_CART_SUCCESS,
        payload: response.data,
      });
    } catch (error) {
      dispatch({
        type: CART_ACTIONS.MOVE_TO_CART_FAILURE,
        payload: error.response?.data?.message || "Failed to move item to cart",
      });
      throw error;
    }
  };

  const clearCart = async () => {
    dispatch({ type: CART_ACTIONS.CLEAR_CART_REQUEST });
    try {
      const response = await cartService.clearCart();
      dispatch({
        type: CART_ACTIONS.CLEAR_CART_SUCCESS,
        payload: response.data,
      });
    } catch (error) {
      dispatch({
        type: CART_ACTIONS.CLEAR_CART_FAILURE,
        payload: error.response?.data?.message || "Failed to clear cart",
      });
      throw error;
    }
  };

  return (
    <CartContext.Provider
      value={{
        ...state,
        fetchCart,
        addToCart,
        updateCartItem,
        removeCartItem,
        saveForLater,
        moveToCart,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

// Custom hook to use the cart context
export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
