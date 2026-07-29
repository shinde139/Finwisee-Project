package com.example.user.controller;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.example.user.dto.CategoryDTO;
import com.example.user.entity.Category;
import com.example.user.service.CategoryService;

@RestController
@RequestMapping("/api/categories")
@CrossOrigin("*")
public class CategoryController {

    @Autowired
    private CategoryService categoryService;

    // ===========================
    // Get Categories By User - Returns DTO
    // ===========================

    @GetMapping("/user/{userId}")
    public List<CategoryDTO> getAllCategories(
            @PathVariable Integer userId) {

        List<Category> categories = categoryService.getAllCategories(userId);
        
        // Convert Category entities to CategoryDTOs
        return categories.stream()
            .map(category -> new CategoryDTO(
                category.getCategoryId(),
                category.getCategoryName(),
                category.getUser() != null ? category.getUser().getUserId() : null
            ))
            .collect(Collectors.toList());
    }

    // ===========================
    // Get Category By Id - Returns DTO
    // ===========================

    @GetMapping("/{id}")
    public CategoryDTO getCategory(
            @PathVariable Integer id) {

        Category category = categoryService.getCategory(id);
        
        if (category == null) {
            return null;
        }
        
        return new CategoryDTO(
            category.getCategoryId(),
            category.getCategoryName(),
            category.getUser() != null ? category.getUser().getUserId() : null
        );
    }

    // ===========================
    // Add Category
    // ===========================

    @PostMapping("/{userId}")
    public String addCategory(
            @PathVariable Integer userId,
            @RequestBody Category category) {

        return categoryService.addCategory(userId, category);
    }

    // ===========================
    // Update Category
    // ===========================

    @PutMapping("/{id}")
    public String updateCategory(
            @PathVariable Integer id,
            @RequestBody Category category) {

        return categoryService.updateCategory(id, category);
    }

    // ===========================
    // Delete Category
    // ===========================

    @DeleteMapping("/{id}")
    public String deleteCategory(
            @PathVariable Integer id) {

        return categoryService.deleteCategory(id);
    }
}