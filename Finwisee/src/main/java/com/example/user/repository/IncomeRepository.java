package com.example.user.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.example.user.entity.Income;

@Repository
public interface IncomeRepository extends JpaRepository<Income, Integer> {

    List<Income> findByUserUserId(Integer userId);

    @Query("""
        SELECT COALESCE(SUM(i.amount),0)
        FROM Income i
        WHERE i.user.userId = :userId
    """)
    Double getTotalIncome(Integer userId);

}