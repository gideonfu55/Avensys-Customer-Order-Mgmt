package com.pomanage.pomanagement.user;

import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Long> {

  User findByUsernameAndPassword(String username, String password);
  
}
