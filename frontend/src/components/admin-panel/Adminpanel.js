import React, { useEffect, useState } from 'react';

import './Adminpanel.css';
import CreateUser from '../create-user/CreateUser';
import UpdateUser from '../update-user/UpdateUser'
import { Modal } from 'react-bootstrap';
import axios from 'axios';
import NavBar from '../navbar/NavBar';


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


  const updateUser = (user) => {
    setSelectedUser(user);
    setShowUserModal(true);
  }

  const handleUserModalClose = () => {
    setShowUserModal(false);
  }

  const handleCreateUserModalClose = () => {
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
            <button onClick={() => setShowCreateUserModal(true)} className='btn' style={{ backgroundColor: '#1567ff', color: 'white' }}>
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
                          <div className="dropdown">
                            <button className="dropdown-btn" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                              <i className="fi fi-bs-menu-dots"></i>
                            </button>
                            <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                              <a className="dropdown-item" style={{ color: 'navy' }} onClick={() => updateUser(user)}>
                                <i className="fi fi-sr-file-edit"></i>
                                <span>Update</span>
                              </a>
                              <a className="dropdown-item" onClick={() => deleteUser(user.username)} style={{ color: 'red' }}>
                                <i className="fi fi-sr-trash"></i>
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
            <Modal.Title><i className="fi fi-sr-user-pen"></i> Update User</Modal.Title>
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
              <i className="fi fi-rr-users-medical"></i>
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