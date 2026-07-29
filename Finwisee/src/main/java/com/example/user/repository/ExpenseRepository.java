package com.example.user.repository;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.example.user.dto.CategoryExpenseDTO;
import com.example.user.dto.MonthlyExpenseDTO;
import com.example.user.entity.Expense;

@Repository
public interface ExpenseRepository extends JpaRepository<Expense, Integer> {

    // ==================== BASIC QUERIES ====================
    
    List<Expense> findByUserUserId(Integer userId);

    List<Expense> findByCategoryCategoryId(Integer categoryId);
    
    List<Expense> findByUserUserIdAndExpenseDate(Integer userId, LocalDate expenseDate);
    
    List<Expense> findByUserUserIdAndExpenseDateBetween(Integer userId, LocalDate startDate, LocalDate endDate);
    
    List<Expense> findByUserUserIdAndCategoryCategoryId(Integer userId, Integer categoryId);
    
    long countByUserUserId(Integer userId);

    // ==================== AGGREGATION QUERIES ====================
    
    @Query("""
        SELECT COALESCE(SUM(e.amount),0)
        FROM Expense e
        WHERE e.user.userId = :userId
    """)
    Double getTotalExpense(@Param("userId") Integer userId);
    
    @Query("""
        SELECT COALESCE(SUM(e.amount),0)
        FROM Expense e
        WHERE e.user.userId = :userId 
        AND e.expenseDate = :date
    """)
    Double getTotalExpenseByDate(@Param("userId") Integer userId, @Param("date") LocalDate date);
    
    @Query("""
        SELECT COALESCE(SUM(e.amount),0)
        FROM Expense e
        WHERE e.user.userId = :userId 
        AND e.expenseDate BETWEEN :startDate AND :endDate
    """)
    Double getTotalExpenseByDateRange(@Param("userId") Integer userId, 
                                      @Param("startDate") LocalDate startDate, 
                                      @Param("endDate") LocalDate endDate);
    
    @Query("""
        SELECT COALESCE(SUM(e.amount),0)
        FROM Expense e
        WHERE e.user.userId = :userId 
        AND e.category.categoryId = :categoryId
    """)
    Double getTotalExpenseByCategory(@Param("userId") Integer userId, @Param("categoryId") Integer categoryId);
    
    @Query("""
        SELECT COALESCE(SUM(e.amount),0)
        FROM Expense e
        WHERE e.user.userId = :userId 
        AND e.category.categoryId = :categoryId 
        AND e.expenseDate = :date
    """)
    Double getTotalExpenseByCategoryAndDate(@Param("userId") Integer userId, 
                                            @Param("categoryId") Integer categoryId, 
                                            @Param("date") LocalDate date);

    // ==================== AVERAGE QUERIES ====================
    
    @Query("""
        SELECT COALESCE(AVG(e.amount),0)
        FROM Expense e
        WHERE e.user.userId = :userId
    """)
    Double getAverageExpense(@Param("userId") Integer userId);
    
    @Query("""
        SELECT COALESCE(AVG(e.amount),0)
        FROM Expense e
        WHERE e.user.userId = :userId 
        AND e.expenseDate BETWEEN :startDate AND :endDate
    """)
    Double getAverageExpenseByDateRange(@Param("userId") Integer userId, 
                                        @Param("startDate") LocalDate startDate, 
                                        @Param("endDate") LocalDate endDate);

    // ==================== MIN/MAX QUERIES ====================
    
    @Query("""
        SELECT COALESCE(MAX(e.amount),0)
        FROM Expense e
        WHERE e.user.userId = :userId
    """)
    Double getMaxExpense(@Param("userId") Integer userId);
    
    @Query("""
        SELECT COALESCE(MIN(e.amount),0)
        FROM Expense e
        WHERE e.user.userId = :userId
    """)
    Double getMinExpense(@Param("userId") Integer userId);
    
    @Query("""
        SELECT e 
        FROM Expense e 
        WHERE e.user.userId = :userId 
        AND e.amount = (SELECT MAX(e2.amount) FROM Expense e2 WHERE e2.user.userId = :userId)
    """)
    Expense findMaxExpenseByUser(@Param("userId") Integer userId);
    
    @Query("""
        SELECT e 
        FROM Expense e 
        WHERE e.user.userId = :userId 
        AND e.amount = (SELECT MIN(e2.amount) FROM Expense e2 WHERE e2.user.userId = :userId)
    """)
    Expense findMinExpenseByUser(@Param("userId") Integer userId);

    // ==================== COUNT QUERIES ====================
    
    @Query("""
        SELECT COUNT(e) 
        FROM Expense e 
        WHERE e.user.userId = :userId 
        AND e.category.categoryId = :categoryId
    """)
    long countExpensesByCategory(@Param("userId") Integer userId, @Param("categoryId") Integer categoryId);
    
