import React from "react";
import { HistoryProvider } from "@/contexts/HistoryContext";
import OrderList from "./OrderList";

const OrderHistoryPage = () => {
  return (
    <HistoryProvider>
      <div className="mx-auto px-4 py-8 w-[95%] md:w-[75%] lg:w-[60%] xl:w-[50%] mt-6">
        <h1 className="text-lg font-bold mb-3">Order History</h1>
        <OrderList />
      </div>
    </HistoryProvider>
  );
};

export default OrderHistoryPage;
