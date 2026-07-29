package com.example.user.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.example.user.entity.SavingGoal;

@Repository
public interface SavingGoalRepository extends JpaRepository<SavingGoal, Integer> {

    List<SavingGoal> findByUserUserId(Integer userId);

    @Query("""
        SELECT COALESCE(SUM(s.targetAmount),0)
        FROM SavingGoal s
        WHERE s.user.userId = :userId
    """)
    Double getTotalSaving(Integer userId);

}