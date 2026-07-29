// Expense.java - Ensure proper relationship mappings
package com.example.user.entity;

import java.time.LocalDate;

import jakarta.persistence.*;

@Entity
@Table(name = "expenses")
public class Expense {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "expense_id")
    private Integer expenseId;

    @Column(nullable = false)
    private Double amount;

    @Column(nullable = false)
    private String description;

    private LocalDate expenseDate;

    // Many Expenses -> One User
    @ManyToOne(fetch = FetchType.EAGER)  // Add EAGER fetching
    @JoinColumn(name = "user_id")
    private User user;

    // Many Expenses -> One Category
    @ManyToOne(fetch = FetchType.EAGER)  // Add EAGER fetching
    @JoinColumn(name = "category_id")
    private Category category;

    // Constructors, getters, and setters...
    public Expense() {}

    public Integer getExpenseId() { return expenseId; }
    public void setExpenseId(Integer expenseId) { this.expenseId = expenseId; }

    public Double getAmount() { return amount; }
    public void setAmount(Double amount) { this.amount = amount; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public LocalDate getExpenseDate() { return expenseDate; }
    public void setExpenseDate(LocalDate expenseDate) { this.expenseDate = expenseDate; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public Category getCategory() { return category; }
    public void setCategory(Category category) { this.category = category; }
}