    @Query("""
        SELECT COUNT(e) 
        FROM Expense e 
        WHERE e.user.userId = :userId 
        AND e.expenseDate = :date
    """)
    long countExpensesByDate(@Param("userId") Integer userId, @Param("date") LocalDate date);

    // ==================== GROUP BY QUERIES ====================
    
    @Query("""
        SELECT new com.example.user.dto.CategoryExpenseDTO(
            c.categoryName,
            SUM(e.amount))
        FROM Expense e
        JOIN e.category c
        WHERE e.user.userId = :userId
        GROUP BY c.categoryName
        ORDER BY SUM(e.amount) DESC
    """)
    List<CategoryExpenseDTO> getExpenseByCategory(@Param("userId") Integer userId);
    
    @Query("""
        SELECT new com.example.user.dto.MonthlyExpenseDTO(
            MONTH(e.expenseDate),
            SUM(e.amount))
        FROM Expense e
        WHERE e.user.userId = :userId
        GROUP BY MONTH(e.expenseDate)
        ORDER BY MONTH(e.expenseDate)
    """)
    List<MonthlyExpenseDTO> getMonthlyExpense(@Param("userId") Integer userId);
    
    @Query("""
        SELECT e.expenseDate, SUM(e.amount) 
        FROM Expense e 
        WHERE e.user.userId = :userId 
        GROUP BY e.expenseDate 
        ORDER BY e.expenseDate DESC
    """)
    List<Object[]> getTotalExpensesGroupedByDate(@Param("userId") Integer userId);
    
    @Query("""
        SELECT e.category.categoryName, e.expenseDate, SUM(e.amount) 
        FROM Expense e 
        WHERE e.user.userId = :userId 
        GROUP BY e.category.categoryName, e.expenseDate 
        ORDER BY e.expenseDate DESC
    """)
    List<Object[]> getTotalExpensesGroupedByCategoryAndDate(@Param("userId") Integer userId);

    // ==================== YEARLY QUERIES ====================
    
    @Query("""
        SELECT e 
        FROM Expense e 
        WHERE e.user.userId = :userId 
        AND YEAR(e.expenseDate) = :year 
        ORDER BY e.expenseDate DESC
    """)
    List<Expense> findExpensesByYear(@Param("userId") Integer userId, @Param("year") Integer year);
    
    @Query("""
        SELECT COALESCE(SUM(e.amount),0) 
        FROM Expense e 
        WHERE e.user.userId = :userId 
        AND YEAR(e.expenseDate) = :year
    """)
    Double getTotalExpenseByYear(@Param("userId") Integer userId, @Param("year") Integer year);
    
    @Query("""
        SELECT MONTH(e.expenseDate), SUM(e.amount), COUNT(e) 
        FROM Expense e 
        WHERE e.user.userId = :userId 
        AND YEAR(e.expenseDate) = :year 
        GROUP BY MONTH(e.expenseDate) 
        ORDER BY MONTH(e.expenseDate)
    """)
    List<Object[]> getYearlyExpenseSummaryByMonth(@Param("userId") Integer userId, @Param("year") Integer year);

    // ==================== MONTHLY QUERIES ====================
    
    @Query("""
        SELECT e 
        FROM Expense e 
        WHERE e.user.userId = :userId 
        AND YEAR(e.expenseDate) = :year 
        AND MONTH(e.expenseDate) = :month 
        ORDER BY e.expenseDate DESC
    """)
    List<Expense> findExpensesByMonth(@Param("userId") Integer userId, 
                                      @Param("year") Integer year, 
                                      @Param("month") Integer month);
    
    @Query("""
        SELECT COALESCE(SUM(e.amount),0) 
        FROM Expense e 
        WHERE e.user.userId = :userId 
        AND YEAR(e.expenseDate) = :year 
        AND MONTH(e.expenseDate) = :month
    """)
    Double getTotalExpenseByMonth(@Param("userId") Integer userId, 
                                  @Param("year") Integer year, 
                                  @Param("month") Integer month);
    
    @Query("""
        SELECT e.category.categoryName, SUM(e.amount), COUNT(e) 
        FROM Expense e 
        WHERE e.user.userId = :userId 
        AND YEAR(e.expenseDate) = :year 
        AND MONTH(e.expenseDate) = :month 
        GROUP BY e.category.categoryName 
        ORDER BY SUM(e.amount) DESC
    """)
    List<Object[]> getMonthlyExpenseSummaryByCategory(@Param("userId") Integer userId, 
                                                       @Param("year") Integer year, 
                                                       @Param("month") Integer month);

    // ==================== COMPLEX QUERIES ====================
    
