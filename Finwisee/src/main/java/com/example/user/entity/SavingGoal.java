package com.example.user.entity;

import java.time.LocalDate;

import jakarta.persistence.*;

@Entity
@Table(name = "saving_goals")
public class SavingGoal {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="goal_id")
    private Integer goalId;

    private String goalName;

    private Double targetAmount;

    private Double savedAmount;

    private LocalDate targetDate;

    private String status;

    @ManyToOne
    @JoinColumn(name="user_id")
    private User user;

    public SavingGoal() {
    }

    public Integer getGoalId() {
        return goalId;
    }

    public void setGoalId(Integer goalId) {
        this.goalId = goalId;
    }

    public String getGoalName() {
        return goalName;
    }

    public void setGoalName(String goalName) {
        this.goalName = goalName;
    }

    public Double getTargetAmount() {
        return targetAmount;
    }

    public void setTargetAmount(Double targetAmount) {
        this.targetAmount = targetAmount;
    }

    public Double getSavedAmount() {
        return savedAmount;
    }

    public void setSavedAmount(Double savedAmount) {
        this.savedAmount = savedAmount;
    }

    public LocalDate getTargetDate() {
        return targetDate;
    }

    public void setTargetDate(LocalDate targetDate) {
        this.targetDate = targetDate;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

}