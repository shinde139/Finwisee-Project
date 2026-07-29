import React, { useEffect, useState } from "react";
import aiAPI from "../api/aiApi";

function BudgetProgress() {

  const userId = localStorage.getItem("userId");

  const [budget, setBudget] = useState({
    totalBudget: 0,
    totalExpense: 0,
  });

  useEffect(() => {
    getBudgetDetails();
  }, []);

  const getBudgetDetails = async () => {
    try {

      const response = await aiAPI.get(`/api/dashboard/${userId}`);

      setBudget({
        totalBudget: response.data.totalBudget,
        totalExpense: response.data.totalExpense,
      });

    } catch (error) {

      console.log(error);

    }
  };

  const percentage =
    budget.totalBudget > 0
      ? Math.round(
          (budget.totalExpense / budget.totalBudget) * 100
        )
      : 0;

  return (

    <div className="bg-[#11183C] p-5 rounded-3xl">

      <h1 className="text-3xl font-bold mb-8">
        Budget vs Actual
      </h1>

      <div className="flex justify-center">

        <div
          className="
          relative
          w-52
          h-52
          rounded-full
          border-[18px]
          border-blue-500
          flex
          items-center
          justify-center
          "
        >

          <div>

            <h1 className="text-5xl font-bold">
              {percentage}%
            </h1>

            <p className="text-center text-gray-400 mt-3">
              Budget Used
            </p>

          </div>

        </div>

      </div>

      <div className="mt-8 space-y-4">

        <div className="flex justify-between">
          <span>Budget</span>
          <span>₹{budget.totalBudget}</span>
        </div>

        <div className="flex justify-between">
          <span>Spent</span>
          <span>₹{budget.totalExpense}</span>
        </div>

        <div className="flex justify-between">
          <span>Remaining</span>

          <span className="text-green-400">
            ₹{budget.totalBudget - budget.totalExpense}
          </span>

        </div>

      </div>

    </div>

  );
}

export default BudgetProgress;