import React, { useEffect, useState } from "react";
import aiAPI from "../api/aiApi";

function SummaryCards() {

  const userId = localStorage.getItem("userId");

  const [dashboard, setDashboard] = useState({
    totalIncome: 0,
    totalExpense: 0,
    balance: 0,
    totalBudget: 0,
    totalSaving: 0,
  });

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {

      const response = await aiAPI.get(`/api/dashboard/${userId}`);

      setDashboard(response.data);

    } catch (error) {

      console.log(error);

    }
  };

  const summaryData = [
    {
      title: "Total Income",
      amount: `₹${dashboard.totalIncome}`,
      percent: "",
      color: "from-green-500 to-emerald-600",
    },
    {
      title: "Total Expense",
      amount: `₹${dashboard.totalExpense}`,
      percent: "",
      color: "from-red-500 to-pink-600",
    },
    {
      title: "Balance",
      amount: `₹${dashboard.balance}`,
      percent: "",
      color: "from-blue-500 to-cyan-600",
    },
    {
      title: "Savings",
      amount: `₹${dashboard.totalSaving}`,
      percent: "",
      color: "from-purple-500 to-indigo-600",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">

      {summaryData.map((item, index) => (

        <div
          key={index}
          className={`bg-gradient-to-r ${item.color} p-5 md:p-6 rounded-3xl shadow-xl hover:scale-105 transition duration-300`}
        >

          <h2 className="text-sm md:text-base text-white/80">
            {item.title}
          </h2>

          <h1 className="text-3xl md:text-4xl font-bold mt-3">
            {item.amount}
          </h1>

        </div>

      ))}

    </div>
  );
}

export default SummaryCards;