import React, { useEffect, useState } from 'react';
import NavBar from './NavBar.js';
import './Adminpanel.css';
import { Modal } from 'react-bootstrap';
import UpdateUser from './UpdateUser';
import CreateUser from './CreateUser'; // Import the CreateUser component
import axios from 'axios';

function Adminpanel() {
  const [user, setAllUser] = useState([]);
  const [searchTermUser, setSearchTermUser] = useState('');
  const [showUserModal, setShowUserModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showCreateUserModal, setShowCreateUserModal] = useState(false); // New state variable for the "Create User" modal

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = () => {
    axios.get('http://localhost:8080/users')
    .then((response) => {
      console.log(response.data);
      setAllUser(response.data);
    })
    .catch((error) => {
      console.error(error);
    })
  }

  const deleteUser = (username) => {
    axios.delete(`http://localhost:8080/user/delete/${username}`)
      .then(response => {
        console.log("Deleted User Account:", response.data);
        loadUsers();
      })
      .catch(error => {
        console.error(error);
      });
  };
  

  function updateUser(user) {
    setSelectedUser(user);
    setShowUserModal(true);
  }

  function handleUserModalClose() {
    setShowUserModal(false);
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
                              <a class="dropdown-item" onClick={() => deleteUser(user.username)} style={{ color: 'red' }}>
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
            <Modal.Title><i class="fi fi-sr-user-pen"></i> Update User</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {selectedUser && (
              <UpdateUser user={selectedUser} closeModal={handleUserModalClose} />
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
