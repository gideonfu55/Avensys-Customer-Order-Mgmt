import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Modal } from 'react-bootstrap';
import NavBar from './NavBar';
import { useDispatch } from 'react-redux';
import { addPost_User, socialAppStore } from './redux';
import CreateProfilePost from './CreateProfilePost';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import './Profile.css'; // Import custom CSS file
import UpdateProfilePost from './UpdateProfilePost';
import ReactPlayer from 'react-player';

function Profile() {
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState(null);
  const [imageErrors, setImageErrors] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null); // Added selectedPost state

  const dispatch = useDispatch();

  const navigate = useNavigate();

  useEffect(() => {
    const username = localStorage.getItem('username');

    axios
      .get(`http://localhost:8080/user/${username}`)
      .then(response => {
        setUser(response.data);
        localStorage.setItem('user', JSON.stringify(response.data));
      })
      .catch(error => {
        console.error(`Error fetching user data: ${error}`);
        navigate('/login');
      });

    axios
      .get(`http://localhost:8080/userposts/${username}`)
      .then(response => {
        setPosts(response.data);
      })
      .catch(error => {
        console.error(`Error fetching posts: ${error}`);
      });
  }, [navigate]);

  if (!user || !posts) {
    console.log('Loading user and posts...');
    return <p>Loading...</p>;
  }

  console.log('User:', user);
  console.log('Posts:', posts);

  function updatePost(post) {
    console.log(post);

    dispatch(addPost_User(post));
    console.log('get socialAppStore.getState()', socialAppStore.getState());
    setSelectedPost(post); // Set the selected post
    setShowModal(true);
  }

  function deletePost(post) {
    console.log(post);

    axios
      .post(`http://localhost:8080/userposts/${user.username}/delete/${post.postId}`, post)
      .then(response => {
        console.log(response.data);
        window.location.pathname = '/profile';
      })
      .catch(error => {
        console.error(`Error deleting post: ${error}`);
      });
  }

  const handleImageError = index => {
    setImageErrors(prevErrors => {
      const updatedErrors = [...prevErrors];
      updatedErrors[index] = true;
      return updatedErrors;
    });
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedPost(null); // Reset the selected post
  };

  return (
    <div>
      <NavBar />
      <Container>
        <div className="profile-container">
          <Row>
            <Col xs={12} md={4}>
              <CreateProfilePost />
            </Col>
            <Col xs={12} md={8}>
              <h3 className="profile-title">Your Posts</h3>
              <Row>
                {posts.map((post, index) => (
                  <Col key={index} xs={12} md={6} lg={4} className="mb-4">
                    <Card className="post-card">
                      <div className="post-card-header">
                        <Button onClick={() => updatePost(post)} variant="primary" size="sm">
                          <FontAwesomeIcon icon={faEdit} />
                        </Button>
                        <Button onClick={() => deletePost(post)} variant="danger" size="sm">
                          <FontAwesomeIcon icon={faTrash} />
                        </Button>
                      </div>
                      <div className="post-card-media">
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
                        <h5 className="post-card-caption">{post.caption}</h5>
                        <p className="post-card-content">{post.content}</p>
                      </Card.Body>
                    </Card>
                  </Col>
                ))}
              </Row>
            </Col>
          </Row>
        </div>
      </Container>

      <Modal show={showModal} onHide={closeModal}>
        <Modal.Header closeButton>
          <Modal.Title>Update Profile Post</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedPost && <UpdateProfilePost post={selectedPost} closeModal={closeModal} />} {/* Pass selectedPost and closeModal */}
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default Profile;
