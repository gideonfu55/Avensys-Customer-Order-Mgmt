package com.example.OJTPO.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.OJTPO.firebase.FirebaseService;
import com.example.OJTPO.model.User;

import java.util.concurrent.CompletableFuture;

@RestController
@CrossOrigin(origins = { "http://localhost:3000", "http://127.0.0.1:5555" })
public class POcontroller {

    @Autowired
    private FirebaseService firebaseService;

    @PostMapping("/login")
    public CompletableFuture<ResponseEntity<User>> login(@RequestBody User loginUser) {
        return firebaseService.validateUser(loginUser.getUsername(), loginUser.getPassword())
                .thenApply(user -> {
                    if (user != null) {
                        return ResponseEntity.ok(user);
                    } else {
                        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
                    }
                });
    }

    @GetMapping("/user/{username}")
    public CompletableFuture<ResponseEntity<User>> getUserByUsername(@PathVariable String username) {
        return firebaseService.getUserByUsername(username)
                .thenApply(user -> {
                    if (user != null) {
                        return ResponseEntity.ok(user);
                    } else {
                        return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
                    }
                });
    }
}
