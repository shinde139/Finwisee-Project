// ExpenseResponseDTO.java
package com.example.user.dto;

import java.time.LocalDate;

public class ExpenseResponseDTO {
    private Integer expenseId;
    private Double amount;
    private String description;
    private LocalDate expenseDate;
    private Integer categoryId;
    private String categoryName;
    private Integer userId;

    public ExpenseResponseDTO() {}

    // Constructor
    public ExpenseResponseDTO(Integer expenseId, Double amount, String description, 
                             LocalDate expenseDate, Integer categoryId, 
                             String categoryName, Integer userId) {
        this.expenseId = expenseId;
        this.amount = amount;
        this.description = description;
        this.expenseDate = expenseDate;
        this.categoryId = categoryId;
        this.categoryName = categoryName;
        this.userId = userId;
    }

    // Getters and Setters
    public Integer getExpenseId() { return expenseId; }
    public void setExpenseId(Integer expenseId) { this.expenseId = expenseId; }

    public Double getAmount() { return amount; }
    public void setAmount(Double amount) { this.amount = amount; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public LocalDate getExpenseDate() { return expenseDate; }
    public void setExpenseDate(LocalDate expenseDate) { this.expenseDate = expenseDate; }

    public Integer getCategoryId() { return categoryId; }
    public void setCategoryId(Integer categoryId) { this.categoryId = categoryId; }

    public String getCategoryName() { return categoryName; }
    public void setCategoryName(String categoryName) { this.categoryName = categoryName; }

    public Integer getUserId() { return userId; }
    public void setUserId(Integer userId) { this.userId = userId; }
}