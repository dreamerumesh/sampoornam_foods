// src/contexts/HistoryContext.jsx
import React, { createContext, useContext, useReducer } from "react";
import { historyService } from "../services/historyService";

// Initial state
const initialState = {
  orders: [],
  loading: false,
  error: null,
  currentOrder: null,
  canCancel: false,
};

// Action types
const FETCH_ORDERS_REQUEST = "FETCH_ORDERS_REQUEST";
const FETCH_ORDERS_SUCCESS = "FETCH_ORDERS_SUCCESS";
const FETCH_ORDERS_FAILURE = "FETCH_ORDERS_FAILURE";
const FETCH_ALL_ORDERS_REQUEST = "FETCH_ALL_ORDERS_REQUEST";
const FETCH_ALL_ORDERS_SUCCESS = "FETCH_ALL_ORDERS_SUCCESS";
const FETCH_ALL_ORDERS_FAILURE = "FETCH_ALL_ORDERS_FAILURE";

const PLACE_ORDER_REQUEST = "PLACE_ORDER_REQUEST";
const PLACE_ORDER_SUCCESS = "PLACE_ORDER_SUCCESS";
const PLACE_ORDER_FAILURE = "PLACE_ORDER_FAILURE";
const CANCEL_ORDER_REQUEST = "CANCEL_ORDER_REQUEST";
const CANCEL_ORDER_SUCCESS = "CANCEL_ORDER_SUCCESS";
const CANCEL_ORDER_FAILURE = "CANCEL_ORDER_FAILURE";

const CANCEL_ORDER_REQUEST_BY_ADMIN = "CANCEL_ORDER_REQUEST_BY_ADMIN";
const CANCEL_ORDER_SUCCESS_BY_ADMIN = "CANCEL_ORDER_SUCCESS_BY_ADMIN";
const CANCEL_ORDER_FAILURE_BY_ADMIN = "CANCEL_ORDER_FAILURE_BY_ADMIN";

const UPDATE_ORDER_REQUEST_BY_ADMIN = "UPDATE_ORDER_REQUEST_BY_ADMIN";
const UPDATE_ORDER_SUCCESS_BY_ADMIN = "UPDATE_ORDER_SUCCESS_BY_ADMIN";
const UPDATE_ORDER_FAILURE_BY_ADMIN = "UPDATE_ORDER_FAILURE_BY_ADMIN";

const CHECK_CANCEL_ORDER_REQUEST = "CHECK_CANCEL_ORDER_REQUEST";
const CHECK_CANCEL_ORDER_SUCCESS = "CHECK_CANCEL_ORDER_SUCCESS";
const CHECK_CANCEL_ORDER_FAILURE = "CHECK_CANCEL_ORDER_FAILURE";

