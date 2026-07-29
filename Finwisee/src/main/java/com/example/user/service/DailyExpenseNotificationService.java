package com.example.user.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class DailyExpenseNotificationService {

    @Autowired
    private NotificationService notificationService;

    // Notification when user adds daily expense
    public void notifyDailyExpenseAdded(Integer userId, Double expenseAmount, String expenseCategory) {
        try {
            String title = "Daily Expense Added";
            String message = String.format(
                "You added an expense of ₹%.2f for %s. Keep tracking your spending!",
                expenseAmount, expenseCategory
            );
            notificationService.saveNotification(userId, title, message, "EXPENSE");

            // Check if expense is high and suggest savings
            if (expenseAmount > 1000) {
                String suggestionTitle = "Expense Alert!";
                String suggestionMessage = String.format(
                    "You spent ₹%.2f today on %s. Consider if this was necessary or if you could save more.",
                    expenseAmount, expenseCategory
                );
                notificationService.saveNotification(userId, suggestionTitle, suggestionMessage, "EXPENSE");
            }

        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    // Notification for daily expense summary
    public void dailyExpenseSummary(Integer userId, Double totalDailyExpense, Double dailyBudget) {
        try {
            if (totalDailyExpense > dailyBudget) {
                String title = "Daily Budget Exceeded";
                String message = String.format(
                    "You have exceeded your daily budget of ₹%.2f. Today's total: ₹%.2f. Consider reducing tomorrow's spending.",
                    dailyBudget, totalDailyExpense
                );
                notificationService.saveNotification(userId, title, message, "EXPENSE");
            } else if (totalDailyExpense > 0) {
                String title = "Daily Expense Summary";
                String message = String.format(
                    "Today's total expense: ₹%.2f. Daily budget remaining: ₹%.2f. Keep it up!",
                    totalDailyExpense, dailyBudget - totalDailyExpense
                );
                notificationService.saveNotification(userId, title, message, "EXPENSE");
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}