import React, { useEffect, useState } from "react";
import { useHistory } from "../../contexts/HistoryContext";
import OrderCard from "./OrderCard";
import { Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

const OrderList = () => {
  const { orders, loading, error, fetchOrders, fetchAllOrders } = useHistory();
  const [cancelledOrders, setCancelledOrders] = useState([]);
  const [canCancelMap, setCanCancelMap] = useState({});
  const navigate = useNavigate();

  const { user, logout } = useAuth();

  useEffect(() => {
    if (!user) return; // optional: skip if user isn't loaded yet

    if (user.isAdmin) {
      fetchAllOrders();
    } else {
      fetchOrders();
    }
  }, [user]);

  //console.log("Orders:", orders);

  const handleCancelOrder = (orderId) => {
    setCancelledOrders([...cancelledOrders, orderId]);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <Loader2 className="animate-spin" size={32} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 text-center">
        Failed to load orders: {error}
      </div>
    );
  }
  if (orders.length === 0) {
    return (
      <div className="text-center py-12 overflow-x-hidden">
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
            d="M3 7l9-4 9 4M3 7v10a2 2 0 002 2h14a2 2 0 002-2V7M3 7l9 5 9-5"
          />
        </svg>
        <h2 className="mt-4 text-xl font-medium text-gray-900">
          No Orders Yet
        </h2>
        <p className="mt-2 text-gray-500">
          Looks like you haven't placed any orders yet.
        </p>
        <Link
          to="/"
          className="mt-6 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Start Shopping
        </Link>
      </div>
    );
  } else {
    //console.log("Orders Length:", orders);
    return (
      <div className="space-y-4 overflow-x-hidden">
        {orders.length === 0 ? (
          <div className="text-center text-gray-500">
            No orders found. Start shopping!
          </div>
        ) : (
          orders.map((order) => (
            <OrderCard
              key={order._id}
              order={order}
              canCancel={order.canCancel}
              onCancelOrder={handleCancelOrder}
              isAdmin={user.isAdmin}
            />
          ))
        )}
      </div>
    );
  }
};

export default OrderList;
