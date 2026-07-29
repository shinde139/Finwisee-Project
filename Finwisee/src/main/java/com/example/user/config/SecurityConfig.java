package com.example.user.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import org.springframework.security.config.annotation.web.builders.HttpSecurity;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import org.springframework.security.crypto.password.PasswordEncoder;

import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {

    // PASSWORD ENCODER
    @Bean
    public PasswordEncoder passwordEncoder() {

        return new BCryptPasswordEncoder();
    }

    // SECURITY CONFIG
    @Bean
    public SecurityFilterChain securityFilterChain(
            HttpSecurity http) throws Exception {

        http

            // ENABLE CORS
            .cors(cors -> {})

            // DISABLE CSRF
            .csrf(csrf -> csrf.disable())

            // AUTHORIZE
            .authorizeHttpRequests(auth -> auth

                    .anyRequest().permitAll()
            );

        return http.build();
    }
}