import React, { useState, useEffect, useRef } from "react";
import { FaBell } from "react-icons/fa";
import aiAPI from "../api/aiApi";

function NotificationBell() {
  const [notifications, setNotifications] = useState([]);
  const [displayNotifications, setDisplayNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [unreadCount, setUnreadCount] = useState(0);
  const dropdownRef = useRef(null);

  // Get user ID from localStorage
  const getUserId = () => {
    try {
      // Try different storage methods
      const userData = localStorage.getItem("item");
      if (userData) {
        try {
          const user = JSON.parse(userData);
          return user.userId || user.id || 1;
        } catch (e) {
          return 1;
        }
      }
      
      const userId = localStorage.getItem("userId");
      if (userId) return parseInt(userId);
      
      return 1;
    } catch (error) {
      console.error("Error getting userId:", error);
      return 1;
    }
  };

  const userId = getUserId();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fetch notifications on mount
  useEffect(() => {
    fetchNotifications();
    // Auto refresh every 30 seconds
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  // Fetch notifications - CORRECTED API ENDPOINT
  const fetchNotifications = async () => {
    setLoading(true);
    try {
      // CORRECTED: Using /api/notifications/{userId} as per your backend
      const response = await aiAPI.get(`/api/notifications/${userId}`);
      console.log("Raw API Response:", response.data);
      
      let notificationsData = [];
      
      // Handle different response structures
      if (response.data) {
        if (Array.isArray(response.data)) {
          notificationsData = response.data;
        } else if (response.data.notifications && Array.isArray(response.data.notifications)) {
          notificationsData = response.data.notifications;
        } else if (response.data.data && Array.isArray(response.data.data)) {
          notificationsData = response.data.data;
        } else if (response.data.content && Array.isArray(response.data.content)) {
          notificationsData = response.data.content;
        }
      }
      
      console.log("Extracted notifications:", notificationsData);
      
      // Transform data to match frontend expectations
      const formattedNotifications = notificationsData.map((item) => ({
        id: item.notification_id || item.id || item._id || Math.random().toString(),
        title: item.title || item.heading || "Notification",
        message: item.message || item.description || item.body || "",
        time: item.created_at || item.createdAt || item.date || new Date().toISOString(),
        isRead: item.is_read === 1 || item.is_read === 0x01 || item.is_read === true || item.isRead === true,
        type: item.type || item.notificationType || "info"
      }));
      
      console.log("Formatted notifications:", formattedNotifications);
      
      setNotifications(formattedNotifications);
      
      // Calculate counts
      const total = formattedNotifications.length;
      const unread = formattedNotifications.filter(n => !n.isRead).length;
      setTotalCount(total);
      setUnreadCount(unread);
      
      // Show only 2 most recent notifications initially
      const sorted = [...formattedNotifications].sort((a, b) => 
        new Date(b.time) - new Date(a.time)
      );
      setDisplayNotifications(sorted.slice(0, 2));
      
      setError(null);
    } catch (error) {
      console.error("Error fetching notifications:", error);
      setError("Failed to load notifications");
      
      // Use fallback data
      const fallbackData = getFallbackNotifications();
      setNotifications(fallbackData);
      const total = fallbackData.length;
      const unread = fallbackData.filter(n => !n.isRead).length;
      setTotalCount(total);
      setUnreadCount(unread);
      setDisplayNotifications(fallbackData.slice(0, 2));
    } finally {
      setLoading(false);
    }
  };

  // Fallback notifications
  const getFallbackNotifications = () => {
    return [
      {
        id: "1",
        title: "Income Added Successfully!",
        message: "🎉 You added ₹10000.00 from frelancing. Great job! Keep tracking your income.",
        time: new Date().toISOString(),
        isRead: false,
        type: "INCOME"
      },
      {
        id: "2",
        title: "Saving Suggestion",
        message: "💡 Suggestion: Consider saving 20% of this income (₹2000.00) for your financial goals.",
        time: new Date(Date.now() - 3600000).toISOString(),
        isRead: false,
        type: "AI"
      },
      {
        id: "3",
        title: "Daily Expense Added",
        message: "You added an expense of ₹500.00 for jewellery. Keep tracking your spending!",
        time: new Date(Date.now() - 86400000).toISOString(),
        isRead: true,
        type: "EXPENSE"
      }
    ];
  };

  // Toggle dropdown
  const toggleDropdown = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      fetchNotifications();
    }
  };

  // Mark as read - CORRECTED ENDPOINT
  const markAsRead = async (id) => {
    try {
      await aiAPI.put(`/api/notifications/read/${id}`);
      
      const updated = notifications.map(n => 
        n.id === id ? { ...n, isRead: true } : n
      );
      setNotifications(updated);
      const unread = updated.filter(n => !n.isRead).length;
      setUnreadCount(unread);
      
      const sorted = [...updated].sort((a, b) => 
        new Date(b.time) - new Date(a.time)
      );
      setDisplayNotifications(sorted.slice(0, 2));
    } catch (error) {
      console.error("Error marking as read:", error);
      // Fallback: update locally
      const updated = notifications.map(n => 
        n.id === id ? { ...n, isRead: true } : n
      );
      setNotifications(updated);
      const unread = updated.filter(n => !n.isRead).length;
      setUnreadCount(unread);
      const sorted = [...updated].sort((a, b) => 
        new Date(b.time) - new Date(a.time)
      );
      setDisplayNotifications(sorted.slice(0, 2));
    }
  };

  // Mark all as read - CORRECTED ENDPOINT
  const markAllAsRead = async () => {
    try {
      await aiAPI.put(`/api/notifications/read-all/${userId}`);
      
      const updated = notifications.map(n => ({ ...n, isRead: true }));
      setNotifications(updated);
      setUnreadCount(0);
      const sorted = [...updated].sort((a, b) => 
        new Date(b.time) - new Date(a.time)
      );
      setDisplayNotifications(sorted.slice(0, 2));
    } catch (error) {
      console.error("Error marking all as read:", error);
      // Fallback: update locally
      const updated = notifications.map(n => ({ ...n, isRead: true }));
      setNotifications(updated);
      setUnreadCount(0);
      const sorted = [...updated].sort((a, b) => 
        new Date(b.time) - new Date(a.time)
      );
      setDisplayNotifications(sorted.slice(0, 2));
    }
  };

  // Delete notification - CORRECTED ENDPOINT
  const deleteNotification = async (id) => {
    try {
      await aiAPI.delete(`/api/notifications/${id}`);
      
      const updated = notifications.filter(n => n.id !== id);
      setNotifications(updated);
      const total = updated.length;
      const unread = updated.filter(n => !n.isRead).length;
      setTotalCount(total);
      setUnreadCount(unread);
      const sorted = [...updated].sort((a, b) => 
        new Date(b.time) - new Date(a.time)
      );
      setDisplayNotifications(sorted.slice(0, 2));
    } catch (error) {
      console.error("Error deleting notification:", error);
      // Fallback: update locally
      const updated = notifications.filter(n => n.id !== id);
      setNotifications(updated);
      const total = updated.length;
      const unread = updated.filter(n => !n.isRead).length;
      setTotalCount(total);
      setUnreadCount(unread);
      const sorted = [...updated].sort((a, b) => 
        new Date(b.time) - new Date(a.time)
      );
      setDisplayNotifications(sorted.slice(0, 2));
    }
  };

  // Show all notifications
  const showAllNotifications = () => {
    const sorted = [...notifications].sort((a, b) => 
      new Date(b.time) - new Date(a.time)
    );
    setDisplayNotifications(sorted);
  };

  // Show only recent (2) notifications
  const showRecentNotifications = () => {
    const sorted = [...notifications].sort((a, b) => 
      new Date(b.time) - new Date(a.time)
    );
    setDisplayNotifications(sorted.slice(0, 2));
  };

  // Format time
  const formatTime = (time) => {
    if (!time) return "Just now";
    try {
      const date = new Date(time);
      const now = new Date();
      const diff = now - date;
      
      if (diff < 60000) return "Just now";
      if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
      if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
      if (diff < 172800000) return "Yesterday";
      if (diff < 604800000) return `${Math.floor(diff / 86400000)}d ago`;
      return date.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric"
      });
    } catch (e) {
      return "Just now";
    }
  };

  // Get icon based on type
  const getIcon = (type) => {
    const icons = {
      INCOME: "💰",
      EXPENSE: "💳",
      GOAL: "🎯",
      AI: "🤖",
      BUDGET: "📊",
      WARNING: "⚠️",
      INFO: "ℹ️",
      SUCCESS: "✅",
      ERROR: "❌"
    };
    return icons[type?.toUpperCase()] || "🔔";
  };

  // Get badge color
  const getBadgeColor = (type) => {
    const colors = {
      INCOME: "bg-green-500/20 text-green-400",
      EXPENSE: "bg-red-500/20 text-red-400",
      GOAL: "bg-purple-500/20 text-purple-400",
      AI: "bg-blue-500/20 text-blue-400",
      BUDGET: "bg-cyan-500/20 text-cyan-400",
      WARNING: "bg-yellow-500/20 text-yellow-400",
      INFO: "bg-blue-500/20 text-blue-400",
      SUCCESS: "bg-green-500/20 text-green-400",
      ERROR: "bg-red-500/20 text-red-400"
    };
    return colors[type?.toUpperCase()] || "bg-gray-500/20 text-gray-400";
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Icon */}
      <button
        onClick={toggleDropdown}
        className="relative p-3 rounded-xl bg-[#0D1335] hover:bg-[#1B2559] transition"
      >
        <FaBell className="text-2xl text-gray-400" />
        {/* Show unread count on bell icon when dropdown is closed */}
        {!isOpen && unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full min-w-[20px] h-5 px-1 flex items-center justify-center font-bold animate-pulse">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
        {!isOpen && unreadCount === 0 && totalCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-gray-500 text-white text-xs rounded-full min-w-[18px] h-4 px-1 flex items-center justify-center text-[10px]">
            {totalCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-3 w-96 bg-[#11183C] rounded-3xl border border-[#26316A] shadow-2xl overflow-hidden z-50 max-h-[500px] flex flex-col">
          {/* Header */}
          <div className="p-4 border-b border-[#26316A] flex justify-between items-center">
            <div>
              <h2 className="text-lg font-bold">Notifications</h2>
              <p className="text-xs text-gray-400">
                {totalCount} total · {unreadCount} unread
              </p>
            </div>
            <div className="flex gap-2">
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="text-sm text-cyan-400 hover:text-cyan-300 transition"
                >
                  Mark All Read
                </button>
              )}
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-white transition"
              >
                ✕
              </button>
            </div>
          </div>

          {/* Notifications List */}
          <div className="overflow-y-auto flex-1">
            {loading ? (
              <div className="flex justify-center items-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-cyan-500"></div>
              </div>
            ) : error ? (
              <div className="text-center text-red-400 py-8">
                <p className="text-4xl mb-2">⚠️</p>
                <p>{error}</p>
                <button 
                  onClick={fetchNotifications}
                  className="mt-2 text-sm text-cyan-400 hover:underline"
                >
                  Retry
                </button>
              </div>
            ) : displayNotifications.length === 0 ? (
              <div className="text-center text-gray-400 py-8">
                <p className="text-4xl mb-2">🔔</p>
                <p>No notifications</p>
              </div>
            ) : (
              displayNotifications.map((item) => (
                <div
                  key={item.id}
                  className={`p-4 border-b border-[#26316A] hover:bg-[#0D1335] transition ${
                    !item.isRead ? "bg-[#0D1335] border-l-4 border-l-cyan-400" : ""
                  }`}
                >
                  <div className="flex gap-3">
                    <div className="flex-shrink-0">
                      <span className="text-2xl">{getIcon(item.type)}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className={`font-bold text-sm ${!item.isRead ? 'text-white' : 'text-gray-300'}`}>
                            {item.title}
                          </h3>
                          <span className={`text-xs px-2 py-0.5 rounded-full ${getBadgeColor(item.type)}`}>
                            {item.type || 'INFO'}
                          </span>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteNotification(item.id);
                          }}
                          className="text-gray-500 hover:text-red-400 transition text-xs ml-2 flex-shrink-0"
                        >
                          ✕
                        </button>
                      </div>
                      <p className="text-gray-400 text-sm mt-1 break-words">
                        {item.message}
                      </p>
                      <div className="flex justify-between items-center mt-2">
                        <p className="text-gray-500 text-xs">
                          {formatTime(item.time)}
                        </p>
                        {!item.isRead && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              markAsRead(item.id);
                            }}
                            className="text-xs text-cyan-400 hover:text-cyan-300 transition"
                          >
                            Mark as read
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          <div className="p-3 border-t border-[#26316A] flex justify-between items-center">
            {totalCount > 2 && displayNotifications.length === 2 && (
              <button 
                className="text-sm text-cyan-400 hover:text-cyan-300 transition"
                onClick={showAllNotifications}
              >
                View All ({totalCount})
              </button>
            )}
            {displayNotifications.length > 2 && (
              <button 
                className="text-sm text-cyan-400 hover:text-cyan-300 transition"
                onClick={showRecentNotifications}
              >
                Show Recent
              </button>
            )}
            <span className="text-xs text-gray-500 ml-auto">
              Auto-refresh: 30s
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

export default NotificationBell;