import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import SummaryCards from "../components/SummaryCards";
import PieChartBox from "../charts/PieChartBox";
import LineChartBox from "../charts/LineChartBox";
import AIAdvisor from "../components/AIAdvisor";
import TransactionTable from "../components/TransactionTable";
import BudgetProgress from "../components/BudgetProgress";
import SavingsGoals from "../components/SavingsGoals";
import NotificationBell from "../components/NotificationBell";
import Footer from "../components/Footer";
import { FaUserCircle } from "react-icons/fa";
import aiAPI from "../api/aiApi";
import { useAuth } from "../context/AuthContext";

function Dashboard() {
  const { user, updateUser } = useAuth();
  const [localUser, setLocalUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // ===============================
  // GET USER FROM STORAGE
  // ===============================

  const getStorageUser = () => {
    try {
      const data = localStorage.getItem("item");
      if (data) {
        return JSON.parse(data);
      }
      return {
        name: localStorage.getItem("name"),
        email: localStorage.getItem("email"),
        userId: localStorage.getItem("userId")
      };
    } catch (error) {
      console.log(error);
      return null;
    }
  };

  // ===============================
  // LOAD USER
  // ===============================

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      let storedUser = getStorageUser();
      if (storedUser && storedUser.userId) {
        setLocalUser(storedUser);
        updateUser(storedUser);
        setLoading(false);
        return;
      }

      const token = localStorage.getItem("token");
      if (!token) {
        setLoading(false);
        return;
      }

      const response = await aiAPI.get("/user/profile");
      const userData = {
        userId: response.data.userId,
        name: response.data.name,
        email: response.data.email
      };

      setLocalUser(userData);
      updateUser(userData);
    } catch (error) {
      console.log("Profile Error", error);
    } finally {
      setLoading(false);
    }
  };

  const displayUser = user || localUser;

  // ===============================
  // LOADING
  // ===============================

  if (loading) {
    return (
      <div className="flex bg-[#070B28] text-white min-h-screen">
        <Sidebar />
        <div className="flex-1 flex justify-center items-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400 mx-auto"></div>
            <p className="mt-4 text-gray-400">Loading Dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex bg-[#070B28] text-white min-h-screen overflow-x-hidden">
      {/* SIDEBAR - FIXED */}
      <div className="fixed h-screen z-50">
        <Sidebar />
      </div>

      {/* MAIN CONTENT WITH LEFT MARGIN FOR SIDEBAR */}
      <div className="flex-1 ml-[280px] p-4 sm:p-6 lg:p-8">
        {/* HEADER */}
        <div className="bg-[#11183C] rounded-3xl border border-[#26316A] p-5 mb-6 flex flex-col lg:flex-row justify-between gap-5">
          <div>
            <h1 className="text-3xl lg:text-5xl font-bold">
              Welcome,
              <span className="text-cyan-400">
                {" "}
                {displayUser?.name || "User"}
              </span>
            </h1>
            <p className="text-gray-400 mt-3">
              Manage your financial life smartly
            </p>
          </div>

          <div className="flex items-center gap-5">
            {/* NOTIFICATION BELL WITH VISIBLE LIST */}
            <div className="relative">
              <NotificationBell showList={true} />
            </div>

            {/* PROFILE */}
            <div className="flex items-center gap-4">
              <div className="text-right">
                <h2 className="text-xl font-bold">
                  {displayUser?.name || "User"}
                </h2>
                <p className="text-gray-400 text-sm">
                  {displayUser?.email || "No Email"}
                </p>
              </div>
              <div className="w-16 h-16 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 flex items-center justify-center text-4xl">
                <FaUserCircle />
              </div>
            </div>
          </div>
        </div>

    
        {/* SUMMARY */}
        <SummaryCards />

        {/* CHART + AI */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mt-6">
          <div><PieChartBox /></div>
          <div><LineChartBox /></div>
          <div><AIAdvisor /></div>
        </div>

        {/* BOTTOM SECTION */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mt-6">
          <div><BudgetProgress /></div>
          <div><SavingsGoals /></div>
          <div><TransactionTable /></div>
        </div>

        {/* FOOTER */}
        <div className="mt-10">
          <Footer />
        </div>
      </div>
    </div>
  );
}

export default Dashboard;