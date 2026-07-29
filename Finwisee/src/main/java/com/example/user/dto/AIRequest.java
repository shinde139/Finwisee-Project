package com.example.user.dto;

public class AIRequest {

    private Integer userId;
    private String question;

    public AIRequest() {}

    public Integer getUserId() {
        return userId;
    }

    public void setUserId(Integer userId) {
        this.userId = userId;
    }

    public String getQuestion() {
        return question;
    }

    public void setQuestion(String question) {
        this.question = question;
    }
}