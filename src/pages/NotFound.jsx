import React from "react";
import { Link } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";

const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#eaffea] text-green-800 px-4">
      <h1 className="text-6xl font-bold mb-4">404</h1>
      <h2 className="text-2xl font-semibold mb-2 text-center" >Page Not Found Or Under Construction</h2>
      <p className="text-center max-w-md mb-6">
        Oops! The page you're looking for doesn’t exist. It might have been under construction or
        removed or the URL might be incorrect.
      </p>
      <Link
        to="/"
        className="inline-flex items-center gap-2 bg-green-500 text-white px-6 py-2 rounded-full shadow-md hover:bg-green-600 transition"
      >
        <FaArrowLeft />
        Back to Home
      </Link>
    </div>
  );
};

export default NotFound;
