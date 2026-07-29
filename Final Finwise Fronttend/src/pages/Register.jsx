import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../api/axios";
import {
  FaUser,
  FaEnvelope,
  FaLock,
  FaArrowRight,
  FaEye,
  FaEyeSlash
} from "react-icons/fa6";

function Register() {
  const navigate = useNavigate();

  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
  });

  // State for validation errors
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    password: "",
  });

  // State for show/hide password
  const [showPassword, setShowPassword] = useState(false);

  // State for loading
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    setUser({
      ...user,
      [name]: value,
    });

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      });
    }
  };

  // Validation function
  const validateForm = () => {
    let isValid = true;
    const newErrors = { name: "", email: "", password: "" };

    // Validate Name
    if (!user.name.trim()) {
      newErrors.name = "Name is required";
      isValid = false;
    }

    // Validate Email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!user.email) {
      newErrors.email = "Email is required";
      isValid = false;
    } else if (!emailRegex.test(user.email)) {
      newErrors.email = "Invalid email format";
      isValid = false;
    }

    // Validate Password - Exactly 8 digits
    const passwordRegex = /^[0-9]{8}$/;
    if (!user.password) {
      newErrors.password = "Password is required";
      isValid = false;
    } else if (!passwordRegex.test(user.password)) {
      newErrors.password = "Password must be exactly 8 digits (numbers only)";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleRegister = async () => {
    // Validate before making API call
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const response = await API.post("/auth/register", user);
      console.log(response.data);
      alert("Registration Successful");
      navigate("/login");
    } catch (error) {
      console.log(error);
      
      // Handle backend validation errors
      if (error.response && error.response.status === 400) {
        const backendErrors = error.response.data;
        if (typeof backendErrors === 'object') {
          // If backend returns field-specific errors
          setErrors({
            name: backendErrors.name || "",
            email: backendErrors.email || "",
            password: backendErrors.password || "",
          });
        } else {
          alert("Registration Failed: " + (backendErrors.message || "Please check your input"));
        }
      } else {
        alert("Registration Failed. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="
      min-h-screen
      bg-[#070B28]
      flex
      items-center
      justify-center
      px-4
      py-6
      "
    >
      <div
        className="
        bg-[#11183C]
        border
        border-[#26316A]
        p-6
        sm:p-8
        md:p-10
        lg:p-12
        rounded-[25px]
        sm:rounded-[35px]
        shadow-2xl
        w-full
        max-w-md
        md:max-w-lg
        "
      >
        {/* HEADER */}
        <div className="text-center mb-8">
          <h1
            className="
            text-3xl
            sm:text-4xl
            md:text-5xl
            font-black
            bg-gradient-to-r
            from-cyan-400
            to-blue-500
            text-transparent
            bg-clip-text
            "
          >
            Create Account
          </h1>
          <p className="text-gray-400 mt-3 text-sm sm:text-base">
            Join FIN WISEE and manage your finances smartly
          </p>
          <p className="text-yellow-400 text-xs mt-2">
            ⚠️ Password must be exactly 8 digits (numbers only)
          </p>
        </div>

        {/* NAME */}
        <div className="mb-5">
          <div
            className={`
            bg-[#0D1335]
            p-4
            rounded-2xl
            flex
            items-center
            gap-4
            ${errors.name ? 'border-2 border-red-500' : ''}
            `}
          >
            <FaUser className="text-cyan-400 text-lg sm:text-xl" />
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={user.name}
              onChange={handleChange}
              className="
              bg-transparent
              outline-none
              w-full
              text-white
              text-sm
              sm:text-base
              "
            />
          </div>
          {errors.name && (
            <p className="text-red-500 text-xs mt-1 ml-2">{errors.name}</p>
          )}
        </div>

        {/* EMAIL */}
        <div className="mb-5">
          <div
            className={`
            bg-[#0D1335]
            p-4
            rounded-2xl
            flex
            items-center
            gap-4
            ${errors.email ? 'border-2 border-red-500' : ''}
            `}
          >
            <FaEnvelope className="text-cyan-400 text-lg sm:text-xl" />
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={user.email}
              onChange={handleChange}
              className="
              bg-transparent
              outline-none
              w-full
              text-white
              text-sm
              sm:text-base
              "
            />
          </div>
          {errors.email && (
            <p className="text-red-500 text-xs mt-1 ml-2">{errors.email}</p>
          )}
        </div>

        {/* PASSWORD */}
        <div className="mb-8">
          <div
            className={`
            bg-[#0D1335]
            p-4
            rounded-2xl
            flex
            items-center
            gap-4
            ${errors.password ? 'border-2 border-red-500' : ''}
            `}
          >
            <FaLock className="text-pink-400 text-lg sm:text-xl" />
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password (8 digits only)"
              value={user.password}
              onChange={handleChange}
              className="
              bg-transparent
              outline-none
              w-full
              text-white
              text-sm
              sm:text-base
              "
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-gray-400 hover:text-white transition"
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
          {errors.password && (
            <p className="text-red-500 text-xs mt-1 ml-2">{errors.password}</p>
          )}
          {/* Password hint */}
          <div className="mt-2 ml-2">
            <p className="text-gray-500 text-xs">
              Password must be exactly 8 digits (e.g., 12345678)
            </p>
            {user.password && (
              <p className={`text-xs mt-1 ${/^[0-9]{8}$/.test(user.password) ? 'text-green-400' : 'text-red-400'}`}>
                {/^[0-9]{8}$/.test(user.password) 
                  ? '✅ Valid password format' 
                  : '❌ Password must be exactly 8 digits'}
              </p>
            )}
          </div>
        </div>

        {/* REGISTER BUTTON */}
        <button
          onClick={handleRegister}
          disabled={isLoading}
          className={`
          w-full
          bg-gradient-to-r
          from-cyan-500
          to-blue-600
          p-4
          rounded-2xl
          text-base
          sm:text-lg
          md:text-xl
          font-bold
          flex
          items-center
          justify-center
          gap-3
          hover:scale-105
          transition
          duration-300
          shadow-2xl
          ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}
          `}
        >
          {isLoading ? (
            <>
              <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Creating Account...
            </>
          ) : (
            <>
              Create Account
              <FaArrowRight />
            </>
          )}
        </button>

        {/* LOGIN LINK */}
        <div
          className="
          text-center
          mt-6
          text-gray-400
          text-sm
          sm:text-base
          "
        >
          Already have an account?
          <Link
            to="/login"
            className="
            text-cyan-400
            ml-2
            hover:text-cyan-300
            "
          >
            Login
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Register;