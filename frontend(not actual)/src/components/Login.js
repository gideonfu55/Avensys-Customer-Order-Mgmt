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
      setError('Please enter your Username and Password');
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
        navigate('/welcome');
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
    <div className="login-page">
      <Container>
        <Row className="justify-content-center align-items-center" style={{ height: '100vh' }}>
          <Col md={4}>
            <Card className="my-5 mx-auto" style={{ borderRadius: '1rem' }}>
              <Card.Body className="p-5 d-flex flex-column align-items-center mx-auto w-100">
                <h2 className="fw-bold mb-2 text-uppercase">Login</h2>
                <p className="mb-5">Please enter your login and password!</p>
                {error && <Alert variant="danger">{error}</Alert>}
                {successMessage && <Alert variant="success">{successMessage}</Alert>}
                <Form noValidate onSubmit={handleSubmit}>
                  <Form.Group controlId="username" className="mb-4 w-100">
                    <Form.Label>Email address</Form.Label>
                    <Form.Control
                      type="email"
                      required
                      onChange={e => setUsername(e.target.value)}
                      className="rounded-pill"
                    />
                  </Form.Group>
                  <Form.Group controlId="password" className="mb-4 w-100">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                      type="password"
                      required
                      onChange={e => setPassword(e.target.value)}
                      className="rounded-pill"
                    />
                  </Form.Group>
                  <p className="small mb-2 pb-lg-2">
                    <a href="#!">Forgot password?</a>
                  </p>
                  <div className="button-container mb-3">
                  <button type="submit" className={`rounded-pill ${username && password ? 'active' : ''}`}  >
                    Login
                  </button>
                  </div>
                  <div>
                    <p className="mb-0">
                      Don't have an account? <a href="/register">Sign Up</a>
                    </p>
                  </div>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default Login;
