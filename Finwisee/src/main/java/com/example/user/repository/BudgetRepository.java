package com.example.user.repository;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.example.user.entity.Budget;

@Repository
public interface BudgetRepository extends JpaRepository<Budget, Integer> {

    List<Budget> findByUserUserId(Integer userId);

    @Query("""
        SELECT COALESCE(SUM(b.budgetAmount),0)
        FROM Budget b
        WHERE b.user.userId = :userId
    """)
    Double getTotalBudget(Integer userId);
    
    @Query("SELECT b FROM Budget b WHERE b.user.userId = :userId " +
            "AND b.category.categoryId = :categoryId " +
            "AND :currentDate BETWEEN b.startDate AND b.endDate")
     Budget findByUserIdAndCategoryIdAndCurrentDate(
         @Param("userId") Integer userId,
         @Param("categoryId") Integer categoryId,
         @Param("currentDate") LocalDate currentDate
     );
     
     // ✅ NEW: Find all active budgets for a user
     @Query("SELECT b FROM Budget b WHERE b.user.userId = :userId " +
            "AND :currentDate BETWEEN b.startDate AND b.endDate")
     List<Budget> findActiveBudgetsByUserId(
         @Param("userId") Integer userId,
         @Param("currentDate") LocalDate currentDate
     );

}