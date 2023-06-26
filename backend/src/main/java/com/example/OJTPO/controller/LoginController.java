package com.example.OJTPO.controller;

import java.util.List;
import java.util.concurrent.CompletableFuture;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.example.OJTPO.model.User;
import com.example.OJTPO.service.UserService;

@RestController
@CrossOrigin(origins = { "http://localhost:3000", "http://127.0.0.1:5555" })
public class LoginController {

  @Autowired
  private UserService userService;

  @PostMapping("/login")
  public CompletableFuture<ResponseEntity<User>> login(@RequestBody User loginUser) {
    return userService.validateUser(loginUser.getUsername(), loginUser.getPassword())
      .thenApply(user -> {
        if (user != null) {
          return ResponseEntity.ok(user);
        } else {
          return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
      });
  }

  @PostMapping("/createUser") // Add the createUser endpoint
  public CompletableFuture<ResponseEntity<User>> createUser(@RequestBody User user) {
    return userService.createUser(user)
      .thenApply(createdUser -> {
        if (createdUser != null) {
          return ResponseEntity.ok(createdUser);
        } else {
          return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
      });
  }

  @GetMapping("/user/{username}")
  public CompletableFuture<ResponseEntity<User>> getUserByUsername(@PathVariable String username) {
    return userService.getUserByUsername(username)
      .thenApply(user -> {
        if (user != null) {
          return ResponseEntity.ok(user);
        } else {
          return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
      });
  }
  
  @GetMapping("/users")
  public ResponseEntity<List<User>> getAllUsers() {
      CompletableFuture<List<User>> usersFuture = userService.getAllUsers();
      try {
          List<User> users = usersFuture.get();
          return ResponseEntity.ok(users);
      } catch (Exception e) {
          return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
      }
  }
}



