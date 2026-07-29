package com.example.user.dto;

import java.time.LocalDate;

public class ExpenseRequest {
    private Integer userId;
    private Integer categoryId;
    private Double amount;
    private String description;
    private LocalDate expenseDate;

    // Constructors
    public ExpenseRequest() {}

    public ExpenseRequest(Integer userId, Integer categoryId, Double amount, 
                         String description, LocalDate expenseDate) {
        this.userId = userId;
        this.categoryId = categoryId;
        this.amount = amount;
        this.description = description;
        this.expenseDate = expenseDate;
    }

    // Getters and Setters
    public Integer getUserId() { return userId; }
    public void setUserId(Integer userId) { this.userId = userId; }

    public Integer getCategoryId() { return categoryId; }
    public void setCategoryId(Integer categoryId) { this.categoryId = categoryId; }

    public Double getAmount() { return amount; }
    public void setAmount(Double amount) { this.amount = amount; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public LocalDate getExpenseDate() { return expenseDate; }
    public void setExpenseDate(LocalDate expenseDate) { this.expenseDate = expenseDate; }
}