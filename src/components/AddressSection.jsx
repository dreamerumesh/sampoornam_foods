// src/components/AddressSection.jsx
import { useState, useEffect } from "react";
import { useAddress } from "../contexts/AddressContext";
import { useHistory } from "../contexts/HistoryContext";
import { useNavigate } from "react-router-dom";

const AddressSection = () => {
  const {
    addresses,
    defaultAddressIndex,
    loading,
    error,
    fetchAddresses,
    addAddress,
    updateAddress,
    deleteAddress,
    setDefaultAddress,
  } = useAddress();
  const navigate = useNavigate();
  const { placeOrder } = useHistory();
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [editingAddressIndex, setEditingAddressIndex] = useState(null);
  const [selectedAddressIndex, setSelectedAddressIndex] = useState(null);
  const [orderPlacing, setOrderPlacing] = useState(false);

  useEffect(() => {
    fetchAddresses();
  }, [fetchAddresses]);

  //console.log("Addresses:", addresses);

  const openAddressModal = (index = null) => {
    setEditingAddressIndex(index);
    setIsAddressModalOpen(true);
  };

  const closeAddressModal = () => {
    setEditingAddressIndex(null);
    setIsAddressModalOpen(false);
  };

  const openConfirmModal = () => {
    setIsConfirmModalOpen(true);
  };

  const closeConfirmModal = () => {
    setIsConfirmModalOpen(false);
  };

  const handleSaveAddress = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const addressData = {
      name: formData.get("name"),
      addressLine1: formData.get("address"),
      city: formData.get("city"),
      state: formData.get("state"),
      pincode: formData.get("pincode"),
      phone: formData.get("mobile"),
      type: formData.get("type"),
      country: "India",
    };

    try {
      if (editingAddressIndex !== null) {
        await updateAddress(editingAddressIndex, addressData);
      } else {
        await addAddress(addressData);
      }
      closeAddressModal();
    } catch (err) {
      console.error("Failed to save address:", err);
    }
  };

  const handleDelete = async (index) => {
    try {
      await deleteAddress(index);
      setSelectedAddressIndex(null);
    } catch (err) {
      console.error("Failed to delete address:", err);
    }
  };

  const handleSetDefault = async (index) => {
    try {
      await setDefaultAddress(index);
    } catch (err) {
      console.error("Failed to set default address:", err);
    }
  };

  const handlePlaceOrder = async () => {
    try {
      setOrderPlacing(true);
      // Call your place-order endpoint with the default address
      const defaultAddress = addresses[defaultAddressIndex];
      //console.log(defaultAddress);
      const data = await placeOrder(defaultAddress);

      //console.log(data.success);
      //console.log(data)
      if (data.success) {
        // Handle successful order placement
        alert("Order placed successfully!");
        closeConfirmModal();
        setTimeout(() => {
          navigate("/");
        }, 1000);
      } else {
        alert(`Failed to place order: ${data.message}`);
      }
    } catch (error) {
      console.error("Failed to place order:", error);

      const errorMessage =
        error.response?.data?.message || "Something went wrong";
      alert(`Order failed: ${errorMessage}`);
    } finally {
      setOrderPlacing(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-lg mx-auto p-4 flex justify-center items-center">
        <div className="animate-pulse text-blue-500">Loading addresses...</div>
      </div>
    );
  }
  //console.log(addresses);
  return (
    <div className="max-w-lg mx-auto p-4 mt-16 sm:p-6">
      <h2 className="text-xl font-bold mb-4">All Addresses</h2>

      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>
      )}

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-4">
        <button
          className="w-full sm:w-auto bg-blue-400 text-white px-4 py-2 rounded hover:bg-blue-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={() => openAddressModal()}
          disabled={addresses.length >= 3}
        >
          Add New Address
        </button>
        <button
          className="w-full sm:w-auto bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={openConfirmModal}
          disabled={addresses.length === 0}
        >
          Deliver to Selected Address
        </button>
      </div>

      {addresses.length === 0 ? (
        <div className="text-center p-6 border border-dashed rounded">
          <p className="text-gray-500">
            No addresses added yet. Add your first address!
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {addresses.map((address, index) => (
            <div
              key={index}
              className={`border p-4 rounded mb-2 cursor-pointer transition ${
                defaultAddressIndex === index
                  ? "border-green-500 bg-green-50"
                  : "hover:border-gray-400"
              }`}
              onClick={() =>
                setSelectedAddressIndex(
                  selectedAddressIndex === index ? null : index
                )
              }
            >
              <div className="flex justify-between">
                <div className="w-full">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
                    <p className="font-semibold">
                      {address.name} ({address.type || "Home"})
                      {defaultAddressIndex === index && (
                        <span className="ml-2 text-sm text-green-600">
                          (Default)
                        </span>
                      )}
                    </p>
                    <p className="text-sm text-gray-500">{address.phone}</p>
                  </div>
                  <p className="text-sm md:text-base mt-1">
                    {address.addressLine1}, {address.city}, {address.state} -{" "}
                    {address.pincode}
                  </p>
                </div>
              </div>

              {selectedAddressIndex === index && (
                <div className="mt-3 flex flex-col sm:flex-row gap-2">
                  {defaultAddressIndex !== index && (
                    <button
                      className="w-1/2 bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 transition"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSetDefault(index);
                      }}
                    >
                      Set as Default
                    </button>
                  )}
                  <div className="w-full flex gap-2">
                    <button
                      className="w-1/3 bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 transition"
                      onClick={(e) => {
                        e.stopPropagation();
                        openAddressModal(index);
                      }}
                    >
                      Edit
                    </button>
                    <button
                      className="w-1/3 bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(index);
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Address Edit/Add Modal */}
      {isAddressModalOpen && (
        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="min-h-screen px-4 text-center">
            <div
              className="fixed inset-0 bg-black opacity-30"
              onClick={closeAddressModal}
            ></div>

            {/* This element centers the modal */}
            <span className="inline-block h-screen align-middle" inert>
              &#8203;
            </span>

            <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
              <h3 className="text-lg font-semibold mb-4">
                {editingAddressIndex !== null
                  ? "Edit Address"
                  : "Add New Address"}
              </h3>

              <form
                onSubmit={handleSaveAddress}
                className="flex flex-col gap-3"
              >
                <input
                  type="text"
                  name="name"
                  defaultValue={
                    editingAddressIndex !== null
                      ? addresses[editingAddressIndex]?.name
                      : ""
                  }
                  placeholder="Full Name"
                  required
                  className="border p-2 rounded"
                />

                <input
                  type="text"
                  name="mobile"
                  defaultValue={
                    editingAddressIndex !== null
                      ? addresses[editingAddressIndex]?.phone
                      : ""
                  }
                  placeholder="Mobile Number"
                  required
                  minLength={10}
                  maxLength={10}
                  pattern="\d{10}"
                  inputMode="numeric"
                  onInvalid={(e) => e.target.setCustomValidity("Enter a valid 10-digit phone number")}
                  onInput={(e) => e.target.setCustomValidity("")}
                  className="border p-2 rounded"
                />

                <input
                  type="text"
                  name="address"
                  defaultValue={
                    editingAddressIndex !== null
                      ? addresses[editingAddressIndex]?.addressLine1
                      : ""
                  }
                  placeholder="Flat, House no., Building, Company"
                  required
                  className="border p-2 rounded"
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    type="text"
                    name="pincode"
                    defaultValue={
                      editingAddressIndex !== null
                        ? addresses[editingAddressIndex]?.pincode
                        : ""
                    }
                    placeholder="Pincode"
                    required
                    className="border p-2 rounded"
                  />

                  <input
                    type="text"
                    name="city"
                    defaultValue={
                      editingAddressIndex !== null
                        ? addresses[editingAddressIndex]?.city
                        : ""
                    }
                    placeholder="Town/City"
                    required
                    className="border p-2 rounded"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    type="text"
                    name="state"
                    defaultValue={
                      editingAddressIndex !== null
                        ? addresses[editingAddressIndex]?.state
                        : ""
                    }
                    placeholder="State"
                    required
                    className="border p-2 rounded"
                  />

                  <select
                    name="type"
                    defaultValue={
                      editingAddressIndex !== null
                        ? addresses[editingAddressIndex]?.type || "Home"
                        : "Home"
                    }
                    className="border p-2 rounded"
                    required
                  >
                    <option value="Home">Home</option>
                    <option value="Work">Work</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="flex flex-col sm:flex-row gap-2 mt-4">
                  <button
                    type="submit"
                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500 transition"
                    onClick={closeAddressModal}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Order Confirmation Modal */}
      {isConfirmModalOpen && addresses.length > 0 && (
        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="min-h-screen px-4 text-center">
            <div
              className="fixed inset-0 bg-black opacity-30"
              onClick={closeConfirmModal}
            ></div>

            {/* This element centers the modal */}
            <span className="inline-block h-screen align-middle" inert>
              &#8203;
            </span>

            <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
              <h3 className="text-lg font-semibold mb-4">Confirm Order</h3>

              <div className="mb-4">
                <p className="font-medium">Delivery Address:</p>
                <div className="mt-2 p-3 border rounded bg-green-50">
                  <p className="font-medium">
                    {addresses[defaultAddressIndex].name} (
                    {addresses[defaultAddressIndex].type || "Home"})
                  </p>
                  <p>{addresses[defaultAddressIndex].addressLine1}</p>
                  <p>
                    {addresses[defaultAddressIndex].city},{" "}
                    {addresses[defaultAddressIndex].state} -{" "}
                    {addresses[defaultAddressIndex].pincode}
                  </p>
                  <p>Phone: {addresses[defaultAddressIndex].phone}</p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-2 mt-6">
                <button
                  onClick={handlePlaceOrder}
                  disabled={orderPlacing}
                  className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {orderPlacing ? "Placing Order..." : "Place Order"}
                </button>
                <button
                  className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500 transition"
                  onClick={closeConfirmModal}
                  disabled={orderPlacing}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddressSection;
