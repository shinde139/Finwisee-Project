import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import aiAPI from "../api/aiApi";
import {
  FaPlaneDeparture,
  FaShieldHeart,
  FaHouse,
  FaCarSide,
  FaRocket,
  FaTrophy,
  FaFire,
  FaArrowTrendUp,
  FaTrash,
  FaPencil,
} from "react-icons/fa6";
import Footer from "../components/Footer";

function Goals() {
  // Logged in user id
  const userId = Number(localStorage.getItem("userId"));
  
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState(null);
  const [formData, setFormData] = useState({
    goalName: "",
    targetAmount: "",
    savedAmount: "",
    targetDate: "",
  });

  // Fetch goals
  useEffect(() => {
    if (userId) {
      fetchGoals();
    }
  }, [userId]);

  const fetchGoals = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await aiAPI.get(`/api/goals/${userId}`);
      console.log("Goals:", response.data);
      setGoals(response.data);

    } catch (error) {
      console.error("Error fetching goals:", error);
      setError("Failed to load goals. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Calculate total savings
  const totalSaved = goals.reduce((sum, goal) => sum + (goal.savedAmount || 0), 0);
  const totalTarget = goals.reduce((sum, goal) => sum + (goal.targetAmount || 0), 0);
  const overallProgress = totalTarget > 0 ? Math.round((totalSaved / totalTarget) * 100) : 0;

  // Get icon and color for goal
  const getGoalDetails = (goalName) => {
    const details = {
      'Europe Trip': { icon: <FaPlaneDeparture />, color: 'from-cyan-500 to-blue-600' },
      'Emergency Fund': { icon: <FaShieldHeart />, color: 'from-green-500 to-emerald-600' },
      'Dream House': { icon: <FaHouse />, color: 'from-pink-500 to-purple-600' },
      'New Car': { icon: <FaCarSide />, color: 'from-orange-500 to-red-500' },
    };
    return details[goalName] || { icon: <FaRocket />, color: 'from-purple-500 to-pink-600' };
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === "targetAmount" || name === "savedAmount" 
        ? parseFloat(value) || 0 
        : value,
    });
  };

  // Handle add goal
  const handleAddGoal = async (e) => {
    e.preventDefault();

    try {
      await aiAPI.post(
        `/api/goals/${userId}`,
        {
          goalName: formData.goalName,
          targetAmount: formData.targetAmount,
          savedAmount: formData.savedAmount || 0,
          targetDate: formData.targetDate || new Date().toISOString().split("T")[0],
        }
      );

      alert("Goal Added Successfully");
      setShowAddModal(false);
      setFormData({
        goalName: "",
        targetAmount: "",
        savedAmount: "",
        targetDate: "",
      });
      fetchGoals();
    } catch (error) {
      console.error("Error adding goal:", error);
      alert("Failed to add goal. Please try again.");
    }
  };

  // Handle edit goal - Open edit modal
  const handleEditGoal = (goal) => {
    setSelectedGoal(goal);
    setFormData({
      goalName: goal.goalName || "",
      targetAmount: goal.targetAmount || "",
      savedAmount: goal.savedAmount || "",
      targetDate: goal.targetDate || "",
    });
    setShowEditModal(true);
  };

  // UPDATE - Handle update goal
  const handleUpdateGoal = async (e) => {
    e.preventDefault();

    // Validate form data
    if (!formData.goalName.trim()) {
      alert("Please enter a goal name");
      return;
    }

    if (!formData.targetAmount || formData.targetAmount <= 0) {
      alert("Please enter a valid target amount");
      return;
    }

    try {
      setLoading(true);
      
      const updateData = {
        goalName: formData.goalName,
        targetAmount: parseFloat(formData.targetAmount),
        savedAmount: parseFloat(formData.savedAmount) || 0,
        targetDate: formData.targetDate,
      };

      console.log("Updating goal:", selectedGoal.goalId, updateData);

      await aiAPI.put(`/api/goals/${selectedGoal.goalId}`, updateData);

      alert("Goal Updated Successfully!");
      setShowEditModal(false);
      setSelectedGoal(null);
      setFormData({
        goalName: "",
        targetAmount: "",
        savedAmount: "",
        targetDate: "",
      });
      
      // Refresh the goals list
      await fetchGoals();
      
    } catch (error) {
      console.error("Error updating goal:", error);
      
      // Show specific error message
      if (error.response) {
        alert(`Failed to update goal: ${error.response.data || error.response.statusText}`);
      } else if (error.request) {
        alert("Failed to update goal: No response from server. Please check your connection.");
      } else {
        alert("Failed to update goal. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  // DELETE - Handle delete goal
  const handleDeleteGoal = async (goalId, goalName) => {
    // Show confirmation dialog with goal name
    if (!window.confirm(`Are you sure you want to delete the goal "${goalName}"? This action cannot be undone.`)) {
      return;
    }

    try {
      setLoading(true);
      
      console.log("Deleting goal:", goalId);
      
      await aiAPI.delete(`/api/goals/${goalId}`);
      
      // Show success message
      alert(`Goal "${goalName}" deleted successfully!`);
      
      // Refresh the goals list
      await fetchGoals();
      
    } catch (error) {
      console.error("Error deleting goal:", error);
      
      // Show specific error message
      if (error.response) {
        alert(`Failed to delete goal: ${error.response.data || error.response.statusText}`);
      } else if (error.request) {
        alert("Failed to delete goal: No response from server. Please check your connection.");
      } else {
        alert("Failed to delete goal. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount || 0);
  };

  // Calculate progress percentage
  const getProgress = (saved, target) => {
    if (!target || target === 0) return 0;
    return Math.min(100, Math.round((saved / target) * 100));
  };

  if (loading) {
    return (
      <div className="flex bg-[#070B28] text-white min-h-screen overflow-hidden">
        <div className="fixed top-0 left-0 h-full z-50">
          <Sidebar />
        </div>
        <div className="flex-1 ml-64 flex items-center justify-center h-screen">
          <div className="text-2xl">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex bg-[#070B28] text-white min-h-screen overflow-hidden">
      {/* STABLE/FIXED SIDEBAR */}
      <div className="fixed top-0 left-0 h-full z-50">
        <Sidebar />
      </div>

      {/* MAIN CONTENT - with left margin for sidebar */}
      <div className="flex-1 ml-64 overflow-y-auto h-screen p-4 sm:p-6 lg:p-8">
        {/* HEADER */}
        <div className="flex flex-col lg:flex-row justify-between lg:items-center gap-6 mb-10">
          <div>
            <h1 className="text-3xl sm:text-4xl lg:text-6xl font-bold">
              Future Goals
            </h1>
            <p className="text-gray-400 mt-2 text-sm sm:text-base lg:text-lg">
              Build your dreams with smart savings plans
            </p>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="
              w-full lg:w-auto
              bg-gradient-to-r
              from-purple-500
              to-pink-600
              px-8 py-4
              rounded-2xl
              text-base lg:text-lg
              font-bold
              shadow-2xl
              hover:scale-105
              transition
              duration-300
            "
          >
            + Create Goal
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-500/20 border border-red-500 text-red-400 px-4 py-3 rounded-xl mb-6">
            {error}
          </div>
        )}

        {/* HERO */}
        <div
          className="
            bg-gradient-to-r
            from-[#11183C]
            to-[#1B2559]
            rounded-[30px]
            lg:rounded-[40px]
            p-5 sm:p-8 lg:p-10
            border border-[#26316A]
          "
        >
          <div className="flex flex-col xl:flex-row justify-between items-center gap-10">
            <div>
              <div className="flex items-center gap-4">
                <FaRocket className="text-3xl sm:text-4xl lg:text-5xl text-cyan-400" />
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold">
                  Goal Achievement
                </h1>
              </div>
              <h2 className="text-4xl sm:text-6xl lg:text-7xl font-bold mt-6 text-cyan-400">
                {formatCurrency(totalSaved)}
              </h2>
              <p className="mt-4 text-gray-400 text-base sm:text-lg lg:text-2xl">
                Total Savings Across All Goals
              </p>
            </div>

            <div
              className="
                w-44 h-44
                sm:w-56 sm:h-56
                lg:w-72 lg:h-72
                rounded-full
                border-[12px]
                sm:border-[16px]
                lg:border-[22px]
                border-cyan-500
                flex items-center justify-center
              "
            >
              <div className="text-center">
                <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold">
                  {overallProgress}%
                </h1>
                <p className="text-gray-400 mt-2 lg:mt-4">
                  Completed
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* GOALS */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 lg:gap-8 mt-10">
          {goals.map((goal) => {
            const progress = getProgress(goal.savedAmount, goal.targetAmount);
            const { icon, color } = getGoalDetails(goal.goalName);
            
            return (
              <div
                key={goal.goalId}
                className="
                  bg-[#11183C]
                  p-5 sm:p-6 lg:p-8
                  rounded-[30px]
                  border border-[#26316A]
                  hover:scale-[1.02]
                  transition
                  duration-300
                  shadow-2xl
                "
              >
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <div
                      className={`
                        w-14 h-14
                        sm:w-16 sm:h-16
                        lg:w-20 lg:h-20
                        rounded-3xl
                        bg-gradient-to-r
                        ${color}
                        flex items-center justify-center
                        text-2xl sm:text-3xl lg:text-4xl
                      `}
                    >
                      {icon}
                    </div>
                    <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mt-5">
                      {goal.goalName}
                    </h1>
                  </div>

                  <div className="text-right">
                    <p className="text-gray-400 text-sm">
                      Progress
                    </p>
                    <h1 className="text-2xl lg:text-3xl font-bold text-green-400 mt-2">
                      {progress}%
                    </h1>
                  </div>
                </div>

                <div className="mt-8">
                  <div className="flex justify-between mb-3 text-gray-400 text-sm sm:text-base">
                    <span>Saved</span>
                    <span>Target</span>
                  </div>
                  <div className="flex justify-between">
                    <h2 className="text-lg sm:text-2xl lg:text-3xl font-bold">
                      {formatCurrency(goal.savedAmount)}
                    </h2>
                    <h2 className="text-lg sm:text-2xl lg:text-3xl font-bold">
                      {formatCurrency(goal.targetAmount)}
                    </h2>
                  </div>
                </div>

                <div className="mt-6">
                  <div className="w-full h-4 bg-[#1B2559] rounded-full overflow-hidden">
                    <div
                      className={`
                        h-4
                        rounded-full
                        bg-gradient-to-r
                        ${color}
                      `}
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>

                <div className="flex flex-wrap justify-between items-center gap-4 mt-8">
                  <div className="flex items-center gap-3 text-green-400">
                    <FaArrowTrendUp />
                    <span>Saving Increased</span>
                  </div>
                  
                  <div className="flex gap-2">
                    <button 
                      onClick={() => handleEditGoal(goal)}
                      className="bg-[#1B2559] px-5 py-3 rounded-2xl hover:bg-[#26316A] transition flex items-center gap-2"
                    >
                      <FaPencil className="text-sm" />
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDeleteGoal(goal.goalId, goal.goalName)}
                      className="bg-red-500/20 px-5 py-3 rounded-2xl hover:bg-red-500/30 transition flex items-center gap-2 text-red-400"
                    >
                      <FaTrash className="text-sm" />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* AI MOTIVATION */}
        <div
          className="
            bg-gradient-to-r
            from-purple-600
            to-pink-600
            mt-10
            p-5 sm:p-8 lg:p-10
            rounded-[30px]
            lg:rounded-[40px]
          "
        >
          <div className="flex flex-col sm:flex-row items-start gap-5">
            <FaTrophy className="text-4xl sm:text-5xl lg:text-6xl" />
            <div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold">
                AI Motivation
              </h1>
              <p className="mt-4 text-base sm:text-lg lg:text-xl leading-relaxed">
                {goals.length === 0 
                  ? "Start creating your saving goals to get personalized motivation!" 
                  : "You're saving faster than last month. Continue consistent investments to achieve your financial dreams earlier."
                }
              </p>
            </div>
          </div>
        </div>

        {/* ACHIEVEMENTS */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mt-10">
          <div className="bg-[#11183C] p-6 lg:p-8 rounded-[30px] border border-[#26316A]">
            <FaFire className="text-4xl lg:text-5xl text-orange-400" />
            <h1 className="text-3xl lg:text-4xl font-bold mt-5">
              {goals.filter(g => g.status === "Completed").length > 0 ? `${goals.filter(g => g.status === "Completed").length} Goals` : 'Start Saving'}
            </h1>
            <p className="text-gray-400 mt-3">
              Completed Goals
            </p>
          </div>

          <div className="bg-[#11183C] p-6 lg:p-8 rounded-[30px] border border-[#26316A]">
            <FaRocket className="text-4xl lg:text-5xl text-cyan-400" />
            <h1 className="text-3xl lg:text-4xl font-bold mt-5">
              {goals.length}
            </h1>
            <p className="text-gray-400 mt-3">
              Active Targets
            </p>
          </div>

          <div className="bg-[#11183C] p-6 lg:p-8 rounded-[30px] border border-[#26316A]">
            <FaTrophy className="text-4xl lg:text-5xl text-yellow-400" />
            <h1 className="text-3xl lg:text-4xl font-bold mt-5">
              {overallProgress > 70 ? 'Top Saver' : overallProgress > 40 ? 'On Track' : 'Keep Going'}
            </h1>
            <p className="text-gray-400 mt-3">
              Monthly Achievement
            </p>
          </div>
        </div>

        {/* FOOTER - CONSTANT */}
        <div className="mt-10">
          <Footer />
        </div>
      </div>

      {/* Add Goal Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-[#11183C] rounded-3xl p-8 max-w-md w-full border border-[#26316A]">
            <h2 className="text-3xl font-bold mb-6">Create New Goal</h2>
            <form onSubmit={handleAddGoal} className="space-y-4">
              <div>
                <label className="block text-gray-400 mb-2">Goal Name</label>
                <input
                  type="text"
                  name="goalName"
                  value={formData.goalName}
                  onChange={handleInputChange}
                  required
                  className="w-full bg-[#0D1335] border border-[#26316A] rounded-xl p-3 text-white focus:outline-none focus:border-purple-500"
                  placeholder="Enter goal name"
                />
              </div>
              <div>
                <label className="block text-gray-400 mb-2">Target Amount (₹)</label>
                <input
                  type="number"
                  name="targetAmount"
                  value={formData.targetAmount}
                  onChange={handleInputChange}
                  required
                  className="w-full bg-[#0D1335] border border-[#26316A] rounded-xl p-3 text-white focus:outline-none focus:border-purple-500"
                  placeholder="Enter target amount"
                />
              </div>
              <div>
                <label className="block text-gray-400 mb-2">Saved Amount (₹)</label>
                <input
                  type="number"
                  name="savedAmount"
                  value={formData.savedAmount}
                  onChange={handleInputChange}
                  className="w-full bg-[#0D1335] border border-[#26316A] rounded-xl p-3 text-white focus:outline-none focus:border-purple-500"
                  placeholder="Enter saved amount"
                />
              </div>
              <div>
                <label className="block text-gray-400 mb-2">Target Date</label>
                <input
                  type="date"
                  name="targetDate"
                  value={formData.targetDate}
                  onChange={handleInputChange}
                  className="w-full bg-[#0D1335] border border-[#26316A] rounded-xl p-3 text-white focus:outline-none focus:border-purple-500"
                />
              </div>
              <div className="flex gap-4 mt-6">
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-purple-500 to-pink-600 py-3 rounded-xl font-bold hover:scale-105 transition"
                >
                  Create Goal
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false);
                    setFormData({ goalName: "", targetAmount: "", savedAmount: "", targetDate: "" });
                  }}
                  className="flex-1 bg-gray-600 py-3 rounded-xl font-bold hover:bg-gray-700 transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Goal Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-[#11183C] rounded-3xl p-8 max-w-md w-full border border-[#26316A]">
            <h2 className="text-3xl font-bold mb-6">Edit Goal</h2>
            <form onSubmit={handleUpdateGoal} className="space-y-4">
              <div>
                <label className="block text-gray-400 mb-2">Goal Name</label>
                <input
                  type="text"
                  name="goalName"
                  value={formData.goalName}
                  onChange={handleInputChange}
                  required
                  className="w-full bg-[#0D1335] border border-[#26316A] rounded-xl p-3 text-white focus:outline-none focus:border-purple-500"
                />
              </div>
              <div>
                <label className="block text-gray-400 mb-2">Target Amount (₹)</label>
                <input
                  type="number"
                  name="targetAmount"
                  value={formData.targetAmount}
                  onChange={handleInputChange}
                  required
                  className="w-full bg-[#0D1335] border border-[#26316A] rounded-xl p-3 text-white focus:outline-none focus:border-purple-500"
                />
              </div>
              <div>
                <label className="block text-gray-400 mb-2">Saved Amount (₹)</label>
                <input
                  type="number"
                  name="savedAmount"
                  value={formData.savedAmount}
                  onChange={handleInputChange}
                  className="w-full bg-[#0D1335] border border-[#26316A] rounded-xl p-3 text-white focus:outline-none focus:border-purple-500"
                />
              </div>
              <div>
                <label className="block text-gray-400 mb-2">Target Date</label>
                <input
                  type="date"
                  name="targetDate"
                  value={formData.targetDate}
                  onChange={handleInputChange}
                  className="w-full bg-[#0D1335] border border-[#26316A] rounded-xl p-3 text-white focus:outline-none focus:border-purple-500"
                />
              </div>
              <div className="flex gap-4 mt-6">
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-purple-500 to-pink-600 py-3 rounded-xl font-bold hover:scale-105 transition"
                  disabled={loading}
                >
                  {loading ? "Updating..." : "Update Goal"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowEditModal(false);
                    setSelectedGoal(null);
                    setFormData({ goalName: "", targetAmount: "", savedAmount: "", targetDate: "" });
                  }}
                  className="flex-1 bg-gray-600 py-3 rounded-xl font-bold hover:bg-gray-700 transition"
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

export default Goals;