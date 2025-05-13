import React from "react";
import { Button } from "../ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";
import { useHistory } from "@/contexts/HistoryContext";
import { toast } from "sonner";

const CancelOrderDialog = ({ orderId, onCancel, isAdmin, orderStatus }) => {
  const { cancelOrder, cancelOrderByAdmin } = useHistory();

  const handleCancelOrder = async () => {
    try {
      const response = isAdmin
        ? await cancelOrderByAdmin(orderId)
        : await cancelOrder(orderId);

      console.log(response.data);
      toast.success("Order cancelled successfully");
      onCancel(orderId);
    } catch (error) {
      toast.error("Failed to cancel order", {
        description: error.message,
      });
    }
  };
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant="destructive"
          className={`w-full ${
            orderStatus === "cancelled" ? "cursor-not-allowed opacity-50" : ""
          }`}
          disabled={orderStatus === "cancelled" || orderStatus === "delivered"}

        >
          Cancel Order
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="w-[90%] max-w-sm mx-auto bg-white text-black rounded-xl">
        <AlertDialogHeader>
          <AlertDialogTitle>
            Are you sure you want to cancel this order?
          </AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. Your order will be cancelled.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="bg-green-400">
            No, Keep Order
          </AlertDialogCancel>
          <AlertDialogAction className="bg-red-400" onClick={handleCancelOrder}>
            Yes, Cancel Order
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default CancelOrderDialog;
