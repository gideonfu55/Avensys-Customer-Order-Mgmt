package com.example.OJTPO.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.OJTPO.firebase.FirebaseService;
import com.example.OJTPO.model.User;

import java.util.concurrent.ExecutionException;

@Service
public class UserService {

    @Autowired
    private FirebaseService firebaseService;

    public User validateUser(String username, String password) throws ExecutionException, InterruptedException {
        return firebaseService.validateUser(username, password).get();
    }

    public User getUserByUsername(String username) throws ExecutionException, InterruptedException {
        return firebaseService.getUserByUsername(username).get();
    }
}