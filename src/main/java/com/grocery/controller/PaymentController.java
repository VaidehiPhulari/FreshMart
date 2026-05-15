package com.grocery.controller;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/payment")
public class PaymentController {

    @PostMapping("/process")
    public Map<String, Object> processPayment(@RequestBody Map<String, Object> paymentDetails) {
        Map<String, Object> response = new HashMap<>();
        response.put("status", "success");
        response.put("message", "Payment processed successfully");
        response.put("orderId", "ORD-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
        response.put("timestamp", java.time.LocalDateTime.now().toString());
        return response;
    }
}
