package com.example.user.controller;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.*;

import com.example.user.entity.Notification;
import com.example.user.service.DailyExpenseNotificationService;
import com.example.user.service.GoalNotificationService;
import com.example.user.service.IncomeNotificationService;
import com.example.user.service.NotificationGeneratorService;
import com.example.user.service.NotificationService;

@RestController
@RequestMapping("/api/notifications")
@CrossOrigin("*")
public class NotificationController {

    @Autowired
    private NotificationService notificationService;

    @Autowired
    private DailyExpenseNotificationService dailyExpenseNotificationService;

    @Autowired
    private IncomeNotificationService incomeNotificationService;

    @Autowired
    private GoalNotificationService goalNotificationService;

    @Autowired
    private NotificationGeneratorService notificationGeneratorService;

    // =========================================================
    // 1. BASIC CRUD OPERATIONS
    // =========================================================

    // Get All Notifications
    @GetMapping("/{userId}")
    public Map<String, Object> getNotifications(@PathVariable Integer userId) {
        Map<String, Object> response = new HashMap<>();
        List<Notification> notifications = notificationService.getNotifications(userId);
        
        response.put("success", true);
        response.put("notifications", notifications);
        response.put("count", notifications.size());
        
        return response;
    }

    // Get Notification by ID
    @GetMapping("/detail/{notificationId}")
    public Map<String, Object> getNotificationById(@PathVariable Integer notificationId) {
        Map<String, Object> response = new HashMap<>();
        Notification notification = notificationService.getNotificationById(notificationId);
        
        if (notification != null) {
            response.put("success", true);
            response.put("notification", notification);
        } else {
            response.put("success", false);
            response.put("message", "Notification not found");
        }
        
        return response;
    }

    // Mark As Read
    @PutMapping("/read/{notificationId}")
    public Map<String, Object> markAsRead(@PathVariable Integer notificationId) {
        Map<String, Object> response = new HashMap<>();
        String result = notificationService.markAsRead(notificationId);
        
        response.put("success", result.contains("successfully"));
        response.put("message", result);
        response.put("notificationId", notificationId);
        
        return response;
    }

    // Delete Notification
    @DeleteMapping("/{notificationId}")
    public Map<String, Object> deleteNotification(@PathVariable Integer notificationId) {
        Map<String, Object> response = new HashMap<>();
        String result = notificationService.deleteNotification(notificationId);
        
        response.put("success", result.contains("successfully"));
        response.put("message", result);
        response.put("notificationId", notificationId);
        
        return response;
    }

    // Delete All Notifications for a user
    @DeleteMapping("/all/{userId}")
    public Map<String, Object> deleteAllNotifications(@PathVariable Integer userId) {
        Map<String, Object> response = new HashMap<>();
        String result = notificationService.deleteAllNotifications(userId);
        
        response.put("success", result.contains("successfully"));
        response.put("message", result);
        response.put("userId", userId);
        
        return response;
    }

    // =========================================================
    // 2. PAGINATION & FILTERING
    // =========================================================

