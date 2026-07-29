import React, { useState } from "react";

import API from "../api/axios";

import {
  Link,
  useNavigate
} from "react-router-dom";

import {
  FaKey,
  FaLock,
  FaArrowRight
} from "react-icons/fa6";

function ResetPassword() {

  const [token, setToken] = useState("");

  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleResetPassword = async () => {

    try {

      const response = await API.post(

        "/auth/reset-password",

        {
          token: token,
          newPassword: password
        }

      );

      alert(response.data);

      navigate("/login");

    } catch (error) {

      console.log(error);

      alert("Reset Password Failed");

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
            from-pink-400
            to-purple-500
            text-transparent
            bg-clip-text
            "
          >
            Reset Password
          </h1>

          <p className="text-gray-400 mt-3 text-sm sm:text-base">
            Enter your reset token and create a new password
          </p>

        </div>

        {/* TOKEN */}

        <div
          className="
          bg-[#0D1335]
          p-4
          rounded-2xl
          flex
          items-center
          gap-4
          mb-5
          "
        >

          <FaKey className="text-yellow-400 text-lg sm:text-xl" />

          <input
            type="text"
            placeholder="Enter Reset Token"
            value={token}
            onChange={(e) =>
              setToken(e.target.value)
            }
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

        {/* PASSWORD */}

        <div
          className="
          bg-[#0D1335]
          p-4
          rounded-2xl
          flex
          items-center
          gap-4
          mb-8
          "
        >

          <FaLock className="text-pink-400 text-lg sm:text-xl" />

          <input
            type="password"
            placeholder="New Password"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
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

        {/* BUTTON */}

        <button
          onClick={handleResetPassword}
          className="
          w-full
          bg-gradient-to-r
          from-pink-500
          to-purple-600
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
          text-white
          "
        >

          Update Password

          <FaArrowRight />

        </button>

        {/* BACK TO LOGIN */}

        <div
          className="
          text-center
          mt-6
          text-gray-400
          text-sm
          sm:text-base
          "
        >

          <Link
            to="/login"
            className="
            hover:text-cyan-400
            transition
            duration-300
            "
          >
            Back To Login
          </Link>

        </div>

      </div>

    </div>

  );

}

export default ResetPassword;