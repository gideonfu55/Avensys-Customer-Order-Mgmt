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

  const [errors, setErrors] = useState({});
  const validateForm = () => {
    const newErrors = [];
    let isValid = true;
    if (!userData.username) {
      newErrors.username = "Username is required."
      isValid = false;
    }
    if (!userData.email) {
      newErrors.email = "Email is required."
      isValid = false;
    }
    if (!userData.password) {
      newErrors.password = "Password is required."
      isValid = false;
    }
    if (!userData.role) {
      newErrors.role = "Role is required."
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  }

  const handleChange = (event) => {
    const { name, value } = event.target;
    setUserData((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const createdAt = new Date().toISOString();
    const newUser = { ...userData, createdAt };

    if (validateForm()) {
      // Send user data to the backend
      axios
        .post('http://localhost:8080/createUser', newUser)
        .then((response) => {
          console.log('User created successfully:', response.data);
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
    } else {
      console.log("User has failed to be created..");
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className='create-user-model'>
        <div className='form-group'>
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
          {errors.username && <div className="text-danger">{errors.username}</div>}
        </div>
        <div className='form-group'>
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
          {errors.password && <div className="text-danger">{errors.password}</div>}

        </div>
        <div className='form-group'>
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
          {errors.email && <div className="text-danger">{errors.email}</div>}

        </div>
        <div className='form-group'>
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
          {errors.role && <div className="text-danger">{errors.role}</div>}
        </div>
        <button type="submit" className='btn btn-dark'>Create User</button>
      </form>
    </div>
  );
}

export default CreateUser;
