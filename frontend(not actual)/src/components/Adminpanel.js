import React, { useEffect, useState } from 'react';
import NavBar from './NavBar.js';
import './Adminpanel.css';
import { Modal } from 'react-bootstrap';
import UpdateUser from './UpdateUser';
import UpdateMediaPost from './UpdateMediaPost';
import CreateUser from './CreateUser'; // Import the CreateUser component
import axios from 'axios';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

function Adminpanel() {
  const [post, setAllPost] = useState([]);
  const [user, setAllUser] = useState([]);
  const [searchTermPost, setSearchTermPost] = useState('');
  const [searchTermUser, setSearchTermUser] = useState('');
  const [showUserModal, setShowUserModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showPostModal, setShowPostModal] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [showCreateUserModal, setShowCreateUserModal] = useState(false); // New state variable for the "Create User" modal

  useEffect(() => {

    axios.get('http://localhost:8080/users')
      .then((response) => {
        console.log(response.data);
        setAllUser(response.data);
      })
      .catch((error) => {
        console.error(`Error fetching users: ${error}`);
      })

    // axios
    //   .get('http://localhost:8080/admin/posts')
    //   .then((response) => {
    //     console.log(response.data);
    //     setAllPost(response.data);
    //   })
    //   .catch((error) => {
    //     console.error(`Error fetching posts data: ${error}`);
    //   });

    // axios
    //   .get('http://localhost:8080/admin/users')
    //   .then((response) => {
    //     setAllUser(response.data);
    //   })
    //   .catch((error) => {
    //     console.error(`Error fetching users data: ${error}`);
    //   });
  }, []);

  function deletePost(post) {
    axios
      .post('http://localhost:8080/admin/delete/post', post)
      .then((response) => {
        console.log(response.data);
        window.location.pathname = '/adminpanel';
      })
      .catch((error) => {
        console.error(`Error deleting post: ${error}`);
      });
  }

  function deleteUser(user) {
    axios
      .post('http://localhost:8080/admin/delete/user', user)
      .then((response) => {
        console.log(response.data);
        window.location.pathname = '/adminpanel';
      })
      .catch((error) => {
        console.error(`Error deleting user: ${error}`);
      });
  }

  function updatePost(post) {
    setSelectedPost(post);
    setShowPostModal(true);
  }

  function updateUser(user) {
    setSelectedUser(user);
    setShowUserModal(true);
  }

  function handleUserModalClose() {
    setShowUserModal(false);
  }

  function handlePostModalClose() {
    setShowPostModal(false);
  }

  function handleCreateUserModalClose() {
    setShowCreateUserModal(false);
  }

  return (
    <div className='dashboard-body'>
      <NavBar />
      <div className='dashboard-content'>
        <div className='admin-create-user'>
          <h3>Admin Panel</h3>
          <div className='create-user-card'>
            Got a new user to add? Create a new user account here.
            <button onClick={() => setShowCreateUserModal(true)} className='btn btn-dark'>
              Create User
            </button>
          </div>

          <div className='user-records'>
            {/* <h3>Post Records</h3>
          <input
            type='text'
            className='form-control search'
            placeholder='Search posts...'
            onChange={(event) => setSearchTermPost(event.target.value)}
          />
          <table className='table admin-table'>
            <thead>
              <tr>
                <th className='role'>Username</th>
                <th>Caption</th>
                <th>Content</th>
                <th>Creation Date</th>
                <th className='role' colSpan='2' style={{ textAlign: 'center' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {post.length <= 0 ? (
                <tr>No post to show</tr>
              ) : (
                post
                  .filter((post) => {
                    if (searchTermPost === '') {
                      return post;
                    } else if (
                      post.content.toLowerCase().includes(searchTermPost.toLowerCase())
                    ) {
                      return post;
                    }
                    return null;
                  })
                  .map((post) => (
                    <tr key={post.postId}>
                      <td>{post.user.username}</td>
                      <td>{post.caption}</td>
                      <td>{post.content}</td>
                      <td>{post.createdAt}</td>
                      <td>
                        <button onClick={() => deletePost(post)} className='btn-danger admin-table button'>
                          <FontAwesomeIcon icon={faTrash} />
                        </button>
                      </td>
                      <td>
                        <button onClick={() => updatePost(post)} className='btn btn-success'>
                          <FontAwesomeIcon icon={faEdit} />
                        </button>
                      </td>
                    </tr>
                  ))
              )}
            </tbody>
          </table> */}

            <h3>User Records</h3>
            <input
              type='text'
              placeholder='Search users...'
              className='form-control search'
              onChange={(event) => setSearchTermUser(event.target.value)}
            />
            <table className='table table-hover admin-table'>
              <thead>
                <tr>
                  <th>Username</th>
                  <th>Password</th>
                  <th>Email</th>
                  <th className='role'>Role</th>
                  <th className='role' style={{ textAlign: 'center' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {user.length <= 0 ? (
                  <tr>
                    <td>No accounts created.</td>
                  </tr>
                ) : (
                  user
                    .filter((user) => {
                      if (searchTermUser === '') {
                        return user;
                      } else if (
                        user.username.toLowerCase().includes(searchTermUser.toLowerCase())
                      ) {
                        return user;
                      }
                      return null;
                    })
                    .map((user) => (
                      <tr key={user.user_id}>
                        <td>{user.username}</td>
                        <td>&#8226;&#8226;&#8226;&#8226;&#8226;&#8226;</td>
                        <td>{user.email}</td>
                        <td>{user.role}</td>
                        <td>
                          <div class="dropdown">
                            <button class="dropdown-btn" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                              <i class="fi fi-bs-menu-dots"></i>
                            </button>
                            <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
                              <a class="dropdown-item" style={{ color: 'navy' }} onClick={() => updateUser(user)}>
                                <i class="fi fi-sr-file-edit"></i>
                                <span>Update</span>
                              </a>
                              <a class="dropdown-item" href="#" style={{ color: 'red' }}>
                                <i class="fi fi-sr-trash"></i>
                                <span>Delete</span>
                              </a>
                            </div>
                          </div>
                        </td>
                      </tr>
                    ))
                )}
              </tbody>
            </table>

          </div>
        </div>

        {/* Update User Modal */}
        <Modal show={showUserModal} onHide={handleUserModalClose}>
          <Modal.Header closeButton>
            <Modal.Title>Update User</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {selectedUser && (
              <UpdateUser user={selectedUser} closeModal={handleUserModalClose} />
            )}
          </Modal.Body>
        </Modal>

        {/* Update Post Modal */}
        <Modal show={showPostModal} onHide={handlePostModalClose}>
          <Modal.Header closeButton>
            <Modal.Title>Update User</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {selectedPost && (
              <UpdateMediaPost post={selectedPost} closeModal={handlePostModalClose} />
            )}
          </Modal.Body>
        </Modal>

        {/* Create User Modal */}
        <Modal show={showCreateUserModal} onHide={handleCreateUserModalClose}>
          <Modal.Header closeButton>
            <Modal.Title>
              <i class="fi fi-rr-users-medical"></i>
              <span style={{ fontWeight: '300' }}> Create User</span>
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {showCreateUserModal && <CreateUser closeModal={handleCreateUserModalClose} />}
          </Modal.Body>
        </Modal>
      </div>


    </div>
  );
}

export default Adminpanel;
