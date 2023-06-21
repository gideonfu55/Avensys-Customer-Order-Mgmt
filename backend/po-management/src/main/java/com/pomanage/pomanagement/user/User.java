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

  @Column(name = "username")
  private String username;

  @Column(nullable = false, name = "password")
  private String password;

  @Column(name = "clientName")
  private String clientName;

  @Column(name = "email")
  private String email;

  @Column(name = "role")
  private String role;

  @CreationTimestamp
  @Column(name ="created_at")
  private LocalDateTime createdAt;

  
}
