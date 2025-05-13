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

const UpdateOrderDialog = ({ orderId, onUpdate, orderStatus }) => {
  const { updateOrderByAdmin } = useHistory();

  const handleUpdateOrder = async () => {
    try {
      const response = await updateOrderByAdmin(orderId);
      console.log(response.data);
      toast.success("Order updated successfully");
      onUpdate(orderId);
    } catch (error) {
      toast.error("Failed to update order", {
        description: error.message,
      });
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant="default"
          className={`w-full ${
            orderStatus === "deliverd" ? "cursor-not-allowed opacity-50" : ""
          }`}
          disabled={orderStatus === "cancelled" || orderStatus === "delivered"}

        >
          Update Order
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="w-[90%] max-w-sm mx-auto bg-white text-black rounded-xl">
        <AlertDialogHeader>
          <AlertDialogTitle>
            Are you sure you want to Confirm this order?
          </AlertDialogTitle>
          <AlertDialogDescription>
            This action will modify the current order details.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="bg-gray-300">Cancel</AlertDialogCancel>
          <AlertDialogAction
            className="bg-blue-500"
            onClick={handleUpdateOrder}
          >
            Yes, Confirm Order
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default UpdateOrderDialog;
