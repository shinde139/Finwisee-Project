import React from "react";
import { Link } from "react-router-dom";
import {
  FaChartPie,
  FaWallet,
  FaRobot,
  FaArrowRight,
} from "react-icons/fa6";

function LandingPage() {
  return (
    <div className="min-h-screen bg-[#070B28] text-white overflow-x-hidden">
      {/* NAVBAR */}
      <div className="flex flex-row justify-between items-center px-4 sm:px-6 md:px-10 lg:px-16 py-4 sm:py-6">
        <div>
          <h1
            className="
              text-2xl
              sm:text-3xl
              md:text-4xl
              lg:text-5xl
              font-black
              bg-gradient-to-r
              from-cyan-400
              to-blue-500
              text-transparent
              bg-clip-text
            "
          >
            FIN WISEE
          </h1>

          <p className="text-gray-400 mt-1 text-xs sm:text-sm md:text-base">
            Smart AI Finance Manager
          </p>
        </div>

        <div className="flex gap-2 sm:gap-4">
          <Link to="/login">
            <button
              className="
                bg-[#11183C]
                border
                border-[#26316A]
                px-4
                sm:px-6
                py-2
                sm:py-3
                rounded-xl
                sm:rounded-2xl
                text-sm
                sm:text-base
                hover:bg-[#1A2254]
                transition
                duration-300
              "
            >
              Login
            </button>
          </Link>

          <Link to="/register">
            <button
              className="
                bg-gradient-to-r
                from-cyan-500
                to-blue-600
                px-4
                sm:px-6
                py-2
                sm:py-3
                rounded-xl
                sm:rounded-2xl
                text-sm
                sm:text-base
                font-bold
                hover:scale-105
                transition
                duration-300
                shadow-2xl
              "
            >
              Register
            </button>
          </Link>
        </div>
      </div>

      {/* HERO SECTION */}
      <div
        className="
          grid
          grid-cols-1
          xl:grid-cols-2
          items-center
          gap-10
          lg:gap-16
          px-4
          sm:px-6
          md:px-10
          lg:px-16
          py-8
          lg:py-12
        "
      >
        {/* LEFT */}
        <div className="text-center xl:text-left">
          <div
            className="
              inline-block
              bg-[#11183C]
              border
              border-cyan-500
              px-4
              sm:px-6
              py-2
              rounded-full
              text-cyan-400
              mb-6
              text-xs
              sm:text-sm
              md:text-base
            "
          >
            AI Powered Finance Platform
          </div>

          <h1
            className="
              text-4xl
              sm:text-5xl
              md:text-6xl
              lg:text-7xl
              xl:text-8xl
              font-black
              leading-tight
            "
          >
            Manage <br />
            Money With <br />
            Smart AI
          </h1>

          <p
            className="
              text-gray-400
              text-base
              sm:text-lg
              md:text-xl
              lg:text-2xl
              mt-6
              lg:mt-8
              leading-relaxed
              max-w-2xl
              mx-auto
              xl:mx-0
            "
          >
            Track expenses, budgets, savings and financial analytics with
            futuristic fintech dashboard.
          </p>

          <div
            className="
              flex
              flex-col
              sm:flex-row
              gap-4
              mt-8
              justify-center
              xl:justify-start
            "
          >
            <Link to="/login" className="w-full sm:w-auto">
              <button
                className="
                  w-full
                  sm:w-auto
                  bg-gradient-to-r
                  from-cyan-500
                  to-blue-600
                  px-8
                  py-4
                  rounded-2xl
                  sm:rounded-3xl
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
                "
              >
                Get Started
                <FaArrowRight />
              </button>
            </Link>

            <button
              className="
                w-full
                sm:w-auto
                bg-[#11183C]
                border
                border-[#26316A]
                px-8
                py-4
                rounded-2xl
                sm:rounded-3xl
                text-base
                sm:text-lg
                md:text-xl
              "
            >
              Explore
            </button>
          </div>
        </div>

        {/* RIGHT */}
        <div className="relative flex justify-center">
          <div
            className="
              bg-[#11183C]
              border
              border-[#26316A]
              p-5
              sm:p-8
              lg:p-10
              rounded-[25px]
              sm:rounded-[30px]
              lg:rounded-[40px]
              w-full
              max-w-sm
              sm:max-w-md
              md:max-w-lg
              xl:max-w-xl
              shadow-2xl
            "
          >
            <div className="flex justify-between items-center">
              <div>
                <p className="text-gray-400 text-sm sm:text-base">
                  Total Balance
                </p>

                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mt-3">
                  ₹2.4L
                </h1>
              </div>

              <div
                className="
                  w-14 h-14
                  sm:w-16 sm:h-16
                  md:w-20 md:h-20
                  lg:w-24 lg:h-24
                  rounded-3xl
                  bg-gradient-to-r
                  from-cyan-500
                  to-blue-600
                  flex
                  items-center
                  justify-center
                  text-xl
                  sm:text-2xl
                  md:text-3xl
                  lg:text-4xl
                "
              >
                <FaWallet />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:gap-5 mt-8">
              <div className="bg-[#0D1335] p-4 sm:p-6 rounded-3xl">
                <FaChartPie className="text-2xl sm:text-4xl text-cyan-400" />

                <h2 className="text-lg sm:text-2xl lg:text-3xl font-bold mt-3">
                  Analytics
                </h2>

                <p className="text-gray-400 mt-2 text-xs sm:text-sm">
                  AI finance reports
                </p>
              </div>

              <div className="bg-[#0D1335] p-4 sm:p-6 rounded-3xl">
                <FaRobot className="text-2xl sm:text-4xl text-pink-400" />

                <h2 className="text-lg sm:text-2xl lg:text-3xl font-bold mt-3">
                  AI Advisor
                </h2>

                <p className="text-gray-400 mt-2 text-xs sm:text-sm">
                  Smart savings tips
                </p>
              </div>
            </div>

            <div
              className="
                mt-6
                bg-gradient-to-r
                from-green-500
                to-emerald-600
                p-5
                sm:p-6
                rounded-3xl
              "
            >
              <h2 className="text-lg sm:text-2xl lg:text-3xl font-bold">
                Monthly Savings
              </h2>

              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black mt-4">
                ₹34,500
              </h1>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LandingPage;