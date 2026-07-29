package com.example.user.service;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.user.dto.TransactionResponseDTO;
import com.example.user.entity.Expense;
import com.example.user.entity.Income;
import com.example.user.entity.Transaction;
import com.example.user.repository.ExpenseRepository;
import com.example.user.repository.IncomeRepository;
import com.example.user.repository.TransactionRepository;

@Service
public class TransactionService {

    private static final Logger logger = LoggerFactory.getLogger(TransactionService.class);

    @Autowired
    private TransactionRepository transactionRepository;

    @Autowired
    private IncomeRepository incomeRepository;

    @Autowired
    private ExpenseRepository expenseRepository;

    // Get All Transactions (Combined Income + Expense) with Running Balance
    @Transactional(readOnly = true)
    public List<TransactionResponseDTO> getTransactions(Integer userId) {
        List<Transaction> transactions = new ArrayList<>();

        logger.info("=== FETCHING TRANSACTIONS FOR USER ID: {} ===", userId);

        // Get all Income records and convert to Transactions
        List<Income> incomes = incomeRepository.findByUserUserId(userId);
        logger.info("Found {} Income records", incomes.size());
        
        for (Income income : incomes) {
            Transaction transaction = new Transaction();
            transaction.setTransactionId(income.getIncomeId());
            transaction.setTransactionType("INCOME");
            transaction.setAmount(income.getAmount());
            
            String description = income.getSource();
            if (income.getDescription() != null && !income.getDescription().isEmpty()) {
                description += " - " + income.getDescription();
            }
            transaction.setDescription(description);
            transaction.setTransactionDate(income.getIncomeDate());
            transaction.setUser(income.getUser());
            transaction.setCategory(null);
            transaction.setReferenceId(income.getIncomeId());
            transaction.setReferenceType("INCOME");
            transactions.add(transaction);
        }

        // Get all Expense records and convert to Transactions
        List<Expense> expenses = expenseRepository.findExpensesWithCategory(userId);
        logger.info("Found {} Expense records", expenses.size());
        
        for (Expense expense : expenses) {
            Transaction transaction = new Transaction();
            transaction.setTransactionId(expense.getExpenseId());
            transaction.setTransactionType("EXPENSE");
            transaction.setAmount(expense.getAmount());
            transaction.setDescription(expense.getDescription());
            transaction.setTransactionDate(expense.getExpenseDate());
            transaction.setUser(expense.getUser());
            transaction.setCategory(expense.getCategory());
            transaction.setReferenceId(expense.getExpenseId());
            transaction.setReferenceType("EXPENSE");
            transactions.add(transaction);
        }

        logger.info("Total transactions before sorting: {}", transactions.size());

        // Sort by date (oldest first for running balance calculation)
        transactions.sort((t1, t2) -> {
            if (t1.getTransactionDate() == null && t2.getTransactionDate() == null) return 0;
            if (t1.getTransactionDate() == null) return 1;
            if (t2.getTransactionDate() == null) return -1;
            return t1.getTransactionDate().compareTo(t2.getTransactionDate());
        });

        // Calculate running balance (oldest to newest)
        Double balance = 0.0;
        for (Transaction transaction : transactions) {
            if ("INCOME".equals(transaction.getTransactionType())) {
                balance += transaction.getAmount();
            } else {
                balance -= transaction.getAmount();
            }
            // Set both availableBalance and runningBalance
            transaction.setAvailableBalance(balance);
        }

        // Reverse to show newest first
        Collections.reverse(transactions);
        
        logger.info("Final transactions count: {}", transactions.size());

        // Convert to DTOs
        return transactions.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    // Get Recent 5 Transactions
    @Transactional(readOnly = true)
    public List<TransactionResponseDTO> getRecentTransactions(Integer userId) {
        List<TransactionResponseDTO> transactions = getTransactions(userId);
        return transactions.stream().limit(5).collect(Collectors.toList());
    }

    // Get Current Balance
    @Transactional(readOnly = true)
    public Double getCurrentBalance(Integer userId) {
        Double totalIncome = incomeRepository.getTotalIncome(userId);
        if (totalIncome == null) totalIncome = 0.0;
        
        Double totalExpense = expenseRepository.getTotalExpense(userId);
        if (totalExpense == null) totalExpense = 0.0;
        
        return totalIncome - totalExpense;
    }

    // Helper method to convert Transaction to DTO
    private TransactionResponseDTO convertToDTO(Transaction transaction) {
        TransactionResponseDTO dto = new TransactionResponseDTO();
        dto.setTransactionId(transaction.getTransactionId());
        dto.setTransactionType(transaction.getTransactionType());
        dto.setAmount(transaction.getAmount());
        dto.setDescription(transaction.getDescription());
        dto.setTransactionDate(transaction.getTransactionDate());
        
        // Use availableBalance as runningBalance
        dto.setRunningBalance(transaction.getAvailableBalance());
        
        if (transaction.getUser() != null) {
            dto.setUserId(transaction.getUser().getUserId());
        }
        
        if (transaction.getCategory() != null) {
            dto.setCategoryId(transaction.getCategory().getCategoryId());
            dto.setCategoryName(transaction.getCategory().getCategoryName());
        } else if ("INCOME".equals(transaction.getTransactionType())) {
            dto.setCategoryName("Income");
        }
        
        return dto;
    }

    // These methods are kept for API completeness but return appropriate messages
    public String addTransaction(Integer userId, Integer categoryId, Transaction transaction) {
        return "Transactions cannot be added manually. Please use Income or Expense operations.";
    }

    public String updateTransaction(Integer id, Transaction transaction) {
        return "Transactions cannot be updated manually. Please update the corresponding Income or Expense.";
    }

    public String deleteTransaction(Integer id) {
        return "Transactions cannot be deleted manually. Please delete the corresponding Income or Expense.";
    }
}