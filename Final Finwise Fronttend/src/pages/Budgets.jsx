import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import aiAPI from "../api/aiApi";
import {
  FaWallet,
  FaTriangleExclamation,
  FaChartSimple,
  FaLightbulb,
  FaCoins,
  FaUtensils,
  FaPlane,
  FaBagShopping,
  FaPlus,
} from "react-icons/fa6";

function Budgets() {
  const [budgets, setBudgets] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingBudget, setEditingBudget] = useState(null);
  const [formData, setFormData] = useState({
    budgetAmount: "",
    startDate: "",
    endDate: "",
    categoryId: "",
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

  // Fetch budgets and categories on component mount
  useEffect(() => {
    fetchBudgets();
    fetchCategories();
  }, []);

  // Helper function to extract error message
  const getErrorMessage = (err) => {
    if (err.response?.data?.message) {
      return err.response.data.message;
    }
    if (err.response?.data?.error) {
      return err.response.data.error;
    }
    if (typeof err.response?.data === 'string') {
      return err.response.data;
    }
    if (err.message) {
      return err.message;
    }
    return "An unexpected error occurred";
  };

  // Fetch all budgets for the user
  const fetchBudgets = async () => {
    try {
      setLoading(true);
      const response = await aiAPI.get(`/api/budget/${userId}`);
      console.log("Budgets fetched:", response.data);
      setBudgets(response.data);
      setError(null);
    } catch (err) {
      console.error("Error fetching budgets:", err);
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  // Fetch all categories for the user
  const fetchCategories = async () => {
    try {
      const response = await aiAPI.get(`/api/categories/user/${userId}`);
      console.log("Categories fetched:", response.data);
      setCategories(response.data);
    } catch (err) {
      console.error("Error fetching categories:", err);
    }
  };

  // Add new budget - ONLY budgetAmount, startDate, endDate, categoryId
  const handleAddBudget = async (e) => {
    e.preventDefault();
    try {
      const budgetData = {
        budgetAmount: parseFloat(formData.budgetAmount),
        startDate: formData.startDate,
        endDate: formData.endDate,
      };

      console.log("=== ADDING BUDGET ===");
      console.log("Category ID:", formData.categoryId);
      console.log("Budget data:", budgetData);

      const response = await aiAPI.post(`/api/budget/${userId}/${formData.categoryId}`, budgetData);
      
      // Show success message from backend
      alert(response.data);
      
      // Reset form
      setFormData({
        budgetAmount: "",
        startDate: "",
        endDate: "",
        categoryId: "",
      });
      setShowModal(false);
      await fetchBudgets();
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  // Update existing budget - ONLY budgetAmount, startDate, endDate, categoryId
  const handleUpdateBudget = async (e) => {
    e.preventDefault();
    try {
      const budgetData = {
        budgetAmount: parseFloat(formData.budgetAmount),
        startDate: formData.startDate,
        endDate: formData.endDate,
        category: { categoryId: parseInt(formData.categoryId) },
      };

      console.log("=== UPDATING BUDGET ===");
      console.log("Budget ID:", editingBudget.budgetId);

      const response = await aiAPI.put(`/api/budget/${editingBudget.budgetId}`, budgetData);
      
      alert(response.data);
      
      setFormData({
        budgetAmount: "",
        startDate: "",
        endDate: "",
        categoryId: "",
      });
      setEditingBudget(null);
      setShowModal(false);
      await fetchBudgets();
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  // Delete budget
  const handleDeleteBudget = async (budgetId) => {
    if (!window.confirm("Are you sure you want to delete this budget?")) {
      return;
    }

    try {
      const response = await aiAPI.delete(`/api/budget/${budgetId}`);
      alert(response.data);
      await fetchBudgets();
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  // Open modal for adding new budget
  const openAddModal = () => {
    setEditingBudget(null);
    setFormData({
      budgetAmount: "",
      startDate: "",
      endDate: "",
      categoryId: "",
    });
    setShowModal(true);
  };

  // Open modal for editing budget
  const openEditModal = (budget) => {
    setEditingBudget(budget);
    setFormData({
      budgetAmount: budget.budgetAmount?.toString() || "",
      startDate: budget.startDate || "",
      endDate: budget.endDate || "",
      categoryId: budget.categoryId?.toString() || "",
    });
    setShowModal(true);
  };

  // Calculate totals
  const totalBudget = budgets.reduce((sum, b) => sum + (b.budgetAmount || 0), 0);
  const totalSpent = budgets.reduce((sum, b) => sum + (b.spentAmount || 0), 0);
  const totalRemaining = totalBudget - totalSpent;
  const efficiency = totalBudget > 0 ? Math.round((totalSpent / totalBudget) * 100) : 0;

  // Get category icon based on category name
  const getCategoryIcon = (categoryName) => {
    const name = categoryName?.toLowerCase() || "";
    if (name.includes("food") || name.includes("dining") || name.includes("restaurant") || name.includes("eat") || name.includes("grocer")) {
      return <FaUtensils className="text-xl sm:text-2xl lg:text-3xl text-green-400" />;
    } else if (name.includes("travel") || name.includes("transport") || name.includes("flight") || name.includes("trip") || name.includes("fuel")) {
      return <FaPlane className="text-xl sm:text-2xl lg:text-3xl text-cyan-400" />;
    } else if (name.includes("shop") || name.includes("retail") || name.includes("clothing") || name.includes("shopping") || name.includes("buy")) {
      return <FaBagShopping className="text-xl sm:text-2xl lg:text-3xl text-pink-400" />;
    } else {
      return <FaWallet className="text-xl sm:text-2xl lg:text-3xl text-purple-400" />;
    }
  };

  // Get category color for progress bar
  const getCategoryColor = (categoryName) => {
    const name = categoryName?.toLowerCase() || "";
    if (name.includes("food") || name.includes("dining") || name.includes("restaurant") || name.includes("eat") || name.includes("grocer")) {
      return "bg-green-500";
    } else if (name.includes("travel") || name.includes("transport") || name.includes("flight") || name.includes("trip") || name.includes("fuel")) {
      return "bg-cyan-500";
    } else if (name.includes("shop") || name.includes("retail") || name.includes("clothing") || name.includes("shopping") || name.includes("buy")) {
      return "bg-pink-500";
    } else {
      return "bg-purple-500";
    }
  };

  return (
    <div className="flex bg-[#070B28] text-white min-h-screen overflow-x-hidden">
      <Sidebar />

      <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
        {/* TOP */}
        <div className="flex flex-col lg:flex-row justify-between lg:items-center gap-6 mb-10">
          <div>
            <h1 className="text-3xl sm:text-4xl lg:text-6xl font-bold">
              Budget Workspace
            </h1>
            <p className="text-gray-400 mt-2 text-sm sm:text-base lg:text-lg">
              Set budgets and track expenses automatically
            </p>
          </div>

          <button
            onClick={openAddModal}
            className="
            w-full
            lg:w-auto
            bg-gradient-to-r
            from-cyan-500
            to-blue-600
            px-6
            lg:px-8
            py-3
            lg:py-4
            rounded-2xl
            text-base
            lg:text-lg
            font-bold
            shadow-2xl
            hover:scale-105
            transition
            duration-300
            flex
            items-center
            justify-center
            gap-2
            "
          >
            <FaPlus /> New Budget
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-500/20 border border-red-500 text-red-400 px-4 py-3 rounded-xl mb-4">
            {error}
            <button 
              onClick={fetchBudgets}
              className="ml-4 text-cyan-400 hover:text-cyan-300 underline"
            >
              Retry
            </button>
          </div>
        )}

        {/* MAIN GRID */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
          {/* LEFT PANEL */}
          <div className="xl:col-span-3 space-y-6">
            {/* TOTAL BUDGET */}
            <div className="bg-[#11183C] p-5 sm:p-6 lg:p-7 rounded-[25px] lg:rounded-[35px] border border-[#26316A]">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-gray-400 text-sm sm:text-base">
                    Total Budget
                  </p>
                  <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mt-4 text-cyan-400">
                    ₹{totalBudget.toLocaleString()}
                  </h1>
                </div>
                <div className="w-14 h-14 sm:w-16 sm:h-16 lg:w-20 lg:h-20 rounded-3xl bg-gradient-to-r from-cyan-500 to-blue-600 flex items-center justify-center text-2xl lg:text-3xl">
                  <FaWallet />
                </div>
              </div>
            </div>

            {/* ALERT */}
            {budgets.some(b => b.budgetAmount > 0 && (b.spentAmount / b.budgetAmount) > 0.75) && (
              <div className="bg-gradient-to-r from-red-500 to-pink-600 p-5 sm:p-6 lg:p-7 rounded-[25px] lg:rounded-[35px]">
                <div className="flex items-center gap-4">
                  <FaTriangleExclamation className="text-2xl lg:text-4xl" />
                  <h1 className="text-2xl lg:text-3xl font-bold">Alert</h1>
                </div>
                <p className="mt-4 lg:mt-6 text-base lg:text-lg leading-7">
                  Some budgets are over 75% utilized. Review your spending!
                </p>
              </div>
            )}

            {/* AI PLANNER */}
            <div className="bg-[#11183C] p-5 sm:p-6 lg:p-7 rounded-[25px] lg:rounded-[35px] border border-[#26316A]">
              <div className="flex items-center gap-4">
                <FaLightbulb className="text-2xl lg:text-4xl text-yellow-400" />
                <h1 className="text-2xl lg:text-3xl font-bold">AI Planner</h1>
              </div>
              <p className="text-gray-400 mt-4 lg:mt-6 leading-7 text-base lg:text-lg">
                {budgets.length > 0 
                  ? "Track your spending against budgets automatically."
                  : "Create your first budget to start tracking."}
              </p>
            </div>
          </div>

          {/* CENTER PANEL */}
          <div className="xl:col-span-6 bg-[#11183C] rounded-[25px] lg:rounded-[35px] p-5 sm:p-6 lg:p-8 border border-[#26316A]">
            <div className="flex justify-between items-center mb-8 lg:mb-10">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold">
                Budget Tracking
              </h1>
              <FaChartSimple className="text-2xl sm:text-3xl lg:text-4xl text-cyan-400" />
            </div>

            {loading ? (
              <div className="text-center text-gray-400 py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500 mx-auto mb-4"></div>
                <p>Loading budgets...</p>
              </div>
            ) : error ? (
              <div className="text-center text-red-400 py-8">
                <p>Error: {error}</p>
                <button 
                  onClick={fetchBudgets}
                  className="mt-4 px-4 py-2 bg-cyan-500 rounded-xl hover:bg-cyan-600 transition"
                >
                  Retry
                </button>
              </div>
            ) : budgets.length === 0 ? (
              <div className="text-center text-gray-400 py-8">
                <p className="text-xl mb-4">No budgets found</p>
                <p className="text-sm">Click "+ New Budget" to create your first budget</p>
              </div>
            ) : (
              budgets.map((budget) => {
                const percentage = budget.budgetAmount > 0 
                  ? Math.round((budget.spentAmount / budget.budgetAmount) * 100)
                  : 0;
                const categoryName = budget.categoryName || "Uncategorized";
                const colorClass = getCategoryColor(categoryName);
                const isOverBudget = percentage > 100;

                return (
                  <div key={budget.budgetId} className="mb-8 lg:mb-10">
                    <div className="flex justify-between items-center mb-4">
                      <div 
                        className="flex items-center gap-3 sm:gap-4 cursor-pointer hover:opacity-80 transition"
                        onClick={() => openEditModal(budget)}
                      >
                        {getCategoryIcon(categoryName)}
                        <h2 className="text-lg sm:text-xl lg:text-2xl font-bold">
                          {categoryName}
                        </h2>
                      </div>

                      <div className="flex items-center gap-4">
                        <span className="text-sm sm:text-base lg:text-lg">
                          <span className={isOverBudget ? "text-red-400" : "text-gray-400"}>
                            ₹{budget.spentAmount?.toLocaleString() || 0}
                          </span>
                          <span className="text-gray-500"> / </span>
                          <span className="text-cyan-400">
                            ₹{budget.budgetAmount?.toLocaleString() || 0}
                          </span>
                        </span>
                        <button
                          onClick={() => handleDeleteBudget(budget.budgetId)}
                          className="text-red-400 hover:text-red-300 transition text-sm hover:scale-110"
                          title="Delete Budget"
                        >
                          ✕
                        </button>
                      </div>
                    </div>

                    <div className="w-full h-4 sm:h-5 bg-[#1B2559] rounded-full overflow-hidden">
                      <div 
                        className={`${isOverBudget ? "bg-red-500" : colorClass} h-4 sm:h-5 rounded-full transition-all duration-500`} 
                        style={{ width: `${Math.min(percentage, 100)}%` }}
                      />
                    </div>
                    
                    <div className="flex justify-between mt-1">
                      <span className="text-xs text-gray-400">
                        {percentage > 100 ? "⚠️ Over Budget" : `${percentage}% used`}
                      </span>
                      <span className="text-xs text-gray-400">
                        Remaining: ₹{(budget.remainingAmount || 0).toLocaleString()}
                      </span>
                    </div>

                    {/* Budget period */}
                    <div className="flex justify-end mt-1">
                      <span className="text-xs text-gray-500">
                        {budget.startDate} - {budget.endDate}
                      </span>
                    </div>
                  </div>
                );
              })
            )}

            {/* STATS */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mt-10 lg:mt-14">
              <div className="bg-[#0D1335] p-5 rounded-3xl">
                <p className="text-gray-400">Total Spent</p>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mt-4 text-orange-400">
                  ₹{totalSpent.toLocaleString()}
                </h1>
              </div>

              <div className="bg-[#0D1335] p-5 rounded-3xl">
                <p className="text-gray-400">Remaining</p>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mt-4 text-green-400">
                  ₹{totalRemaining.toLocaleString()}
                </h1>
              </div>

              <div className="bg-[#0D1335] p-5 rounded-3xl">
                <p className="text-gray-400">Utilization</p>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mt-4 text-cyan-400">
                  {efficiency}%
                </h1>
              </div>
            </div>
          </div>

          {/* RIGHT PANEL */}
          <div className="xl:col-span-3 space-y-6">
            {/* SAVINGS */}
            <div className="bg-gradient-to-b from-green-500 to-emerald-700 p-6 lg:p-8 rounded-[25px] lg:rounded-[35px]">
              <FaCoins className="text-4xl lg:text-5xl" />
              <h1 className="text-3xl lg:text-4xl font-bold mt-6 lg:mt-8">
                Savings
              </h1>
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold mt-4 lg:mt-6">
                ₹{totalRemaining.toLocaleString()}
              </h2>
              <p className="mt-4 lg:mt-6 text-base lg:text-lg">
                {totalRemaining > 0 
                  ? "Great job staying within your budgets!"
                  : "You've exceeded your budgets. Review your spending."}
              </p>
            </div>

            {/* BUDGET SCORE */}
            <div className="bg-[#11183C] p-6 lg:p-8 rounded-[25px] lg:rounded-[35px] border border-[#26316A]">
              <h1 className="text-2xl lg:text-3xl font-bold mb-8">
                Budget Score
              </h1>
              <div className="flex justify-center">
                <div className="w-32 h-32 sm:w-40 sm:h-40 lg:w-44 lg:h-44 rounded-full border-[12px] lg:border-[16px] border-cyan-500 flex items-center justify-center">
                  <div className="text-center">
                    <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold">
                      {budgets.length > 0 ? 100 - efficiency : 0}%
                    </h1>
                    <p className="text-gray-400 mt-2 text-sm sm:text-base">
                      {budgets.length === 0 ? "No Budget" : "Smart Usage"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-[#11183C] p-6 lg:p-8 rounded-[25px] lg:rounded-[35px] border border-[#26316A]">
              <h1 className="text-2xl lg:text-3xl font-bold mb-6">
                Quick Stats
              </h1>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-400">Total Budgets</span>
                  <span className="font-bold">{budgets.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Categories</span>
                  <span className="font-bold">{categories.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Active Budgets</span>
                  <span className="font-bold">
                    {budgets.filter(b => {
                      const today = new Date();
                      const start = new Date(b.startDate);
                      const end = new Date(b.endDate);
                      return today >= start && today <= end;
                    }).length}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal for Add/Edit Budget */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-[#11183C] rounded-[35px] p-6 lg:p-8 max-w-md w-full border border-[#26316A] max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl lg:text-3xl font-bold mb-6">
              {editingBudget ? "Edit Budget" : "Create New Budget"}
            </h2>

            <form onSubmit={editingBudget ? handleUpdateBudget : handleAddBudget}>
              <div className="space-y-4">
                {/* Category Selection */}
                <div>
                  <label className="block text-gray-400 text-sm mb-2">
                    Category *
                  </label>
                  <select
                    required
                    value={formData.categoryId}
                    onChange={(e) => setFormData({...formData, categoryId: e.target.value})}
                    className="w-full bg-[#0D1335] border border-[#26316A] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500"
                  >
                    <option value="">Select Category</option>
                    {categories.map((category) => (
                      <option key={category.categoryId} value={category.categoryId}>
                        {category.categoryName}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Budget Amount */}
                <div>
                  <label className="block text-gray-400 text-sm mb-2">
                    Budget Amount (₹) *
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    step="0.01"
                    value={formData.budgetAmount}
                    onChange={(e) => setFormData({...formData, budgetAmount: e.target.value})}
                    className="w-full bg-[#0D1335] border border-[#26316A] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500"
                    placeholder="Enter budget amount"
                  />
                </div>

                {/* Start Date */}
                <div>
                  <label className="block text-gray-400 text-sm mb-2">
                    Start Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.startDate}
                    onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                    className="w-full bg-[#0D1335] border border-[#26316A] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>

                {/* End Date */}
                <div>
                  <label className="block text-gray-400 text-sm mb-2">
                    End Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.endDate}
                    onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                    className="w-full bg-[#0D1335] border border-[#26316A] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>

                {/* Info Box - Automatic Tracking */}
                <div className="bg-[#0D1335] p-4 rounded-xl border border-[#26316A]">
                  <div className="flex items-start gap-3">
                    <div className="mt-1">
                      <svg className="w-5 h-5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-cyan-400">Automatic Tracking</p>
                      <p className="text-xs text-gray-400 mt-1">
                        Spent amount will be automatically calculated from your expenses 
                        for this category within the selected date range. No manual entry needed!
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 mt-8">
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-600 px-6 py-3 rounded-xl font-bold hover:scale-105 transition duration-300"
                >
                  {editingBudget ? "Update Budget" : "Create Budget"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setEditingBudget(null);
                    setFormData({
                      budgetAmount: "",
                      startDate: "",
                      endDate: "",
                      categoryId: "",
                    });
                  }}
                  className="flex-1 bg-[#1B2559] px-6 py-3 rounded-xl font-bold hover:bg-[#26316A] transition duration-300"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Budgets;