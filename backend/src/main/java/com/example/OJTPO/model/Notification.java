package com.example.OJTPO.model;

import java.util.ArrayList;
import java.util.List;

public class Notification {

  private String id;
  private String username;
  private String userRole;
  private String message;
  private String createdAt;
  private List<String> readByUser;
  private String notificationType;

  public Notification() {
    this.readByUser = new ArrayList<>();
  }

  public Notification(String id, String username, String userRole, String message, String createdAt) {
    this.id = id;
    this.username = username;
    this.userRole = userRole;
    this.message = message;
    this.createdAt = createdAt;
    this.readByUser = new ArrayList<>();
  }

  public String getId() {
    return this.id;
  }

  public void setId(String id) {
    this.id = id;
  }

  public String getUsername() {
    return this.username;
  }

  public void setUsername(String username) {
    this.username = username;
  }

  public String getUserRole() {
    return this.userRole;
  }

  public void setUserRole(String userRole) {
    this.userRole = userRole;
  }

  public String getMessage() {
    return this.message;
  }

  public void setMessage(String message) {
    this.message = message;
  }

  public String getCreatedAt() {
    return this.createdAt;
  }

  public void setCreatedAt(String createdAt) {
    this.createdAt = createdAt;
  }

  public List<String> getReadByUser() {
    return this.readByUser;
  }

  public void setReadByUser(List<String> readByUser) {
    this.readByUser = readByUser;
  }

  public String getNotificationType() {
    return notificationType;
  }

  public void setNotificationType(String notificationType) {
    this.notificationType = notificationType;
  }

}
