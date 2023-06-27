package com.example.OJTPO.model;

public class Notification {

  private String id;
  private String username;
  private String userRole;
  private String message;
  private String createdAt;
  private boolean isRead;

  public Notification() {
  }

  public Notification(String id, String username, String userRole, String message, String createdAt, boolean isRead) {
    this.id = id;
    this.username = username;
    this.userRole = userRole;
    this.message = message;
    this.createdAt = createdAt;
    this.isRead = isRead;
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

  public boolean getIsRead() {
    return this.isRead;
  }

  public void setIsRead(boolean isRead) {
    this.isRead = isRead;
  }

}