    // ✅ Get Notifications with Pagination
    @GetMapping("/{userId}/paginated")
    public Map<String, Object> getNotificationsPaginated(
            @PathVariable Integer userId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {

        Map<String, Object> response = new HashMap<>();
        Page<Notification> notificationPage = notificationService.getNotificationsPaginated(userId, page, size);
        
        response.put("success", true);
        response.put("content", notificationPage.getContent());
        response.put("totalElements", notificationPage.getTotalElements());
        response.put("totalPages", notificationPage.getTotalPages());
        response.put("currentPage", notificationPage.getNumber());
        response.put("size", notificationPage.getSize());
        response.put("hasNext", notificationPage.hasNext());
        response.put("hasPrevious", notificationPage.hasPrevious());
        response.put("isFirst", notificationPage.isFirst());
        response.put("isLast", notificationPage.isLast());
        
        return response;
    }

    // Get Notifications by Type
    @GetMapping("/{userId}/type/{type}")
    public Map<String, Object> getNotificationsByType(
            @PathVariable Integer userId,
            @PathVariable String type) {

        Map<String, Object> response = new HashMap<>();
        List<Notification> notifications = notificationService.getNotificationsByType(userId, type.toUpperCase());
        
        response.put("success", true);
        response.put("notifications", notifications);
        response.put("count", notifications.size());
        response.put("type", type);
        
        return response;
    }

    // Get Unread Notifications
    @GetMapping("/{userId}/unread-list")
    public Map<String, Object> getUnreadNotifications(@PathVariable Integer userId) {
        Map<String, Object> response = new HashMap<>();
        List<Notification> notifications = notificationService.getUnreadNotifications(userId);
        
        response.put("success", true);
        response.put("notifications", notifications);
        response.put("count", notifications.size());
        
        return response;
    }

    // =========================================================
    // 3. SUMMARY & STATISTICS
    // =========================================================

    // Get Unread Count
    @GetMapping("/unread/{userId}")
    public Map<String, Object> getUnreadCount(@PathVariable Integer userId) {
        Map<String, Object> response = new HashMap<>();
        Long count = notificationService.getUnreadCount(userId);
        
        response.put("success", true);
        response.put("count", count);
        response.put("userId", userId);
        
        return response;
    }

    // Get Notification Summary
    @GetMapping("/{userId}/summary")
    public Map<String, Object> getNotificationSummary(@PathVariable Integer userId) {
        Map<String, Object> summary = new HashMap<>();
        
        summary.put("unreadCount", notificationService.getUnreadCount(userId));
        summary.put("totalCount", notificationService.getNotificationCount(userId));
        summary.put("latestNotifications", notificationService.getLatestNotifications(userId, 5));
        
        // Get counts by type
        Map<String, Long> typeCounts = new HashMap<>();
        typeCounts.put("EXPENSE", notificationService.getCountByType(userId, "EXPENSE"));
        typeCounts.put("INCOME", notificationService.getCountByType(userId, "INCOME"));
        typeCounts.put("GOAL", notificationService.getCountByType(userId, "GOAL"));
        typeCounts.put("AI", notificationService.getCountByType(userId, "AI"));
        summary.put("typeCounts", typeCounts);
        
        // Get today's notifications
        summary.put("todayCount", notificationService.getTodayCount(userId));
        
        return summary;
    }

    // ✅ Get Notification Stats
    @GetMapping("/stats/{userId}")
    public Map<String, Object> getNotificationStats(@PathVariable Integer userId) {
        Map<String, Object> stats = new HashMap<>();
        
        long total = notificationService.getNotificationCount(userId);
        long unread = notificationService.getUnreadCount(userId);
        long read = total - unread;
        
        stats.put("success", true);
        stats.put("total", total);
        stats.put("unread", unread);
        stats.put("read", read);
        stats.put("unreadPercentage", total > 0 ? (unread * 100.0 / total) : 0);
        stats.put("readPercentage", total > 0 ? (read * 100.0 / total) : 0);
        
        return stats;
    }

    // =========================================================
    // 4. BULK OPERATIONS
    // =========================================================

    // Bulk Mark as Read
    @PutMapping("/read-bulk")
    public Map<String, Object> markMultipleAsRead(@RequestBody List<Integer> notificationIds) {
        Map<String, Object> response = new HashMap<>();
        String result = notificationService.markMultipleAsRead(notificationIds);
        
        response.put("success", result.contains("successfully"));
        response.put("message", result);
        response.put("notificationIds", notificationIds);
        response.put("count", notificationIds.size());
        
        return response;
    }

    // Bulk Delete
    @DeleteMapping("/delete-bulk")
    public Map<String, Object> deleteMultipleNotifications(@RequestBody List<Integer> notificationIds) {
        Map<String, Object> response = new HashMap<>();
        String result = notificationService.deleteMultipleNotifications(notificationIds);
        
        response.put("success", result.contains("successfully"));
        response.put("message", result);
        response.put("count", notificationIds.size());
        
        return response;
    }

    // Mark All as Read for User
    @PutMapping("/read-all/{userId}")
    public Map<String, Object> markAllAsRead(@PathVariable Integer userId) {
        Map<String, Object> response = new HashMap<>();
        String result = notificationService.markAllAsRead(userId);
        
        response.put("success", result.contains("successfully"));
        response.put("message", result);
        response.put("userId", userId);
        
        return response;
    }

    // =========================================================
    // 5. EXPENSE NOTIFICATIONS
    // =========================================================

    // Notify when expense is added
    @PostMapping("/expense/{userId}")
    public Map<String, Object> notifyExpenseAdded(
            @PathVariable Integer userId,
            @RequestParam Double expenseAmount,
            @RequestParam String category) {

        Map<String, Object> response = new HashMap<>();
        dailyExpenseNotificationService.notifyDailyExpenseAdded(userId, expenseAmount, category);
        
        response.put("success", true);
        response.put("message", "Expense notification sent");
        response.put("userId", userId);
        response.put("amount", expenseAmount);
        response.put("category", category);
        
        return response;
    }

    // Daily expense summary
    @PostMapping("/expense/summary/{userId}")
    public Map<String, Object> dailyExpenseSummary(
            @PathVariable Integer userId,
            @RequestParam Double totalDailyExpense,
            @RequestParam Double dailyBudget) {

        Map<String, Object> response = new HashMap<>();
        dailyExpenseNotificationService.dailyExpenseSummary(userId, totalDailyExpense, dailyBudget);
        
        response.put("success", true);
        response.put("message", "Daily expense summary sent");
        response.put("userId", userId);
        response.put("totalExpense", totalDailyExpense);
        response.put("dailyBudget", dailyBudget);
        
        return response;
    }

    // Expense Alert
    @PostMapping("/alert/expense/{userId}")
    public Map<String, Object> expenseAlert(
            @PathVariable Integer userId,
            @RequestParam Double totalExpense,
            @RequestParam Double monthlyLimit) {

        Map<String, Object> response = new HashMap<>();
        notificationGeneratorService.expenseAlert(userId, totalExpense, monthlyLimit);
        
        response.put("success", true);
        response.put("message", "Expense alert sent");
        response.put("userId", userId);
        response.put("totalExpense", totalExpense);
        response.put("monthlyLimit", monthlyLimit);
        
        return response;
    }

    // =========================================================
    // 6. INCOME NOTIFICATIONS
    // =========================================================

    // Notify when income is added
    @PostMapping("/income/{userId}")
    public Map<String, Object> notifyIncomeAdded(
            @PathVariable Integer userId,
            @RequestParam Double incomeAmount,
            @RequestParam String source) {

        Map<String, Object> response = new HashMap<>();
        incomeNotificationService.notifyIncomeAdded(userId, incomeAmount, source);
        
        response.put("success", true);
        response.put("message", "Income notification sent");
        response.put("userId", userId);
        response.put("amount", incomeAmount);
        response.put("source", source);
        
        return response;
    }

    // Monthly income summary
    @PostMapping("/income/summary/{userId}")
    public Map<String, Object> monthlyIncomeSummary(
            @PathVariable Integer userId,
            @RequestParam Double totalMonthlyIncome) {

        Map<String, Object> response = new HashMap<>();
        incomeNotificationService.monthlyIncomeSummary(userId, totalMonthlyIncome);
        
        response.put("success", true);
        response.put("message", "Monthly income summary sent");
        response.put("userId", userId);
        response.put("totalIncome", totalMonthlyIncome);
        
        return response;
    }

    // =========================================================
    // 7. GOAL NOTIFICATIONS
    // =========================================================

    // Notify when goal is created
    @PostMapping("/goal/create/{userId}")
    public Map<String, Object> notifyGoalCreated(
            @PathVariable Integer userId,
            @RequestParam String goalName,
            @RequestParam Double targetAmount) {

        Map<String, Object> response = new HashMap<>();
        goalNotificationService.notifyGoalCreated(userId, goalName, targetAmount);
        
        response.put("success", true);
        response.put("message", "Goal notification sent");
        response.put("userId", userId);
        response.put("goalName", goalName);
        response.put("targetAmount", targetAmount);
        
        return response;
    }

    // Notify when goal progress is updated
    @PostMapping("/goal/progress/{userId}")
    public Map<String, Object> notifyGoalProgress(
            @PathVariable Integer userId,
            @RequestParam String goalName,
            @RequestParam Double savedAmount,
            @RequestParam Double targetAmount) {

        Map<String, Object> response = new HashMap<>();
        goalNotificationService.notifyGoalProgress(userId, goalName, savedAmount, targetAmount);
        
        response.put("success", true);
        response.put("message", "Goal progress notification sent");
        response.put("userId", userId);
        response.put("goalName", goalName);
        response.put("savedAmount", savedAmount);
        response.put("targetAmount", targetAmount);
        response.put("percentage", (savedAmount / targetAmount) * 100);
        
        return response;
    }

    // Goal Reminder
    @PostMapping("/goal/reminder/{userId}")
    public Map<String, Object> goalReminder(
            @PathVariable Integer userId,
            @RequestParam String goalName,
            @RequestParam Double savedAmount,
            @RequestParam Double targetAmount) {

        Map<String, Object> response = new HashMap<>();
        notificationGeneratorService.goalReminder(userId, goalName, savedAmount, targetAmount);
        
        response.put("success", true);
        response.put("message", "Goal reminder sent");
        response.put("userId", userId);
        
        return response;
    }

    // Goal Completion Notification
    @PostMapping("/goal/complete/{userId}")
    public Map<String, Object> notifyGoalCompleted(
            @PathVariable Integer userId,
            @RequestParam String goalName) {

        Map<String, Object> response = new HashMap<>();
        goalNotificationService.notifyGoalCompleted(userId, goalName);
        
        response.put("success", true);
        response.put("message", "Goal completion notification sent");
        response.put("userId", userId);
        response.put("goalName", goalName);
        
        return response;
    }

    // =========================================================
    // 8. AI SUGGESTIONS
    // =========================================================

    // AI Suggestion
    @PostMapping("/ai/suggestion/{userId}")
    public Map<String, Object> aiSuggestion(
            @PathVariable Integer userId,
            @RequestParam String suggestion) {

        Map<String, Object> response = new HashMap<>();
        notificationGeneratorService.aiSuggestion(userId, suggestion);
        
        response.put("success", true);
        response.put("message", "AI suggestion sent");
        response.put("userId", userId);
        response.put("suggestion", suggestion);
        
        return response;
    }

    // =========================================================
    // 9. SEARCH & FILTER
    // =========================================================

    // Search Notifications
    @GetMapping("/{userId}/search")
    public Map<String, Object> searchNotifications(
            @PathVariable Integer userId,
            @RequestParam String keyword) {

        Map<String, Object> response = new HashMap<>();
        List<Notification> notifications = notificationService.searchNotifications(userId, keyword);
        
        response.put("success", true);
        response.put("notifications", notifications);
        response.put("count", notifications.size());
        response.put("keyword", keyword);
        
        return response;
    }

    // Filter Notifications by Read Status
    @GetMapping("/{userId}/filter")
    public Map<String, Object> filterNotifications(
            @PathVariable Integer userId,
            @RequestParam(required = false) Boolean isRead) {

        Map<String, Object> response = new HashMap<>();
        List<Notification> notifications = notificationService.filterNotifications(userId, isRead);
        
        response.put("success", true);
        response.put("notifications", notifications);
        response.put("count", notifications.size());
        response.put("filter", isRead != null ? (isRead ? "Read" : "Unread") : "All");
        
        return response;
    }

    // =========================================================
    // 10. EXPORT NOTIFICATIONS
    // =========================================================

    // Export Notifications as JSON
    @GetMapping("/{userId}/export")
    public Map<String, Object> exportNotifications(@PathVariable Integer userId) {
        Map<String, Object> response = new HashMap<>();
        List<Notification> notifications = notificationService.getNotifications(userId);
        
        response.put("success", true);
        response.put("exportDate", LocalDateTime.now());
        response.put("userId", userId);
        response.put("totalCount", notifications.size());
        response.put("notifications", notifications);
        
        return response;
    }

    // =========================================================
    // 11. HEALTH CHECK
    // =========================================================

    @GetMapping("/health")
    public Map<String, Object> healthCheck() {
        Map<String, Object> response = new HashMap<>();
        response.put("status", "UP");
        response.put("service", "Notification Service");
        response.put("timestamp", LocalDateTime.now());
        return response;
    }
}