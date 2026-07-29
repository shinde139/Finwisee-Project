// ExpenseService.java
package com.example.user.service;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.user.dto.ExpenseResponseDTO;
import com.example.user.entity.Budget;
import com.example.user.entity.Category;
import com.example.user.entity.Expense;
import com.example.user.entity.User;
import com.example.user.repository.BudgetRepository;
import com.example.user.repository.CategoryRepository;
import com.example.user.repository.ExpenseRepository;
import com.example.user.repository.IncomeRepository;
import com.example.user.repository.UserRepository;

@Service
public class ExpenseService {

    @Autowired
    private ExpenseRepository expenseRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private IncomeRepository incomeRepository;

    @Autowired
    private BudgetRepository budgetRepository;

    @Autowired
    private DailyExpenseNotificationService dailyExpenseNotificationService;
    
    @Autowired
    private NotificationGeneratorService notificationGeneratorService;

    // Add Expense - ONLY TODAY'S DATE ALLOWED
    @Transactional
    public String addExpense(
            Integer userId,
            Integer categoryId,
            Expense expense){

        // VALIDATE: Expense date MUST be today only
        LocalDate today = LocalDate.now();
        
        // If expense date is null, set it to today
        if (expense.getExpenseDate() == null) {
            expense.setExpenseDate(today);
        }
        
        // Check if date is exactly today
        if (!expense.getExpenseDate().equals(today)) {
            return String.format(
                "Your income is insufficient! You can only add expenses for TODAY (%s). " +
                "You entered: %s. Please use today's date only.",
                today, expense.getExpenseDate()
            );
        }

        // Check if user exists
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User Not Found"));
        
        // Check if category exists
        Category category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new RuntimeException("Category Not Found"));

        expense.setUser(user);
        expense.setCategory(category);

        // VALIDATE: Total expenses cannot exceed total income
        Double totalIncome = incomeRepository.getTotalIncome(userId);
        if (totalIncome == null) {
            totalIncome = 0.0;
        }
        
        Double currentTotalExpense = expenseRepository.getTotalExpense(userId);
        if (currentTotalExpense == null) {
            currentTotalExpense = 0.0;
        }
        
        double newTotalExpense = currentTotalExpense + expense.getAmount();

        // Check if expense exceeds income
        if (newTotalExpense > totalIncome) {
            return String.format(
                "Your income is insufficient! " +
                "Total Income: %.2f | Current Expenses: %.2f | " +
                "This Expense: %.2f | Total would be: %.2f | " +
                "You need additional: %.2f",
                totalIncome, currentTotalExpense, expense.getAmount(), 
                newTotalExpense, newTotalExpense - totalIncome
            );
        }

        // Check if user has any income
        if (totalIncome == 0) {
            return "Your income is insufficient! You have not added any income yet. Please add income first.";
        }

        // Check and update budget for this category
        Budget categoryBudget = budgetRepository.findByUserIdAndCategoryIdAndCurrentDate(userId, categoryId, today);
        if (categoryBudget != null) {
            // Check if adding this expense would exceed the category budget
            Double currentSpent = categoryBudget.getSpentAmount() != null ? categoryBudget.getSpentAmount() : 0.0;
            Double newSpent = currentSpent + expense.getAmount();
            
            if (newSpent > categoryBudget.getBudgetAmount()) {
                return String.format(
                    "Budget exceeded for category '%s'! " +
                    "Budget: %.2f | Already Spent: %.2f | This Expense: %.2f | " +
                    "Would exceed by: %.2f",
                    category.getCategoryName(),
                    categoryBudget.getBudgetAmount(),
                    currentSpent,
                    expense.getAmount(),
                    newSpent - categoryBudget.getBudgetAmount()
                );
            }
            
            // Update spent amount
            categoryBudget.setSpentAmount(newSpent);
            budgetRepository.save(categoryBudget);
        }

        // Save expense
        Expense savedExpense = expenseRepository.save(expense);

        // Send notification
        String categoryName = category.getCategoryName() != null ? 
                              category.getCategoryName() : "Uncategorized";
        
        dailyExpenseNotificationService.notifyDailyExpenseAdded(
            userId, 
            savedExpense.getAmount(), 
            categoryName
        );

