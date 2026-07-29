import axios from "axios";

const notificationAPI = axios.create({
  baseURL: "http://localhost:9090/api/notifications",
});

// Auto add token to all requests
notificationAPI.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const notificationApi = {
  // ===============================
  // BASIC CRUD OPERATIONS
  // ===============================

  // Get all notifications for a user
  getNotifications: (userId) => {
    return notificationAPI.get(`/${userId}`);
  },

  // Get notification by ID
  getNotificationById: (notificationId) => {
    return notificationAPI.get(`/detail/${notificationId}`);
  },

  // Mark a notification as read
  markAsRead: (notificationId) => {
    return notificationAPI.put(`/read/${notificationId}`);
  },

  // Delete a single notification
  deleteNotification: (notificationId) => {
    return notificationAPI.delete(`/${notificationId}`);
  },

  // Delete all notifications for a user
  deleteAllNotifications: (userId) => {
    return notificationAPI.delete(`/all/${userId}`);
  },

  // ===============================
  // PAGINATION & FILTERING
  // ===============================

  // Get paginated notifications (for load more)
  getPaginated: (userId, page = 0, size = 20) => {
    return notificationAPI.get(`/${userId}/paginated?page=${page}&size=${size}`);
  },

  // Get notifications by type (EXPENSE, INCOME, GOAL, AI)
  getByType: (userId, type) => {
    return notificationAPI.get(`/${userId}/type/${type}`);
  },

  // Get only unread notifications
  getUnreadList: (userId) => {
    return notificationAPI.get(`/${userId}/unread-list`);
  },

  // ===============================
  // SUMMARY & STATISTICS
  // ===============================

  // Get unread count only
  getUnreadCount: (userId) => {
    return notificationAPI.get(`/unread/${userId}`);
  },

  // Get complete summary (counts, latest, etc.)
  getSummary: (userId) => {
    return notificationAPI.get(`/${userId}/summary`);
  },

  // Get statistics (total, unread, read, percentages)
  getStats: (userId) => {
    return notificationAPI.get(`/stats/${userId}`);
  },

  // ===============================
  // BULK OPERATIONS
  // ===============================

  // Mark multiple notifications as read
  markMultipleAsRead: (notificationIds) => {
    return notificationAPI.put('/read-bulk', notificationIds);
  },

  // Delete multiple notifications
  deleteMultiple: (notificationIds) => {
    return notificationAPI.delete('/delete-bulk', { data: notificationIds });
  },

  // Mark all notifications as read for a user
  markAllAsRead: (userId) => {
    return notificationAPI.put(`/read-all/${userId}`);
  },

  // ===============================
  // SEARCH & FILTER
  // ===============================

  // Search notifications by keyword
  searchNotifications: (userId, keyword) => {
    return notificationAPI.get(`/${userId}/search?keyword=${encodeURIComponent(keyword)}`);
  },

  // Filter notifications by read status
  filterNotifications: (userId, isRead) => {
    return notificationAPI.get(`/${userId}/filter?isRead=${isRead}`);
  },

  // ===============================
  // EXPORT
  // ===============================

  // Export all notifications as JSON
  exportNotifications: (userId) => {
    return notificationAPI.get(`/${userId}/export`);
  },

  // ===============================
  // HEALTH CHECK
  // ===============================

  healthCheck: () => {
    return notificationAPI.get('/health');
  }
};

export default notificationApi;