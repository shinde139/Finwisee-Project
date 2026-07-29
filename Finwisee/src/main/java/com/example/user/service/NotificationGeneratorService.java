package com.example.user.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class NotificationGeneratorService {

    @Autowired
    private NotificationService notificationService;

    // =========================================================
    // EXPENSE ALERT
    // =========================================================

    public void expenseAlert(Integer userId, Double totalExpense, Double monthlyLimit) {
        try {
            if (totalExpense >= monthlyLimit) {
                notificationService.saveNotification(
                    userId,
                    "Expense Limit Reached",
                    "Your monthly expense reached ₹" + totalExpense +
                    ". Try reducing unnecessary spending.",
                    "EXPENSE"
                );
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    // =========================================================
    // GOAL REMINDER
    // =========================================================

    public void goalReminder(Integer userId, String goalName, Double savedAmount, Double target) {
        try {
            if (target == null || target == 0) {
                return;
            }
            
            Double percentage = (savedAmount / target) * 100;

            if (percentage < 50) {
                notificationService.saveNotification(
                    userId,
                    "Goal Progress Alert",
                    "Your goal '" + goalName + "' is only " + 
                    String.format("%.1f", percentage) + 
                    "% completed. Increase saving.",
                    "GOAL"
                );
            } else if (percentage >= 50 && percentage < 75) {
                notificationService.saveNotification(
                    userId,
                    "Goal Halfway There!",
                    "Great! You're " + 
                    String.format("%.1f", percentage) + 
                    "% towards your goal '" + goalName + "'. Keep pushing!",
                    "GOAL"
                );
            } else if (percentage >= 75 && percentage < 100) {
                notificationService.saveNotification(
                    userId,
                    "Goal Almost Complete!",
                    "You're " + 
                    String.format("%.1f", percentage) + 
                    "% towards your goal '" + goalName + "'. Almost there!",
                    "GOAL"
                );
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    // =========================================================
    // AI SUGGESTION
    // =========================================================

    public void aiSuggestion(Integer userId, String suggestion) {
        try {
            if (suggestion != null && !suggestion.isEmpty()) {
                notificationService.saveNotification(
                    userId,
                    "AI Financial Advice",
                    suggestion,
                    "AI"
                );
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}