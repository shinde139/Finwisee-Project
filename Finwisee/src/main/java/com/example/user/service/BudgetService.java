// BudgetService.java
package com.example.user.service;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.user.dto.BudgetResponseDTO;
import com.example.user.entity.Budget;
import com.example.user.entity.Category;
import com.example.user.entity.User;
import com.example.user.repository.BudgetRepository;
import com.example.user.repository.CategoryRepository;
import com.example.user.repository.ExpenseRepository;
import com.example.user.repository.UserRepository;

@Service
public class BudgetService {

    @Autowired
    private BudgetRepository budgetRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private ExpenseRepository expenseRepository; // ✅ ADD THIS

    // Add Budget - AUTOMATICALLY CALCULATE SPENT AMOUNT
    @Transactional
    public String addBudget(
            Integer userId,
            Integer categoryId,
            Budget budget){

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User Not Found"));

        Category category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new RuntimeException("Category Not Found"));

        // Set user and category
        budget.setUser(user);
        budget.setCategory(category);

        // ✅ NEW: Automatically calculate spent amount from existing expenses
        LocalDate startDate = budget.getStartDate();
        LocalDate endDate = budget.getEndDate();
        
        if (startDate != null && endDate != null) {
            // Calculate total expenses for this category within the date range
            Double existingExpenses = expenseRepository.getTotalExpenseByCategoryAndDateRange(
                userId, 
                categoryId, 
                startDate, 
                endDate
            );
            
            // Set spent amount (default to 0 if no expenses found)
            budget.setSpentAmount(existingExpenses != null ? existingExpenses : 0.0);
        } else {
            // If dates are not provided, set spent amount to 0
            budget.setSpentAmount(0.0);
        }

        // Save budget
        budgetRepository.save(budget);

