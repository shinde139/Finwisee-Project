package com.example.user.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.user.dto.CategoryExpenseDTO;
import com.example.user.dto.DashboardResponse;
import com.example.user.dto.MonthlyExpenseDTO;
import com.example.user.repository.BudgetRepository;
import com.example.user.repository.ExpenseRepository;
import com.example.user.repository.IncomeRepository;
import com.example.user.repository.SavingGoalRepository;

@Service
public class DashboardService {

    @Autowired
    private IncomeRepository incomeRepository;

    @Autowired
    private ExpenseRepository expenseRepository;

    @Autowired
    private BudgetRepository budgetRepository;

    @Autowired
    private SavingGoalRepository savingGoalRepository;

    // 🔔 Notification Services
    @Autowired
    private NotificationGeneratorService notificationGenerator;
    
    @Autowired
    private DailyExpenseNotificationService dailyExpenseNotificationService;
    
    @Autowired
    private IncomeNotificationService incomeNotificationService;

    // ===========================
    // Dashboard Summary
    // ===========================

    public DashboardResponse getDashboard(Integer userId) {

        DashboardResponse response = new DashboardResponse();

        Double income = incomeRepository.getTotalIncome(userId);
        Double expense = expenseRepository.getTotalExpense(userId);
        Double budget = budgetRepository.getTotalBudget(userId);
        Double saving = savingGoalRepository.getTotalSaving(userId);

        // Handle null values
        income = income != null ? income : 0.0;
        expense = expense != null ? expense : 0.0;
        budget = budget != null ? budget : 0.0;
        saving = saving != null ? saving : 0.0;

        response.setTotalIncome(income);
        response.setTotalExpense(expense);
        response.setBalance(income - expense);
        response.setTotalBudget(budget);
        response.setTotalSaving(saving);

        // ===============================
        // DASHBOARD NOTIFICATIONS
        // ===============================

        // 1. Check monthly expenses against budget
        if (expense > budget && budget > 0) {
            notificationGenerator.expenseAlert(
                userId,
                expense,
                budget
            );
        }

        // 2. Monthly expense summary (if there are expenses)
        if (expense > 0) {
            dailyExpenseNotificationService.dailyExpenseSummary(
                userId,
                expense,
                budget > 0 ? budget / 30 : 1000.0 // Daily budget
            );
        }

        // 3. Monthly income summary (if there is income)
        if (income > 0) {
            incomeNotificationService.monthlyIncomeSummary(
                userId,
                income
            );
        }

        // 4. Financial health tip
        if (income > 0 && expense > 0) {
            Double savingRate = ((income - expense) / income) * 100;
            if (savingRate < 10) {
                String tip = String.format(
                    "Your saving rate is %.1f%%. Try to save at least 20%% of your income for a healthy financial life.",
                    savingRate
                );
                notificationGenerator.aiSuggestion(userId, tip);
            } else if (savingRate >= 20) {
                String tip = String.format(
                    "Great job! Your saving rate is %.1f%%. You're on the right track!",
                    savingRate
                );
                notificationGenerator.aiSuggestion(userId, tip);
            }
        }

        return response;
    }

    // ===========================
    // Expense By Category
    // ===========================

    public List<CategoryExpenseDTO> getExpenseByCategory(Integer userId) {
        return expenseRepository.getExpenseByCategory(userId);
    }

    // ===========================
    // Monthly Expense Trend
    // ===========================

    public List<MonthlyExpenseDTO> getMonthlyExpense(Integer userId) {
        return expenseRepository.getMonthlyExpense(userId);
    }
}