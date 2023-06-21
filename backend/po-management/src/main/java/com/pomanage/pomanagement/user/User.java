package com.pomanage.pomanagement.user;

import java.time.LocalDateTime;

import org.hibernate.annotations.CreationTimestamp;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "user")
public class User {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private long id;

  @Column(nullable = false, name = "username")
  private String username;

  @Column(nullable = false, name = "password")
  private String password;

  @Column(unique = true, name = "email")
  private String email;

  @Column(nullable = false, name = "role")
  private String role;

  @CreationTimestamp
  @Column(name ="created_at")
  private LocalDateTime createdAt;


  public User() {
  }

  public User(long id, String username, String password, String email, String role, LocalDateTime createdAt) {
    this.id = id;
    this.username = username;
    this.password = password;
    this.email = email;
    this.role = role;
    this.createdAt = createdAt;
  }

  public long getId() {
    return this.id;
  }

  public void setId(long id) {
    this.id = id;
  }

  public String getUsername() {
    return this.username;
  }

  public void setUsername(String username) {
    this.username = username;
  }

  public String getPassword() {
    return this.password;
  }

  public void setPassword(String password) {
    this.password = password;
  }

  public String getEmail() {
    return this.email;
  }

  public void setEmail(String email) {
    this.email = email;
  }

  public String getRole() {
    return this.role;
  }

  public void setRole(String role) {
    this.role = role;
  }

  public LocalDateTime getCreatedAt() {
    return this.createdAt;
  }

  public void setCreatedAt(LocalDateTime createdAt) {
    this.createdAt = createdAt;
  }

  public User id(long id) {
    setId(id);
    return this;
  }

  public User username(String username) {
    setUsername(username);
    return this;
  }

  public User password(String password) {
    setPassword(password);
    return this;
  }

  public User email(String email) {
    setEmail(email);
    return this;
  }

  public User role(String role) {
    setRole(role);
    return this;
  }

  public User createdAt(LocalDateTime createdAt) {
    setCreatedAt(createdAt);
    return this;
  }

  @Override
  public String toString() {
    return "{" +
      " id='" + getId() + "'" +
      ", username='" + getUsername() + "'" +
      ", password='" + getPassword() + "'" +
      ", email='" + getEmail() + "'" +
      ", role='" + getRole() + "'" +
      ", createdAt='" + getCreatedAt() + "'" +
      "}";
  }
  
}
