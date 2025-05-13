// src/pages/RegisterPage.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import { Toaster, toast } from "react-hot-toast";

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Basic validation
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      setIsRegistering(true);
      const response = await register({
        name: formData.firstName + " " + formData.lastName,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
      });

      if (response.success) {
        toast.success(response.message);
        
        setTimeout(
          () => navigate("/verify-otp", { state: { email: formData.email } }),
          2500
        );
      } else {
        setIsRegistering(false);
        toast.error(response.message);
      }

      // Redirect to OTP verification
      //navigate('/verify-otp', { state: { email: formData.email } });
    } catch (err) {
      setIsRegistering(false);
      setError(err.message || "Registration failed");
    }
  };

  return (
    <>
      <Toaster position="top-right" expand={true} richColors />
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Create your account
            </h2>
          </div>
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="rounded-md shadow-sm space-y-4">
              <div className="flex space-x-4">
                <input
                  name="firstName"
                  type="text"
                  required
                  className="flex-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
                  placeholder="First Name"
                  value={formData.firstName}
                  onChange={handleChange}
                />
                <input
                  name="lastName"
                  type="text"
                  required
                  className="flex-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
                  placeholder="Last Name"
                  value={formData.lastName}
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-3 w-full">
                {/* Email Input */}
                <input
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  pattern="[a-z][a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"
                  className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
                  placeholder="Enter Valid Email address"
                  value={formData.email}
                  onChange={handleChange}
                  onInvalid={(e) => e.target.setCustomValidity("Please enter a valid email address")}
                  onInput={(e) => e.target.setCustomValidity("")}


                />

                {/* Password Input with Eye Icon */}
                <div className="relative w-full">
                  <input
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    required
                    pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$"
                    minLength={8}
                    className="appearance-none rounded relative block w-full px-3 pr-10 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                    onInvalid={(e) => e.target.setCustomValidity("Must Contain minimum 1 Uppercase, 1 Lowercase, 1 Number and 1 Special Character")}
                    onInput={(e) => e.target.setCustomValidity("")}
                  />
                  <button
                    type="button"
                    className="absolute top-1/2 right-3 transform -translate-y-1/2 flex items-center text-gray-600 hover:text-green-600 focus:outline-none"
                    onClick={() => setShowPassword(!showPassword)}
                    tabIndex="-1"
                  >
                    {showPassword ? (
                      <EyeIcon className="h-5 w-5" />
                    ) : (
                      <EyeSlashIcon className="h-5 w-5" />
                    )}
                  </button>
                </div>

                {/* Confirm Password Input with Eye Icon */}
                <div className="relative w-full">
                  <input
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    required
                    className="appearance-none relative block w-full px-3 pr-10 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                    placeholder="Confirm Password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                  />
                  <button
                    type="button"
                    className="absolute top-1/2 right-3 transform -translate-y-1/2 flex items-center text-gray-600 hover:text-green-600 focus:outline-none"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    tabIndex="-1"
                  >
                    {showConfirmPassword ? (
                      <EyeIcon className="h-5 w-5" />
                    ) : (
                      <EyeSlashIcon className="h-5 w-5" />
                    )}
                  </button>
                </div>

                {/* Phone Input */}
                <input
                  name="phone"
                  type="tel"
                  required
                  minLength={10}
                  maxLength={10}
                  pattern="[0-9]{10}"
                  className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
                  placeholder="Enter Valid Phone Number"
                  value={formData.phone}
                  onChange={handleChange}
                  onInvalid={(e) => e.target.setCustomValidity("Enter a valid 10-digit phone number")}
                  onInput={(e) => e.target.setCustomValidity("")}

                />
              </div>
            </div>

            {error && (
              <div className="text-red-500 text-sm text-center">{error}</div>
            )}

            <div>
              <button
                type="submit"
                disabled={isRegistering}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
              {isRegistering ? <span>Registering..</span>: "Register"}
              </button>
            </div>
          </form>
          <div className="text-center">
            <p className="mt-2 text-sm text-gray-600">
              Already have an account?{" "}
              <a
                href="/login"
                className="font-medium text-green-600 hover:text-green-500"
              >
                Sign in
              </a>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default RegisterPage;
