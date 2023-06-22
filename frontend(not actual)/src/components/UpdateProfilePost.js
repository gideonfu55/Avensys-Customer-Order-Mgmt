import React, { useState } from 'react';
import { Button, Card, Container, Form, Row, Col } from 'react-bootstrap';
import axios from 'axios';

function UpdateProfilePost({ post, closeModal }) {
  const [formData, setFormData] = useState({
    postId: post.postId,
    caption: post.caption,
    content: post.content,
    mediaUrl: post.mediaUrl,
    createdAt: post.createdAt,
  });

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
  
    // Update the existing object with the form values
    const updatedPost = {
      ...post,
      ...formData,
      user: {
        ...post.user,
        username: localStorage.getItem('username'),
      },
    };
  
    axios
      .post(`http://localhost:8080/userposts/${post.user.username}/update/${formData.postId}`, updatedPost)
      .then((response) => {
        console.log(response.data);
        window.location.reload();
      })
      .catch((error) => {
        console.error(`Error fetching user data: ${error}`);
      });
  
    console.log(formData);
    closeModal();
  };
  

  return (
    <Container>
      <Row className="justify-content-center">
        <Col md={6}>
          <Card>
            <Card.Header>Update Media Post</Card.Header>
            <Card.Body>
              <Form onSubmit={handleSubmit}>
                <Form.Group controlId="content">
                <Form.Group controlId="caption">
                  <Form.Label>Caption</Form.Label>
                  <Form.Control type="text" required name="caption" value={formData.caption} onChange={handleChange} />
                </Form.Group>
                  <Form.Label>Content</Form.Label>
                  <Form.Control type="text" required name="content" value={formData.content} onChange={handleChange} />
                </Form.Group>
                <Form.Group controlId="createdAt">
                  <Form.Label>Date Created</Form.Label>
                  <Form.Control type="text" required name="createdAt" value={formData.createdAt} onChange={handleChange} disabled />
                </Form.Group>
                <Button type="submit" variant="primary">Update</Button>
                <Button variant="secondary" onClick={closeModal}>Cancel</Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default UpdateProfilePost;
