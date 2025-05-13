import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";
import CancelOrderDialog from "./CancelOrderDialog";
import UpdateOrderDialog from "./UpdateOrderDialog";
import OrderDetailModal from "./OrderDetailModal";

const OrderCard = ({ order, onCancelOrder, canCancel, isAdmin }) => {
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const formatDateTime = (dateTimeString) => {
    const dateTime = new Date(dateTimeString);
    const date = dateTime.toLocaleDateString("en-GB");
    const time = dateTime.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
    return `${date}`;
  };
  //console.log(order);
  return (
    <>
      <Card className="rounded-xl">
        <Card
          className={`w-full cursor-pointer bg-white border border-green-200 shadow-sm rounded-xl`}
          onClick={() => setIsDetailsOpen(true)}
        >
          <CardHeader className="flex flex-row items-center justify-between py-1 px-2">
            <h3 className="text-base">
              Order:{" "}
              <span
                className={`font-semibold text-lg ${
                  order.status === "cancelled"
                    ? "text-red-600"
                    : order.status === "delivered"
                    ? "text-green-800"
                    : "text-indigo-800"
                }`}
              >
                {order.status}
              </span>
            </h3>

            <Badge
              variant="primary"
              className="text-md px-1.5 py-1.5 border border-white-600"
            >
              {formatDateTime(order.orderDate)}
            </Badge>
          </CardHeader>

          <CardContent className="p-4">
            <div className="space-y-2">
              {order.items.map((item, index) => (
                <div key={index} className="flex justify-between">
                  <span>{item.name}</span>
                  <span>Qty: {item.quantity}</span>
                </div>
              ))}
              <div className="border-t pt-2 mt-2 flex justify-between font-semibold">
                <span>Total Amount</span>
                <span>₹{order.total}</span>
              </div>
            </div>
          </CardContent>
        </Card>
        {canCancel && !isAdmin && (
          <div className="bg-red-400 rounded-b-md -mt-1">
            <CancelOrderDialog
              orderId={order._id}
              onCancel={onCancelOrder}
              isAdmin={isAdmin}
            />
          </div>
        )}
        {isAdmin && (
          <div className="flex flex-row rounded-b-md border border-green-200 border-t-0 p-0.2 space-x-0.5 w-full">
            <div
              className={`${
                order.status === "cancelled" ? "bg-red-300" : "bg-red-400"
              } rounded-bl-md -mt-1.5 w-1/2`}
            >
              <CancelOrderDialog
                orderId={order._id}
                onCancel={onCancelOrder}
                isAdmin={isAdmin}
                orderStatus={order.status}
              />
            </div>

            <div className="bg-blue-400 rounded-br-md -mt-1.5 w-1/2">
              <UpdateOrderDialog
                orderId={order._id}
                isAdmin={isAdmin}
                orderStatus={order.status}
              />
            </div>
          </div>
        )}
      </Card>
      <OrderDetailModal
        order={order}
        isOpen={isDetailsOpen}
        onOpenChange={setIsDetailsOpen}
      />
    </>
  );
};

export default OrderCard;
