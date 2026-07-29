package com.example.user.dto;

import java.time.LocalDate;

public class TransactionResponseDTO {
    private Integer transactionId;
    private String transactionType;
    private Double amount;
    private String description;
    private LocalDate transactionDate;
    private Integer userId;
    private Integer categoryId;
    private String categoryName;
    private Double runningBalance;

    public TransactionResponseDTO() {}

    // Getters and Setters
    public Integer getTransactionId() { return transactionId; }
    public void setTransactionId(Integer transactionId) { this.transactionId = transactionId; }

    public String getTransactionType() { return transactionType; }
    public void setTransactionType(String transactionType) { this.transactionType = transactionType; }

    public Double getAmount() { return amount; }
    public void setAmount(Double amount) { this.amount = amount; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public LocalDate getTransactionDate() { return transactionDate; }
    public void setTransactionDate(LocalDate transactionDate) { this.transactionDate = transactionDate; }

    public Integer getUserId() { return userId; }
    public void setUserId(Integer userId) { this.userId = userId; }

    public Integer getCategoryId() { return categoryId; }
    public void setCategoryId(Integer categoryId) { this.categoryId = categoryId; }

    public String getCategoryName() { return categoryName; }
    public void setCategoryName(String categoryName) { this.categoryName = categoryName; }

    public Double getRunningBalance() { return runningBalance; }
    public void setRunningBalance(Double runningBalance) { this.runningBalance = runningBalance; }
}