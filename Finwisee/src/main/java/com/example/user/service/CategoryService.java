package com.example.user.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.user.entity.Category;
import com.example.user.entity.User;
import com.example.user.repository.CategoryRepository;
import com.example.user.repository.UserRepository;

@Service
public class CategoryService {

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private UserRepository userRepository;

    // ===========================
    // Get Categories By User - FIXED
    // ===========================

    public List<Category> getAllCategories(Integer userId) {
        System.out.println("========================================");
        System.out.println("🔍 Fetching categories for user ID: " + userId);
        System.out.println("========================================");
        
        List<Category> categories = null;
        
        // Method 1: Try findByUserUserId
        try {
            System.out.println("🔄 Method 1: findByUserUserId(" + userId + ")");
            categories = categoryRepository.findByUserUserId(userId);
            if (categories != null && !categories.isEmpty()) {
                System.out.println("✅ Method 1 found " + categories.size() + " categories");
            } else {
                System.out.println("⚠️ Method 1 returned empty or null");
            }
        } catch (Exception e) {
            System.out.println("❌ Method 1 failed: " + e.getMessage());
        }
        
        // Method 2: Try findCategoriesByUserId with JOIN
        if (categories == null || categories.isEmpty()) {
            try {
                System.out.println("🔄 Method 2: findCategoriesByUserId(" + userId + ")");
                categories = categoryRepository.findCategoriesByUserId(userId);
                if (categories != null && !categories.isEmpty()) {
                    System.out.println("✅ Method 2 found " + categories.size() + " categories");
                } else {
                    System.out.println("⚠️ Method 2 returned empty or null");
                }
            } catch (Exception e) {
                System.out.println("❌ Method 2 failed: " + e.getMessage());
            }
        }
        
        // Method 3: Try findByUserId
        if (categories == null || categories.isEmpty()) {
            try {
                System.out.println("🔄 Method 3: findByUserId(" + userId + ")");
                categories = categoryRepository.findByUserId(userId);
                if (categories != null && !categories.isEmpty()) {
                    System.out.println("✅ Method 3 found " + categories.size() + " categories");
                } else {
                    System.out.println("⚠️ Method 3 returned empty or null");
                }
            } catch (Exception e) {
                System.out.println("❌ Method 3 failed: " + e.getMessage());
            }
        }
        
        // Method 4: Native SQL (most reliable)
        if (categories == null || categories.isEmpty()) {
            try {
                System.out.println("🔄 Method 4: findCategoriesByUserIdNative(" + userId + ")");
                categories = categoryRepository.findCategoriesByUserIdNative(userId);
                if (categories != null && !categories.isEmpty()) {
                    System.out.println("✅ Method 4 found " + categories.size() + " categories");
                } else {
                    System.out.println("⚠️ Method 4 returned empty or null");
                }
            } catch (Exception e) {
                System.out.println("❌ Method 4 failed: " + e.getMessage());
            }
        }
        
        // Last resort: Get all and filter manually
        if (categories == null || categories.isEmpty()) {
            try {
                System.out.println("🔄 Method 5: Manual filtering from all categories");
                List<Category> allCategories = categoryRepository.findAll();
                System.out.println("📊 Total categories in database: " + allCategories.size());
                
                // Check if user exists first
                User user = userRepository.findById(userId).orElse(null);
                if (user == null) {
                    System.out.println("❌ User with ID " + userId + " does not exist!");
                    return List.of();
                }
                System.out.println("✅ User found: " + user.getName());
                
                categories = allCategories.stream()
                    .filter(cat -> {
                        User catUser = cat.getUser();
                        if (catUser == null) {
                            System.out.println("⚠️ Category " + cat.getCategoryId() + " has null user");
                            return false;
                        }
                        Integer catUserId = catUser.getUserId();
                        boolean matches = catUserId != null && catUserId.equals(userId);
                        System.out.println("📂 Category " + cat.getCategoryId() + " (" + cat.getCategoryName() + 
                            ") belongs to user: " + catUserId + " | Matches: " + matches);
                        return matches;
                    })
                    .collect(java.util.stream.Collectors.toList());
                
                System.out.println("✅ Method 5 found " + categories.size() + " categories");
            } catch (Exception e) {
                System.out.println("❌ Method 5 failed: " + e.getMessage());
                e.printStackTrace();
            }
        }
        
        // Final result
        System.out.println("========================================");
        System.out.println("🏁 FINAL RESULT: Found " + (categories != null ? categories.size() : 0) + " categories for user " + userId);
        
        if (categories != null && !categories.isEmpty()) {
            System.out.println("📋 Category List:");
            for (Category cat : categories) {
                System.out.println("   📂 ID: " + cat.getCategoryId() + 
                    ", Name: " + cat.getCategoryName() + 
                    ", UserID: " + (cat.getUser() != null ? cat.getUser().getUserId() : "null"));
            }
        } else {
            System.out.println("⚠️ No categories found for user " + userId);
            System.out.println("💡 Check if user " + userId + " exists in user_master table");
            System.out.println("💡 Check if categories have user_id = " + userId + " in categories table");
            
            // Verify user exists
            User user = userRepository.findById(userId).orElse(null);
            if (user == null) {
                System.out.println("❌ User with ID " + userId + " does NOT exist in database!");
            } else {
                System.out.println("✅ User exists: " + user.getName());
            }
        }
        System.out.println("========================================");
        
        return categories != null ? categories : List.of();
    }

