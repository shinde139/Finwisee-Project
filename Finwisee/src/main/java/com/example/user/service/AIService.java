package com.example.user.service;

import java.time.LocalDateTime;
import java.util.*;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import com.example.user.dto.AIRequest;
import com.example.user.entity.AISuggestion;
import com.example.user.entity.Expense;
import com.example.user.entity.Income;
import com.example.user.entity.SavingGoal;
import com.example.user.entity.User;
import com.example.user.repository.AISuggestionRepository;
import com.example.user.repository.ExpenseRepository;
import com.example.user.repository.IncomeRepository;
import com.example.user.repository.SavingGoalRepository;
import com.example.user.repository.UserRepository;

@Service
public class AIService {

    @Value("${groq.api.key}")
    private String apiKey;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AISuggestionRepository aiSuggestionRepository;

    @Autowired
    private ExpenseRepository expenseRepository;

    @Autowired
    private IncomeRepository incomeRepository;

    @Autowired
    private SavingGoalRepository savingGoalRepository;

    @Autowired
    private NotificationService notificationService;
    
    @Autowired
    private NotificationGeneratorService notificationGenerator;

    private final RestTemplate restTemplate = new RestTemplate();

    // =====================================================
    // USER ASK AI QUESTION
    // =====================================================

    public String askAI(AIRequest request) {
        try {
            String url = "https://api.groq.com/openai/v1/chat/completions";

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.setBearerAuth(apiKey);

            Map<String, Object> body = new HashMap<>();
            body.put("model", "llama-3.3-70b-versatile");
            body.put("messages", List.of(
                Map.of("role", "user", "content", request.getQuestion())
            ));

            HttpEntity<Map<String, Object>> entity = 
                new HttpEntity<>(body, headers);

            ResponseEntity<Map> response = restTemplate.exchange(
                url,
                HttpMethod.POST,
                entity,
                Map.class
            );

            Map<String, Object> responseBody = response.getBody();

            if (responseBody == null) {
                return "No AI Response";
            }

            List<Map<String, Object>> choices = 
                (List<Map<String, Object>>) responseBody.get("choices");

            if (choices == null || choices.isEmpty()) {
                return "AI Response Empty";
            }

            Map<String, Object> choice = choices.get(0);
            Map<String, Object> message = (Map<String, Object>) choice.get("message");

            String aiResponse = message.get("content").toString();

            // SAVE HISTORY
            saveAIHistory(
                request.getUserId(),
                request.getQuestion(),
                aiResponse
            );

            // ===============================
            // AI NOTIFICATION
            // ===============================
            
            // Save AI suggestion as notification
            notificationGenerator.aiSuggestion(
                request.getUserId(),
                aiResponse.length() > 200 ? aiResponse.substring(0, 200) + "..." : aiResponse
            );

            return aiResponse;

        } catch (Exception e) {
            e.printStackTrace();
            return "AI Service Error: " + e.getMessage();
        }
    }

    // =====================================================
    // SAVE AI HISTORY
    // =====================================================

    private void saveAIHistory(Integer userId, String question, String response) {

        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User Not Found"));

        AISuggestion suggestion = new AISuggestion();
        suggestion.setUser(user);
        suggestion.setUserQuestion(question);
        suggestion.setAiResponse(response);
        suggestion.setGeneratedDate(LocalDateTime.now());

        aiSuggestionRepository.save(suggestion);
    }

    // =====================================================
    // AUTOMATIC FINANCIAL AI ADVICE
    // =====================================================

    public String generateFinancialAdvice(Integer userId) {
        try {
            // Get financial data
            List<Income> incomes = incomeRepository.findByUserUserId(userId);
            List<Expense> expenses = expenseRepository.findByUserUserId(userId);
            List<SavingGoal> goals = savingGoalRepository.findByUserUserId(userId);
            
            Double totalIncome = incomes.stream().mapToDouble(Income::getAmount).sum();
            Double totalExpense = expenses.stream().mapToDouble(Expense::getAmount).sum();
            Double saving = totalIncome - totalExpense;
            
            // Build prompt with user data
            StringBuilder prompt = new StringBuilder();
            prompt.append("You are FINWISE AI financial advisor.\n");
            prompt.append("User Financial Data:\n");
            prompt.append(String.format("Total Income: ₹%.2f\n", totalIncome));
            prompt.append(String.format("Total Expense: ₹%.2f\n", totalExpense));
            prompt.append(String.format("Current Saving: ₹%.2f\n", saving));
            
            if (!goals.isEmpty()) {
                prompt.append("Goals:\n");
                for (SavingGoal goal : goals) {
                    Double progress = (goal.getSavedAmount() / goal.getTargetAmount()) * 100;
                    prompt.append(String.format("- %s: %.1f%% complete (₹%.2f/₹%.2f)\n", 
                        goal.getGoalName(), progress, goal.getSavedAmount(), goal.getTargetAmount()));
                }
            }
            
            prompt.append("\nGive short personalized financial advice:");
            prompt.append("\n1. Spending analysis");
            prompt.append("\n2. Saving tips");
            prompt.append("\n3. Goal improvement suggestions");
            prompt.append("\nKeep answer simple and actionable.");

            AIRequest request = new AIRequest();
            request.setUserId(userId);
            request.setQuestion(prompt.toString());

            String advice = askAI(request);

            // Save as notification
            notificationService.saveNotification(
                userId,
                "AI Financial Suggestion",
                advice.length() > 255 ? advice.substring(0, 255) : advice,
                "AI"
            );

            return advice;

        } catch (Exception e) {
            e.printStackTrace();
            return "Unable to generate advice: " + e.getMessage();
        }
    }

    // =====================================================
    // GET AI HISTORY
    // =====================================================

    public List<AISuggestion> getHistory(Integer userId) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User Not Found"));

        return aiSuggestionRepository.findByUserOrderByGeneratedDateAsc(user);
    }
}