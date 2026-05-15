package com.grocery.service;

import com.grocery.model.User;
import com.grocery.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    public User authenticate(String username, String password) {
        Optional<User> userOpt = userRepository.findByUsername(username);
        if (userOpt.isPresent() && userOpt.get().getPassword().equals(password)) {
            return userOpt.get(); // Note: Plain text passwords used for simplicity as requested
        }
        return null;
    }

    public User register(String username, String password) {
        if (userRepository.findByUsername(username).isPresent()) {
            return null; // Username already exists
        }
        User user = new User(username, password);
        return userRepository.save(user);
    }
}
