// BudgetController.java
package com.example.user.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.example.user.dto.BudgetResponseDTO;
import com.example.user.entity.Budget;
import com.example.user.service.BudgetService;

@RestController
@RequestMapping("/api/budget")
@CrossOrigin("*")
public class BudgetController {

    @Autowired
    private BudgetService budgetService;

    // Add Budget
    @PostMapping("/{userId}/{categoryId}")
    public String addBudget(
            @PathVariable Integer userId,
            @PathVariable Integer categoryId,
            @RequestBody Budget budget){
        return budgetService.addBudget(userId, categoryId, budget);
    }

    // Get User Budgets - UPDATED to return DTOs
    @GetMapping("/{userId}")
    public List<BudgetResponseDTO> getBudgets(
            @PathVariable Integer userId){
        return budgetService.getBudgets(userId);
    }

    // Update
    @PutMapping("/{budgetId}")
    public String updateBudget(
            @PathVariable Integer budgetId,
            @RequestBody Budget budget){
        return budgetService.updateBudget(budgetId, budget);
    }

    // Delete
    @DeleteMapping("/{budgetId}")
    public String deleteBudget(
            @PathVariable Integer budgetId){
        return budgetService.deleteBudget(budgetId);
    }
}