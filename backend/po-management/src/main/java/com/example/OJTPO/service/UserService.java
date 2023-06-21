package com.example.OJTPO.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.OJTPO.model.User;
import com.example.OJTPO.repository.UserRepository;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    public User validateUser(String username, String password) {
        return userRepository.findByUsernameAndPassword(username, password);
    }

    public User getUserByUsername(String username) {
        return userRepository.findByUsername(username);
    }
}