        return String.format(
            "Expense Added Successfully for %s. Remaining budget: %.2f", 
            today, totalIncome - newTotalExpense
        );
    }

    // Get All User Expenses
    @Transactional(readOnly = true)
    public List<ExpenseResponseDTO> getExpenses(Integer userId){
        List<Expense> expenses = expenseRepository.findByUserUserId(userId);
        return expenses.stream()
                .map(expense -> {
                    ExpenseResponseDTO dto = new ExpenseResponseDTO();
                    dto.setExpenseId(expense.getExpenseId());
                    dto.setAmount(expense.getAmount());
                    dto.setDescription(expense.getDescription());
                    dto.setExpenseDate(expense.getExpenseDate());
                    
                    if (expense.getCategory() != null) {
                        dto.setCategoryId(expense.getCategory().getCategoryId());
                        dto.setCategoryName(expense.getCategory().getCategoryName());
                    } else {
                        dto.setCategoryId(null);
                        dto.setCategoryName("Uncategorized");
                    }
                    
                    if (expense.getUser() != null) {
                        dto.setUserId(expense.getUser().getUserId());
                    }
                    
                    return dto;
                })
                .collect(Collectors.toList());
    }

    // Get Today's Expenses Only
    @Transactional(readOnly = true)
    public List<ExpenseResponseDTO> getTodayExpenses(Integer userId){
        LocalDate today = LocalDate.now();
        List<Expense> expenses = expenseRepository.findByUserUserId(userId);
        
        return expenses.stream()
                .filter(expense -> expense.getExpenseDate() != null && 
                                  expense.getExpenseDate().equals(today))
                .map(expense -> {
                    ExpenseResponseDTO dto = new ExpenseResponseDTO();
                    dto.setExpenseId(expense.getExpenseId());
                    dto.setAmount(expense.getAmount());
                    dto.setDescription(expense.getDescription());
                    dto.setExpenseDate(expense.getExpenseDate());
                    
                    if (expense.getCategory() != null) {
                        dto.setCategoryId(expense.getCategory().getCategoryId());
                        dto.setCategoryName(expense.getCategory().getCategoryName());
                    } else {
                        dto.setCategoryId(null);
                        dto.setCategoryName("Uncategorized");
                    }
                    
                    if (expense.getUser() != null) {
                        dto.setUserId(expense.getUser().getUserId());
                    }
                    
                    return dto;
                })
                .collect(Collectors.toList());
    }

    // Get Today's Total Expense
    @Transactional(readOnly = true)
    public Double getTodayTotalExpense(Integer userId){
        LocalDate today = LocalDate.now();
        List<Expense> expenses = expenseRepository.findByUserUserId(userId);
        
        return expenses.stream()
                .filter(expense -> expense.getExpenseDate() != null && 
                                  expense.getExpenseDate().equals(today))
                .mapToDouble(Expense::getAmount)
                .sum();
    }

    // Update Expense - Only allow update if expense is from today
    @Transactional
    public String updateExpense(
            Integer expenseId,
            Expense expense){

        Expense oldExpense = expenseRepository.findById(expenseId).orElse(null);

        if(oldExpense == null){
            return "Your income is insufficient! Expense not found.";
        }

        LocalDate today = LocalDate.now();
        
        // Check if the existing expense is from today
        if (oldExpense.getExpenseDate() == null || !oldExpense.getExpenseDate().equals(today)) {
            return String.format(
                "Your income is insufficient! This expense is from %s. " +
                "You can only update expenses from TODAY (%s).",
                oldExpense.getExpenseDate() != null ? oldExpense.getExpenseDate() : "Unknown Date", 
                today
            );
        }

        // New date must also be today
        if (expense.getExpenseDate() != null && !expense.getExpenseDate().equals(today)) {
            return String.format(
                "Your income is insufficient! Expense date must be TODAY (%s). You entered: %s",
                today, expense.getExpenseDate()
            );
        }

        // If date is null, set to today
        if (expense.getExpenseDate() == null) {
            expense.setExpenseDate(today);
        }

        // Check budget
        Integer userId = oldExpense.getUser().getUserId();
        Double totalIncome = incomeRepository.getTotalIncome(userId);
        if (totalIncome == null) {
            totalIncome = 0.0;
        }
        
        Double currentTotalExpense = expenseRepository.getTotalExpense(userId);
        if (currentTotalExpense == null) {
            currentTotalExpense = 0.0;
        }
        
        double newTotalExpense = currentTotalExpense - oldExpense.getAmount() + expense.getAmount();

        if (newTotalExpense > totalIncome) {
            return String.format(
                "Your income is insufficient! " +
                "Total Income: %.2f | Current Expenses: %.2f | " +
                "Updated Expense: %.2f | Total would be: %.2f | " +
                "You need additional: %.2f",
                totalIncome, currentTotalExpense, expense.getAmount(), 
                newTotalExpense, newTotalExpense - totalIncome
            );
        }

        // Update budget spent amounts
        Integer oldCategoryId = oldExpense.getCategory() != null ? 
                               oldExpense.getCategory().getCategoryId() : null;
        Integer newCategoryId = expense.getCategory() != null ? 
                               expense.getCategory().getCategoryId() : null;
        
        // Revert old category budget
        if (oldCategoryId != null) {
            Budget oldBudget = budgetRepository.findByUserIdAndCategoryIdAndCurrentDate(userId, oldCategoryId, today);
            if (oldBudget != null) {
                Double currentSpent = oldBudget.getSpentAmount() != null ? oldBudget.getSpentAmount() : 0.0;
                oldBudget.setSpentAmount(Math.max(0, currentSpent - oldExpense.getAmount()));
                budgetRepository.save(oldBudget);
            }
        }
        
        // Add to new category budget
        if (newCategoryId != null) {
            Budget newBudget = budgetRepository.findByUserIdAndCategoryIdAndCurrentDate(userId, newCategoryId, today);
            if (newBudget != null) {
                Double currentSpent = newBudget.getSpentAmount() != null ? newBudget.getSpentAmount() : 0.0;
                Double newSpent = currentSpent + expense.getAmount();
                
                if (newSpent > newBudget.getBudgetAmount()) {
                    // Revert previous changes if budget is exceeded
                    if (oldCategoryId != null) {
                        Budget rollbackBudget = budgetRepository.findByUserIdAndCategoryIdAndCurrentDate(userId, oldCategoryId, today);
                        if (rollbackBudget != null) {
                            rollbackBudget.setSpentAmount(rollbackBudget.getSpentAmount() + oldExpense.getAmount());
                            budgetRepository.save(rollbackBudget);
                        }
                    }
                    
                    return String.format(
                        "Budget exceeded for category '%s'! " +
                        "Budget: %.2f | Already Spent: %.2f | This Expense: %.2f | " +
                        "Would exceed by: %.2f",
                        expense.getCategory().getCategoryName(),
                        newBudget.getBudgetAmount(),
                        currentSpent,
                        expense.getAmount(),
                        newSpent - newBudget.getBudgetAmount()
                    );
                }
                
                newBudget.setSpentAmount(newSpent);
                budgetRepository.save(newBudget);
            }
        }

        // Update expense fields
        oldExpense.setAmount(expense.getAmount());
        oldExpense.setDescription(expense.getDescription());
        oldExpense.setExpenseDate(expense.getExpenseDate());
        
        // Update category if provided
        if (expense.getCategory() != null) {
            oldExpense.setCategory(expense.getCategory());
        }

        expenseRepository.save(oldExpense);
        return String.format("Expense Updated Successfully for %s. Remaining budget: %.2f", 
                           today, totalIncome - newTotalExpense);
    }

    // Delete Expense - Only allow deletion if expense is from today
    @Transactional
    public String deleteExpense(Integer expenseId){
        Expense expense = expenseRepository.findById(expenseId).orElse(null);
        if (expense == null) {
            return "Your income is insufficient! Expense not found.";
        }
        
        LocalDate today = LocalDate.now();
        
        // Check if the expense is from today
        if (expense.getExpenseDate() == null || !expense.getExpenseDate().equals(today)) {
            return String.format(
                "Your income is insufficient! This expense is from %s. " +
                "You can only delete expenses from TODAY (%s).",
                expense.getExpenseDate() != null ? expense.getExpenseDate() : "Unknown Date", 
                today
            );
        }
        
        // Update budget spent amount
        Integer categoryId = expense.getCategory() != null ? 
                            expense.getCategory().getCategoryId() : null;
        Integer userId = expense.getUser().getUserId();
        
        if (categoryId != null) {
            Budget categoryBudget = budgetRepository.findByUserIdAndCategoryIdAndCurrentDate(userId, categoryId, today);
            if (categoryBudget != null) {
                Double currentSpent = categoryBudget.getSpentAmount() != null ? categoryBudget.getSpentAmount() : 0.0;
                categoryBudget.setSpentAmount(Math.max(0, currentSpent - expense.getAmount()));
                budgetRepository.save(categoryBudget);
            }
        }
        
        expenseRepository.deleteById(expenseId);
        
        Double totalIncome = incomeRepository.getTotalIncome(userId);
        if (totalIncome == null) {
            totalIncome = 0.0;
        }
        
        Double totalExpense = expenseRepository.getTotalExpense(userId);
        if (totalExpense == null) {
            totalExpense = 0.0;
        }
        
        return String.format("Expense Deleted Successfully. Remaining budget: %.2f", 
                           totalIncome - totalExpense);
    }

    // Get Budget Summary
    @Transactional(readOnly = true)
    public String getBudgetSummary(Integer userId) {
        Double totalIncome = incomeRepository.getTotalIncome(userId);
        if (totalIncome == null) {
            totalIncome = 0.0;
        }
        
        Double totalExpense = expenseRepository.getTotalExpense(userId);
        if (totalExpense == null) {
            totalExpense = 0.0;
        }
        
        Double todayExpense = getTodayTotalExpense(userId);
        
        if (totalIncome == 0) {
            return "Your income is insufficient! You have not added any income yet. Please add income first.";
        }
        
        // Get category budget summary
        LocalDate today = LocalDate.now();
        List<Budget> activeBudgets = budgetRepository.findActiveBudgetsByUserId(userId, today);
        StringBuilder categorySummary = new StringBuilder();
        
        if (!activeBudgets.isEmpty()) {
            categorySummary.append("\n\nCategory Budgets:");
            for (Budget budget : activeBudgets) {
                String categoryName = budget.getCategory() != null ? 
                                     budget.getCategory().getCategoryName() : "Uncategorized";
                categorySummary.append(String.format(
                    "\n  - %s: %.2f / %.2f (Remaining: %.2f)",
                    categoryName,
                    budget.getSpentAmount(),
                    budget.getBudgetAmount(),
                    budget.getBudgetAmount() - budget.getSpentAmount()
                ));
            }
        }
        
        return String.format(
            "Budget Summary for User %d:\n" +
            "Total Income: %.2f\n" +
            "Total Expenses: %.2f\n" +
            "Today's Expenses: %.2f\n" +
            "Remaining Budget: %.2f\n" +
            "Expense Percentage: %.2f%%%s",
            userId, totalIncome, totalExpense, todayExpense, 
            totalIncome - totalExpense,
            (totalExpense / totalIncome) * 100,
            categorySummary.toString()
        );
    }

    // Get Expenses by Date Range
    @Transactional(readOnly = true)
    public List<ExpenseResponseDTO> getExpensesByDateRange(
            Integer userId, 
            LocalDate startDate, 
            LocalDate endDate) {
        
        List<Expense> expenses = expenseRepository.findByUserUserId(userId);
        
        return expenses.stream()
                .filter(expense -> expense.getExpenseDate() != null &&
                                  !expense.getExpenseDate().isBefore(startDate) &&
                                  !expense.getExpenseDate().isAfter(endDate))
                .map(expense -> {
                    ExpenseResponseDTO dto = new ExpenseResponseDTO();
                    dto.setExpenseId(expense.getExpenseId());
                    dto.setAmount(expense.getAmount());
                    dto.setDescription(expense.getDescription());
                    dto.setExpenseDate(expense.getExpenseDate());
                    
                    if (expense.getCategory() != null) {
                        dto.setCategoryId(expense.getCategory().getCategoryId());
                        dto.setCategoryName(expense.getCategory().getCategoryName());
                    } else {
                        dto.setCategoryId(null);
                        dto.setCategoryName("Uncategorized");
                    }
                    
                    if (expense.getUser() != null) {
                        dto.setUserId(expense.getUser().getUserId());
                    }
                    
                    return dto;
                })
                .collect(Collectors.toList());
    }

    // Check if user can add expense
    public String canAddExpense(Integer userId, Double amount) {
        Double totalIncome = incomeRepository.getTotalIncome(userId);
        if (totalIncome == null) {
            totalIncome = 0.0;
        }
        
        if (totalIncome == 0) {
            return "Your income is insufficient! You have not added any income yet. Please add income first.";
        }
        
        Double currentTotalExpense = expenseRepository.getTotalExpense(userId);
        if (currentTotalExpense == null) {
            currentTotalExpense = 0.0;
        }
        
        double newTotal = currentTotalExpense + amount;
        
        if (newTotal > totalIncome) {
            return String.format(
                "Your income is insufficient! " +
                "Available: %.2f | Required: %.2f | Shortage: %.2f",
                totalIncome - currentTotalExpense, amount, newTotal - totalIncome
            );
        }
        
        return "You can add this expense. Remaining budget: " + (totalIncome - newTotal);
    }

    // Check if expense can be added for specific category
    public String canAddExpenseToCategory(Integer userId, Integer categoryId, Double amount) {
        LocalDate today = LocalDate.now();
        
        // Check overall income budget
        Double totalIncome = incomeRepository.getTotalIncome(userId);
        if (totalIncome == null || totalIncome == 0) {
            return "Your income is insufficient! You have not added any income yet. Please add income first.";
        }
        
        Double currentTotalExpense = expenseRepository.getTotalExpense(userId);
        if (currentTotalExpense == null) {
            currentTotalExpense = 0.0;
        }
        
        double newTotalExpense = currentTotalExpense + amount;
        if (newTotalExpense > totalIncome) {
            return String.format(
                "Insufficient overall budget! " +
                "Available: %.2f | Required: %.2f | Shortage: %.2f",
                totalIncome - currentTotalExpense, amount, newTotalExpense - totalIncome
            );
        }
        
        // Check category-specific budget
        Budget categoryBudget = budgetRepository.findByUserIdAndCategoryIdAndCurrentDate(userId, categoryId, today);
        if (categoryBudget != null) {
            Double currentSpent = categoryBudget.getSpentAmount() != null ? categoryBudget.getSpentAmount() : 0.0;
            Double newSpent = currentSpent + amount;
            
            if (newSpent > categoryBudget.getBudgetAmount()) {
                return String.format(
                    "Category budget exceeded! " +
                    "Budget: %.2f | Already Spent: %.2f | This Expense: %.2f | " +
                    "Would exceed by: %.2f",
                    categoryBudget.getBudgetAmount(),
                    currentSpent,
                    amount,
                    newSpent - categoryBudget.getBudgetAmount()
                );
            }
            
            return String.format(
                "You can add this expense. Category budget: %.2f | " +
                "Already spent: %.2f | Remaining: %.2f",
                categoryBudget.getBudgetAmount(),
                currentSpent,
                categoryBudget.getBudgetAmount() - currentSpent
            );
        }
        
        return "No category-specific budget set. You can add this expense based on overall budget.";
    }

    // Get remaining budget
    public String getRemainingBudget(Integer userId) {
        Double totalIncome = incomeRepository.getTotalIncome(userId);
        if (totalIncome == null) {
            totalIncome = 0.0;
        }
        
        if (totalIncome == 0) {
            return "Your income is insufficient! You have not added any income yet. Please add income first.";
        }
        
        Double totalExpense = expenseRepository.getTotalExpense(userId);
        if (totalExpense == null) {
            totalExpense = 0.0;
        }
        
        double remaining = totalIncome - totalExpense;
        
        if (remaining < 0) {
            return String.format(
                "Your income is insufficient! You have exceeded your income by %.2f. " +
                "Total Income: %.2f | Total Expenses: %.2f",
                Math.abs(remaining), totalIncome, totalExpense
            );
        }
        
        return String.format("Remaining Budget: %.2f (Income: %.2f - Expenses: %.2f)", 
                           remaining, totalIncome, totalExpense);
    }
}