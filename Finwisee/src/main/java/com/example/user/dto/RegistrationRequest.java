package com.example.user.dto;

import org.springframework.web.multipart.MultipartFile;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

public class RegistrationRequest {
    
    @NotBlank(message = "Name is required")
    private String name;
    
    @NotBlank(message = "Email is required")
    @jakarta.validation.constraints.Email(message = "Invalid email format")
    private String email;
    
    @NotBlank(message = "Password is required")
    @Pattern(
        regexp = "^[0-9]{8}$",
        message = "Password must be exactly 8 digits (numbers only)"
    )
    private String password;
    
    private MultipartFile profileImage;

    public RegistrationRequest() {}

    public RegistrationRequest(String name, String email, String password, MultipartFile profileImage) {
        this.name = name;
        this.email = email;
        this.password = password;
        this.profileImage = profileImage;
    }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public MultipartFile getProfileImage() { return profileImage; }
    public void setProfileImage(MultipartFile profileImage) { this.profileImage = profileImage; }
}