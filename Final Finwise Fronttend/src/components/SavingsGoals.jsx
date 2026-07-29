import React, { useEffect, useState } from "react";
import aiAPI from "../api/aiApi";

function SavingsGoals() {

  const userId = localStorage.getItem("userId");

  const [saving, setSaving] = useState(0);

  useEffect(() => {
    getSaving();
  }, []);

  const getSaving = async () => {
    try {

      const response = await aiAPI.get(`/api/dashboard/${userId}`);

      setSaving(response.data.totalSaving || 0);

    } catch (error) {
      console.log(error);
    }
  };

  return (

    <div className="bg-[#11183C] p-5 rounded-3xl">

      <h1 className="text-3xl font-bold mb-8">
        Savings
      </h1>

      <div className="flex justify-center">

        <div
          className="
          w-52
          h-52
          rounded-full
          border-[18px]
          border-green-500
          flex
          items-center
          justify-center
          "
        >

          <div className="text-center">

            <h1 className="text-5xl font-bold text-green-400">
              ₹{saving}
            </h1>

            <p className="text-gray-400 mt-3">
              Total Savings
            </p>

          </div>

        </div>

      </div>

    </div>

  );
}

export default SavingsGoals;