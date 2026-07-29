package com.example.user.controller;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.user.dto.TransactionResponseDTO;
import com.example.user.entity.Transaction;
import com.example.user.service.PdfExportService;
import com.example.user.service.TransactionService;

@RestController
@RequestMapping("/api/transaction")
@CrossOrigin("*")
public class TransactionController {

    private static final Logger logger = LoggerFactory.getLogger(TransactionController.class);

    @Autowired
    private TransactionService transactionService;

    @Autowired
    private PdfExportService pdfExportService;

    // Get All Transactions - Returns DTOs with running balance
    @GetMapping("/{userId}")
    public ResponseEntity<List<TransactionResponseDTO>> getTransactions(
            @PathVariable Integer userId) {
        
        logger.info("GET /api/transaction/{} - Fetching transactions", userId);
        
        try {
            List<TransactionResponseDTO> transactions = transactionService.getTransactions(userId);
            return ResponseEntity.ok(transactions);
        } catch (Exception e) {
            logger.error("Error fetching transactions: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // Get Recent 5 Transactions
    @GetMapping("/recent/{userId}")
    public ResponseEntity<List<TransactionResponseDTO>> getRecentTransactions(
            @PathVariable Integer userId) {
        
        logger.info("GET /api/transaction/recent/{} - Fetching recent transactions", userId);
        
        try {
            List<TransactionResponseDTO> transactions = transactionService.getRecentTransactions(userId);
            return ResponseEntity.ok(transactions);
        } catch (Exception e) {
            logger.error("Error fetching recent transactions: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // Get Current Balance
    @GetMapping("/balance/{userId}")
    public ResponseEntity<Double> getCurrentBalance(
            @PathVariable Integer userId) {
        
        logger.info("GET /api/transaction/balance/{} - Fetching current balance", userId);
        
        try {
            Double balance = transactionService.getCurrentBalance(userId);
            return ResponseEntity.ok(balance);
        } catch (Exception e) {
            logger.error("Error fetching current balance: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // Download PDF
    @GetMapping("/pdf/{userId}")
    public ResponseEntity<byte[]> downloadTransactionPdf(
            @PathVariable Integer userId) {
        
        logger.info("GET /api/transaction/pdf/{} - Generating PDF", userId);
        
        try {
            byte[] pdfBytes = pdfExportService.generateTransactionPdf(userId);
            
            return ResponseEntity.ok()
                    .header("Content-Type", "application/pdf")
                    .header("Content-Disposition", "attachment; filename=transaction_history.pdf")
                    .body(pdfBytes);
        } catch (Exception e) {
            logger.error("Error generating PDF: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // Add - Not allowed manually
    @PostMapping("/{userId}/{categoryId}")
    public ResponseEntity<String> addTransaction(
            @PathVariable Integer userId,
            @PathVariable Integer categoryId,
            @RequestBody Transaction transaction) {
        
        logger.info("POST /api/transaction/{}/{} - Manual add attempt", userId, categoryId);
        String result = transactionService.addTransaction(userId, categoryId, transaction);
        return ResponseEntity.status(HttpStatus.METHOD_NOT_ALLOWED).body(result);
    }

    // Update - Not allowed manually
    @PutMapping("/{id}")
    public ResponseEntity<String> updateTransaction(
            @PathVariable Integer id,
            @RequestBody Transaction transaction) {
        
        logger.info("PUT /api/transaction/{} - Manual update attempt", id);
        String result = transactionService.updateTransaction(id, transaction);
        return ResponseEntity.status(HttpStatus.METHOD_NOT_ALLOWED).body(result);
    }

    // Delete - Not allowed manually
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteTransaction(
            @PathVariable Integer id) {
        
        logger.info("DELETE /api/transaction/{} - Manual delete attempt", id);
        String result = transactionService.deleteTransaction(id);
        return ResponseEntity.status(HttpStatus.METHOD_NOT_ALLOWED).body(result);
    }
}