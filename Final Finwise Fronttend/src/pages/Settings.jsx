import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";
import aiAPI from "../api/aiApi";

import {
  FaMoon,
  FaBell,
  FaGlobe,
  FaMoneyBillWave,
  FaPalette
} from "react-icons/fa6";

function Settings() {

  // ==========================
  // Get user ID from localStorage
  // ==========================
  const getUserId = () => {
    const userData = localStorage.getItem("user");
    if (userData) {
      try {
        const user = JSON.parse(userData);
        return user.userId || user.id;
      } catch (e) {
        return null;
      }
    }
    return null;
  };

  const userId = getUserId();

  // ==========================
  // Change Password States
  // ==========================
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // ==========================
  // Handle Input
  // ==========================
  const handlePasswordChange = (e) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value,
    });
  };

  // ==========================
  // Submit Password
  // ==========================
  const changePassword = async (e) => {
    e.preventDefault();
    setMessage("");

    // Check if user is logged in
    if (!userId) {
      setMessage("❌ Please login first to change password.");
      return;
    }

    // Validate passwords match
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage("❌ New Password and Confirm Password do not match.");
      return;
    }

    // Validate password length
    if (passwordData.newPassword.length < 6) {
      setMessage("❌ New Password must be at least 6 characters long.");
      return;
    }

    try {
      setLoading(true);

      // Convert userId to number
      const userIdNumber = parseInt(userId);
      if (isNaN(userIdNumber)) {
        setMessage("❌ Invalid user ID.");
        return;
      }

      // Try different field name formats
      const requestBody = {
        userId: userIdNumber,  // Try camelCase first
        oldPassword: passwordData.oldPassword,
        newPassword: passwordData.newPassword,
      };

      console.log("Change password request:", requestBody);

      const response = await aiAPI.post(
        `/user/change-password`,
        requestBody
      );

      console.log("Change password response:", response);

      setMessage("✅ Password Changed Successfully.");
      
      setPasswordData({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

      setTimeout(() => {
        setShowPasswordModal(false);
        setMessage("");
      }, 1500);

    } catch (err) {
      console.error("Change password error:", err);
      
      let errorMessage = "❌ Unable to change password.";
      
      if (err.response) {
        if (err.response.status === 401) {
          errorMessage = "❌ Current password is incorrect.";
        } else if (err.response.status === 400) {
          errorMessage = "❌ Invalid request. Please check your input.";
        } else if (err.response.status === 404) {
          errorMessage = "❌ User not found. Please login again.";
        } else if (err.response.data) {
          errorMessage = typeof err.response.data === 'string' 
            ? `❌ ${err.response.data}` 
            : err.response.data.message ? `❌ ${err.response.data.message}` : "❌ Server error occurred.";
        }
      } else if (err.request) {
        errorMessage = "❌ Server not responding. Please try again.";
      } else {
        errorMessage = `❌ ${err.message || "Unable to change password."}`;
      }
      
      setMessage(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Check if message is a success message
  const isSuccessMessage = () => {
    if (typeof message !== 'string') return false;
    return message.includes("✅") || 
           message.toLowerCase().includes("successfully") || 
           message.toLowerCase().includes("success");
  };

  return (
    <div className="flex min-h-screen bg-[#070B28] text-white">

      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl lg:text-6xl font-bold">
            Settings
          </h1>

          <p className="text-gray-400 mt-2 text-sm sm:text-base lg:text-lg">
            Customize your dashboard experience
          </p>
        </div>

        {/* Settings Container */}
        <div
          className="
          bg-[#11183C]
          p-4 sm:p-6 lg:p-8
          rounded-3xl lg:rounded-[40px]
          border border-[#26316A]
          w-full
          max-w-6xl
          "
        >

          {/* DARK MODE */}
          <div
            className="
            bg-[#0D1335]
            p-4 sm:p-6
            rounded-3xl
            flex
            flex-col
            sm:flex-row
            sm:justify-between
            sm:items-center
            gap-4
            mb-5
            hover:bg-[#151E4D]
            transition
            "
          >
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-cyan-500 flex items-center justify-center text-2xl sm:text-3xl">
                <FaMoon />
              </div>

              <div>
                <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold">
                  Dark Mode
                </h2>

                <p className="text-gray-400 text-sm sm:text-base">
                  Enable dashboard dark theme
                </p>
              </div>
            </div>

            <button className="bg-green-500 px-5 py-2 rounded-xl font-bold text-sm sm:text-lg">
              ON
            </button>
          </div>

          {/* Notifications */}
          <div
            className="
            bg-[#0D1335]
            p-4 sm:p-6
            rounded-3xl
            flex
            flex-col
            sm:flex-row
            sm:justify-between
            sm:items-center
            gap-4
            mb-5
            hover:bg-[#151E4D]
            transition
            "
          >
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-purple-500 flex items-center justify-center text-2xl sm:text-3xl">
                <FaBell />
              </div>

              <div>
                <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold">
                  Notifications
                </h2>

                <p className="text-gray-400 text-sm sm:text-base">
                  Manage alerts and reminders
                </p>
              </div>
            </div>

            <button className="bg-purple-500 px-5 py-2 rounded-xl font-bold text-sm sm:text-lg">
              Enabled
            </button>
          </div>

          {/* Language */}
          <div
            className="
            bg-[#0D1335]
            p-4 sm:p-6
            rounded-3xl
            flex
            flex-col
            sm:flex-row
            sm:justify-between
            sm:items-center
            gap-4
            mb-5
            hover:bg-[#151E4D]
            transition
            "
          >
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-blue-500 flex items-center justify-center text-2xl sm:text-3xl">
                <FaGlobe />
              </div>

              <div>
                <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold">
                  Language
                </h2>

                <p className="text-gray-400 text-sm sm:text-base">
                  English (India)
                </p>
              </div>
            </div>

            <button className="bg-blue-500 px-5 py-2 rounded-xl font-bold text-sm sm:text-lg">
              Change
            </button>
          </div>

          {/* Currency */}
          <div
            className="
            bg-[#0D1335]
            p-4 sm:p-6
            rounded-3xl
            flex
            flex-col
            sm:flex-row
            sm:justify-between
            sm:items-center
            gap-4
            mb-5
            hover:bg-[#151E4D]
            transition
            "
          >
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-green-500 flex items-center justify-center text-2xl sm:text-3xl">
                <FaMoneyBillWave />
              </div>

              <div>
                <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold">
                  Currency
                </h2>

                <p className="text-gray-400 text-sm sm:text-base">
                  INR (₹)
                </p>
              </div>
            </div>

            <button className="bg-green-500 px-5 py-2 rounded-xl font-bold text-sm sm:text-lg">
              Update
            </button>
          </div>

          {/* Theme Color */}
          <div
            className="
            bg-[#0D1335]
            p-4 sm:p-6
            rounded-3xl
            flex
            flex-col
            lg:flex-row
            lg:justify-between
            lg:items-center
            gap-4
            mb-5
            hover:bg-[#151E4D]
            transition
            "
          >
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-pink-500 flex items-center justify-center text-2xl sm:text-3xl">
                <FaPalette />
              </div>

              <div>
                <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold">
                  Theme Color
                </h2>

                <p className="text-gray-400 text-sm sm:text-base">
                  Customize dashboard colors
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <div className="w-8 h-8 rounded-full bg-cyan-500 cursor-pointer"></div>
              <div className="w-8 h-8 rounded-full bg-purple-500 cursor-pointer"></div>
              <div className="w-8 h-8 rounded-full bg-pink-500 cursor-pointer"></div>
              <div className="w-8 h-8 rounded-full bg-green-500 cursor-pointer"></div>
              <div className="w-8 h-8 rounded-full bg-yellow-500 cursor-pointer"></div>
            </div>
          </div>

          {/* ========================= */}
          {/* CHANGE PASSWORD CARD */}
          {/* ========================= */}

          <div
            className="
            bg-[#0D1335]
            p-4 sm:p-6
            rounded-3xl
            flex
            flex-col
            sm:flex-row
            sm:justify-between
            sm:items-center
            gap-4
            hover:bg-[#151E4D]
            transition
            "
          >
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-red-500 flex items-center justify-center text-2xl sm:text-3xl">
                <span>🔒</span>
              </div>

              <div>
                <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold">
                  Change Password
                </h2>

                <p className="text-gray-400 text-sm sm:text-base">
                  Update your account password securely.
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                if (!userId) {
                  setMessage("❌ Please login first to change password.");
                  setTimeout(() => setMessage(""), 3000);
                  return;
                }
                setShowPasswordModal(true);
                setMessage("");
              }}
              className="bg-red-500 hover:bg-red-600 px-5 py-2 rounded-xl font-bold"
            >
              Change
            </button>
          </div>

        </div>

      </div>

      {/* ========================= */}
      {/* CHANGE PASSWORD MODAL */}
      {/* ========================= */}

      {showPasswordModal && (
        <div className="fixed inset-0 bg-black/70 flex justify-center items-center z-50 p-4">
          <div className="bg-[#11183C] w-full max-w-md rounded-3xl border border-[#26316A] p-8 relative">

            {/* Close Button */}
            <button
              onClick={() => {
                setShowPasswordModal(false);
                setPasswordData({
                  oldPassword: "",
                  newPassword: "",
                  confirmPassword: "",
                });
                setMessage("");
              }}
              className="absolute right-5 top-5 text-gray-400 hover:text-white text-2xl"
            >
              ✕
            </button>

            <h2 className="text-3xl font-bold mb-6">
              Change Password
            </h2>

            {message && (
              <div className={`mb-4 p-3 rounded-xl text-center ${
                isSuccessMessage() 
                  ? "bg-green-600" 
                  : "bg-red-600"
              }`}>
                {message}
              </div>
            )}

            <form onSubmit={changePassword} className="space-y-5">

              {/* Current Password */}
              <div>
                <label className="block mb-2 text-gray-300">
                  Current Password
                </label>

                <input
                  type="password"
                  name="oldPassword"
                  value={passwordData.oldPassword}
                  onChange={handlePasswordChange}
                  required
                  placeholder="Enter current password"
                  className="w-full bg-[#070B28] border border-[#26316A] rounded-xl p-3 outline-none focus:border-purple-500"
                />
              </div>

              {/* New Password */}
              <div>
                <label className="block mb-2 text-gray-300">
                  New Password
                </label>

                <input
                  type="password"
                  name="newPassword"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  required
                  placeholder="Enter new password (min 6 characters)"
                  className="w-full bg-[#070B28] border border-[#26316A] rounded-xl p-3 outline-none focus:border-purple-500"
                />
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block mb-2 text-gray-300">
                  Confirm Password
                </label>

                <input
                  type="password"
                  name="confirmPassword"
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                  required
                  placeholder="Confirm new password"
                  className="w-full bg-[#070B28] border border-[#26316A] rounded-xl p-3 outline-none focus:border-purple-500"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 py-3 rounded-xl font-bold hover:scale-105 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Changing Password..." : "Change Password"}
              </button>

            </form>

          </div>
        </div>
      )}

      {/* FOOTER */}
      <div className="mt-10">
        <Footer />
      </div>

    </div>
  );
}

export default Settings;