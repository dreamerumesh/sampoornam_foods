import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Toaster, toast } from "react-hot-toast";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev); // Toggle the state between true and false
  };

  const handleSubmit = async (e) => {
    setIsLoggingIn(true);
    e.preventDefault();
    setError("");

    try {
      const response = await login({ email, password });
      setIsLoggingIn(false);
      //console.log(response);

      if (response.success) {
        toast.success("Login Successful!");
        setTimeout(() => navigate("/"), 1500); // Redirect after 1.5s
      } else if (
        !response.success &&
        response.message ===
          "Account not verified. A new OTP has been sent to your email."
      ) {
        setError("Account not Verified Please Verifiy");
        setTimeout(
          () => navigate("/verify-otp", { state: { email: email } }),
          1500
        );
      } else if (
        !response.success &&
        response.message === "Invalid credentials"
      ) {
        setError("Invalid credentials");
      }
      else if (!response.success && response.message === "No user found") {
        setError("User not found");
      }
    } catch (err) {
      setIsLoggingIn(true);
      setError(err.message || "Login failed");
      
    }
  };

  return (
    <>
      <Toaster position="top-right" expand={true} richColors />

      <div className="min-h-screen flex flex-col items-center pt-24 pb-12 px-4 sm:px-6 lg:px-8 bg-gray-50 overflow-x-hidden">
        <div className="max-w-md w-full space-y-8">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Sign in to your account
            </h2>
          </div>
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <input type="hidden" name="remember" defaultValue="true" />
            <div className="rounded-md shadow-sm -space-y-px">
              <div>
                <label htmlFor="email-address" className="sr-only">
                  Email address
                </label>
                <input
                  id="email-address"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="relative w-full">
                <label htmlFor="password" className="sr-only">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 pr-10 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                {/* Eye Icon Button */}
                <button
                  type="button"
                  className="absolute top-1/2 right-3 transform -translate-y-1/2 flex items-center text-gray-600 hover:text-green-600 focus:outline-none"
                  onClick={togglePasswordVisibility} // Toggle password visibility on click
                  tabIndex="-1" // Prevent button from getting focus
                >
                  {showPassword ? (
                    <EyeIcon className="h-5 w-5" /> // Show "eye open" icon
                  ) : (
                    <EyeSlashIcon className="h-5 w-5" /> // Show "eye closed" icon
                  )}
                </button>
              </div>
            </div>

            {error && (
              <div className="text-red-500 text-md text-center">{error}</div>
            )}

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                />
                <label
                  htmlFor="remember-me"
                  className="ml-2 block text-sm text-gray-900"
                >
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <a
                  href="/forgot-password"
                  className="font-medium text-green-600 hover:text-green-800"
                >
                  Forgot your password?
                </a>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoggingIn}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                {isLoggingIn ? <span>Logging..</span>:"Login"}
              </button>
            </div>
          </form>
          <div className="text-center">
            <p className="mt-2  text-gray-600">
              Don't have an account?{" "}
              <a
                href="/register"
                className="font-medium text-green-700 hover:text-green-500"
              >
                Register here
              </a>
            </p>
          </div>
          <p className="text-center text-gray-600">
            Not ready to log in?{" "}
            <Link to="/" className="font-medium text-green-700 underline">
              Browse products
            </Link>
          </p>
        </div>
      </div>
    </>
  );
};

export default LoginPage;
