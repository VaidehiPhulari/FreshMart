package com.grocery.service;

import com.grocery.model.CartItem;
import com.grocery.model.Product;
import com.grocery.model.User;
import com.grocery.repository.CartItemRepository;
import com.grocery.repository.ProductRepository;
import com.grocery.repository.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CartService {

    @Autowired
    private CartItemRepository cartItemRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProductRepository productRepository;

    public List<CartItem> getCartItems(Long userId) {
        User user = userRepository.findById(userId).orElseThrow();
        return cartItemRepository.findByUser(user);
    }

    public CartItem addToCart(Long userId, Long productId) {
        User user = userRepository.findById(userId).orElseThrow();
        Product product = productRepository.findById(productId).orElseThrow();

        Optional<CartItem> existingItemOpt = cartItemRepository.findByUserAndProduct(user, product);
        if (existingItemOpt.isPresent()) {
            CartItem existingItem = existingItemOpt.get();
            existingItem.setQuantity(existingItem.getQuantity() + 1);
            return cartItemRepository.save(existingItem);
        } else {
            CartItem newItem = new CartItem(user, product, 1);
            return cartItemRepository.save(newItem);
        }
    }

    public void removeFromCart(Long cartItemId) {
        cartItemRepository.deleteById(cartItemId);
    }

    @Transactional
    public void checkout(Long userId) {
        User user = userRepository.findById(userId).orElseThrow();
        cartItemRepository.deleteByUser(user);
    }
}
