package com.example.user.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.user.entity.Income;
import com.example.user.entity.User;
import com.example.user.repository.IncomeRepository;
import com.example.user.repository.UserRepository;

@Service
public class IncomeService {

    @Autowired
    private IncomeRepository incomeRepository;

    @Autowired
    private UserRepository userRepository;

    // 🔔 Notification Services
    @Autowired
    private IncomeNotificationService incomeNotificationService;

    // Add Income
    public String addIncome(Integer userId, Income income){

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User Not Found"));

        income.setUser(user);

        Income savedIncome = incomeRepository.save(income);

        // ===============================
        // 🔔 SEND INCOME NOTIFICATION
        // ===============================
        
        String source = savedIncome.getSource() != null ? 
                        savedIncome.getSource() : "Unknown Source";
        
        incomeNotificationService.notifyIncomeAdded(
            userId, 
            savedIncome.getAmount(), 
            source
        );

        return "Income Added Successfully";
    }

    // Get User Income
    public List<Income> getIncome(Integer userId){
        return incomeRepository.findByUserUserId(userId);
    }

    // Update Income
    public String updateIncome(Integer incomeId, Income income){

        Income oldIncome = incomeRepository.findById(incomeId).orElse(null);

        if(oldIncome == null){
            return "Income Not Found";
        }

        oldIncome.setAmount(income.getAmount());
        oldIncome.setSource(income.getSource());
        oldIncome.setDescription(income.getDescription());
        oldIncome.setIncomeDate(income.getIncomeDate());

        incomeRepository.save(oldIncome);

        return "Income Updated Successfully";
    }

    // Delete Income
    public String deleteIncome(Integer incomeId){
        incomeRepository.deleteById(incomeId);
        return "Income Deleted Successfully";
    }
    
 // In IncomeService.java
    public Double getTotalIncome(Integer userId) {
        Double total = incomeRepository.getTotalIncome(userId);
        return total != null ? total : 0.0;
    }
}