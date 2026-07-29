import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import aiAPI from "../api/aiApi";
import Footer from "../components/Footer";
import {
  FaFileExcel,
  FaWallet,
  FaChartPie,
  FaMoneyBillTrendUp,
  FaArrowTrendUp,
  FaDownload
} from "react-icons/fa6";

function Reports() {
  const [report, setReport] = useState({
    totalIncome: 0,
    totalExpense: 0,
    totalSaving: 0,
    totalBudget: 0,
    balance: 0
  });
  const [loading, setLoading] = useState(false);

  // ===============================
  // LOAD REPORT SUMMARY
  // ===============================
  useEffect(() => {
    fetchReport();
  }, []);

  const fetchReport = async () => {
    setLoading(true);
    try {
      const userId = localStorage.getItem("userId");
      const response = await aiAPI.get(`/api/dashboard/${userId}`);
      setReport(response.data);
    } catch (error) {
      console.log("Report Fetch Error:", error);
    } finally {
      setLoading(false);
    }
  };

  // ===============================
  // DOWNLOAD EXCEL REPORT
  // ===============================
  const downloadExcel = async () => {
    try {
      const userId = localStorage.getItem("userId");
      const response = await aiAPI.get(
        `/api/reports/excel/${userId}`,
        {
          responseType: "blob"
        }
      );

      const url = window.URL.createObjectURL(
        new Blob([response.data])
      );

      const link = document.createElement("a");
      link.href = url;
      link.download = "FINWISE_REPORT.xlsx";
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.log("Excel Download Error:", error);
      alert("Excel download failed");
    }
  };

  return (
    <div className="flex bg-[#070B28] text-white min-h-screen overflow-hidden">
      {/* STABLE/FIXED SIDEBAR */}
      <div className="fixed top-0 left-0 h-full z-50">
        <Sidebar />
      </div>

      {/* MAIN CONTENT - with left margin for sidebar */}
      <div className="flex-1 ml-64 overflow-y-auto h-screen p-4 sm:p-6 lg:p-8">
        {/* HEADER */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-10">
          <div>
            <h1 className="text-3xl sm:text-4xl lg:text-6xl font-bold">
              Financial Reports
            </h1>
            <p className="text-gray-400 mt-3 text-sm sm:text-base lg:text-lg">
              Analyze your income, expenses and savings
            </p>
          </div>

          <button
            onClick={downloadExcel}
            className="
              flex
              items-center
              gap-3
              bg-gradient-to-r
              from-green-500
              to-emerald-600
              px-6 sm:px-7
              py-3 sm:py-4
              rounded-2xl
              text-base sm:text-lg
              font-bold
              hover:scale-105
              transition
              duration-300
              w-full lg:w-auto
              justify-center
            "
          >
            <FaFileExcel className="text-xl sm:text-2xl" />
            Download Excel
          </button>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-10">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
          </div>
        )}

        {/* SUMMARY CARDS */}
        {!loading && (
          <div className="
            grid
            grid-cols-1
            sm:grid-cols-2
            xl:grid-cols-4
            gap-6
          ">
            {/* INCOME */}
            <div className="
              bg-[#11183C]
              p-5 sm:p-6 lg:p-7
              rounded-[35px]
              border
              border-[#26316A]
              hover:scale-[1.02]
              transition
              duration-300
            ">
              <p className="text-gray-400 text-sm sm:text-base">
                Total Income
              </p>
              <h1 className="
                text-2xl sm:text-3xl lg:text-4xl
                font-bold
                mt-4
                text-green-400
              ">
                ₹ {report.totalIncome?.toLocaleString() || 0}
              </h1>
              <FaWallet className="
                text-3xl sm:text-4xl
                mt-5
                text-green-400
              "/>
            </div>

            {/* EXPENSE */}
            <div className="
              bg-[#11183C]
              p-5 sm:p-6 lg:p-7
              rounded-[35px]
              border
              border-[#26316A]
              hover:scale-[1.02]
              transition
              duration-300
            ">
              <p className="text-gray-400 text-sm sm:text-base">
                Total Expense
              </p>
              <h1 className="
                text-2xl sm:text-3xl lg:text-4xl
                font-bold
                mt-4
                text-red-400
              ">
                ₹ {report.totalExpense?.toLocaleString() || 0}
              </h1>
              <FaChartPie className="
                text-3xl sm:text-4xl
                mt-5
                text-red-400
              "/>
            </div>

            {/* SAVING */}
            <div className="
              bg-[#11183C]
              p-5 sm:p-6 lg:p-7
              rounded-[35px]
              border
              border-[#26316A]
              hover:scale-[1.02]
              transition
              duration-300
            ">
              <p className="text-gray-400 text-sm sm:text-base">
                Total Saving
              </p>
              <h1 className="
                text-2xl sm:text-3xl lg:text-4xl
                font-bold
                mt-4
                text-cyan-400
              ">
                ₹ {report.totalSaving?.toLocaleString() || 0}
              </h1>
              <FaMoneyBillTrendUp className="
                text-3xl sm:text-4xl
                mt-5
                text-cyan-400
              "/>
            </div>

            {/* BALANCE */}
            <div className="
              bg-[#11183C]
              p-5 sm:p-6 lg:p-7
              rounded-[35px]
              border
              border-[#26316A]
              hover:scale-[1.02]
              transition
              duration-300
            ">
              <p className="text-gray-400 text-sm sm:text-base">
                Balance
              </p>
              <h1 className="
                text-2xl sm:text-3xl lg:text-4xl
                font-bold
                mt-4
                text-yellow-400
              ">
                ₹ {report.balance?.toLocaleString() || 0}
              </h1>
              <FaArrowTrendUp className="
                text-3xl sm:text-4xl
                mt-5
                text-yellow-400
              "/>
            </div>
          </div>
        )}

        {/* EXPORT CENTER */}
        <div className="
          mt-10
          bg-[#11183C]
          p-6 sm:p-8
          rounded-[35px]
          border
          border-[#26316A]
        ">
          <h1 className="
            text-2xl sm:text-3xl
            font-bold
            mb-6
          ">
            Generate Financial Report
          </h1>

          <button
            onClick={downloadExcel}
            className="
              flex
              items-center
              gap-4
              bg-gradient-to-r
              from-green-500
              to-emerald-600
              px-6 sm:px-8
              py-3 sm:py-4
              rounded-2xl
              text-base sm:text-xl
              font-bold
              hover:scale-105
              transition
              duration-300
            "
          >
            <FaDownload />
            Generate & Download Excel
          </button>
        </div>

        {/* FOOTER - CONSTANT */}
        <div className="mt-10">
          <Footer />
        </div>
      </div>
    </div>
  );
}

export default Reports;