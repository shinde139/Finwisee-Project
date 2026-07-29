package com.example.user.dto;

public class CategoryExpenseDTO {

    private String category;
    private Double total;

    public CategoryExpenseDTO() {
    }

    public CategoryExpenseDTO(String category, Double total) {
        this.category = category;
        this.total = total;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public Double getTotal() {
        return total;
    }

    public void setTotal(Double total) {
        this.total = total;
    }

}