// Reducer
const historyReducer = (state, action) => {
  switch (action.type) {
    case FETCH_ORDERS_REQUEST:
      return { ...state, loading: true, error: null };
    case FETCH_ORDERS_SUCCESS:
      return { ...state, loading: false, orders: action.payload, error: null };
    case FETCH_ORDERS_FAILURE:
      return { ...state, loading: false, error: action.payload };
    case FETCH_ALL_ORDERS_REQUEST:
      return { ...state, loading: true, error: null };
    case FETCH_ALL_ORDERS_SUCCESS:
      return { ...state, loading: false, orders: action.payload, error: null };
    case FETCH_ALL_ORDERS_FAILURE:
      return { ...state, loading: false, error: action.payload };

    case PLACE_ORDER_REQUEST:
      return { ...state, loading: true, error: null };
    case PLACE_ORDER_SUCCESS:
      return {
        ...state,
        loading: false,
        orders: [action.payload, ...state.orders],
        currentOrder: action.payload,
        error: null,
      };
    case PLACE_ORDER_FAILURE:
      return { ...state, loading: false, error: action.payload };
    case CANCEL_ORDER_REQUEST:
      return { ...state, loading: true, error: null };
    case CANCEL_ORDER_SUCCESS:
      return {
        ...state,
        loading: false,
        orders: state.orders.map((order) =>
          order._id === action.payload._id ? action.payload : order
        ),
        error: null,
      };
    case CANCEL_ORDER_FAILURE:
      return { ...state, loading: false, error: action.payload };
    case CANCEL_ORDER_REQUEST_BY_ADMIN:
      return { ...state, loading: true, error: null };
    case CANCEL_ORDER_SUCCESS_BY_ADMIN:
      return {
        ...state,
        loading: false,
        orders: state.orders.map((order) =>
          order._id === action.payload._id ? action.payload : order
        ),
        error: null,
      };
    case CANCEL_ORDER_FAILURE_BY_ADMIN:
      return { ...state, loading: false, error: action.payload };
    case UPDATE_ORDER_REQUEST_BY_ADMIN:
      return { ...state, loading: true, error: null };
    case UPDATE_ORDER_SUCCESS_BY_ADMIN:
      return {
        ...state,
        loading: false,
        orders: state.orders.map((order) =>
          order._id === action.payload._id ? action.payload : order
        ),
        error: null,
      };
    case UPDATE_ORDER_FAILURE_BY_ADMIN:
      return { ...state, loading: false, error: action.payload };
    case CHECK_CANCEL_ORDER_REQUEST:
      return { ...state, loading: true, error: null };
    case CHECK_CANCEL_ORDER_SUCCESS:
      return {
        ...state,
        loading: false,
        canCancel: action.payload.canCancel,
        error: null,
      };
    case CHECK_CANCEL_ORDER_FAILURE:
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

// Create context
const HistoryContext = createContext();

// Provider component
export const HistoryProvider = ({ children }) => {
  const [state, dispatch] = useReducer(historyReducer, initialState);

  // Action creators
  const fetchOrders = async () => {
    dispatch({ type: FETCH_ORDERS_REQUEST });
    try {
      const response = await historyService.getOrderHistory();
      //console.log("Fetched Orders check :", response.data);
      dispatch({
        type: FETCH_ORDERS_SUCCESS,
        payload: response.data,
      });
    } catch (error) {
      dispatch({
        type: FETCH_ORDERS_FAILURE,
        payload: error.response?.data?.message || "Failed to fetch orders",
      });
    }
  };

  const fetchAllOrders = async () => {
    dispatch({ type: FETCH_ALL_ORDERS_REQUEST });
    try {
      const response = await historyService.getAllOrderHistory();
      //console.log("Fetched Orders:", response.data);
      dispatch({
        type: FETCH_ALL_ORDERS_SUCCESS,
        payload: response.data,
      });
    } catch (error) {
      dispatch({
        type: FETCH_ALL_ORDERS_FAILURE,
        payload: error.response?.data?.message || "Failed to fetch orders",
      });
    }
  };

  const placeOrder = async (address) => {
    dispatch({ type: PLACE_ORDER_REQUEST });
    try {
      //console.log("Address being sent to backend:", address);

      const response = await historyService.placeOrder(address);
      //console.log("correct one");
      dispatch({
        type: PLACE_ORDER_SUCCESS,
        payload: response.data,
      });

      return response.data;
    } catch (error) {
      dispatch({
        type: PLACE_ORDER_FAILURE,
        payload: error.response?.data?.message || "Failed to place order",
      });
      console.log("Error checking");
      throw error;
    }
  };

  const cancelOrder = async (orderId) => {
    dispatch({ type: CANCEL_ORDER_REQUEST });
    try {
      const response = await historyService.cancelOrder(orderId);
      dispatch({
        type: CANCEL_ORDER_SUCCESS,
        payload: response.data,
      });
      return response.data;
    } catch (error) {
      dispatch({
        type: CANCEL_ORDER_FAILURE,
        payload: error.response?.data?.message || "Failed to cancel order",
      });
      throw error;
    }
  };

  const cancelOrderByAdmin = async (orderId) => {
    dispatch({ type: CANCEL_ORDER_REQUEST_BY_ADMIN });
    try {
      const response = await historyService.cancelOrderByAdmin(orderId);
      dispatch({
        type: CANCEL_ORDER_SUCCESS_BY_ADMIN,
        payload: response.data,
      });
      return response.data;
    } catch (error) {
      dispatch({
        type: CANCEL_ORDER_FAILURE_BY_ADMIN,
        payload: error.response?.data?.message || "Failed to cancel order",
      });
      throw error;
    }
  };

  const updateOrderByAdmin = async (orderId) => {
    dispatch({ type: UPDATE_ORDER_REQUEST_BY_ADMIN });
    try {
      const response = await historyService.updateOrderByAdmin(orderId);
      dispatch({
        type: UPDATE_ORDER_SUCCESS_BY_ADMIN,
        payload: response.data,
      });
      return response.data;
    } catch (error) {
      dispatch({
        type: UPDATE_ORDER_FAILURE_BY_ADMIN,
        payload: error.response?.data?.message || "Failed to cancel order",
      });
      throw error;
    }
  };

  const checkCancelEligibility = async (orderId) => {
    dispatch({ type: CHECK_CANCEL_ORDER_REQUEST });
    try {
      const response = await historyService.checkCancelEligibility(orderId);
      //console.log(response.data);
      dispatch({
        type: CHECK_CANCEL_ORDER_SUCCESS,
        payload: response,
      });
      return response;
    } catch (error) {
      dispatch({
        type: CHECK_CANCEL_ORDER_FAILURE,
        payload:
          error.response?.data?.message ||
          "Failed to check cancellation eligibility",
      });
      throw error;
    }
  };

  return (
    <HistoryContext.Provider
      value={{
        ...state,
        fetchOrders,
        fetchAllOrders,
        placeOrder,
        cancelOrder,
        cancelOrderByAdmin,
        updateOrderByAdmin,
        checkCancelEligibility,
      }}
    >
      {children}
    </HistoryContext.Provider>
  );
};

// Custom hook to use the HistoryContext
export function useHistory() {
  const context = useContext(HistoryContext);
  if (!context) {
    throw new Error("useHistory must be used within a HistoryProvider");
  }
  return context;
}
