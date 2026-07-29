import React, { useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import aiAPI from "../api/aiApi";

const COLORS = [
  "#2563eb",
  "#16a34a",
  "#f59e0b",
  "#ec4899",
  "#8b5cf6",
  "#ef4444",
  "#06b6d4",
  "#84cc16",
];

function PieChartBox() {

  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    getExpenseCategory();
  }, []);

  const getExpenseCategory = async () => {

    try {

      const userId = localStorage.getItem("userId");

      const response = await aiAPI.get(
        `/api/dashboard/category/${userId}`
      );

      console.log("Expense Category:", response.data);

      // Convert API response into Recharts format
      const formattedData = response.data.map(item => ({
        name: item.category,
        value: item.total
      }));

      setChartData(formattedData);

    } catch (error) {

      console.log("Expense Category Error:", error);

    }

  };

  return (

    <div className="bg-[#11183C] p-5 rounded-3xl">

      <h1 className="text-2xl font-bold mb-5">
        Expense by Category
      </h1>

      <div className="h-[300px]">

        <ResponsiveContainer width="100%" height="100%">

          <PieChart>

            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              outerRadius={90}
              label
            >

              {chartData.map((entry, index) => (

                <Cell
                  key={index}
                  fill={COLORS[index % COLORS.length]}
                />

              ))}

            </Pie>

            <Tooltip />

          </PieChart>

        </ResponsiveContainer>

      </div>

    </div>

  );

}

export default PieChartBox;