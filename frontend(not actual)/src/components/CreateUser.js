import React, { useState } from 'react';
import axios from 'axios';

function CreateUser() {
  const [userData, setUserData] = useState({
    username: '',
    password: '',
    email: '',
    role: ''
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setUserData((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const createdAt = new Date().toISOString();
    const newUser = { ...userData, createdAt };

    // Send user data to the backend
    axios
      .post('http://localhost:8080/createUser', newUser)
      .then((response) => {
        console.log('User created successfully:', response.data);
        // Reset the form
        setUserData({
          username: '',
          password: '',
          email: '',
          role: ''
        });
      })
      .catch((error) => {
        console.error('Error creating user:', error);
      });
  };

  return (
    <div>
      <h3>Create User</h3>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            name="username"
            value={userData.username}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            name="password"
            value={userData.password}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={userData.email}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="role">Role:</label>
          <input
            type="text"
            id="role"
            name="role"
            value={userData.role}
            onChange={handleChange}
          />
        </div>
        <button type="submit">Create User</button>
      </form>
    </div>
  );
}

export default CreateUser;
