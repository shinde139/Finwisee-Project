package com.example.user.dto;

public class DashboardResponse {

    private Double totalIncome;
    private Double totalExpense;
    private Double balance;
    private Double totalBudget;
    private Double totalSaving;

    public DashboardResponse() {
    }

    public Double getTotalIncome() {
        return totalIncome;
    }

    public void setTotalIncome(Double totalIncome) {
        this.totalIncome = totalIncome;
    }

    public Double getTotalExpense() {
        return totalExpense;
    }

    public void setTotalExpense(Double totalExpense) {
        this.totalExpense = totalExpense;
    }

    public Double getBalance() {
        return balance;
    }

    public void setBalance(Double balance) {
        this.balance = balance;
    }

    public Double getTotalBudget() {
        return totalBudget;
    }

    public void setTotalBudget(Double totalBudget) {
        this.totalBudget = totalBudget;
    }

    public Double getTotalSaving() {
        return totalSaving;
    }

    public void setTotalSaving(Double totalSaving) {
        this.totalSaving = totalSaving;
    }
}