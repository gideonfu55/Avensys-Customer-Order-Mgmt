package com.pomanage.pomanagement.user;

import java.util.List;

public class UserService {

  private final UserRepository userRepository;

  public UserService(UserRepository userRepository) {
    this.userRepository = userRepository;
  }

  // CRUD operations:

  // Create user - used by Admin
  public void createUser(User user) {
    userRepository.save(user);
  }

  // Authenticate user
  public User validateUser(String username, String password) {
      User user = userRepository.findByUsernameAndPassword(username, password);
      return user;
  }

  // Read list of user - used by Admin
  public List<User> getAllUsers() {
    return (List<User>) userRepository.findAll();
  }

  // Update user - used by Admin
  public void updateUser(User user) {
    userRepository.save(user);
  }

  // Delete user - used by Admin
  public void deleteUser(long id) {
    userRepository.deleteById(id);
  }

}
