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

    setIsLoading(true); // Enable loading state

    const updatedUser = {
      ...user,
      ...formData,
    };

    axios
      .post('http://localhost:8080/admin/update/user', updatedUser)
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
    <>
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId='username'>
          <Form.Label>Username</Form.Label>
          <Form.Control
            type='text'
            required
            name='username'
            value={formData.username}
            onChange={handleChange}
          />
        </Form.Group>
        <Form.Group controlId='password'>
          <Form.Label>Password</Form.Label>
          <Form.Control
            type='text'
            required
            name='password'
            value={formData.password}
            onChange={handleChange}
          />
        </Form.Group>
        <Form.Group controlId='email'>
          <Form.Label>Email Address</Form.Label>
          <Form.Control
            type='text'
            required
            name='email'
            value={formData.email}
            onChange={handleChange}
          />
        </Form.Group>
        <Form.Group controlId='role' className='mb-3'>
          <Form.Label>Role</Form.Label>
          <Form.Select
            required
            name='role'
            value={formData.role}
            onChange={handleChange}
          >
            <option value=''>Select Role</option>
            <option value='Admin'>Admin</option>
            <option value='User'>User</option>
          </Form.Select>
        </Form.Group>

        <Button type='submit' variant='primary' disabled={isLoading}>
          {isLoading ? (
            <FontAwesomeIcon icon={faSpinner} spin />
          ) : (
            <FontAwesomeIcon icon={faCheck} size='2x' />
          )}
        </Button>
      </Form>
    </>
  );
}

export default UpdateUser;
