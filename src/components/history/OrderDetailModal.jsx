import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "../ui/dialog";

const OrderDetailModal = ({ order, isOpen, onOpenChange }) => {
  if (!order) return null;

  // Handle click on the modal to close it
  const handleModalClick = (e) => {
    // Close the modal when clicked
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent
        className="w-[90vw] sm:max-w-[480px] max-h-[85vh] overflow-y-auto bg-white p-0 rounded-xl shadow-xl"
        onClick={handleModalClick}
      >
        {/* Close button */}

        <DialogHeader className="bg-gradient-to-r from-blue-100 to-indigo-100 p-6 rounded-t-xl">
          <DialogTitle className="text-xl font-bold">Order Details</DialogTitle>
          <DialogDescription className="text-md ">
            Detailed information about your order
          </DialogDescription>
        </DialogHeader>

        <div className="p-3 space-y-2">
          <div>
            <h3 className="font-medium mb-3 text-base text-green-700">
              Order Items
            </h3>
            <div className="max-h-48 overflow-y-auto pr-1 bg-blue-50 rounded-lg p-3">
              {order.items.map((item, index) => (
                <div
                  key={index}
                  className="flex justify-between py-3 border-b border-blue-100 last:border-b-0"
                >
                  <span className="font-medium text-gray-800">{item.name}</span>
                  <span className="text-gray-600 bg-white px-2 py-1 rounded-md text-sm">
                    Qty: {item.quantity}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-amber-50 p-4 rounded-lg border border-amber-100">
            <h3 className="font-medium mb-2 text-base text-amber-800">
              Delivery Address
            </h3>
            <p className="text-sm mb-1 text-gray-700">{order.address.name}</p>
            <p className="text-sm mb-1 text-gray-700">
              {order.address.addressLine1}
            </p>
            <p className="text-sm mb-1 text-gray-700">{order.address.city}</p>
            <p className="text-sm mb-1 text-gray-700">
              {order.address.pincode}
            </p>
            {/* {order.address} */}
            <p className="text-sm text-gray-600">Phone: {order.phone}</p>
          </div>

          <div className="flex justify-between font-semibold text-lg pt-4 mt-2 border-t border-gray-200">
            <span className="text-gray-800">Total Amount</span>
            <span className="text-emerald-600 bg-emerald-50 px-4 py-1 rounded-md">
              ₹{order.total}
            </span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OrderDetailModal;
