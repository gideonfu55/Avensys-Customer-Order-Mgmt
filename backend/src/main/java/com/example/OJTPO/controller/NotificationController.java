package com.example.OJTPO.controller;

import java.util.List;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutionException;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.OJTPO.model.Notification;
import com.example.OJTPO.model.User;
import com.example.OJTPO.service.NotificationService;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = { "http://localhost:3000", "http://127.0.0.1:5555" })
public class NotificationController {

  private final NotificationService notificationService;

  public NotificationController(NotificationService notificationService) {
    this.notificationService = notificationService;
  }

  @PostMapping("/notification/create")
  public ResponseEntity<String> createNotification(@RequestBody Notification notification) {
    try {
      notificationService.createNotification(notification);
      return new ResponseEntity<>("Notification created successfully", HttpStatus.OK);
    } catch (Exception e) {
      return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @PutMapping("/notification/{id}")
  public ResponseEntity<String> updateNotification(@PathVariable String id, @RequestBody Notification notification) {
    try {
      notificationService.updateNotification(id, notification);
      return new ResponseEntity<>("Notification updated successfully", HttpStatus.OK);
    } catch (Exception e) {
      return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @PutMapping("/notification/{id}/read")
  public ResponseEntity<String> markNotificationAsRead(@PathVariable String id, @RequestBody User user) {
    try {
      notificationService.markNotificationAsRead(id, user);
      return new ResponseEntity<>("Notification marked as read successfully", HttpStatus.OK);
    } catch (Exception e) {
      return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @GetMapping("/notification/{userRole}")
  public ResponseEntity<List<Notification>> getAllNotificationsByRole(@PathVariable String userRole) throws ExecutionException, InterruptedException {
    List<Notification> notifications = notificationService.getAllNotificationsByRole(userRole).get();
    return ResponseEntity.ok(notifications);
  }

  @GetMapping("/notification/all")
  public CompletableFuture<ResponseEntity<List<Notification>>> getAllNotifications() throws ExecutionException, InterruptedException {
    return notificationService.getAllNotifications()
      .thenApply(ResponseEntity::ok)
      .exceptionally(e -> ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build());
  }

  @DeleteMapping("/notification/{id}")
  public void deleteNotification(@PathVariable String id) {
    notificationService.deleteNotification(id);
  }
  
}
