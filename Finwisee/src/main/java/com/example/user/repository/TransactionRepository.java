// TransactionRepository.java
package com.example.user.repository;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.example.user.entity.Transaction;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, Integer> {

    // Original methods
    List<Transaction> findByUserUserId(Integer userId);
    
    List<Transaction> findTop5ByUserUserIdOrderByTransactionDateDesc(Integer userId);

    // Additional methods for better querying
    List<Transaction> findByUserUserIdAndTransactionTypeOrderByTransactionDateDesc(Integer userId, String transactionType);
    
    List<Transaction> findByUserUserIdAndTransactionDateBetweenOrderByTransactionDateDesc(
        Integer userId, LocalDate startDate, LocalDate endDate);
    
    List<Transaction> findByUserUserIdOrderByTransactionDateDesc(Integer userId);
    
    long countByUserUserId(Integer userId);
    
    @Query("SELECT SUM(t.amount) FROM Transaction t WHERE t.user.userId = :userId AND t.transactionType = :type")
    Double sumAmountByUserAndType(@Param("userId") Integer userId, @Param("type") String type);
    
    @Query("SELECT t FROM Transaction t WHERE t.user.userId = :userId ORDER BY t.transactionDate DESC")
    List<Transaction> findRecentTransactionsByUser(@Param("userId") Integer userId);
}