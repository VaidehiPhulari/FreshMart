package com.grocery.controller;

import com.grocery.model.CartItem;
import com.grocery.service.CartService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/cart")
public class CartController {

    @Autowired
    private CartService cartService;

    // Simple map to receive add to cart request body
    public static class AddToCartRequest {
        public Long userId;
        public Long productId;
    }

    @GetMapping("/{userId}")
    public List<CartItem> getCartItems(@PathVariable Long userId) {
        return cartService.getCartItems(userId);
    }

    @PostMapping("/add")
    public CartItem addToCart(@RequestBody AddToCartRequest request) {
        return cartService.addToCart(request.userId, request.productId);
    }

    @DeleteMapping("/remove/{cartItemId}")
    public ResponseEntity<?> removeFromCart(@PathVariable Long cartItemId) {
        cartService.removeFromCart(cartItemId);
        return ResponseEntity.ok(Map.of("message", "Item removed"));
    }

    @PostMapping("/checkout/{userId}")
    public ResponseEntity<?> checkout(@PathVariable Long userId) {
        cartService.checkout(userId);
        return ResponseEntity.ok(Map.of("message", "Payment Confirmed. Cart is empty now!"));
    }
}