    @Query("""
        SELECT e 
        FROM Expense e 
        WHERE e.user.userId = :userId 
        AND e.amount >= :amount 
        ORDER BY e.amount DESC
    """)
    List<Expense> findExpensesAboveAmount(@Param("userId") Integer userId, @Param("amount") Double amount);
    
    @Query("""
        SELECT e 
        FROM Expense e 
        WHERE e.user.userId = :userId 
        AND e.amount <= :amount 
        ORDER BY e.amount DESC
    """)
    List<Expense> findExpensesBelowAmount(@Param("userId") Integer userId, @Param("amount") Double amount);
    
    @Query("""
        SELECT e 
        FROM Expense e 
        WHERE e.user.userId = :userId 
        AND e.amount BETWEEN :minAmount AND :maxAmount 
        ORDER BY e.amount DESC
    """)
    List<Expense> findExpensesByAmountRange(@Param("userId") Integer userId, 
                                            @Param("minAmount") Double minAmount, 
                                            @Param("maxAmount") Double maxAmount);
    
    @Query("""
        SELECT e 
        FROM Expense e 
        WHERE e.user.userId = :userId 
        AND LOWER(e.description) LIKE LOWER(CONCAT('%', :keyword, '%'))
        ORDER BY e.expenseDate DESC
    """)
    List<Expense> findExpensesByDescriptionKeyword(@Param("userId") Integer userId, @Param("keyword") String keyword);
    
    @Query("""
        SELECT e 
        FROM Expense e 
        WHERE e.user.userId = :userId 
        AND e.expenseDate >= :date 
        ORDER BY e.expenseDate DESC
    """)
    List<Expense> findRecentExpenses(@Param("userId") Integer userId, @Param("date") LocalDate date);

    // ==================== TOP N QUERIES - FIXED ====================
    
    // FIXED: Removed the limit parameter and use Pageable instead
    @Query("""
        SELECT e 
        FROM Expense e 
        WHERE e.user.userId = :userId 
        ORDER BY e.expenseDate DESC
    """)
    List<Expense> findTopNByUserUserIdOrderByExpenseDateDesc(@Param("userId") Integer userId, 
                                                             org.springframework.data.domain.Pageable pageable);
    
    // Alternative: Use native query with limit
    @Query(value = """
        SELECT * FROM expenses e 
        WHERE e.user_id = :userId 
        ORDER BY e.expense_date DESC 
        LIMIT :limit
    """, nativeQuery = true)
    List<Expense> findTopNExpenses(@Param("userId") Integer userId, @Param("limit") int limit);
    
    @Query("""
        SELECT e 
        FROM Expense e 
        WHERE e.user.userId = :userId 
        ORDER BY e.amount DESC
    """)
    List<Expense> findTopNByUserUserIdOrderByAmountDesc(@Param("userId") Integer userId, 
                                                        org.springframework.data.domain.Pageable pageable);

    // ==================== TODAY'S EXPENSES DEFAULT METHODS ====================
    
    default List<Expense> findTodayExpenses(Integer userId) {
        return findByUserUserIdAndExpenseDate(userId, LocalDate.now());
    }
    
    default Double getTodayTotalExpense(Integer userId) {
        return getTotalExpenseByDate(userId, LocalDate.now());
    }
    
    default boolean hasExpensesToday(Integer userId) {
        return countExpensesByDate(userId, LocalDate.now()) > 0;
    }

    // ==================== EAGER FETCH QUERIES ====================
    
    @Query("""
        SELECT e 
        FROM Expense e 
        LEFT JOIN FETCH e.category 
        WHERE e.user.userId = :userId 
        ORDER BY e.expenseDate DESC
    """)
    List<Expense> findExpensesWithCategory(@Param("userId") Integer userId);
    
    @Query("""
        SELECT e 
        FROM Expense e 
        LEFT JOIN FETCH e.user 
        WHERE e.user.userId = :userId 
        ORDER BY e.expenseDate DESC
    """)
    List<Expense> findExpensesWithUser(@Param("userId") Integer userId);
    
    @Query("""
        SELECT e 
        FROM Expense e 
        LEFT JOIN FETCH e.user 
        LEFT JOIN FETCH e.category 
        WHERE e.user.userId = :userId 
        ORDER BY e.expenseDate DESC
    """)
    List<Expense> findExpensesWithUserAndCategory(@Param("userId") Integer userId);

    // ==================== DISTINCT QUERIES ====================
    
    @Query("""
        SELECT DISTINCT e.expenseDate 
        FROM Expense e 
        WHERE e.user.userId = :userId 
        ORDER BY e.expenseDate DESC
    """)
    List<LocalDate> findDistinctExpenseDates(@Param("userId") Integer userId);
    
