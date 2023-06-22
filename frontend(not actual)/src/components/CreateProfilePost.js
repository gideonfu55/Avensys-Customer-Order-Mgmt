import { useState } from 'react';
import React from 'react';
import { Button, Container, Form, Row } from 'react-bootstrap';
import axios from 'axios';
import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage';
import { faArrowRight, faSpinner} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './CreateProfilePost.css'; 
import ProfileBio from './ProfileBio';
// eslint-disable-next-line
import { app } from './Firebase'; //do not remove

function CreateProfilePost() {
  const [isLoading, setIsLoading] = useState(false);
  const userObject = localStorage.getItem('user');
  const username = localStorage.getItem('username');
  const storage = getStorage();

  const getCurrentTimestamp = () => {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    const timestamp = `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
    return timestamp;
  };

  const [formData, setFormData] = useState({
    postId: 0,
    caption: '',
    content: '',
    mediaUrl: '',
    createdAt: getCurrentTimestamp(),
  });

  const [uploadStatus, setUploadStatus] = useState('');

  // Event to handle file upload
  const handleFileUpload = async (event) => {
    setIsLoading(true);
    const file = event.target.files[0];
    const storageRef = ref(storage, 'gs://springtest-f7ba8.appspot.com/' + file.name);

    try {
      await uploadBytes(storageRef, file);
      console.log('File uploaded successfully!');
      const downloadURL = await getDownloadURL(storageRef);
      console.log('File download URL:', downloadURL);

      // Update the form data with the download URL
      setFormData({
        ...formData,
        [event.target.name]: downloadURL,
      });

      setUploadStatus('File uploaded successfully!');
    } catch (error) {
      console.error('Error uploading file:', error);
      setUploadStatus('Error uploading file');
    }
    setIsLoading(false);
  };

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    // Update the existing object with the form values
    setFormData({ ...formData, user: userObject });

    axios
      .post(`http://localhost:8080/userposts/${username}/post`, formData)
      .then((response) => {
        console.log(response.data);
      })
      .catch((error) => {
        console.error(`Error fetching user data: ${error}`);
      });

    console.log('updatedObject: ', formData);
    window.location.pathname = '/Profile';
  };

  return (
    <Container >
      <Row>
        <ProfileBio/>
      </Row>
      <Row class="border border-secondary rounded">
      {/* <Row> */}
      <div className="create-profile-post-container">
        <h3 className="create-profile-post-title">Write something new for your friends to see!</h3>
        <Form onSubmit={handleSubmit} className="create-profile-post-form">
          <Form.Group controlId="caption">
            <Form.Label>Caption</Form.Label>
            <Form.Control type="text" name="caption" required placeholder="Enter Title" onChange={handleChange} />
          </Form.Group>
          <Form.Group controlId="content">
            <Form.Label>Content</Form.Label>
            <Form.Control type="text" name="content" required placeholder="Enter Content" onChange={handleChange} />
          </Form.Group>
          <Form.Group controlId="mediaUrl">
            <Form.Label>Upload file</Form.Label>
            <div className="input-group mb-3">
              <Form.Control type="file" name="mediaUrl" placeholder="Enter URL" onChange={handleFileUpload} />  
            </div>
          </Form.Group>
          {uploadStatus && <p>{uploadStatus}</p>}
          <Button type="submit" variant="primary" className="btn-block rounded-pill mb-3" disabled={isLoading}>
            {isLoading ? (<>
              <span className="align-middle">Uploading File</span>{" "}
              <FontAwesomeIcon icon={faSpinner} spin className="align-middle" /></>
            ) : (<>
              <span className="align-middle">Submit</span>{" "}
              <FontAwesomeIcon icon={faArrowRight} className="align-middle" /></>
            )}
          </Button>
        </Form>
      </div>
      </Row>
    </Container>
  );
}

export default CreateProfilePost;
