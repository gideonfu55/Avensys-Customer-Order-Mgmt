import React from 'react';
import {Container, Card, Image} from 'react-bootstrap';
import './CreateProfilePost.css'; // Import custom CSS file

function ProfileBio() {
  const username = localStorage.getItem('username');

  return (
    <Container class="mb-3">
        <Card className="post-card">
            <Image src="/header.jpeg" className="post-card-media" alt="Header missing"/>       
            <Card.Body>
            <h4 className="post-card-title">{username}</h4>
            <p className="post-card-content">9 Following</p>
            <p className="post-card-content">9 Followers</p>
            </Card.Body>
        </Card>
    </Container>
  );
}

export default ProfileBio;
