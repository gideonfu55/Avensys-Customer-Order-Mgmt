import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card } from 'react-bootstrap';
import NavBar from './NavBar';
import ReactPlayer from 'react-player';

// Pending issues:
// Can access Explore without logging in

function Explore() {
  const [posts, setPosts] = useState(null);
  const [imageErrors, setImageErrors] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`http://localhost:8080/admin/posts`)
      .then(response => {
        setPosts(response.data);
      })
      .catch(error => {
        console.error(`Error fetching posts: ${error}`);
      });
  }, [navigate]);

  if (!posts) {
    console.log('Loading posts...');
    return <p>Loading...</p>;
  }

  console.log('Posts:', posts);

  const handleImageError = index => {
    setImageErrors(prevErrors => {
      const updatedErrors = [...prevErrors];
      updatedErrors[index] = true;
      return updatedErrors;
    });
  };

  return (
    <div>
      <NavBar />
      <Container>
        <Row className="mt-4">
          {posts.map((post, index) => (
            <Col key={index} xs={12} md={4} lg={3} className="mb-4">
              <Card>
                <div className="card-header">
                  <Card.Text>Post by: {post.user.username}</Card.Text>
                </div>
                <div>
                  {post.mediaUrl && !imageErrors[index] ? (
                    <Card.Img
                      variant="top"
                      src={post.mediaUrl}
                      alt="Error occurred"
                      onError={() => handleImageError(index)}
                    />
                  ) : (
                    post.mediaUrl && (
                      <div className="video-player-wrapper">
                        <ReactPlayer
                          className="react-player"
                          url={post.mediaUrl}
                          controls
                          width="100%"
                          height="100%"
                        />
                      </div>
                    )
                  )}
                </div>
                <Card.Body>
                  <h5>
                    <Card.Text>{post.caption}</Card.Text>
                  </h5>
                  <p>
                    <Card.Text>{post.content}</Card.Text>
                  </p>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </div>
  );
}

export default Explore;
