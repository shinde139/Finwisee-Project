// src/pages/Login.js
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaEnvelope, FaLock, FaArrowRight } from "react-icons/fa6";
import API from "../api/axios";
import { useAuth } from "../context/AuthContext";

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setLoginData({
      ...loginData,
      [e.target.name]: e.target.value,
    });
  };

  const handleLogin = async () => {
    if (!loginData.email || !loginData.password) {
      alert("Please fill all fields");
      return;
    }

    try {
      const response = await API.post("/auth/login", loginData);
      const { token, userId, email, name } = response.data;

      if (!token) {
        alert("Token not received from server");
        return;
      }

      // Create user data object
      const userData = { 
        token, 
        userId: userId.toString(), 
        email, 
        name 
      };
      
      // Use context login (which handles all storage)
      const success = login(userData);
      
      if (success) {
        // Verify data was stored
        const storedUser = localStorage.getItem('user');
        console.log('Stored user data:', storedUser);
        
        alert("Login Successful");
        navigate("/dashboard");
      }

    } catch (error) {
      console.log(error);
      alert(error.response?.data || "Server Error");
    }
  };

  return (
    <div className="min-h-screen bg-[#070B28] flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-[#11183C] border border-[#26316A] rounded-3xl p-8 shadow-2xl">
        {/* HEADER */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-black bg-gradient-to-r from-cyan-400 to-blue-500 text-transparent bg-clip-text">
            Welcome
          </h1>
          <p className="text-gray-400 mt-3">
            Login to your finance dashboard
          </p>
        </div>

        {/* EMAIL */}
        <div className="bg-[#0D1335] p-4 rounded-xl flex items-center gap-3 mb-5">
          <FaEnvelope className="text-cyan-400" />
          <input
            type="email"
            name="email"
            placeholder="Enter Email"
            value={loginData.email}
            onChange={handleChange}
            className="bg-transparent outline-none w-full text-white"
          />
        </div>

        {/* PASSWORD */}
        <div className="bg-[#0D1335] p-4 rounded-xl flex items-center gap-3 mb-7">
          <FaLock className="text-pink-400" />
          <input
            type="password"
            name="password"
            placeholder="Enter Password"
            value={loginData.password}
            onChange={handleChange}
            className="bg-transparent outline-none w-full text-white"
          />
        </div>

        {/* LOGIN BUTTON */}
        <button
          onClick={handleLogin}
          className="w-full py-4 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold flex items-center justify-center gap-3 hover:scale-105 transition"
        >
          Login <FaArrowRight />
        </button>

        {/* LINKS */}
        <div className="mt-6 flex justify-between text-sm text-gray-400">
          <Link to="/forgot-password" className="hover:text-cyan-400">
            Forgot Password?
          </Link>
          <Link to="/register" className="hover:text-cyan-400">
            Create Account
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Login;