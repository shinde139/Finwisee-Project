// src/pages/Profile.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import { useAuth } from "../context/AuthContext";
import Footer from "../components/Footer";
import {
  FaUser,
  FaEnvelope,
  FaPen,
  FaRightFromBracket
} from "react-icons/fa6";
import { useNavigate } from "react-router-dom";

function Profile() {
  const { user, updateUser, logout } = useAuth();
  const [userData, setUserData] = useState({});
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = () => {
    setLoading(true);

    if (user && user.name) {
      console.log("Loading from context:", user);
      setUserData(user);
      setLoading(false);
      return;
    }

    try {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        if (parsedUser.name) {
          console.log("Loading from localStorage user object:", parsedUser);
          setUserData(parsedUser);
          updateUser(parsedUser);
          setLoading(false);
          return;
        }
      }
    } catch (error) {
      console.error("Error parsing stored user:", error);
    }

    try {
      const name = localStorage.getItem('name');
      const email = localStorage.getItem('email');
      const userId = localStorage.getItem('userId');
      const token = localStorage.getItem('token');

      if (name) {
        console.log("Loading from individual items:", { name, email, userId });
        const userObj = { 
          name, 
          email: email || "No email", 
          userId: userId || "N/A",
          token: token || "N/A"
        };
        setUserData(userObj);
        localStorage.setItem('user', JSON.stringify(userObj));
        updateUser(userObj);
        setLoading(false);
        return;
      }
    } catch (error) {
      console.error("Error loading individual items:", error);
    }

    console.log("No user data found, fetching from API");
    getProfile();
  };

  const getProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      
      if (!token) {
        console.warn("No token found");
        setLoading(false);
        return;
      }

      const response = await axios.get(
        "http://localhost:9090/user/profile",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Profile API response:", response.data);

      const userDataFromAPI = {
        userId: response.data.userId || response.data.id || "N/A",
        email: response.data.email || "No email",
        name: response.data.name || "User",
        token: token
      };

      setUserData(userDataFromAPI);
      updateUser(userDataFromAPI);
      localStorage.setItem('user', JSON.stringify(userDataFromAPI));
      localStorage.setItem('name', userDataFromAPI.name);
      localStorage.setItem('email', userDataFromAPI.email);
      localStorage.setItem('userId', userDataFromAPI.userId);
      
      setLoading(false);

    } catch (error) {
      console.error("Profile API Error:", error);
      
      try {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          if (parsedUser.name) {
            setUserData(parsedUser);
            setLoading(false);
            return;
          }
        }
      } catch (e) {
        console.error("Error with cached data:", e);
      }
      
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setUserData({
      ...userData,
      [e.target.name]: e.target.value
    });
  };

  const updateProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      
      if (!token) {
        alert("No authentication token found. Please login again.");
        navigate("/login");
        return;
      }

      await axios.put(
        `http://localhost:9090/user/${userData.userId}`,
        userData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      updateUser({
        name: userData.name,
        email: userData.email,
        userId: userData.userId
      });

      const updatedUser = { 
        ...userData,
        name: userData.name,
        email: userData.email
      };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      localStorage.setItem('name', userData.name);
      localStorage.setItem('email', userData.email);
      
      alert("Profile Updated Successfully!");
      setEditMode(false);

    } catch(error) {
      console.error("Update Error:", error);
      alert(error.response?.data?.message || "Update Failed. Please try again.");
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  if (loading) {
    return (
      <div className="flex bg-[#070B28] text-white min-h-screen overflow-hidden">
        {/* STABLE/FIXED SIDEBAR */}
        <div className="fixed top-0 left-0 h-full z-50">
          <Sidebar />
        </div>
        <div className="flex-1 ml-64 flex items-center justify-center h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400 mx-auto"></div>
            <p className="mt-4 text-gray-400">Loading profile...</p>
          </div>
        </div>
      </div>
    );
  }

  const displayUser = userData.name ? userData : user;

  return (
    <div className="flex bg-[#070B28] text-white min-h-screen overflow-hidden">
      {/* STABLE/FIXED SIDEBAR */}
      <div className="fixed top-0 left-0 h-full z-50">
        <Sidebar />
      </div>

      {/* MAIN CONTENT - with left margin for sidebar */}
      <div className="flex-1 ml-64 overflow-y-auto h-screen p-4 sm:p-6 lg:p-8">
        <style>
          {`
            @keyframes pulse {
              0%, 100% { transform: scale(1); opacity: 0.5; }
              50% { transform: scale(1.1); opacity: 1; }
            }
            @keyframes spin-slow {
              from { transform: rotate(0deg); }
              to { transform: rotate(360deg); }
            }
            .profile-card {
              transition: all 0.3s ease;
            }
            .profile-card:hover {
              transform: translateY(-2px);
              border-color: rgba(6, 182, 212, 0.4);
            }
          `}
        </style>

        {/* TOP HEADER */}
        <div className="bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-700 rounded-[40px] p-6 sm:p-8 lg:p-10 relative overflow-hidden shadow-2xl">
          {/* Animated background elements */}
          <div 
            className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"
            style={{
              animation: 'pulse 3s ease-in-out infinite'
            }}
          ></div>
          <div 
            className="absolute bottom-0 left-0 w-48 h-48 bg-purple-400/20 rounded-full blur-2xl"
            style={{
              animation: 'pulse 3s ease-in-out infinite 1s'
            }}
          ></div>

          <div className="flex flex-col lg:flex-row justify-between items-center lg:items-center gap-6 lg:gap-0 relative z-10">
            <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 lg:gap-8">
              {/* PROFILE IMAGE with ring animation */}
              <div className="relative">
                <div 
                  className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 blur-sm"
                  style={{
                    animation: 'spin-slow 8s linear infinite'
                  }}
                ></div>
                <div className="relative w-24 h-24 sm:w-32 sm:h-32 lg:w-40 lg:h-40 rounded-full bg-white/20 backdrop-blur-lg border-4 border-white/30 flex items-center justify-center text-4xl sm:text-5xl lg:text-7xl shadow-2xl shrink-0">
                  <FaUser className="text-white drop-shadow-lg" />
                </div>
              </div>

              {/* USER INFO */}
              <div className="text-center sm:text-left">
                <h1 className="text-3xl sm:text-4xl lg:text-6xl font-bold bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent">
                  {displayUser?.name || "User"}
                </h1>
                <p className="text-lg sm:text-xl lg:text-2xl mt-2 sm:mt-3 lg:mt-4 text-white/80 flex items-center gap-2 justify-center sm:justify-start">
                  <span className="inline-block w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                  Premium Finance Member
                </p>
                <div className="flex justify-center sm:justify-start gap-4 sm:gap-6 lg:gap-8 mt-3 sm:mt-4 lg:mt-6">
                  <div className="flex items-center gap-2 sm:gap-3 text-white/90">
                    <FaEnvelope className="text-sm sm:text-base" />
                    <span className="text-sm sm:text-base lg:text-lg truncate max-w-[150px] sm:max-w-[200px] lg:max-w-none">
                      {displayUser?.email || "No email"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* BUTTONS */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full sm:w-auto">
              <button
                onClick={() => setEditMode(!editMode)}
                className="flex items-center justify-center gap-2 sm:gap-3 bg-white/20 backdrop-blur-lg px-5 sm:px-6 lg:px-7 py-3 sm:py-3.5 lg:py-4 rounded-2xl text-sm sm:text-base lg:text-lg font-bold hover:bg-white/30 transition-all duration-300 hover:scale-105 w-full sm:w-auto border border-white/10"
              >
                <FaPen className="text-sm sm:text-base" />
                {editMode ? "Cancel" : "Edit Profile"}
              </button>

              <button
                onClick={handleLogout}
                className="flex items-center justify-center gap-2 sm:gap-3 bg-gradient-to-r from-red-500 to-red-600 px-5 sm:px-6 lg:px-7 py-3 sm:py-3.5 lg:py-4 rounded-2xl text-sm sm:text-base lg:text-lg font-bold hover:from-red-600 hover:to-red-700 transition-all duration-300 hover:scale-105 w-full sm:w-auto shadow-lg shadow-red-500/20"
              >
                <FaRightFromBracket className="text-sm sm:text-base" />
                Logout
              </button>
            </div>
          </div>
        </div>

        {/* Profile Details Section */}
        <div className="mt-6 sm:mt-7 lg:mt-8">
          <div className="bg-gradient-to-br from-[#11183C] to-[#0D1335] p-6 sm:p-7 lg:p-8 rounded-[40px] border border-[#26316A] shadow-2xl">
            <div className="flex items-center justify-between mb-6 sm:mb-7 lg:mb-8">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                Personal Information
              </h1>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-7 lg:gap-8">
              {/* NAME */}
              <div className="profile-card bg-[#0D1335]/50 p-4 sm:p-5 rounded-2xl border border-[#1A2350] transition-all duration-300">
                <p className="text-gray-400 text-base sm:text-lg mb-2">Full Name</p>
                {editMode ? (
                  <input
                    type="text"
                    name="name"
                    value={userData.name || ""}
                    onChange={handleChange}
                    className="w-full mt-1 p-3 sm:p-3.5 lg:p-4 rounded-xl bg-[#070B28] outline-none text-white text-base sm:text-lg border border-[#1A2350] focus:border-cyan-500 transition-colors"
                  />
                ) : (
                  <h2 className="text-xl sm:text-2xl font-bold mt-1 break-words text-white/90">
                    {displayUser?.name || "N/A"}
                  </h2>
                )}
              </div>

              {/* EMAIL */}
              <div className="profile-card bg-[#0D1335]/50 p-4 sm:p-5 rounded-2xl border border-[#1A2350] transition-all duration-300">
                <p className="text-gray-400 text-base sm:text-lg mb-2">Email Address</p>
                {editMode ? (
                  <input
                    type="email"
                    name="email"
                    value={userData.email || ""}
                    onChange={handleChange}
                    className="w-full mt-1 p-3 sm:p-3.5 lg:p-4 rounded-xl bg-[#070B28] outline-none text-white text-base sm:text-lg border border-[#1A2350] focus:border-cyan-500 transition-colors"
                  />
                ) : (
                  <h2 className="text-xl sm:text-2xl font-bold mt-1 break-words text-white/90">
                    {displayUser?.email || "N/A"}
                  </h2>
                )}
              </div>
            </div>

            {/* SAVE BUTTON */}
            {editMode && (
              <div className="mt-8 sm:mt-9 lg:mt-10 flex justify-center">
                <button
                  onClick={updateProfile}
                  className="bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 px-8 sm:px-10 lg:px-12 py-3 sm:py-3.5 lg:py-4 rounded-2xl text-base sm:text-lg lg:text-xl font-bold hover:scale-105 transition-all duration-300 shadow-lg shadow-cyan-500/20 w-full sm:w-auto"
                >
                  💾 Save Changes
                </button>
              </div>
            )}
          </div>
        </div>

        {/* FOOTER */}
        <div className="mt-10">
          <Footer />
        </div>
      </div>
    </div>
  );
}

export default Profile;