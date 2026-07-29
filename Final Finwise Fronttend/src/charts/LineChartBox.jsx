import React, { useEffect, useState } from "react";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer
} from "recharts";

import aiAPI from "../api/aiApi";

function LineChartBox() {

  const [monthlyData, setMonthlyData] = useState([]);

  useEffect(() => {
    getMonthlyExpense();
  }, []);

  const getMonthlyExpense = async () => {

    try {

      const userId = localStorage.getItem("userId");

      const response = await aiAPI.get(
        `/api/dashboard/monthly/${userId}`
      );

      console.log("API Response:", response.data);

      const months = [
        "",
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec"
      ];

      const formattedData = response.data.map((item) => ({
        month: months[item.month],
        total: item.total
      }));

      console.log("Formatted Data:", formattedData);

      setMonthlyData(formattedData);

    } catch (error) {

      console.log("Monthly Trend Error:", error);

    }

  };

  return (

    <div className="bg-[#11183C] p-4 md:p-5 rounded-3xl">

      {/* HEADER */}

      <div
        className="
        flex
        flex-col
        sm:flex-row
        sm:justify-between
        sm:items-center
        gap-4
        mb-5
        "
      >

        <h1
          className="
          text-xl
          md:text-2xl
          lg:text-3xl
          font-bold
          "
        >
          Monthly Expense Trend
        </h1>

        <button
          className="
          bg-[#1B2559]
          px-4
          py-2
          rounded-xl
          text-sm
          md:text-base
          w-fit
          "
        >
          This Year
        </button>

      </div>

      {/* CHART */}

      <div className="w-full">

        <ResponsiveContainer
          width="100%"
          height={window.innerWidth < 640 ? 250 : 350}
        >

          <LineChart data={monthlyData}>

            <CartesianGrid stroke="#1B2559" />

            <XAxis
              dataKey="month"
              stroke="#ffffff"
              tick={{ fontSize: 12 }}
            />

            <YAxis
              stroke="#ffffff"
              tick={{ fontSize: 12 }}
            />

            <Tooltip />

            <Line
              type="monotone"
              dataKey="total"
              stroke="#3B82F6"
              strokeWidth={4}
              dot={{ r: 5 }}
            />

          </LineChart>

        </ResponsiveContainer>

      </div>

    </div>

  );

}

export default LineChartBox;