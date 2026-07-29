package com.example.user.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class IncomeNotificationService {

    @Autowired
    private NotificationService notificationService;

    // Notification when user adds income
    public void notifyIncomeAdded(Integer userId, Double incomeAmount, String incomeSource) {
        try {
            String title = "Income Added Successfully!";
            String message = String.format(
                "🎉 You added ₹%.2f from %s. Great job! Keep tracking your income.",
                incomeAmount, incomeSource
            );
            notificationService.saveNotification(userId, title, message, "INCOME");

            // Encourage saving
            String savingSuggestion = String.format(
                "💡 Suggestion: Consider saving 20%% of this income (₹%.2f) for your financial goals.",
                incomeAmount * 0.2
            );
            notificationService.saveNotification(userId, "Saving Suggestion", savingSuggestion, "AI");

        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    // Monthly income summary
    public void monthlyIncomeSummary(Integer userId, Double totalMonthlyIncome) {
        try {
            String title = "Monthly Income Summary";
            String message = String.format(
                "Your total income this month is ₹%.2f. Review your spending to ensure you're on track.",
                totalMonthlyIncome
            );
            notificationService.saveNotification(userId, title, message, "INCOME");
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}