    @Query("""
        SELECT DISTINCT e.category.categoryName 
        FROM Expense e 
        WHERE e.user.userId = :userId 
        AND e.category IS NOT NULL
    """)
    List<String> findDistinctCategories(@Param("userId") Integer userId);

    // ==================== DATE SPECIFIC QUERIES ====================
    
    @Query("""
        SELECT e 
        FROM Expense e 
        WHERE e.user.userId = :userId 
        AND e.expenseDate < :date 
        ORDER BY e.expenseDate DESC
    """)
    List<Expense> findExpensesBeforeDate(@Param("userId") Integer userId, @Param("date") LocalDate date);
    
    @Query("""
        SELECT e 
        FROM Expense e 
        WHERE e.user.userId = :userId 
        AND e.expenseDate > :date 
        ORDER BY e.expenseDate DESC
    """)
    List<Expense> findExpensesAfterDate(@Param("userId") Integer userId, @Param("date") LocalDate date);
    
    @Query("""
        SELECT e 
        FROM Expense e 
        WHERE e.user.userId = :userId 
        AND e.expenseDate <= :date 
        ORDER BY e.expenseDate DESC
    """)
    List<Expense> findExpensesOnOrBeforeDate(@Param("userId") Integer userId, @Param("date") LocalDate date);
    
    @Query("""
        SELECT e 
        FROM Expense e 
        WHERE e.user.userId = :userId 
        AND e.expenseDate >= :date 
        ORDER BY e.expenseDate DESC
    """)
    List<Expense> findExpensesOnOrAfterDate(@Param("userId") Integer userId, @Param("date") LocalDate date);

    // ==================== CATEGORY ANALYSIS QUERIES ====================
    
    @Query("""
        SELECT e.category.categoryName, SUM(e.amount) 
        FROM Expense e 
        WHERE e.user.userId = :userId 
        GROUP BY e.category.categoryName 
        ORDER BY SUM(e.amount) DESC
    """)
    List<Object[]> getTopCategoriesByAmount(@Param("userId") Integer userId);
    
    @Query("""
        SELECT e.category.categoryName, COUNT(e) 
        FROM Expense e 
        WHERE e.user.userId = :userId 
        GROUP BY e.category.categoryName 
        ORDER BY COUNT(e) DESC
    """)
    List<Object[]> getTopCategoriesByCount(@Param("userId") Integer userId);

    // ==================== DAILY EXPENSE QUERIES ====================
    
    @Query("""
        SELECT e.expenseDate, SUM(e.amount) 
        FROM Expense e 
        WHERE e.user.userId = :userId 
        AND e.expenseDate >= :startDate 
        GROUP BY e.expenseDate 
        ORDER BY e.expenseDate DESC
    """)
    List<Object[]> getDailyExpenses(@Param("userId") Integer userId, @Param("startDate") LocalDate startDate);
    
    @Query("""
        SELECT e.expenseDate, SUM(e.amount), COUNT(e) 
        FROM Expense e 
        WHERE e.user.userId = :userId 
        AND e.expenseDate BETWEEN :startDate AND :endDate 
        GROUP BY e.expenseDate 
        ORDER BY e.expenseDate DESC
    """)
    List<Object[]> getDailyExpensesWithCount(@Param("userId") Integer userId, 
                                             @Param("startDate") LocalDate startDate, 
                                             @Param("endDate") LocalDate endDate);

    // ==================== COMPARISON QUERIES ====================
    
    @Query("""
        SELECT COALESCE(SUM(e.amount),0) 
        FROM Expense e 
        WHERE e.user.userId = :userId 
        AND YEAR(e.expenseDate) = :year 
        AND MONTH(e.expenseDate) = :month
    """)
    Double getMonthlyExpense(@Param("userId") Integer userId, 
                             @Param("year") Integer year, 
                             @Param("month") Integer month);
    
    @Query("""
        SELECT COALESCE(SUM(e.amount),0) 
        FROM Expense e 
        WHERE e.user.userId = :userId 
        AND e.expenseDate BETWEEN :startDate AND :endDate
    """)
    Double getWeeklyExpense(@Param("userId") Integer userId, 
                            @Param("startDate") LocalDate startDate, 
                            @Param("endDate") LocalDate endDate);
    
    
    
    @Query("SELECT SUM(e.amount) FROM Expense e WHERE e.user.userId = :userId " +
            "AND e.category.categoryId = :categoryId " +
            "AND e.expenseDate BETWEEN :startDate AND :endDate")
     Double getTotalExpenseByCategoryAndDateRange(
         @Param("userId") Integer userId,
         @Param("categoryId") Integer categoryId,
         @Param("startDate") LocalDate startDate,
         @Param("endDate") LocalDate endDate
     );
}