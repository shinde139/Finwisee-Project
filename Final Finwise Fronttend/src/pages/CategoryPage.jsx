// src/pages/CategoryPage.jsx
import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import {
  FaTags,
  FaPlus,
  FaSearch,
  FaFilter,
  FaTimes,
  FaEdit,
  FaTrash,
  FaExclamationTriangle,
  FaInfoCircle
} from "react-icons/fa";
import aiAPI from "../api/aiApi";
import Footer from "../components/Footer";

function CategoryPage() {
  const [categories, setCategories] = useState([]);
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("error");
  
  // Form state for Add/Edit
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentCategoryId, setCurrentCategoryId] = useState(null);
  const [formData, setFormData] = useState({
    categoryName: "",
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

  // Auto-hide alert after 5 seconds
  useEffect(() => {
    if (showAlert) {
      const timer = setTimeout(() => {
        setShowAlert(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [showAlert]);

  // Show custom alert
  const showCustomAlert = (message, type = "error") => {
    setAlertMessage(message);
    setAlertType(type);
    setShowAlert(true);
    
    // Also show browser alert
    if (type === "error") {
      alert(`❌ Error!\n\n${message}`);
    } else {
      alert(`✅ Success!\n\n${message}`);
    }
  };

  // Fetch categories on component mount
  useEffect(() => {
    fetchCategories();
  }, []);

  // Filter categories on search
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredCategories(categories);
    } else {
      const filtered = categories.filter(category =>
        category.categoryName.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredCategories(filtered);
    }
  }, [searchTerm, categories]);

  // Fetch Categories
  const fetchCategories = async () => {
    setLoading(true);
    try {
      console.log("=== FETCHING CATEGORIES ===");
      console.log("User ID:", userId);
      
      const response = await aiAPI.get(`/api/categories/user/${userId}`);
      console.log("Categories fetched:", response.data);
      
      setCategories(response.data);
      setFilteredCategories(response.data);
      setError("");
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Failed to fetch categories";
      setError(errorMsg);
      showCustomAlert(errorMsg, "error");
      console.error("Error fetching categories:", err);
    } finally {
      setLoading(false);
    }
  };

  // Add Category
  const addCategory = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccessMessage("");
    
    try {
      const categoryData = {
        categoryName: formData.categoryName.trim()
      };
      
      console.log("=== ADDING CATEGORY ===");
      console.log("Category data:", categoryData);
      
      const response = await aiAPI.post(`/api/categories/${userId}`, categoryData);
      console.log("Add category response:", response.data);
      
      const responseText = response.data;
      
      if (typeof responseText === 'string' && responseText.toLowerCase().includes("error")) {
        showCustomAlert(responseText, "error");
        setError(responseText);
        setLoading(false);
        return;
      }
      
      // Success case
      const successMsg = responseText || "Category added successfully!";
      showCustomAlert(successMsg, "success");
      setSuccessMessage(successMsg);
      await fetchCategories();
      resetForm();
      setShowModal(false);
      setError("");
    } catch (err) {
      let errorMessage = err.response?.data || "Failed to add category";
      
      if (typeof errorMessage === 'string') {
        showCustomAlert(errorMessage, "error");
        setError(errorMessage);
      } else {
        showCustomAlert("Failed to add category", "error");
        setError("Failed to add category");
      }
      
      console.error("Error adding category:", err);
    } finally {
      setLoading(false);
    }
  };

  // Update Category
  const updateCategory = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccessMessage("");
    
    try {
      const categoryData = {
        categoryName: formData.categoryName.trim()
      };
      
      console.log("=== UPDATING CATEGORY ===");
      console.log("Category ID:", currentCategoryId);
      console.log("Category data:", categoryData);
      
      const response = await aiAPI.put(`/api/categories/${currentCategoryId}`, categoryData);
      console.log("Update response:", response.data);
      
      const responseText = response.data;
      
      if (typeof responseText === 'string' && responseText.toLowerCase().includes("error")) {
        showCustomAlert(responseText, "error");
        setError(responseText);
        setLoading(false);
        return;
      }
      
      const successMsg = responseText || "Category updated successfully!";
      showCustomAlert(successMsg, "success");
      setSuccessMessage(successMsg);
      await fetchCategories();
      resetForm();
      setShowModal(false);
      setIsEditing(false);
      setCurrentCategoryId(null);
      setError("");
    } catch (err) {
      let errorMessage = err.response?.data || "Failed to update category";
      
      if (typeof errorMessage === 'string') {
        showCustomAlert(errorMessage, "error");
        setError(errorMessage);
      } else {
        showCustomAlert("Failed to update category", "error");
        setError("Failed to update category");
      }
      
      console.error("Error updating category:", err);
    } finally {
      setLoading(false);
    }
  };

  // Delete Category
  const deleteCategory = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete "${name}"?`)) return;
    
    setLoading(true);
    setError("");
    setSuccessMessage("");
    
    try {
      const response = await aiAPI.delete(`/api/categories/${id}`);
      console.log("Delete response:", response.data);
      
      const responseText = response.data;
      
      if (typeof responseText === 'string' && responseText.toLowerCase().includes("error")) {
        showCustomAlert(responseText, "error");
        setError(responseText);
        setLoading(false);
        return;
      }
      
      const successMsg = responseText || "Category deleted successfully!";
      showCustomAlert(successMsg, "success");
      setSuccessMessage(successMsg);
      await fetchCategories();
      setError("");
    } catch (err) {
      let errorMessage = err.response?.data || "Failed to delete category";
      
      if (typeof errorMessage === 'string') {
        showCustomAlert(errorMessage, "error");
        setError(errorMessage);
      } else {
        showCustomAlert("Failed to delete category", "error");
        setError("Failed to delete category");
      }
      
      console.error("Error deleting category:", err);
    } finally {
      setLoading(false);
    }
  };

  // Open modal for Add
  const handleAddCategory = () => {
    setIsEditing(false);
    setCurrentCategoryId(null);
    setFormData({
      categoryName: "",
    });
    setShowModal(true);
    setError("");
    setSuccessMessage("");
    setShowAlert(false);
  };

  // Open modal for Edit
  const handleEditCategory = (category) => {
    setIsEditing(true);
    setCurrentCategoryId(category.categoryId);
    setFormData({
      categoryName: category.categoryName || "",
    });
    setShowModal(true);
    setError("");
    setSuccessMessage("");
    setShowAlert(false);
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      categoryName: "",
    });
  };

  // Get color for category
  const getCategoryColor = (name) => {
    if (!name) return "from-purple-500 to-indigo-500";
    
    const lower = name.toLowerCase();
    if (lower.includes("food") || lower.includes("grocer") || lower.includes("dining")) 
      return "from-blue-500 to-cyan-500";
    if (lower.includes("travel") || lower.includes("transport") || lower.includes("flight")) 
      return "from-green-500 to-emerald-500";
    if (lower.includes("shop") || lower.includes("clothing") || lower.includes("retail")) 
      return "from-pink-500 to-purple-500";
    if (lower.includes("home") || lower.includes("rent") || lower.includes("utility")) 
      return "from-yellow-500 to-orange-500";
    if (lower.includes("work") || lower.includes("business") || lower.includes("office")) 
      return "from-indigo-500 to-blue-500";
    if (lower.includes("health") || lower.includes("medical") || lower.includes("fitness")) 
      return "from-red-500 to-pink-500";
    if (lower.includes("education") || lower.includes("study") || lower.includes("course")) 
      return "from-teal-500 to-cyan-500";
    if (lower.includes("entertainment") || lower.includes("movie") || lower.includes("game")) 
      return "from-purple-500 to-pink-500";
    if (lower.includes("gift") || lower.includes("donation")) 
      return "from-rose-500 to-red-500";
    return "from-purple-500 to-indigo-500";
  };

  return (
    <div className="flex bg-[#070B28] text-white min-h-screen overflow-hidden">
      {/* STABLE/FIXED SIDEBAR */}
      <div className="fixed top-0 left-0 h-full z-50">
        <Sidebar />
      </div>

      {/* MAIN CONTENT - with left margin for sidebar */}
      <div className="flex-1 ml-64 overflow-y-auto h-screen p-4 sm:p-6 lg:p-8">
        {/* CUSTOM ALERT POPUP */}
        {showAlert && (
          <div className={`fixed top-4 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-lg p-4 rounded-xl shadow-2xl border ${
            alertType === "error" 
              ? "bg-red-500/95 border-red-700" 
              : "bg-green-500/95 border-green-700"
          } animate-slide-down`}>
            <div className="flex items-start gap-3">
              {alertType === "error" ? (
                <FaExclamationTriangle className="text-white text-xl flex-shrink-0 mt-0.5" />
              ) : (
                <FaInfoCircle className="text-white text-xl flex-shrink-0 mt-0.5" />
              )}
              <div className="flex-1">
                <p className={`font-bold text-white ${alertType === "error" ? "text-red-100" : "text-green-100"}`}>
                  {alertType === "error" ? "Error!" : "Success!"}
                </p>
                <p className="text-white text-sm mt-1 leading-relaxed">
                  {alertMessage}
                </p>
              </div>
              <button 
                onClick={() => setShowAlert(false)}
                className="text-white/70 hover:text-white transition flex-shrink-0"
              >
                <FaTimes size={18} />
              </button>
            </div>
          </div>
        )}

        {/* HEADER */}
        <div className="flex flex-col lg:flex-row justify-between lg:items-center gap-6 mb-10">
          <div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold">
              Categories
            </h1>
            <p className="text-gray-400 mt-2 text-sm sm:text-base lg:text-lg">
              Manage your expense categories
            </p>
          </div>
          <button
            onClick={handleAddCategory}
            className="w-full lg:w-auto flex items-center justify-center gap-3 bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-3 lg:py-4 rounded-2xl text-base lg:text-lg font-bold hover:scale-105 transition duration-300 shadow-lg"
          >
            <FaPlus />
            Add Category
          </button>
        </div>

        {/* SEARCH */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="flex items-center gap-3 bg-[#11183C] px-5 py-4 rounded-2xl flex-1">
            <FaSearch className="text-gray-400" />
            <input
              type="text"
              placeholder="Search categories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-transparent outline-none w-full text-white"
            />
          </div>
          <button className="bg-[#11183C] px-6 py-4 rounded-2xl flex items-center justify-center gap-3 hover:bg-[#1B2559] transition">
            <FaFilter />
            Filter
          </button>
        </div>

        {/* SUCCESS MESSAGE - Inline Banner */}
        {successMessage && !showAlert && (
          <div className="bg-green-500/20 border border-green-500 text-green-400 px-4 py-3 rounded-xl mb-4 flex items-center gap-2">
            <FaInfoCircle />
            {successMessage}
          </div>
        )}

        {/* ERROR MESSAGE - Inline Banner */}
        {error && !showAlert && (
          <div className="bg-red-500/20 border border-red-500 text-red-400 px-4 py-4 rounded-xl mb-4 flex items-start gap-3">
            <FaExclamationTriangle className="mt-0.5 flex-shrink-0 text-lg" />
            <div>
              <span className="font-bold">Error: </span>
              {error}
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && categories.length === 0 && (
          <div className="flex justify-center items-center py-10">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
          </div>
        )}

        {/* CATEGORIES TABLE */}
        <div className="bg-[#11183C] mt-10 p-4 sm:p-6 lg:p-8 rounded-3xl border border-[#1B2559]">
          <div className="flex justify-between items-center mb-8 flex-wrap gap-4">
            <h1 className="text-2xl sm:text-3xl font-bold">
              All Categories
            </h1>
            <span className="text-cyan-400 text-sm sm:text-base">
              Total: {filteredCategories.length} categories
            </span>
          </div>

          {/* MOBILE SCROLL */}
          <div className="overflow-x-auto">
            <table className="w-full min-w-[650px]">
              <thead>
                <tr className="text-gray-400 border-b border-[#1B2559]">
                  <th className="text-left py-4 px-2">#</th>
                  <th className="text-left py-4 px-2">Category Name</th>
                  <th className="text-left py-4 px-2">User ID</th>
                  <th className="text-left py-4 px-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCategories.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="text-center py-8 text-gray-400">
                      {searchTerm ? "No categories match your search" : "No categories found. Add your first category!"}
                    </td>
                  </tr>
                ) : (
                  filteredCategories.map((category, index) => (
                    <tr key={category.categoryId} className="border-b border-[#1B2559] hover:bg-[#0F1635] transition">
                      <td className="py-5 px-2">{index + 1}</td>
                      <td className="py-5 px-2">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-lg bg-gradient-to-r ${getCategoryColor(category.categoryName)} flex items-center justify-center text-sm text-white flex-shrink-0`}>
                            <FaTags />
                          </div>
                          <span className="font-medium">{category.categoryName}</span>
                        </div>
                      </td>
                      <td className="py-5 px-2">
                        <span className="bg-[#1B2559] px-3 py-1 rounded-full text-sm text-gray-300">
                          User {category.userId}
                        </span>
                      </td>
                      <td className="py-5 px-2">
                        <div className="flex gap-3">
                          <button
                            onClick={() => handleEditCategory(category)}
                            className="text-blue-400 hover:text-blue-300 transition p-1"
                            title="Edit"
                          >
                            <FaEdit size={18} />
                          </button>
                          <button
                            onClick={() => deleteCategory(category.categoryId, category.categoryName)}
                            className="text-red-400 hover:text-red-300 transition p-1"
                            title="Delete"
                          >
                            <FaTrash size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal for Add/Edit Category */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-[#11183C] rounded-3xl p-6 sm:p-8 max-w-md w-full border border-[#1B2559] relative">
            <button
              onClick={() => {
                setShowModal(false);
                resetForm();
                setIsEditing(false);
                setCurrentCategoryId(null);
                setError("");
                setSuccessMessage("");
                setShowAlert(false);
              }}
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition"
            >
              <FaTimes size={24} />
            </button>

            <h2 className="text-2xl font-bold mb-6">
              {isEditing ? "Edit Category" : "Add New Category"}
            </h2>

            {/* Error in Modal */}
            {error && (
              <div className="bg-red-500/20 border border-red-500 text-red-400 px-4 py-3 rounded-xl mb-4 flex items-start gap-2">
                <FaExclamationTriangle className="mt-0.5 flex-shrink-0" />
                <span className="text-sm">{error}</span>
              </div>
            )}

            <form onSubmit={isEditing ? updateCategory : addCategory}>
              <div className="space-y-4">
                {/* Category Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Category Name <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.categoryName}
                    onChange={(e) => setFormData({ ...formData, categoryName: e.target.value })}
                    className="w-full bg-[#070B28] border border-[#1B2559] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500"
                    placeholder="Enter category name (e.g., Food, Travel)"
                    required
                    minLength={2}
                    autoFocus
                  />
                  <p className="text-gray-500 text-sm mt-2">
                    Category name must be at least 2 characters
                  </p>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-6 bg-gradient-to-r from-purple-600 to-pink-600 py-3 rounded-2xl font-bold hover:scale-[1.02] transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Saving..." : isEditing ? "Update Category" : "Add Category"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* FOOTER */}
      <div className="mt-10">
        <Footer />
      </div>

      {/* CSS Animation for Alert */}
      <style>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateX(-50%) translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
          }
        }
        .animate-slide-down {
          animation: slideDown 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
}

export default CategoryPage;