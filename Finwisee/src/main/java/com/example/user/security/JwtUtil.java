package com.example.user.security;

import java.nio.charset.StandardCharsets;
import java.util.Date;

import javax.crypto.SecretKey;

import org.springframework.stereotype.Component;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;

@Component
public class JwtUtil {

    // ✅ FIX: must be 32+ characters for HS256
    private final String SECRET =
            "mysecretkeymysecretkeymysecretkey1234567890";

    private final SecretKey key =
            Keys.hmacShaKeyFor(SECRET.getBytes(StandardCharsets.UTF_8));

    // =========================
    // LOGIN TOKEN
    // =========================
    public String generateToken(String email) {

        return Jwts.builder()
                .setSubject(email)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60))
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();
    }

    // =========================
    // RESET TOKEN
    // =========================
    public String generateResetToken(String email) {

        return Jwts.builder()
                .setSubject(email)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + 1000 * 60 * 15))
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();
    }

    // =========================
    // EXTRACT EMAIL (FIXED SAFE)
    // =========================
    public String extractEmail(String token) {

        try {
            // remove Bearer if accidentally passed
            if (token.startsWith("Bearer ")) {
                token = token.substring(7);
            }

            return Jwts.parserBuilder()
                    .setSigningKey(key)
                    .build()
                    .parseClaimsJws(token)
                    .getBody()
                    .getSubject();

        } catch (Exception e) {
            System.out.println("JWT PARSE ERROR: " + e.getMessage());
            throw new RuntimeException("Invalid JWT Token");
        }
    }
}