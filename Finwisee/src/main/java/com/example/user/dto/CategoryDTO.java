package com.example.user.dto;

public class CategoryDTO {
    private Integer categoryId;
    private String categoryName;
    private Integer userId;
    
    // Constructors
    public CategoryDTO() {}
    
    public CategoryDTO(Integer categoryId, String categoryName, Integer userId) {
        this.categoryId = categoryId;
        this.categoryName = categoryName;
        this.userId = userId;
    }
    
    // Getters and Setters
    public Integer getCategoryId() {
        return categoryId;
    }
    
    public void setCategoryId(Integer categoryId) {
        this.categoryId = categoryId;
    }
    
    public String getCategoryName() {
        return categoryName;
    }
    
    public void setCategoryName(String categoryName) {
        this.categoryName = categoryName;
    }
    
    public Integer getUserId() {
        return userId;
    }
    
    public void setUserId(Integer userId) {
        this.userId = userId;
    }
}