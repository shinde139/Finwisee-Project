// src/components/AIAdvisor.js
import React, { useState, useEffect } from "react";
import aiApi from "../api/aiApi";
import { FaRobot, FaPaperPlane, FaHistory, FaTrash, FaChevronDown, FaChevronUp, FaSearch, FaSync } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";

function AIAdvisor() {
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(true);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredHistory, setFilteredHistory] = useState([]);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [error, setError] = useState(null);
  const { user, updateUser } = useAuth();
  const [userName, setUserName] = useState("User");
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    // Get user data from localStorage
    const getUserData = () => {
      try {
        // 1. Try context first
        if (user?.name && user?.userId) {
          setUserName(user.name);
          setUserId(parseInt(user.userId));
          // Load history from localStorage first, then sync with database
          loadHistoryFromLocalStorage(parseInt(user.userId));
          loadAllChatHistoryFromDB(parseInt(user.userId));
          restoreHistoryState(parseInt(user.userId));
          return;
        }

        // 2. Try full user object from localStorage
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          if (parsedUser.name && parsedUser.userId) {
            setUserName(parsedUser.name);
            setUserId(parseInt(parsedUser.userId));
            updateUser(parsedUser);
            // Load history from localStorage first, then sync with database
            loadHistoryFromLocalStorage(parseInt(parsedUser.userId));
            loadAllChatHistoryFromDB(parseInt(parsedUser.userId));
            restoreHistoryState(parseInt(parsedUser.userId));
            return;
          }
        }

        // 3. Try individual items
        const name = localStorage.getItem('name');
        const id = localStorage.getItem('userId');
        const email = localStorage.getItem('email');
        const token = localStorage.getItem('token');
        
        if (name && id) {
          setUserName(name);
          setUserId(parseInt(id));
          
          if (email && token) {
            const userData = { name, email, userId: parseInt(id), token };
            localStorage.setItem('user', JSON.stringify(userData));
            updateUser(userData);
          }
          // Load history from localStorage first, then sync with database
          loadHistoryFromLocalStorage(parseInt(id));
          loadAllChatHistoryFromDB(parseInt(id));
          restoreHistoryState(parseInt(id));
        }
      } catch (error) {
        console.error('Error getting user data:', error);
      }
    };

    getUserData();
  }, [user, updateUser]);

  // Load history from localStorage immediately
  const loadHistoryFromLocalStorage = (userId) => {
    try {
      const savedHistory = localStorage.getItem(`chatHistory_${userId}`);
      if (savedHistory) {
        const parsedHistory = JSON.parse(savedHistory);
        setChatHistory(parsedHistory);
        setFilteredHistory(parsedHistory);
        console.log(`📱 Loaded ${parsedHistory.length} history items from localStorage (instant display)`);
        setIsInitialLoad(false);
      }
    } catch (error) {
      console.error('Error loading history from localStorage:', error);
    }
  };

  // Restore history visibility state from localStorage
  const restoreHistoryState = (userId) => {
    try {
      const savedState = localStorage.getItem(`historyVisible_${userId}`);
      if (savedState !== null) {
        setShowHistory(JSON.parse(savedState));
      } else {
        setShowHistory(true);
        localStorage.setItem(`historyVisible_${userId}`, JSON.stringify(true));
      }
    } catch (error) {
      console.error('Error restoring history state:', error);
      setShowHistory(true);
    }
  };

  // Save history visibility state to localStorage
  const saveHistoryState = (userId, isVisible) => {
    try {
      localStorage.setItem(`historyVisible_${userId}`, JSON.stringify(isVisible));
    } catch (error) {
      console.error('Error saving history state:', error);
    }
  };

  // Load ALL chat history from DATABASE for this user (background sync)
  const loadAllChatHistoryFromDB = async (userId) => {
    if (!userId) {
      console.log("No userId provided for loading history");
      return;
    }
    
    try {
      setLoadingHistory(true);
      setError(null);
      const token = localStorage.getItem("token");
      
      console.log(`📡 Fetching history from DATABASE for userId: ${userId}`);
      
      const response = await aiApi.get(`/api/ai/history/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("📊 Database response:", response.data);

      let formattedHistory = [];

      if (response.data && Array.isArray(response.data)) {
        // Format the history data from database
        formattedHistory = response.data.map((item) => ({
          id: item.id || Date.now(),
          question: item.question || item.userMessage || "Unknown question",
          answer: item.answer || item.aiResponse || "No answer available",
          timestamp: item.timestamp || item.createdAt || new Date().toISOString(),
          userId: item.userId || userId,
        }));
        
        // Sort by timestamp (newest first)
        formattedHistory.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        
        console.log(`✅ Loaded ${formattedHistory.length} history items from DATABASE`);
      } else {
        console.log("No history found in database or invalid format");
        // Try to get from localStorage if database is empty
        const savedHistory = localStorage.getItem(`chatHistory_${userId}`);
        if (savedHistory) {
          try {
            formattedHistory = JSON.parse(savedHistory);
            console.log(`📱 Using localStorage data (${formattedHistory.length} items)`);
          } catch (e) {
            console.error("Error parsing saved history:", e);
          }
        }
      }

      // Update state with database data (or localStorage fallback)
      if (formattedHistory.length > 0 || chatHistory.length === 0) {
        setChatHistory(formattedHistory);
        setFilteredHistory(formattedHistory);
        // Save to localStorage as backup
        if (formattedHistory.length > 0) {
          localStorage.setItem(`chatHistory_${userId}`, JSON.stringify(formattedHistory));
        }
      }

    } catch (error) {
      console.error("❌ Error fetching from database:", error);
      setError("Could not connect to database. Showing cached history.");
      
      // Keep localStorage data if database fails
      const savedHistory = localStorage.getItem(`chatHistory_${userId}`);
      if (savedHistory) {
        try {
          const parsedHistory = JSON.parse(savedHistory);
          if (parsedHistory.length > 0) {
            setChatHistory(parsedHistory);
            setFilteredHistory(parsedHistory);
            console.log(`📱 Using cached history (${parsedHistory.length} items)`);
          }
        } catch (e) {
          console.error("Error parsing saved history:", e);
        }
      }
    } finally {
      setLoadingHistory(false);
      setIsInitialLoad(false);
    }
  };

  // Refresh history from database
  const refreshHistory = () => {
    if (userId) {
      setLoadingHistory(true);
      loadAllChatHistoryFromDB(userId);
    }
  };

  const askAI = async () => {
    if (!question.trim()) return;

    // Get userId from multiple sources
    let currentUserId = userId || 
                       user?.userId || 
                       localStorage.getItem("userId");

    if (!currentUserId) {
      alert("User not found. Please login again.");
      return;
    }

    const currentQuestion = question.trim();
    setQuestion("");
    setLoading(true);

    try {
      const res = await aiApi.post("/api/ai/ask", {
        question: currentQuestion,
        userId: parseInt(currentUserId),
      });

      const aiResponse = res.data?.response || res.data || "No response received";

      // Add to chat history
      const newEntry = {
        id: Date.now(),
        question: currentQuestion,
        answer: aiResponse,
        timestamp: new Date().toISOString(),
        userId: parseInt(currentUserId),
      };

      const updatedHistory = [newEntry, ...chatHistory];
      setChatHistory(updatedHistory);
      setFilteredHistory(updatedHistory);
      
      // Save to localStorage immediately
      localStorage.setItem(`chatHistory_${currentUserId}`, JSON.stringify(updatedHistory));
      
      // Re-apply search filter if any
      if (searchTerm) {
        filterHistory(searchTerm, updatedHistory);
      }

      console.log(`✅ Added new entry to history for user ${currentUserId}`);

    } catch (error) {
      console.error("AI Error:", error);
      alert("Unable to get AI advice. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      askAI();
    }
  };

  const clearHistory = async () => {
    if (window.confirm("Are you sure you want to clear all chat history from database?")) {
      try {
        // Clear from state
        setChatHistory([]);
        setFilteredHistory([]);
        
        // Clear from localStorage
        localStorage.removeItem(`chatHistory_${userId}`);
        localStorage.removeItem(`historyVisible_${userId}`);
        
        // Optional: Call backend to clear history
        // const token = localStorage.getItem("token");
        // await aiApi.delete(`/api/ai/history/${userId}`, {
        //   headers: { Authorization: `Bearer ${token}` }
        // });
        
        setShowHistory(true);
        alert("History cleared successfully!");
      } catch (error) {
        console.error("Error clearing history:", error);
        alert("Failed to clear history. Please try again.");
      }
    }
  };

  const filterHistory = (term, history = chatHistory) => {
    setSearchTerm(term);
    if (!term.trim()) {
      setFilteredHistory(history);
      return;
    }
    
    const filtered = history.filter(item => 
      item.question.toLowerCase().includes(term.toLowerCase()) ||
      item.answer.toLowerCase().includes(term.toLowerCase())
    );
    setFilteredHistory(filtered);
  };

  const formatDate = (timestamp) => {
    try {
      const date = new Date(timestamp);
      return date.toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (e) {
      return "Invalid date";
    }
  };

  const toggleHistory = () => {
    const newState = !showHistory;
    setShowHistory(newState);
    if (userId) {
      saveHistoryState(userId, newState);
    }
    
    if (newState) {
      // Refresh history from database when opening
      loadAllChatHistoryFromDB(userId);
    }
  };

  return (
    <div className="bg-[#11183C] p-4 sm:p-5 rounded-3xl">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
        <div className="flex items-center gap-3">
          <FaRobot className="text-cyan-400 text-2xl sm:text-3xl" />
          <h1 className="text-xl sm:text-2xl font-bold">AI Financial Advisor</h1>
        </div>
        
        <div className="flex items-center gap-2">
          {/* Refresh Button */}
          <button
            onClick={refreshHistory}
            disabled={loadingHistory}
            className="bg-[#1B2559] px-3 py-2 rounded-xl hover:bg-[#2A3A7A] transition text-sm disabled:opacity-50"
            title="Refresh history from database"
          >
            <FaSync className={loadingHistory ? "animate-spin" : ""} />
          </button>
          
          {/* History Toggle Button */}
          <button
            onClick={toggleHistory}
            className="flex items-center gap-2 bg-[#1B2559] px-3 py-2 rounded-xl hover:bg-[#2A3A7A] transition text-sm"
          >
            <FaHistory />
            <span className="hidden sm:inline">History</span>
            {showHistory ? <FaChevronUp size={12} /> : <FaChevronDown size={12} />}
            {chatHistory.length > 0 && (
              <span className="bg-cyan-400 text-black text-xs px-2 py-0.5 rounded-full">
                {chatHistory.length}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* WELCOME WITH USER NAME */}
      <div className="text-gray-300 mb-4 text-sm sm:text-base">
        Hello, <span className="text-cyan-400 font-bold">{userName}</span>! How can I help you today?
      </div>

      {/* CHAT HISTORY SECTION - Shows all previous history */}
      {showHistory && (
        <div className="mb-4 bg-[#0D1335] rounded-2xl p-4 max-h-[500px] overflow-y-auto">
          <div className="flex flex-wrap justify-between items-center gap-2 mb-3">
            <h3 className="text-cyan-400 font-semibold flex items-center gap-2">
              <FaHistory /> Previous Conversations ({chatHistory.length})
            </h3>
            <div className="flex gap-2">
              {chatHistory.length > 0 && (
                <button
                  onClick={clearHistory}
                  className="text-red-400 hover:text-red-300 text-sm flex items-center gap-1"
                >
                  <FaTrash size={12} /> Clear All
                </button>
              )}
            </div>
          </div>

          {/* Error message */}
          {error && (
            <div className="bg-yellow-500/20 border border-yellow-500 text-yellow-300 p-3 rounded-xl mb-3 text-sm">
              ⚠️ {error}
            </div>
          )}

          {/* Search bar */}
          <div className="relative mb-3">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchTerm}
              onChange={(e) => filterHistory(e.target.value)}
              className="w-full bg-[#11183C] p-2 pl-10 rounded-xl outline-none text-white text-sm"
            />
          </div>
          
          {loadingHistory && isInitialLoad ? (
            <div className="text-center text-gray-400 py-4">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-cyan-400 mx-auto mb-2"></div>
              Loading history...
            </div>
          ) : filteredHistory.length === 0 ? (
            <p className="text-gray-400 text-center py-4">
              {searchTerm ? "No results found for your search" : "No previous conversations. Start asking questions!"}
            </p>
          ) : (
            <div className="space-y-4">
              {filteredHistory.map((item) => (
                <div key={item.id} className="bg-[#11183C] p-4 rounded-xl hover:bg-[#1B2559] transition">
                  <div className="flex justify-between items-start mb-2">
                    <p className="text-green-400 text-sm font-medium break-words flex-1 mr-2">
                      ❓ {item.question}
                    </p>
                    <span className="text-gray-500 text-xs whitespace-nowrap">
                      {formatDate(item.timestamp)}
                    </span>
                  </div>
                  <div className="bg-[#0D1335] p-3 rounded-lg mt-1">
                    <p className="text-cyan-300 text-sm break-words">
                      💡 {item.answer}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Sync status */}
          {loadingHistory && !isInitialLoad && (
            <div className="text-center text-gray-500 text-xs mt-2">
              <span className="animate-pulse">Syncing with database...</span>
            </div>
          )}
        </div>
      )}

      {/* INPUT - Ask new question */}
      <div className="flex mt-4 gap-3">
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={loading ? "Processing..." : "Ask a new financial question..."}
          disabled={loading}
          className="flex-1 bg-[#0D1335] p-3 rounded-2xl outline-none text-white text-sm sm:text-base disabled:opacity-50"
        />

        <button
          onClick={askAI}
          disabled={loading || !question.trim()}
          className="bg-purple-600 px-4 sm:px-5 rounded-2xl hover:bg-purple-700 disabled:opacity-50 transition"
        >
          {loading ? (
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
          ) : (
            <FaPaperPlane />
          )}
        </button>
      </div>

      {/* Database status indicator */}
      <div className="mt-2 text-xs text-gray-500 flex items-center gap-2">
        <span className="inline-block w-2 h-2 rounded-full bg-green-500"></span>
        {chatHistory.length > 0 ? (
          <span>{chatHistory.length} conversations loaded</span>
        ) : (
          <span>No conversations yet</span>
        )}
        {!loadingHistory && !isInitialLoad && (
          <span className="text-gray-600">• {error ? "Using cache" : "Connected"}</span>
        )}
      </div>
    </div>
  );
}

export default AIAdvisor;