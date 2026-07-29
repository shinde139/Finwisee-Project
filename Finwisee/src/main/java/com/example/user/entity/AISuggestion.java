package com.example.user.entity;



import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name="ai_suggestions")
public class AISuggestion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer suggestionId;

    @Column(columnDefinition = "TEXT")
    private String userQuestion;

    @Column(columnDefinition = "LONGTEXT")
    private String aiResponse;

    private LocalDateTime generatedDate;

    @ManyToOne
    @JoinColumn(name="user_id")
    private User user;

    public Integer getSuggestionId() {
        return suggestionId;
    }

    public void setSuggestionId(Integer suggestionId) {
        this.suggestionId = suggestionId;
    }

    public String getUserQuestion() {
        return userQuestion;
    }

    public void setUserQuestion(String userQuestion) {
        this.userQuestion = userQuestion;
    }

    public String getAiResponse() {
        return aiResponse;
    }

    public void setAiResponse(String aiResponse) {
        this.aiResponse = aiResponse;
    }

    public LocalDateTime getGeneratedDate() {
        return generatedDate;
    }

    public void setGeneratedDate(LocalDateTime generatedDate) {
        this.generatedDate = generatedDate;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

}
