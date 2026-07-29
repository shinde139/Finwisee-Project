package com.example.user.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.example.user.entity.Category;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Integer> {

    // Method 1: Using method naming convention
    List<Category> findByUserUserId(Integer userId);
    
    // Method 2: Using @Query with explicit JOIN
    @Query("SELECT c FROM Category c JOIN c.user u WHERE u.userId = :userId")
    List<Category> findCategoriesByUserId(@Param("userId") Integer userId);
    
    // Method 3: Native SQL query (most reliable)
    @Query(value = "SELECT * FROM categories WHERE user_id = :userId", nativeQuery = true)
    List<Category> findCategoriesByUserIdNative(@Param("userId") Integer userId);
    
    // Method 4: Alternative JPQL query
    @Query("SELECT c FROM Category c WHERE c.user.userId = :userId")
    List<Category> findByUserId(@Param("userId") Integer userId);
}