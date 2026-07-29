package com.example.user.service;

import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.mail.SimpleMailMessage;

import org.springframework.mail.javamail.JavaMailSender;

import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    public void sendResetEmail(
            String toEmail,
            String token) {

        String resetLink =
                "http://localhost:3000/reset-password?token="
                + token;

        SimpleMailMessage message =
                new SimpleMailMessage();

        message.setTo(toEmail);

        message.setSubject(
                "Reset Password"
        );

        message.setText(
                "Click below link to reset password:\n"
                + resetLink
        );

        mailSender.send(message);
    }
}