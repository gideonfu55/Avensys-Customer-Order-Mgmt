import React, { useState } from 'react';
import axios from 'axios';
import './CreateUser.css'

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
      <form onSubmit={handleSubmit} className='create-user-model'>
        <div>
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            name="username"
            value={userData.username}
            onChange={handleChange}
            placeholder='Enter Username'
            className='form-control'
          />
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={userData.password}
            onChange={handleChange}
            placeholder='Enter Password'
            className='form-control'
          />
        </div>
        <div>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={userData.email}
            onChange={handleChange}
            className='form-control'
            placeholder='Enter Email'
          />
        </div>
        <div>
          <label htmlFor="role">Role</label>
          <select
            class="form-control custom-select"
            id="role"
            name="role"
            value={userData.role}
            onChange={handleChange}>
            <option selected value=''>Select Role</option>
            <option value='Admin'>Admin</option>
            <option value='Delivery'>Delivery</option>
            <option value='Finance'>Finance</option>
            <option value='Management'>Management</option>
            <option value='Sales'>Sales</option>
          </select>
        </div>
        <button type="submit" className='btn btn-primary'>Create User</button>
      </form>
    </div>
  );
}

export default CreateUser;
