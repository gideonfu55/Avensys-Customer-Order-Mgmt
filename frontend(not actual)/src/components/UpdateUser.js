import React, { useState } from 'react';
import axios from 'axios';
import './UpdateUser.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

function UpdateUser({ user, closeModal }) {
  const [formData, setFormData] = useState(user);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  const handleUpdateUserSubmit = (event) => {
    event.preventDefault();
    setIsLoading(true);
    const updatedUser = { ...user, ...formData };
    const { username } = updatedUser;
    axios.patch(`http://localhost:8080/user/update/${username}`, updatedUser)
      .then((response) => {
        console.log(response.data);
        closeModal();
        window.location.href = '/adminpanel';
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {
        setIsLoading(false);
      })
  }

  return (
    <div>
      <form onSubmit={handleUpdateUserSubmit} className='update-form'>
        <div className='form-group'>
          <label>Username</label>
          <input
            className='form-control'
            name='username'
            value={formData.username}
            onChange={handleChange}
            id='username-update'
            type='text' />
        </div>
        <div className='form-group'>
          <label>Email</label>
          <input
            className='form-control'
            name='email'
            value={formData.email}
            onChange={handleChange}
            id='email-update'
            type='text' />
        </div>
        <div className='form-group'>
          <label>Password</label>
          <input
            className='form-control'
            name='password'
            value={formData.password}
            onChange={handleChange}
            id='password-update'
            type='password' />
        </div>
        <div className='form-group'>
          <label>Role</label>
          <select
            className='form-control'
            name='role'
            onChange={handleChange}
            value={formData.role}>
            <option value=''>Select Role</option>
            <option value='Admin'>Admin</option>
            <option value='Delivery'>Delivery</option>
            <option value='Finance'>Finance</option>
            <option value='Management'>Management</option>
            <option value='Sales'>Sales</option>
          </select>
        </div>
        <button
          className='btn btn-dark'
          style={{ width: '100%' }}
          disabled={isLoading}>
          {isLoading ? (
            <FontAwesomeIcon icon={faSpinner} spin />
          ) : (
            <span>Save Changes</span>
          )}
        </button>
      </form>
    </div>
  );
}

export default UpdateUser;
