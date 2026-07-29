package com.example.user.service;

import com.example.user.dto.ChangePasswordRequest;
import com.example.user.dto.LoginRequest;
import com.example.user.dto.LoginResponse;
import com.example.user.dto.ResetPasswordRequest;
import com.example.user.entity.User;
import com.example.user.repository.UserRepository;
import com.example.user.security.JwtUtil;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Collection;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private EmailService emailService;

    // GET ALL
    public Collection<User> retrieveAll() {
        return userRepository.findAll();
    }

    // GET BY ID
    public User retrieveById(Integer userId) {
        return userRepository.findById(userId).orElse(null);
    }

    // UPDATE - Only updates name, preserves all other data
    public User updateUser(Integer userId, String newName) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        // Only update the name
        user.setName(newName);
        
        return userRepository.save(user);
    }

    // DELETE
    public void deleteById(Integer userId) {
        userRepository.deleteById(userId);
    }

    // REGISTER
    public String register(User user) {
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        userRepository.save(user);
        return "User Registered Successfully";
    }

    // LOGIN
    public LoginResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElse(null);

        if (user == null) {
            return new LoginResponse("User Not Found", null, null, null);
        }

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            return new LoginResponse("Invalid Password", null, null, null);
        }

        String token = jwtUtil.generateToken(user.getEmail());

        return new LoginResponse(
                token,
                user.getUserId(),
                user.getName(),
                user.getEmail()
        );
    }

    // FORGOT PASSWORD
    public String forgotPassword(String email) {
        User user = userRepository.findByEmail(email).orElse(null);

        if (user == null) {
            return "Email Not Found";
        }

        String token = jwtUtil.generateResetToken(email);
        emailService.sendResetEmail(email, token);

        return "Reset Password Link Sent";
    }

    // RESET PASSWORD
    public String resetPassword(ResetPasswordRequest request) {
        String email = jwtUtil.extractEmail(request.getToken());

        User user = userRepository.findByEmail(email)
                .orElse(null);

        if (user == null) {
            return "User Not Found";
        }

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);

        return "Password Reset Successfully";
    }

    // PROFILE (FIXED SAFE VERSION)
    public User getProfile(String token) {
        if (token == null || token.isEmpty()) {
            throw new RuntimeException("Token missing");
        }

        if (token.startsWith("Bearer ")) {
            token = token.substring(7);
        }

        try {
            String email = jwtUtil.extractEmail(token);
            System.out.println("EMAIL FROM TOKEN: " + email);

            return userRepository.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("User Not Found"));

        } catch (Exception e) {
            System.out.println("JWT ERROR: " + e.getMessage());
            throw new RuntimeException("Invalid Token");
        }
    }
    
    public String changePassword(ChangePasswordRequest request) {

        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new RuntimeException("User Not Found"));

        if (!passwordEncoder.matches(
                request.getOldPassword(),
                user.getPassword())) {

            return "Current Password is Incorrect";
        }

        user.setPassword(
                passwordEncoder.encode(request.getNewPassword()));

        userRepository.save(user);

        return "Password Changed Successfully";
    }
}