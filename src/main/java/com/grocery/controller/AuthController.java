package com.grocery.controller;

import com.grocery.model.User;
import com.grocery.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class AuthController {

    @Autowired
    private UserService userService;

    public static class LoginRequest {
        public String username;
        public String password;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        User user = userService.authenticate(request.username, request.password);
        if (user != null) {
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Login successful");
            response.put("userId", user.getId());
            return ResponseEntity.ok(response);
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid credentials");
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody LoginRequest request) {
        User user = userService.register(request.username, request.password);
        if (user != null) {
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Registration successful");
            response.put("userId", user.getId());
            return ResponseEntity.ok(response);
        }
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Username already exists");
    }
}
