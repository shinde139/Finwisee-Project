package com.example.user.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.user.entity.SavingGoal;
import com.example.user.entity.User;
import com.example.user.repository.SavingGoalRepository;
import com.example.user.repository.UserRepository;

@Service
public class SavingGoalService {

    @Autowired
    private SavingGoalRepository goalRepository;

    @Autowired
    private UserRepository userRepository;

    // 🔔 Notification Services
    @Autowired
    private GoalNotificationService goalNotificationService;
    
    @Autowired
    private NotificationGeneratorService notificationGenerator;

    // ==================================================
    // ADD GOAL
    // ==================================================

    public String addGoal(Integer userId, SavingGoal goal) {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User Not Found"));

        goal.setUser(user);

        if (goal.getSavedAmount() == null) {
            goal.setSavedAmount(0.0);
        }

        if (goal.getSavedAmount() >= goal.getTargetAmount()) {
            goal.setStatus("Completed");
        } else {
            goal.setStatus("In Progress");
        }

        SavingGoal savedGoal = goalRepository.save(goal);

        // ===============================
        // 🔔 SEND GOAL NOTIFICATIONS
        // ===============================

        // 1. Goal Created Notification
        goalNotificationService.notifyGoalCreated(
            userId,
            savedGoal.getGoalName(),
            savedGoal.getTargetAmount()
        );

        // 2. Goal Reminder
        notificationGenerator.goalReminder(
            userId,
            savedGoal.getGoalName(),
            savedGoal.getSavedAmount(),
            savedGoal.getTargetAmount()
        );

        return "Goal Added Successfully";
    }

    // ==================================================
    // GET GOALS
    // ==================================================

    public List<SavingGoal> getGoals(Integer userId) {
        return goalRepository.findByUserUserId(userId);
    }

    // ==================================================
    // UPDATE GOAL
    // ==================================================

    public String updateGoal(Integer goalId, SavingGoal goal) {

        SavingGoal oldGoal = goalRepository.findById(goalId).orElse(null);

        if (oldGoal == null) {
            return "Goal Not Found";
        }

        oldGoal.setGoalName(goal.getGoalName());
        oldGoal.setTargetAmount(goal.getTargetAmount());
        oldGoal.setSavedAmount(goal.getSavedAmount());
        oldGoal.setTargetDate(goal.getTargetDate());

        if (goal.getSavedAmount() >= goal.getTargetAmount()) {
            oldGoal.setStatus("Completed");
        } else {
            oldGoal.setStatus("In Progress");
        }

        SavingGoal updatedGoal = goalRepository.save(oldGoal);

        // ===============================
        // 🔔 SEND GOAL PROGRESS NOTIFICATION
        // ===============================

        goalNotificationService.notifyGoalProgress(
            updatedGoal.getUser().getUserId(),
            updatedGoal.getGoalName(),
            updatedGoal.getSavedAmount(),
            updatedGoal.getTargetAmount()
        );

        return "Goal Updated Successfully";
    }

    // ==================================================
    // DELETE GOAL
    // ==================================================

    public String deleteGoal(Integer id) {
        goalRepository.deleteById(id);
        return "Goal Deleted Successfully";
    }
}