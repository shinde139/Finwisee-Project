package com.example.user.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.user.entity.AISuggestion;
import com.example.user.entity.User;

public interface AISuggestionRepository
        extends JpaRepository<AISuggestion, Integer> {

    List<AISuggestion> findByUserOrderByGeneratedDateAsc(
            User user);

}