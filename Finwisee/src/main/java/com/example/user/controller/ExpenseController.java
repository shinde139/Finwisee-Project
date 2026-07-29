// ExpenseController.java - ADD THIS NEW ENDPOINT ONLY
package com.example.user.controller;

import java.time.LocalDate;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.user.dto.ExpenseResponseDTO;
import com.example.user.entity.Expense;
import com.example.user.service.ExpenseService;

@RestController
@RequestMapping("/api/expense")
public class ExpenseController {

    @Autowired
    private ExpenseService expenseService;

    // Add Expense - Today only
    @PostMapping("/{userId}/{categoryId}")
    public ResponseEntity<String> addExpense(
            @PathVariable Integer userId,
            @PathVariable Integer categoryId,
            @RequestBody Expense expense) {
        String result = expenseService.addExpense(userId, categoryId, expense);
        return ResponseEntity.ok(result);
    }

    // Get All Expenses
    @GetMapping("/{userId}")
    public ResponseEntity<List<ExpenseResponseDTO>> getExpenses(@PathVariable Integer userId) {
        List<ExpenseResponseDTO> expenses = expenseService.getExpenses(userId);
        return ResponseEntity.ok(expenses);
    }

    // Get Today's Expenses Only
    @GetMapping("/{userId}/today")
    public ResponseEntity<List<ExpenseResponseDTO>> getTodayExpenses(@PathVariable Integer userId) {
        List<ExpenseResponseDTO> expenses = expenseService.getTodayExpenses(userId);
        return ResponseEntity.ok(expenses);
    }

    // Get Today's Total Expense
    @GetMapping("/{userId}/today/total")
    public ResponseEntity<String> getTodayTotalExpense(@PathVariable Integer userId) {
        Double total = expenseService.getTodayTotalExpense(userId);
        return ResponseEntity.ok(String.format("Today's Total Expense: %.2f", total));
    }

    // Get Budget Summary
    @GetMapping("/{userId}/summary")
    public ResponseEntity<String> getBudgetSummary(@PathVariable Integer userId) {
        String summary = expenseService.getBudgetSummary(userId);
        return ResponseEntity.ok(summary);
    }

    // Get Remaining Budget
    @GetMapping("/{userId}/remaining")
    public ResponseEntity<String> getRemainingBudget(@PathVariable Integer userId) {
        String remaining = expenseService.getRemainingBudget(userId);
        return ResponseEntity.ok(remaining);
    }

    // Check if expense can be added
    @GetMapping("/{userId}/can-add")
    public ResponseEntity<String> canAddExpense(
            @PathVariable Integer userId,
            @RequestParam Double amount) {
        String result = expenseService.canAddExpense(userId, amount);
        return ResponseEntity.ok(result);
    }

    // ✅ NEW: Check if expense can be added for specific category
    @GetMapping("/{userId}/{categoryId}/can-add")
    public ResponseEntity<String> canAddExpenseToCategory(
            @PathVariable Integer userId,
            @PathVariable Integer categoryId,
            @RequestParam Double amount) {
        String result = expenseService.canAddExpenseToCategory(userId, categoryId, amount);
        return ResponseEntity.ok(result);
    }

    // Get Expenses by Date Range
    @GetMapping("/{userId}/range")
    public ResponseEntity<List<ExpenseResponseDTO>> getExpensesByDateRange(
            @PathVariable Integer userId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        List<ExpenseResponseDTO> expenses = expenseService.getExpensesByDateRange(userId, startDate, endDate);
        return ResponseEntity.ok(expenses);
    }

    // Update Expense - Only if from today
    @PutMapping("/{expenseId}")
    public ResponseEntity<String> updateExpense(
            @PathVariable Integer expenseId,
            @RequestBody Expense expense) {
        String result = expenseService.updateExpense(expenseId, expense);
        return ResponseEntity.ok(result);
    }
    
    

    // Delete Expense - Only if from today
    @DeleteMapping("/{expenseId}")
    public ResponseEntity<String> deleteExpense(@PathVariable Integer expenseId) {
        String result = expenseService.deleteExpense(expenseId);
        return ResponseEntity.ok(result);
    }
    
    
}