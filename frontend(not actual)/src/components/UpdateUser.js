import React, { useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faSpinner } from '@fortawesome/free-solid-svg-icons';

function UpdateUser({ user, closeModal }) {
  const [formData, setFormData] = useState(user);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
    
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log(formData)
    setIsLoading(true); // Enable loading state

    const updatedUser = {
      ...user,
      ...formData,
    };

    axios
      .patch(`http://localhost:8080/api/user/update/${formData.id}`, updatedUser)
      .then((response) => {
        console.log(response.data);
        closeModal();
        window.location.href = '/adminpanel'; // Navigate to /adminpanel
      })
      .catch((error) => {
        console.error(`Error updating user: ${error}`);
      })
      .finally(() => {
        setIsLoading(false); // Disable loading state
      });
  };

  return (
    <div className='update-user-modal'>
      <div className='update-user-details'>

      </div>
      <form onSubmit={handleSubmit}>
        <div className='form-group'>
          <label>Username</label>
          <input 
          type='text' 
          name='username'
          className='form-control'
          value={formData.username}
          onChange={handleChange} />
        </div>
        <div className='form-group'>
          <label>Email</label>
          <input
            type='text'
            name='email'
            className='form-control'
            value={formData.email}
            onChange={handleChange} />
        </div>
        <div className='form-group'>
          <label>Password</label>
          <input 
          type='password' 
          name='password'
          className='form-control'
          value={formData.password} 
          onChange={handleChange}/>
        </div>
        <div className='form-group'>
          <label>Role</label>
          <select 
          className='form-control'
          name='role'
          onChange={handleChange}
          value={formData.role}>
            <option selected value=''>Select Role</option>
            <option value='Admin'>Admin</option>
            <option value='Delivery'>Delivery</option>
            <option value='Finance'>Finance</option>
            <option value='Sales'>Sales</option>
            <option value='Management'>Management</option>
          </select>
        </div>
        <button type='submit' className='btn btn-dark' style={{ width: '100%' }}>Save Changes</button>
      </form>
    </div>
    // <>
    //   <Form onSubmit={handleSubmit}>
    //     <Form.Group controlId='username'>
    //       <Form.Label>Username</Form.Label>
    //       <Form.Control
    //         type='text'
    //         required
    //         name='username'
    //         value={formData.username}
    //         onChange={handleChange}
    //       />
    //     </Form.Group>
    //     <Form.Group controlId='password'>
    //       <Form.Label>Password</Form.Label>
    //       <Form.Control
    //         type='text'
    //         required
    //         name='password'
    //         value={formData.password}
    //         onChange={handleChange}
    //       />
    //     </Form.Group>
    //     <Form.Group controlId='email'>
    //       <Form.Label>Email Address</Form.Label>
    //       <Form.Control
    //         type='text'
    //         required
    //         name='email'
    //         value={formData.email}
    //         onChange={handleChange}
    //       />
    //     </Form.Group>
    //     <Form.Group controlId='role' className='mb-3'>
    //       <Form.Label>Role</Form.Label>
    //       <Form.Select
    //         required
    //         name='role'
    //         value={formData.role}
    //         onChange={handleChange}
    //       >
    //         <option value=''>Select Role</option>
    //         <option value='Admin'>Admin</option>
    //         <option value='User'>User</option>
    //       </Form.Select>
    //     </Form.Group>

    //     <Button type='submit' variant='primary' disabled={isLoading}>
    //       {isLoading ? (
    //         <FontAwesomeIcon icon={faSpinner} spin />
    //       ) : (
    //         <FontAwesomeIcon icon={faCheck} size='2x' />
    //       )}
    //     </Button>
    //   </Form>
    // </>
  );
}

export default UpdateUser;
