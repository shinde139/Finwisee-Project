import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import transactionAPI from "../api/aiApi";
import Footer from "../components/Footer";
import {
  FaFilter,
  FaMagnifyingGlass,
  FaFilePdf,
} from "react-icons/fa6";

function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentBalance, setCurrentBalance] = useState(0);
  const [totalIncome, setTotalIncome] = useState(0);
  const [downloadingPdf, setDownloadingPdf] = useState(false);

  // Stats
  const [stats, setStats] = useState({
    total: 0,
    totalExpenses: 0
  });

  // Get user ID from localStorage
  const getUserId = () => {
    const userData = localStorage.getItem("user");
    if (userData) {
      try {
        const user = JSON.parse(userData);
        return user.userId || user.id;
      } catch (e) {
        return 1;
      }
    }
    return 1;
  };

  const userId = getUserId();

  useEffect(() => {
    fetchTransactions();
    fetchBalanceAndIncome();
  }, []);

  // ================= GET BALANCE AND INCOME =================
  const fetchBalanceAndIncome = async () => {
    try {
      // Fetch current balance
      const balanceResponse = await transactionAPI.get(`/api/transaction/balance/${userId}`);
      const balance = balanceResponse.data || 0;
      setCurrentBalance(balance);
      
      // Fetch income
      try {
        const incomeResponse = await transactionAPI.get(`/api/income/${userId}`);
        const incomes = incomeResponse.data || [];
        const total = incomes.reduce((sum, income) => sum + (income.amount || 0), 0);
        setTotalIncome(total);
      } catch (incomeError) {
        console.warn("Income endpoint failed, using fallback:", incomeError);
        // Fallback: Calculate from transactions
        const response = await transactionAPI.get(`/api/transaction/${userId}`);
        const totalIncome = response.data
          .filter(t => t.transactionType === "INCOME")
          .reduce((sum, t) => sum + (t.amount || 0), 0);
        setTotalIncome(totalIncome);
      }
      
    } catch (error) {
      console.error("Error fetching balance/income:", error);
      setCurrentBalance(0);
      setTotalIncome(0);
    }
  };

  // ================= GET TRANSACTIONS =================
  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const response = await transactionAPI.get(`/api/transaction/${userId}`);
      console.log("Transactions response:", response.data);
      
      if (response.data && response.data.length > 0) {
        // Filter only EXPENSE transactions
        const expensesOnly = response.data.filter(item => item.transactionType === "EXPENSE");
        
        // First get the current balance
        const balanceResponse = await transactionAPI.get(`/api/transaction/balance/${userId}`);
        const balance = balanceResponse.data || 0;
        setCurrentBalance(balance);
        
        // Calculate running balance for each transaction using the fetched balance
        const expensesWithBalance = calculateRunningBalance(expensesOnly, balance);
        
        setTransactions(expensesWithBalance);
        calculateStats(expensesWithBalance);
      } else {
        setTransactions([]);
        setStats({
          total: 0,
          totalExpenses: 0
        });
      }
      
      setError(null);
    } catch (error) {
      console.error("Transaction Fetch Error:", error);
      setError("Failed to load transactions");
    } finally {
      setLoading(false);
    }
  };

  // ================= CALCULATE RUNNING BALANCE =================
  const calculateRunningBalance = (expenses, currentBal) => {
    // Sort transactions by date (oldest first) for correct running balance
    const sorted = [...expenses].sort((a, b) => {
      return new Date(a.transactionDate) - new Date(b.transactionDate);
    });

    // Calculate total expenses
    const totalExpenses = sorted.reduce((sum, t) => sum + (t.amount || 0), 0);
    
    // Starting balance before any expenses
    let runningBal = currentBal - totalExpenses;
    
    // Calculate running balance for each transaction
    return sorted.map((transaction) => {
      // Add current expense to get balance after this transaction
      runningBal += transaction.amount;
      
      return {
        ...transaction,
        runningBalance: runningBal
      };
    });
  };

  // ================= STATISTICS =================
  const calculateStats = (data) => {
    let totalExpenses = 0;
    data.forEach((transaction) => {
      totalExpenses += transaction.amount || 0;
    });
    setStats({
      total: data.length,
      totalExpenses: totalExpenses
    });
  };

  // ================= DOWNLOAD PDF =================
  const downloadPdf = async () => {
    if (transactions.length === 0) return;
    
    setDownloadingPdf(true);
    try {
      const response = await transactionAPI.get(`/api/transaction/pdf/${userId}`, {
        responseType: 'blob'
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `transaction_history_${new Date().toISOString().split('T')[0]}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      
    } catch (error) {
      console.error("PDF Download Error:", error);
      setError("Failed to download PDF");
    } finally {
      setDownloadingPdf(false);
    }
  };

  const formatDate = (date) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric"
    });
  };

  // ================= SEARCH =================
  const filteredTransactions = transactions.filter((transaction) => {
    const description = (transaction.description || "").toLowerCase();
    const searchLower = searchTerm.toLowerCase();
    return description.includes(searchLower);
  });

  // Format currency
  const formatCurrency = (amount) => {
    return `₹${amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  // Refresh data
  const refreshData = async () => {
    await fetchBalanceAndIncome();
    await fetchTransactions();
  };

  return (
    <div className="flex bg-[#070B28] text-white min-h-screen overflow-hidden">
      {/* STABLE/FIXED SIDEBAR */}
      <div className="fixed top-0 left-0 h-full z-50">
        <Sidebar />
      </div>

      {/* MAIN CONTENT - with left margin for sidebar */}
      <div className="flex-1 ml-64 overflow-y-auto h-screen p-4 sm:p-6">
        
        {/* HEADER with PDF Button */}
        <div className="flex justify-between items-start mb-3">
          <h1 className="text-3xl sm:text-4xl font-bold">
            Transaction History
          </h1>
          
          {/* PDF Download Button */}
          <button
            onClick={downloadPdf}
            disabled={downloadingPdf || transactions.length === 0}
            className={`
              flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition whitespace-nowrap mt-1
              ${downloadingPdf || transactions.length === 0 
                ? 'bg-gray-600/30 cursor-not-allowed text-gray-500' 
                : 'bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30'}
            `}
          >
            {downloadingPdf ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-red-400"></div>
                <span>Generating...</span>
              </>
            ) : (
              <>
                <FaFilePdf />
                <span>Export PDF</span>
              </>
            )}
          </button>
        </div>
        
        <p className="text-gray-400 mb-8">
          Complete record of all your expenses with running balance.
        </p>

        {error && (
          <div className="bg-red-500/20 border border-red-500 p-3 rounded-xl mb-5">
            {error}
          </div>
        )}

        {/* CARDS - 4 columns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8" id="pdf-content">
          <div className="bg-[#11183C] p-6 rounded-3xl">
            <p className="text-gray-400 text-sm">Available Balance</p>
            <h1 className="text-3xl font-bold text-green-400">
              {formatCurrency(currentBalance)}
            </h1>
          </div>

          <div className="bg-[#11183C] p-6 rounded-3xl">
            <p className="text-gray-400 text-sm">Total Income</p>
            <h1 className="text-3xl font-bold text-blue-400">
              {formatCurrency(totalIncome)}
            </h1>
          </div>

          <div className="bg-[#11183C] p-6 rounded-3xl">
            <p className="text-gray-400 text-sm">Total Expenses</p>
            <h1 className="text-3xl font-bold text-red-400">
              {formatCurrency(stats.totalExpenses)}
            </h1>
          </div>

          <div className="bg-[#11183C] p-6 rounded-3xl">
            <p className="text-gray-400 text-sm">Total Transactions</p>
            <h1 className="text-4xl font-bold">
              {stats.total}
            </h1>
          </div>
        </div>

        {/* SEARCH */}
        <div className="flex gap-4 mb-6">
          <div className="bg-[#11183C] p-3 rounded-xl flex-1 flex items-center gap-3">
            <FaMagnifyingGlass />
            <input
              className="bg-transparent outline-none w-full"
              placeholder="Search by description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <button
            onClick={refreshData}
            className="bg-[#11183C] px-5 rounded-xl hover:bg-[#1B2559] transition"
          >
            <FaFilter />
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-10">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500"></div>
          </div>
        ) : filteredTransactions.length === 0 ? (
          <div className="text-center text-gray-400 py-10">
            <p>No expenses found</p>
          </div>
        ) : (
          <div className="bg-[#11183C] rounded-2xl border border-[#1B2559] overflow-hidden overflow-x-auto">
            <div className="min-w-[700px]">
              {/* Table Header */}
              <div className="grid grid-cols-4 bg-[#0C1336] px-6 py-4 border-b border-[#1B2559] text-gray-400 font-semibold text-sm">
                <div>Description</div>
                <div>Date</div>
                <div className="text-right">Expense Amount</div>
                <div className="text-right">Available Balance</div>
              </div>

              {/* Table Body */}
              {filteredTransactions.map((item) => {
                // Use calculated runningBalance
                const balance = item.runningBalance !== undefined && item.runningBalance !== null 
                  ? item.runningBalance 
                  : currentBalance; // Fallback to current balance

                return (
                  <div
                    key={item.transactionId}
                    className="grid grid-cols-4 px-6 py-4 border-b border-[#1B2559] hover:bg-[#1B2559] transition duration-300 items-center"
                  >
                    {/* Description */}
                    <div>
                      <p className="font-medium text-white">
                        {item.description || "N/A"}
                      </p>
                    </div>

                    {/* Date */}
                    <div className="text-gray-300">
                      {formatDate(item.transactionDate)}
                    </div>

                    {/* Expense Amount */}
                    <div className="text-right">
                      <span className="text-red-400 font-semibold">
                        {formatCurrency(item.amount)}
                      </span>
                    </div>

                    {/* Available Balance */}
                    <div className="text-right">
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
          </div>
        )}

        {/* FOOTER */}
        <div className="mt-10">
          <Footer />
        </div>
      </div>
    </div>
  );
}

export default Transactions;