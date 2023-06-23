import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, Container, Form, Row, Col, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import './Login.css';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const navigate = useNavigate();

  const handleSubmit = event => {
    event.preventDefault();

    if (!username || !password) {
      setError('Please enter your username and password!');
      return;
    }

    axios
      .post('http://localhost:8080/login', {
        username,
        password,
      })
      .then(response => {
        console.log(response.data);
        localStorage.setItem('username', username); // Save username
        navigate('/dashboard');
      })
      .catch(error => {
        console.error(`Error: ${error}`);
        setError('Invalid username or password');
      });
  };

  useEffect(() => {
    const successMsg = localStorage.getItem('successMessage');
    if (successMsg) {
      setSuccessMessage(successMsg);
      localStorage.removeItem('successMessage');
    }
  }, []);

  return (
    <div className="login-body">
      <div className='login-card'>
        <form className='login-form' noValidate onSubmit={handleSubmit}>
          <h2 className='text-light'>Sign In</h2>
          {/* Username */}
          <div className='form-group'>
            <input type='text' className='form-control login-input' placeholder='Username' onChange={e => setUsername(e.target.value)} />
          </div>
          {/* Password */}
          <div className='form-group'>
            <input type='password' className='form-control login-input' placeholder='Password' onChange={e => setPassword(e.target.value)} />
          </div>
          {/* Validation */}
          {error && <Alert variant="danger">{error}</Alert>}
          {successMessage && <Alert variant="success">{successMessage}</Alert>}
          {/* Button */}
          <input type='submit' className='signin-btn' value={'SIGN IN'} />
          <a href='#' className='forgot-pw'>FORGOT PASSWORD?</a>
        </form>
      </div>
      <div className='side-image'>
        <h4 style={{ fontWeight: '100', color: '#f1f1f1' }}>Avensys</h4>
        <h1 style={{ fontWeight: '900', color: '#f1f1f1' }}>PO Manager System</h1>
      </div>
    </div>
  );
}

export default Login;
