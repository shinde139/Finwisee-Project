package com.example.user.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.example.user.dto.CategoryExpenseDTO;
import com.example.user.dto.DashboardResponse;
import com.example.user.dto.MonthlyExpenseDTO;
import com.example.user.service.DashboardService;

@RestController
@RequestMapping("/api/dashboard")
@CrossOrigin("*")
public class DashboardController {

    @Autowired
    private DashboardService dashboardService;

    @GetMapping("/{userId}")
    public DashboardResponse dashboard(
            @PathVariable Integer userId){

        return dashboardService.getDashboard(userId);

    }

    @GetMapping("/category/{userId}")
    public List<CategoryExpenseDTO> category(
            @PathVariable Integer userId){

        return dashboardService.getExpenseByCategory(userId);

    }

    @GetMapping("/monthly/{userId}")
    public List<MonthlyExpenseDTO> monthly(
            @PathVariable Integer userId){

        return dashboardService.getMonthlyExpense(userId);

    }

}