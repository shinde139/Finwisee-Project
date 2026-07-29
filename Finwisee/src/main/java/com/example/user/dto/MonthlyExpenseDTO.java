package com.example.user.dto;

public class MonthlyExpenseDTO {

    private Integer month;
    private Double total;

    public MonthlyExpenseDTO() {
    }

    public MonthlyExpenseDTO(Integer month, Double total) {
        this.month = month;
        this.total = total;
    }

    public Integer getMonth() {
        return month;
    }

    public void setMonth(Integer month) {
        this.month = month;
    }

    public Double getTotal() {
        return total;
    }

}