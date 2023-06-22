import React, { useState } from 'react';
import axios from 'axios';
import { Container, Form, Card, Row, Col, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import './Register.css';

function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [errorMessage, setErrorMessage] = useState(null);

  const navigate = useNavigate();

  const handleSubmit = event => {
    event.preventDefault();

    if (!username || !password || !email) {
      setErrorMessage('Please fill in all the fields');
      return;
    }

    axios
      .post('http://localhost:8080/register', {
        username,
        password,
        email,
      })
      .then(response => {
        console.log(response.data);
        navigate('/login');
        localStorage.setItem('successMessage', 'Account created successfully');
      })
      .catch(error => {
        if (error.response && error.response.status === 409) {
          setErrorMessage('Username exists, please enter another username');
        } else {
          console.error(`Error: ${error}`);
          setErrorMessage('Error creating account. Please contact system administrator');
        }
      });
  };

  return (
    <div className="register-page">
      <Container>
        <Row className="justify-content-center align-items-center" style={{ height: '100vh' }}>
          <Col md={6}>
            <Card className="my-5 mx-auto p-4 shadow-sm" style={{ borderRadius: '1rem' }}>
              <Card.Body className="p-5 d-flex flex-column align-items-center mx-auto w-100">
               <h2 className="fw-bold mb-2 text-uppercase">Create account</h2>
                {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
                <Form noValidate onSubmit={handleSubmit}>
                  <Form.Group controlId="username" className="mb-4 w-100">
                    <Form.Label>Username</Form.Label>
                    <Form.Control
                      type="text"
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
                  <Form.Group controlId="email" className="mb-4 w-100">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      type="email"
                      required
                      onChange={e => setEmail(e.target.value)}
                      className="rounded-pill"
                    />
                  </Form.Group>
                  <div className="button-container mb-3">
                    <button type="submit" className={`rounded-pill ${username && password && email ? 'active' : ''}`}  >
                      Create User
                    </button>
                  </div>
                  <div>
                    <p className="mb-0">
                      Already have an account? <a href="/login">Login</a>
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

export default Register;
