package com.example.user.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.example.user.dto.AIRequest;
import com.example.user.entity.AISuggestion;
import com.example.user.service.AIService;

@RestController
@RequestMapping("/api/ai")
@CrossOrigin("*")
public class AIController {

    @Autowired
    private AIService aiService;

    @PostMapping("/ask")
    public String askAI(@RequestBody AIRequest request) {

        if (request.getQuestion() == null || request.getQuestion().trim().isEmpty()) {
            return "Question cannot be empty";
        }

        if (request.getUserId() == null) {
            return "UserId is required";
        }

        return aiService.askAI(request);
    }

    @GetMapping("/history/{userId}")
    public List<AISuggestion> getHistory(@PathVariable Integer userId) {
        return aiService.getHistory(userId);
    }
}