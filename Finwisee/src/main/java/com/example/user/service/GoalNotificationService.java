package com.example.user.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class GoalNotificationService {

    @Autowired
    private NotificationService notificationService;

    @Autowired
    private NotificationGeneratorService notificationGeneratorService;

    // Notification when user adds a goal
    public void notifyGoalCreated(Integer userId, String goalName, Double targetAmount) {
        try {
            String title = "🎯 New Goal Created!";
            String message = String.format(
                "You created a new goal '%s' with target ₹%.2f. Good luck!",
                goalName, targetAmount
            );
            notificationService.saveNotification(userId, title, message, "GOAL");

            // Suggest monthly savings plan
            Double monthlySaving = targetAmount / 12;
            String suggestionTitle = "Goal Achievement Plan";
            String suggestionMessage = String.format(
                "💡 To reach your goal '%s', try saving ₹%.2f per month for 12 months.",
                goalName, monthlySaving
            );
            notificationService.saveNotification(userId, suggestionTitle, suggestionMessage, "AI");

        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    // Notification when goal progress is updated
    public void notifyGoalProgress(Integer userId, String goalName, Double savedAmount, Double targetAmount) {
        try {
            Double percentage = (savedAmount / targetAmount) * 100;
            
            String title = "Goal Progress Update";
            String message = String.format(
                "Your goal '%s' is %.1f%% complete. You've saved ₹%.2f out of ₹%.2f.",
                goalName, percentage, savedAmount, targetAmount
            );
            notificationService.saveNotification(userId, title, message, "GOAL");

            // Goal reminder
            notificationGeneratorService.goalReminder(userId, goalName, savedAmount, targetAmount);

        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    // Goal completion notification
    public void notifyGoalCompleted(Integer userId, String goalName) {
        try {
            String title = "🏆 Goal Achieved!";
            String message = String.format(
                "Congratulations! You have successfully achieved your goal '%s'. Well done! 🎉",
                goalName
            );
            notificationService.saveNotification(userId, title, message, "GOAL");
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}