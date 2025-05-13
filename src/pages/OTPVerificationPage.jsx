// src/pages/OTPVerificationPage.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Toaster, toast } from "react-hot-toast";

const OTPVerificationPage = () => {
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [countdown, setCountdown] = useState(30);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const { verifyOTP, resendOTP } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const email = location.state?.email;

  useEffect(() => {
    if (!email) {
      navigate("/login");
    }
  }, [email, navigate]);
  
  useEffect(() => {
    if (countdown === 0) return;
  
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  
    return () => clearInterval(timer);
  }, [countdown]); // <== depend on countdown
  

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setError("");
    setIsVerifying(true);
    try {
      const response = await verifyOTP({ email, otp });

      if (response.success) {
        toast.success("Verification Successful! Please Login");
        setTimeout(() => navigate("/login"), 1500); // Redirect after 1.5s
      }
      // Redirect to dashboard or home
    } catch (err) {
      setIsVerifying(false);
      toast.error("Verification failed");
      setError(err.message || "OTP verification failed");
    }
  };

  const handleResendOTP = async () => {
    if (countdown === 0) {
      setIsResending(true);
      try {
        await resendOTP(email);
        toast.success("OTP resent successfully");
        setCountdown(30); // countdown will now trigger the useEffect again
        setError("");
      } catch (err) {
        toast.error("Failed to resend OTP");
        setError(err.message || "Failed to resend OTP");
      } finally {
        setIsResending(false);
      }
    }
  };
  

  return (
    <>
      <Toaster position="top-right" expand={true} richColors />
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Verify Your Email
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Enter the 6-digit OTP sent to {email}
            </p>
          </div>
          <form className="mt-8 space-y-6" onSubmit={handleVerifyOTP}>
            <div className="rounded-md shadow-sm -space-y-px">
              <input
                type="text"
                required
                pattern = "[0-9]{6}"
                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
                placeholder="Enter 6-digit OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                maxLength="6"
                onInvalid={(e) => e.target.setCustomValidity("Please enter a valid OTP")}
                onInput={(e) => e.target.setCustomValidity("")}
              />
            </div>

            {error && (
              <div className="text-red-500 text-sm text-center">{error}</div>
            )}

            <div className="flex items-center justify-between">
              <div className="text-sm">
                {countdown > 0 ? (
                  <span className="text-gray-600">
                    Resend OTP in {countdown} seconds
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={handleResendOTP}
                    disabled={isResending}
                    className="font-medium text-green-600 hover:text-green-800"
                  >
                    {isResending ? <span>Sending..</span>:"Resend OTP"}
                  </button>
                )}
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                {isVerifying ? <span>Verifying..</span> : "Verify"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default OTPVerificationPage;
