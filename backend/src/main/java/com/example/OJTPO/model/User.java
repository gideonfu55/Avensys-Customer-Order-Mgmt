package com.example.OJTPO.model;



public class User {

    private int id;
    private String username;
    private String password;
    private String email;
    private String role;
    private String createdAt;

    // Getter and Setter methods
    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public String getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(String createdAt) {
        this.createdAt = createdAt;
    }

    public void updateWith(User newUser) {
        this.username = newUser.username != null ? newUser.username : this.username;
        this.email = newUser.email != null ? newUser.email : this.email;
        this.password = newUser.password != null ? newUser.password : this.password;
        this.role = newUser.role != null ? newUser.role : this.role;
        this.createdAt = newUser.createdAt != null ? newUser.createdAt : this.createdAt;
    }
}

