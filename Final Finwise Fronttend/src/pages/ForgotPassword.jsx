import React, { useState } from "react";

import API from "../api/axios";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import {
  FaEnvelope,
  FaArrowRight,
} from "react-icons/fa6";

function ForgotPassword() {
  const [email, setEmail] = useState("");

  const navigate = useNavigate();

  const handleForgotPassword = async () => {
    try {
      const response = await API.post(
        "/auth/forgot-password?email=" + email
      );

      alert(response.data);

      navigate("/reset-password");
    } catch (error) {
      console.log(error);
      alert("Email Not Found");
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
      sm:px-6
      py-6
      "
    >
      <div
        className="
        w-full
        max-w-md
        sm:max-w-lg
        bg-[#11183C]
        border
        border-[#26316A]
        rounded-[25px]
        sm:rounded-[35px]
        p-6
        sm:p-8
        md:p-10
        shadow-2xl
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
            from-pink-400
            to-purple-500
            text-transparent
            bg-clip-text
            "
          >
            Forgot Password
          </h1>

          <p className="text-gray-400 mt-3 text-sm sm:text-base">
            Enter your registered email address
          </p>
        </div>

        {/* EMAIL INPUT */}

        <div
          className="
          bg-[#0D1335]
          p-4
          rounded-2xl
          flex
          items-center
          gap-3
          mb-6
          "
        >
          <FaEnvelope className="text-pink-400 text-lg sm:text-xl" />

          <input
            type="email"
            placeholder="Enter Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="
            bg-transparent
            outline-none
            w-full
            text-white
            placeholder-gray-500
            text-sm
            sm:text-base
            "
          />
        </div>

        {/* BUTTON */}

        <button
          onClick={handleForgotPassword}
          className="
          w-full
          bg-gradient-to-r
          from-pink-500
          to-purple-600
          py-4
          rounded-2xl
          text-base
          sm:text-lg
          md:text-xl
          font-bold
          text-white
          flex
          items-center
          justify-center
          gap-3
          hover:scale-[1.02]
          transition-all
          duration-300
          shadow-xl
          "
        >
          Send Reset Link
          <FaArrowRight />
        </button>

        {/* BACK LINK */}

        <div className="text-center mt-6">
          <Link
            to="/login"
            className="
            text-gray-400
            hover:text-cyan-400
            transition
            text-sm
            sm:text-base
            "
          >
            Back To Login
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;