import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useProduct } from "../contexts/ProductContext";
import { useCart } from "../contexts/CartContext";
import axiosInstance from "../utils/axiosConfig";
import AddProductModal from "../components/AddProductModal";
import { Link } from "react-router-dom";
import { CheckCircle } from "lucide-react";

const ProductCard = ({ product, isAdmin }) => {
  const { user } = useAuth();
  const { addToCart } = useCart();
  const { updateProduct } = useProduct();
  const [isEditing, setIsEditing] = useState(false);
  const [isAdded, setIsAdded] = useState(false);
  //console.log(product);

  const handleAddToCart = async () => {
    if (!user) {
      // Redirect to login or show login modal
      window.location.href = "/login";
      return;
    }

    try {
      const response = await addToCart(product._id, 1);
      console.log("product._id", product._id);
      // Optionally, show success message or update UI
      //console.log("Product added to cart:", response);
    } catch (error) {
      console.error("Failed to add to cart:", error);
      // Optionally show error message to the user
      alert("Something went wrong while adding to cart.");
    }
  };

  const handleClick = () => {
    handleAddToCart(); // Call original add to cart logic

    setIsAdded(true); // Show success message

    // Hide it after 3 seconds
    setTimeout(() => {
      setIsAdded(false);
    }, 500);
  };

  const handleToggleActive = async () => {
    if (!isAdmin) return;

    try {
      await updateProduct(product._id, {
        ...product,
        isActive: !product.isActive,
      });
    } catch (error) {
      console.error("Failed to toggle product status", error);
    }
  };

  const isMainImage = product.images?.find((img) => img.isMain)?.fileId;
  const imageUrl = isMainImage
    ? `${axiosInstance.defaults.baseURL}/products/image/${isMainImage}`
    : "/placeholder-image.png";

  const renderAdminControls = () => {
    if (!isAdmin) return null;

    return (
      <>

        <button
          onClick={() => setIsEditing(true)}
          disabled={!product.isActive}
          className="bg-green-700 text-white px-2 py-1 rounded-md hover:bg-green-700 transition"
        >
          Edit
        </button>
        <button
          onClick={handleToggleActive}
          className={`px-2 py-1 rounded-md transition ${
            product.isActive
              ? "bg-red-600 text-white hover:bg-red-700"
              : "bg-green-600 text-white hover:bg-green-700"
          }`}
        >
          {product.isActive ? "Remove" : "Add"}
        </button>
      </>
    );
  };

  return (
    <>
    <div
      className={`bg-white rounded-lg shadow-md p-2 relative transition ${
        !product.isActive ? "grayscale" : ""
      }`}
    >
      <Link to={`/product/${product._id}`} className="block">
        <img
          src={imageUrl}
          alt={product.name}
          className="w-full h-36 object-cover rounded-t-lg mb-2"
        />

        <h3 className="text-lg font-semibold text-emerald-700 mb-0">
          {product.name}
        </h3>

        <p className="text-gray-600 mb-1 truncate w-full">
          {product.description}
        </p>
      </Link>
      <div className="flex justify-between items-center w-full">
        <span className="text-md lg:text-[15px] font-bold">
          ₹{`${product.price}`} / {`${product.size} ${product.unit}`}
        </span>

        {
        !isAdmin && (
          <button
            onClick={handleClick}
            disabled={isAdded}
            className={`${
              isAdded
                ? "bg-green-300 cursor-not-allowed"
                : "bg-green-700 hover:bg-green-600"
            } text-white px-2 py-1 rounded transition flex items-center`}
          >
            {isAdded ? (
              <>
                <CheckCircle className="mr-1" size={20} />
                Added
              </>
            ) : (
              "Add to Cart"
            )}
          </button>
        )}

        {isAdmin && (
          <div className="flex space-x-2">{renderAdminControls()}</div>
        )}
       </div>
      {isEditing && (
      <AddProductModal
        onClose={() => setIsEditing(false)}
          initialProduct={product}
       />
       )}
   </div> 
   </>
  );
  
};

export default ProductCard;