    // ===========================
    // Get Category By Id
    // ===========================

    public Category getCategory(Integer id) {
        System.out.println("🔍 Fetching category by ID: " + id);
        Category category = categoryRepository.findById(id).orElse(null);
        if (category != null) {
            System.out.println("✅ Found category: " + category.getCategoryName() + 
                " (User: " + (category.getUser() != null ? category.getUser().getUserId() : "null") + ")");
        } else {
            System.out.println("❌ Category not found with ID: " + id);
        }
        return category;
    }

    // ===========================
    // Add Category
    // ===========================

    public String addCategory(Integer userId, Category category) {
        System.out.println("========================================");
        System.out.println("➕ Adding category for user: " + userId);
        System.out.println("📂 Category name: " + category.getCategoryName());
        
        User user = userRepository.findById(userId).orElse(null);

        if(user == null) {
            System.out.println("❌ User not found with ID: " + userId);
            return "User Not Found";
        }

        System.out.println("✅ User found: " + user.getName() + " (ID: " + user.getUserId() + ")");
        category.setUser(user);
        Category savedCategory = categoryRepository.save(category);
        
        System.out.println("✅ Category added successfully with ID: " + savedCategory.getCategoryId());
        System.out.println("========================================");
        return "Category Added Successfully";
    }

    // ===========================
    // Update Category
    // ===========================

    public String updateCategory(Integer id, Category category) {
        System.out.println("✏️ Updating category ID: " + id);
        
        Category oldCategory = categoryRepository.findById(id).orElse(null);

        if(oldCategory == null) {
            System.out.println("❌ Category not found with ID: " + id);
            return "Category Not Found";
        }

        System.out.println("✅ Old name: " + oldCategory.getCategoryName());
        System.out.println("✅ New name: " + category.getCategoryName());
        
        oldCategory.setCategoryName(category.getCategoryName());
        categoryRepository.save(oldCategory);
        
        System.out.println("✅ Category updated successfully");
        return "Category Updated Successfully";
    }

    // ===========================
    // Delete Category
    // ===========================

    public String deleteCategory(Integer id) {
        System.out.println("🗑️ Deleting category ID: " + id);
        
        if(!categoryRepository.existsById(id)) {
            System.out.println("❌ Category not found with ID: " + id);
            return "Category Not Found";
        }

        categoryRepository.deleteById(id);
        System.out.println("✅ Category deleted successfully");
        return "Category Deleted Successfully";
    }
}