import React, { useEffect, useState } from "react";
import axios from "axios";

function Topbar() {

  const [user, setUser] = useState({});

  useEffect(() => {
    getProfile();
  }, []);

  const getProfile = async () => {

    try {

      const token = localStorage.getItem("token");

      const response = await axios.get(
        "http://localhost:8080/user/profile",
        {
          headers: {
            Authorization: "Bearer " + token
          }
        }
      );

      setUser(response.data);

    } catch (error) {

      console.log(error);

    }
  };

  return (

    <div
      className="
      flex
      flex-col
      lg:flex-row
      lg:justify-between
      lg:items-center
      gap-6
      mb-8
      "
    >

      {/* LEFT */}

      <div>

        <h1
          className="
          text-2xl
          sm:text-3xl
          md:text-4xl
          lg:text-5xl
          font-bold
          "
        >
          Good Morning, {user?.name || "User"} 👋
        </h1>

        <p
          className="
          text-gray-400
          mt-2
          text-sm
          md:text-base
          "
        >
          Here's your financial overview for today.
        </p>

      </div>

      {/* RIGHT */}

      <div
        className="
        flex
        flex-col
        sm:flex-row
        gap-4
        items-stretch
        sm:items-center
        "
      >

        <input
          type="text"
          placeholder="Search anything..."
          className="
          w-full
          sm:w-72
          lg:w-80
          bg-[#11183C]
          px-5
          py-3
          rounded-xl
          outline-none
          "
        />

        <div
          className="
          bg-purple-700
          w-12
          h-12
          rounded-full
          flex
          items-center
          justify-center
          font-bold
          text-white
          text-lg
          shrink-0
          "
        >

          {user?.name
            ? user.name.charAt(0).toUpperCase()
            : "U"}

        </div>

      </div>

    </div>
  );
}

export default Topbar;