package com.example.user.controller;

import com.example.user.dto.ChangePasswordRequest;
import com.example.user.dto.LoginRequest;
import com.example.user.dto.LoginResponse;
import com.example.user.dto.RegistrationRequest;
import com.example.user.dto.ResetPasswordRequest;
import com.example.user.dto.UpdateUserRequest;
import com.example.user.entity.User;
import com.example.user.service.UserService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.Collection;

@RestController
@RequestMapping("/user")
@CrossOrigin(origins = "http://localhost:3000")
public class UserController {

    @Autowired
    private UserService userService;

    // GET ALL USERS
    @GetMapping
    public Collection<User> retrieveAll() {
        return userService.retrieveAll();
    }

    // GET USER BY ID
    @GetMapping("/{userId}")
    public ResponseEntity<?> retrieveById(@PathVariable Integer userId) {
        User user = userService.retrieveById(userId);

        if (user == null) {
            return ResponseEntity.status(404).body("User not found");
        }

        return ResponseEntity.ok(user);
    }

    // UPDATE USER - Only updates name, preserves all other data
    @PutMapping("/{userId}")
    public ResponseEntity<?> update(
            @PathVariable Integer userId,
            @RequestBody UpdateUserRequest request) {

        try {
            // Validate
            if (request.getName() == null || request.getName().trim().isEmpty()) {
                return ResponseEntity.badRequest().body("Name cannot be empty");
            }

            // Check if user exists
            User existingUser = userService.retrieveById(userId);
            if (existingUser == null) {
                return ResponseEntity.status(404).body("User not found");
            }

            // Update only the name
            User updatedUser = userService.updateUser(userId, request.getName().trim());
            
            return ResponseEntity.ok("Updated Successfully");
            
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Update failed: " + e.getMessage());
        }
    }

    // DELETE USER
    @DeleteMapping("/{userId}")
    public ResponseEntity<?> delete(@PathVariable Integer userId) {
        userService.deleteById(userId);
        return ResponseEntity.ok("Deleted Successfully");
    }

    // REGISTER - UPDATED to use RegistrationRequest with validation
    @PostMapping("/auth/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegistrationRequest request) {
        try {
            // Convert RegistrationRequest to User entity
            User user = new User();
            user.setName(request.getName());
            user.setEmail(request.getEmail());
            user.setPassword(request.getPassword());
            
            // Handle profile image if needed
            // If you have profile image handling, add it here
            
            String result = userService.register(user);
            return ResponseEntity.ok(result);
            
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Registration failed: " + e.getMessage());
        }
    }

    // LOGIN
    @PostMapping("/auth/login")
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest request) {
        return ResponseEntity.ok(userService.login(request));
    }

    // FORGOT PASSWORD
    @PostMapping("/auth/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestParam String email) {
        return ResponseEntity.ok(userService.forgotPassword(email));
    }

    // RESET PASSWORD
    @PostMapping("/auth/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody ResetPasswordRequest request) {
        return ResponseEntity.ok(userService.resetPassword(request));
    }

    // PROFILE (FIXED)
    @GetMapping("/profile")
    public ResponseEntity<?> getProfile(
            @RequestHeader("Authorization") String token) {

        try {
            return ResponseEntity.ok(userService.getProfile(token));
        } catch (Exception e) {
            return ResponseEntity.status(401).body("Invalid Token");
        }
    }
    
    @PostMapping("/change-password")
    public ResponseEntity<?> changePassword(
            @RequestBody ChangePasswordRequest request) {

        return ResponseEntity.ok(
                userService.changePassword(request));
    }
}