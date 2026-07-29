package com.example.user.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.example.user.entity.SavingGoal;
import com.example.user.service.SavingGoalService;

@RestController
@RequestMapping("/api/goals")
@CrossOrigin("*")
public class SavingGoalController {

    @Autowired
    private SavingGoalService goalService;

    // Add Goal

    @PostMapping("/{userId}")

    public String addGoal(

            @PathVariable Integer userId,

            @RequestBody SavingGoal goal){

        return goalService.addGoal(userId,goal);

    }

    // Get Goals

    @GetMapping("/{userId}")

    public List<SavingGoal> getGoals(

            @PathVariable Integer userId){

        return goalService.getGoals(userId);

    }

    // Update Goal

    @PutMapping("/{goalId}")

    public String updateGoal(

            @PathVariable Integer goalId,

            @RequestBody SavingGoal goal){

        return goalService.updateGoal(goalId,goal);

    }

    // Delete Goal

    @DeleteMapping("/{goalId}")

    public String deleteGoal(

            @PathVariable Integer goalId){

        return goalService.deleteGoal(goalId);

    }

}