        return String.format(
            "Budget Added Successfully for category '%s'. " +
            "Amount: %.2f | Already Spent: %.2f | Remaining: %.2f",
            category.getCategoryName(),
            budget.getBudgetAmount(),
            budget.getSpentAmount(),
            budget.getBudgetAmount() - budget.getSpentAmount()
        );
    }

    // Get Budgets
    @Transactional(readOnly = true)
    public List<BudgetResponseDTO> getBudgets(Integer userId){
        List<Budget> budgets = budgetRepository.findByUserUserId(userId);
        return budgets.stream()
                .map(budget -> {
                    BudgetResponseDTO dto = new BudgetResponseDTO();
                    dto.setBudgetId(budget.getBudgetId());
                    dto.setBudgetAmount(budget.getBudgetAmount());
                    
                    // ✅ Get latest spent amount from expenses
                    Double spentAmount = getSpentAmountForBudget(budget);
                    dto.setSpentAmount(spentAmount);
                    
                    dto.setStartDate(budget.getStartDate());
                    dto.setEndDate(budget.getEndDate());
                    
                    if (budget.getCategory() != null) {
                        dto.setCategoryId(budget.getCategory().getCategoryId());
                        dto.setCategoryName(budget.getCategory().getCategoryName());
                    } else {
                        dto.setCategoryId(null);
                        dto.setCategoryName("Uncategorized");
                    }
                    
                    if (budget.getUser() != null) {
                        dto.setUserId(budget.getUser().getUserId());
                    }
                    
                    return dto;
                })
                .collect(Collectors.toList());
    }

    // Get Budget by ID
    @Transactional(readOnly = true)
    public BudgetResponseDTO getBudgetById(Integer userId, Integer budgetId){
        Budget budget = budgetRepository.findById(budgetId)
                .orElseThrow(() -> new RuntimeException("Budget not found"));
        
        BudgetResponseDTO dto = new BudgetResponseDTO();
        dto.setBudgetId(budget.getBudgetId());
        dto.setBudgetAmount(budget.getBudgetAmount());
        
        // ✅ Get latest spent amount from expenses
        Double spentAmount = getSpentAmountForBudget(budget);
        dto.setSpentAmount(spentAmount);
        
        dto.setStartDate(budget.getStartDate());
        dto.setEndDate(budget.getEndDate());
        
        if (budget.getCategory() != null) {
            dto.setCategoryId(budget.getCategory().getCategoryId());
            dto.setCategoryName(budget.getCategory().getCategoryName());
        } else {
            dto.setCategoryId(null);
            dto.setCategoryName("Uncategorized");
        }
        
        if (budget.getUser() != null) {
            dto.setUserId(budget.getUser().getUserId());
        }
        
        return dto;
    }

    // ✅ NEW: Helper method to calculate spent amount for a budget
    private Double getSpentAmountForBudget(Budget budget) {
        if (budget.getStartDate() == null || budget.getEndDate() == null) {
            return 0.0;
        }
        
        Integer userId = budget.getUser().getUserId();
        Integer categoryId = budget.getCategory().getCategoryId();
        
        Double spent = expenseRepository.getTotalExpenseByCategoryAndDateRange(
            userId, 
            categoryId, 
            budget.getStartDate(), 
            budget.getEndDate()
        );
        
        return spent != null ? spent : 0.0;
    }

    // Update Budget - Recalculate spent amount
    @Transactional
    public String updateBudget(
            Integer budgetId,
            Budget budget){

        Budget oldBudget = budgetRepository.findById(budgetId)
                .orElse(null);

        if(oldBudget == null){
            return "Budget Not Found";
        }

        // Update fields if provided
        if (budget.getBudgetAmount() != null) {
            oldBudget.setBudgetAmount(budget.getBudgetAmount());
        }
        
        if (budget.getStartDate() != null) {
            oldBudget.setStartDate(budget.getStartDate());
        }
        
        if (budget.getEndDate() != null) {
            oldBudget.setEndDate(budget.getEndDate());
        }
        
        if (budget.getCategory() != null) {
            oldBudget.setCategory(budget.getCategory());
        }

        // ✅ Recalculate spent amount based on updated dates/category
        Double recalculatedSpent = getSpentAmountForBudget(oldBudget);
        oldBudget.setSpentAmount(recalculatedSpent);

        budgetRepository.save(oldBudget);

        return String.format(
            "Budget Updated Successfully. " +
            "Amount: %.2f | Already Spent: %.2f | Remaining: %.2f",
            oldBudget.getBudgetAmount(),
            oldBudget.getSpentAmount(),
            oldBudget.getBudgetAmount() - oldBudget.getSpentAmount()
        );
    }

    // Delete Budget
    @Transactional
    public String deleteBudget(Integer id){
        if (!budgetRepository.existsById(id)) {
            return "Budget Not Found";
        }
        
        budgetRepository.deleteById(id);
        return "Budget Deleted Successfully";
    }

    // ✅ NEW: Get Category Budget Summary with real-time calculations
    @Transactional(readOnly = true)
    public String getCategoryBudgetSummary(Integer userId, Integer categoryId) {
        LocalDate today = LocalDate.now();
        Budget budget = budgetRepository.findByUserIdAndCategoryIdAndCurrentDate(userId, categoryId, today);
        
        if (budget == null) {
            return "No active budget found for this category.";
        }
        
        String categoryName = budget.getCategory() != null ? 
                             budget.getCategory().getCategoryName() : "Uncategorized";
        
        // ✅ Calculate real-time spent amount
        Double spent = getSpentAmountForBudget(budget);
        double remaining = budget.getBudgetAmount() - spent;
        double percentage = (spent / budget.getBudgetAmount()) * 100;
        
        return String.format(
            "Budget Summary for '%s':\n" +
            "Budget Amount: %.2f\n" +
            "Spent: %.2f\n" +
            "Remaining: %.2f\n" +
            "Usage: %.2f%%\n" +
            "Period: %s to %s",
            categoryName,
            budget.getBudgetAmount(),
            spent,
            remaining,
            percentage,
            budget.getStartDate(),
            budget.getEndDate()
        );
    }

    // ✅ NEW: Refresh all budgets - Recalculate spent amounts for all budgets
    @Transactional
    public String refreshAllBudgets(Integer userId) {
        List<Budget> budgets = budgetRepository.findByUserUserId(userId);
        int updatedCount = 0;
        
        for (Budget budget : budgets) {
            Double recalculatedSpent = getSpentAmountForBudget(budget);
            budget.setSpentAmount(recalculatedSpent);
            budgetRepository.save(budget);
            updatedCount++;
        }
        
        return String.format("Refreshed spent amounts for %d budgets", updatedCount);
    }
}