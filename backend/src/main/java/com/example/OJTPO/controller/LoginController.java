package com.example.OJTPO.controller;

import java.util.List;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutionException;

import com.example.OJTPO.model.Invoice;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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

    @DeleteMapping("/user/delete/{username}")
    public CompletableFuture<ResponseEntity<String>> deleteUser(@PathVariable("username") String username) {
        return userService.deleteUserByUsername(username)
                .thenApply(deletedUser -> {
                    if (deletedUser != null) {
                        return ResponseEntity.ok(deletedUser);
                    } else {
                        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found!");
                    }
                });
    }

    @PatchMapping("/user/update/{username}")
    public CompletableFuture<ResponseEntity<String>> updateUser(@PathVariable("username") String username, @RequestBody User updatedUser) {
        return userService.updateUserByUsername(username, updatedUser)
                .thenApply(isUpdated -> {
                    if (isUpdated) {
                        return ResponseEntity.ok("User with username: " + username + " has been updated.");
                    } else {
                        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found!");
                    }
                });
    }


}



