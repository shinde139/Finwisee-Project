import React, { useEffect, useState } from "react";
import aiAPI from "../api/aiApi";

function TransactionTable() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Get user ID from localStorage
  const getUserId = () => {
    const userData = localStorage.getItem("user");
    if (userData) {
      try {
        const user = JSON.parse(userData);
        return user.userId || user.id;
      } catch (e) {
        return localStorage.getItem("userId") || 1;
      }
    }
    return localStorage.getItem("userId") || 1;
  };

  const userId = getUserId();

  useEffect(() => {
    getTransactions();
  }, []);

  const getTransactions = async () => {
    setLoading(true);
    try {
      const response = await aiAPI.get(`/api/transaction/${userId}`);
      console.log("Transactions fetched:", response.data);
      
      // Filter only EXPENSE transactions and sort by date (newest first)
      const expenseTransactions = response.data
        .filter(item => item.transactionType === "EXPENSE")
        .sort((a, b) => new Date(b.transactionDate) - new Date(a.transactionDate))
        .slice(0, 5);
      
      setTransactions(expenseTransactions);
      setError(null);
    } catch (error) {
      console.log("Error fetching transactions:", error);
      setError("Failed to load transactions");
    } finally {
      setLoading(false);
    }
  };

  // Format date
  const formatDate = (date) => {
    if (!date) return "N/A";
    try {
      return new Date(date).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric"
      });
    } catch (e) {
      return date;
    }
  };

  // Format currency
  const formatCurrency = (amount) => {
    return `₹${amount?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || "0.00"}`;
  };

  // Get balance color
  const getBalanceColor = (balance) => {
    return balance >= 0 ? "text-green-400" : "text-red-400";
  };

  return (
    <div className="bg-[#11183C] p-5 rounded-3xl">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-5">
        <h1 className="text-xl md:text-2xl lg:text-3xl font-bold">
          Recent Transactions
        </h1>
        <button
          onClick={getTransactions}
          className="text-cyan-400 text-sm md:text-base hover:text-cyan-300 transition"
          disabled={loading}
        >
          {loading ? "Loading..." : "Refresh"}
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-500/20 border border-red-500 text-red-400 p-3 rounded-xl mb-4 text-center">
          {error}
          <button 
            onClick={getTransactions}
            className="ml-3 underline hover:text-red-300"
          >
            Retry
          </button>
        </div>
      )}

      {/* Loading State */}
      {loading && transactions.length === 0 && (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-cyan-500"></div>
        </div>
      )}

      {/* TABLE with Horizontal Scroll */}
      <div className="overflow-x-auto">
        {transactions.length > 0 ? (
          <div className="bg-[#11183C] rounded-2xl border border-[#1B2559] overflow-hidden min-w-[700px]">
            
            {/* Table Header */}
            <div className="grid grid-cols-4 bg-[#0C1336] px-6 py-4 border-b border-[#1B2559] text-gray-400 font-semibold text-sm">
              <div className="min-w-[120px]">Description</div>
              <div className="min-w-[120px]">Date</div>
              <div className="min-w-[120px] text-right">Expense Amount</div>
              <div className="min-w-[120px] text-right">Available Balance</div>
            </div>

            {/* Table Body */}
            {transactions.map((item) => {
              const balance = item.runningBalance || 0;

              return (
                <div
                  key={item.transactionId}
                  className="grid grid-cols-4 px-6 py-4 border-b border-[#1B2559] hover:bg-[#1B2559] transition duration-300 items-center"
                >
                  {/* Description */}
                  <div className="min-w-[120px]">
                    <p className="font-medium text-white truncate">
                      {item.description || "N/A"}
                    </p>
                  </div>

                  {/* Date */}
                  <div className="min-w-[120px] text-gray-300">
                    {formatDate(item.transactionDate)}
                  </div>

                  {/* Expense Amount */}
                  <div className="min-w-[120px] text-right">
                    <span className="text-red-400 font-semibold">
                      {formatCurrency(item.amount)}
                    </span>
                  </div>

                  {/* Available Balance */}
                  <div className="min-w-[120px] text-right">
                    <span
                      className={`font-bold ${
                        balance >= 0
                          ? "text-green-400"
                          : "text-red-400"
                      }`}
                    >
                      {formatCurrency(balance)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center text-gray-400 py-6">
            No expenses found
          </div>
        )}
      </div>
    </div>
  );
}

export default TransactionTable;