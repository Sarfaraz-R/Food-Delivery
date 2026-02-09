import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { DBUrl } from "../../constants/constants.js";

const ResetPassword = () => {
  const navigate = useNavigate();

  // Steps: 1 = Send OTP | 2 = Verify OTP | 3 = Reset Password
  const [step, setStep] = useState(1);

  const [emailOrUsername, setEmailOrUsername] = useState("");
  const [OTP, setOTP] = useState("");

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  /* ---------------- HELPERS ---------------- */

  // Convert input to backend format
  const getAuthPayload = () => {
    if (emailOrUsername.includes("@")) {
      return { email: emailOrUsername.trim() };
    }
    return { username: emailOrUsername.trim() };
  };

  const clearMessages = () => {
    setErrorMsg("");
    setSuccessMsg("");
  };

  /* ---------------- SEND OTP ---------------- */

  const handleSendOTP = async (e) => {
    e.preventDefault();

    if (!emailOrUsername.trim()) {
      return setErrorMsg("❌ Enter email or username");
    }

    setLoading(true);
    clearMessages();

    try {
      await axios.post(
        `${DBUrl.url}/api/auth/send-OTP`,
        getAuthPayload(),
        { withCredentials: true }
      );

      setSuccessMsg("✅ OTP sent successfully!");
      setStep(2);

      setTimeout(() => setSuccessMsg(""), 2000);

    } catch (err) {
      setErrorMsg(
        err.response?.data?.message || "❌ Failed to send OTP"
      );

      setTimeout(() => setErrorMsg(""), 3000);

    } finally {
      setLoading(false);
    }
  };

  /* ---------------- VERIFY OTP ---------------- */

  const handleVerifyOTP = async (e) => {
    e.preventDefault();

    if (!OTP.trim()) {
      return setErrorMsg("❌ Enter OTP");
    }

    setLoading(true);
    clearMessages();

    try {
      await axios.post(
        `${DBUrl.url}/api/auth/verify-OTP`,
        {
          ...getAuthPayload(),
          OTP,
        },
        { withCredentials: true }
      );

      setSuccessMsg("✅ OTP verified!");
      setStep(3);

      setTimeout(() => setSuccessMsg(""), 2000);

    } catch (err) {
      setErrorMsg(
        err.response?.data?.message || "❌ Invalid OTP"
      );

      setTimeout(() => setErrorMsg(""), 3000);

    } finally {
      setLoading(false);
    }
  };

  /* ---------------- RESET PASSWORD ---------------- */

  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (!newPassword || !confirmPassword) {
      return setErrorMsg("❌ Fill all fields");
    }

    if (newPassword !== confirmPassword) {
      return setErrorMsg("❌ Passwords do not match");
    }

    setLoading(true);
    clearMessages();

    try {
      await axios.post(
        `${DBUrl.url}/api/auth/reset-password`,
        {
          ...getAuthPayload(),
          newPassword,
          confirmPassword,
        },
        { withCredentials: true }
      );

      setSuccessMsg("🎉 Password reset successful!");

      // Redirect after animation
      setTimeout(() => {
        navigate("/login");
      }, 2500);

    } catch (err) {
      setErrorMsg(
        err.response?.data?.message || "❌ Reset failed"
      );

      setTimeout(() => setErrorMsg(""), 3000);

    } finally {
      setLoading(false);
    }
  };

  /* ---------------- UI ---------------- */

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-3">

      {/* Card */}
      <div
        className="bg-white shadow-md rounded-lg 
        w-full max-w-[340px] sm:max-w-[380px]
        p-4 sm:p-5 animate-fadeIn"
      >

        {/* Title */}
        <h2 className="text-xl sm:text-2xl font-bold text-center mb-4 text-gray-800">

          {step === 1 && "Forgot Password"}
          {step === 2 && "Verify OTP"}
          {step === 3 && "Reset Password"}

        </h2>


        {/* STEP 1: SEND OTP */}
        {step === 1 && (
          <form onSubmit={handleSendOTP} className="space-y-3">

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Email / Username
              </label>

              <input
                type="text"
                value={emailOrUsername}
                onChange={(e) => setEmailOrUsername(e.target.value)}
                placeholder="Enter email or username"
                className="w-full border px-3 py-2 rounded-md text-sm focus:ring-1 focus:ring-green-400 outline-none"
                required
              />
            </div>

            <button
              disabled={loading}
              type="submit"
              className="w-full bg-green-500 text-white py-2 rounded-md font-semibold hover:bg-green-600 transition text-sm"
            >
              {loading ? "Sending..." : "Send OTP"}
            </button>

          </form>
        )}


        {/* STEP 2: VERIFY OTP */}
        {step === 2 && (
          <form onSubmit={handleVerifyOTP} className="space-y-3">

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Enter OTP
              </label>

              <input
                type="text"
                value={OTP}
                onChange={(e) => setOTP(e.target.value)}
                placeholder="6 digit OTP"
                className="w-full border px-3 py-2 rounded-md text-sm focus:ring-1 focus:ring-green-400 outline-none"
                required
              />
            </div>

            <button
              disabled={loading}
              type="submit"
              className="w-full bg-green-500 text-white py-2 rounded-md font-semibold hover:bg-green-600 transition text-sm"
            >
              {loading ? "Verifying..." : "Verify OTP"}
            </button>

          </form>
        )}


        {/* STEP 3: RESET PASSWORD */}
        {step === 3 && (
          <form
            onSubmit={handleResetPassword}
            className="space-y-3 animate-slideUp"
          >

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                New Password
              </label>

              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="New password"
                className="w-full border px-3 py-2 rounded-md text-sm focus:ring-1 focus:ring-green-400 outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Confirm Password
              </label>

              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm password"
                className="w-full border px-3 py-2 rounded-md text-sm focus:ring-1 focus:ring-green-400 outline-none"
                required
              />
            </div>

            <button
              disabled={loading}
              type="submit"
              className="w-full bg-green-500 text-white py-2 rounded-md font-semibold hover:bg-green-600 transition text-sm"
            >
              {loading ? "Resetting..." : "Reset Password"}
            </button>

          </form>
        )}


        {/* Success Message */}
        {successMsg && (
          <div className="mt-3 bg-green-100 text-green-700 text-sm text-center py-2 px-3 rounded animate-bounce">
            {successMsg}
          </div>
        )}

        {/* Error Message */}
        {errorMsg && (
          <div className="mt-3 bg-red-100 text-red-700 text-sm text-center py-2 px-3 rounded animate-shake">
            {errorMsg}
          </div>
        )}


        {/* Back to Login */}
        <p className="text-center text-xs text-gray-600 mt-4">
          Back to{" "}
          <Link
            to="/login"
            className="text-green-500 font-semibold hover:underline"
          >
            Login
          </Link>
        </p>

      </div>
    </div>
  );
};

export default ResetPassword;
