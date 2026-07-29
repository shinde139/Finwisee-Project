package com.example.user.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.user.entity.Income;
import com.example.user.service.IncomeService;

@RestController
@RequestMapping("/api/income")
@CrossOrigin("*")
public class IncomeController {

    @Autowired
    private IncomeService incomeService;

    // Add Income

    @PostMapping("/{userId}")
    public String addIncome(
            @PathVariable Integer userId,
            @RequestBody Income income){

        return incomeService.addIncome(userId, income);
    }

    // Get User Income

    @GetMapping("/{userId}")
    public List<Income> getIncome(
            @PathVariable Integer userId){

        return incomeService.getIncome(userId);
    }

    // Update Income

    @PutMapping("/{incomeId}")
    public String updateIncome(
            @PathVariable Integer incomeId,
            @RequestBody Income income){

        return incomeService.updateIncome(incomeId, income);
    }

    // Delete Income

    @DeleteMapping("/{incomeId}")
    public String deleteIncome(
            @PathVariable Integer incomeId){

        return incomeService.deleteIncome(incomeId);
    }
    
    @GetMapping("/total/{userId}")
    public ResponseEntity<Double> getTotalIncome(
            @PathVariable Integer userId) {
        
        try {
            Double totalIncome = incomeService.getTotalIncome(userId);
            if (totalIncome == null) {
                totalIncome = 0.0;
            }
            return ResponseEntity.ok(totalIncome);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

}