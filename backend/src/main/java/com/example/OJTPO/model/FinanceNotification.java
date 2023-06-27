package com.example.OJTPO.model;

public class FinanceNotification {
  
  private Long id;
  private String message;
  private String createdAt;

  public FinanceNotification() {
  }

  public FinanceNotification(Long id, String message, String createdAt) {
    this.id = id;
    this.message = message;
    this.createdAt = createdAt;
  }

  public Long getId() {
    return this.id;
  }

  public void setId(Long id) {
    this.id = id;
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

}
