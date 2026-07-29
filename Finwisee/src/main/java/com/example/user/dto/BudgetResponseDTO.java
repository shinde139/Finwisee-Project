// BudgetResponseDTO.java
package com.example.user.dto;

import java.time.LocalDate;

public class BudgetResponseDTO {
    private Integer budgetId;
    private Double budgetAmount;
    private Double spentAmount;
    private Double remainingAmount;
    private LocalDate startDate;
    private LocalDate endDate;
    private Integer categoryId;
    private String categoryName;
    private Integer userId;

    public BudgetResponseDTO() {}

    public BudgetResponseDTO(Integer budgetId, Double budgetAmount, Double spentAmount,
                            LocalDate startDate, LocalDate endDate, Integer categoryId,
                            String categoryName, Integer userId) {
        this.budgetId = budgetId;
        this.budgetAmount = budgetAmount;
        this.spentAmount = spentAmount;
        this.remainingAmount = budgetAmount - (spentAmount != null ? spentAmount : 0.0);
        this.startDate = startDate;
        this.endDate = endDate;
        this.categoryId = categoryId;
        this.categoryName = categoryName;
        this.userId = userId;
    }

    // Getters and Setters
    public Integer getBudgetId() { return budgetId; }
    public void setBudgetId(Integer budgetId) { this.budgetId = budgetId; }

    public Double getBudgetAmount() { return budgetAmount; }
    public void setBudgetAmount(Double budgetAmount) { this.budgetAmount = budgetAmount; }

    public Double getSpentAmount() { return spentAmount; }
    public void setSpentAmount(Double spentAmount) { this.spentAmount = spentAmount; }

    public Double getRemainingAmount() { 
        return budgetAmount - (spentAmount != null ? spentAmount : 0.0);
    }
    public void setRemainingAmount(Double remainingAmount) { this.remainingAmount = remainingAmount; }

    public LocalDate getStartDate() { return startDate; }
    public void setStartDate(LocalDate startDate) { this.startDate = startDate; }

    public LocalDate getEndDate() { return endDate; }
    public void setEndDate(LocalDate endDate) { this.endDate = endDate; }

    public Integer getCategoryId() { return categoryId; }
    public void setCategoryId(Integer categoryId) { this.categoryId = categoryId; }

    public String getCategoryName() { return categoryName; }
    public void setCategoryName(String categoryName) { this.categoryName = categoryName; }

    public Integer getUserId() { return userId; }
    public void setUserId(Integer userId) { this.userId = userId; }
}