import React, { useState, useEffect } from 'react';
import './Dashboard.css';
import { Modal } from 'react-bootstrap';
import NavBar from './NavBar';
import CreatePO from './CreatePO';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Dashboard() {
  const [user, setUser] = useState(null);
  const [showPOForm, setShowPOForm] = useState(false);
  const navigate = useNavigate();
  const [loadModal, setLoadModal] = useState(false);
  const [outstandingCount, setOutstandingCount] = useState(0); 

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
  }, [navigate]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoadModal(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    axios
      .get("http://localhost:8080/api/po/all")
      .then(response => {
        const data = response.data;
        if (Array.isArray(data)) {
          const outstandingCount = data.filter(po => po.status.toLowerCase() === "outstanding").length;
          setOutstandingCount(outstandingCount);
        }
      })
      .catch(error => {
        console.error(`Error fetching POs: ${error}`);
      });
  }, []);

  const handleCreatePO = () => {
    setShowPOForm(true);
  };

  const handlePOFormClose = () => {
    setShowPOForm(false);
  };

  if (!user) {
    return <p>Loading...</p>;
  }

  return (
    <div className='dashboard-body'>
      <NavBar />
      <div className='dashboard-content'>
        <h1>Welcome back, {user.username}!</h1>
        {/* Search Bar */}
        <form className='search'>
          <input type='text' placeholder='Search..' className='form-control search' />
        </form>
        {/* Highlights */}
        <div className='highlight-overview'>
          <h5>Overview</h5>
          <div className='highlights'>
            <div className='highlight-1'>
              <h1>{outstandingCount}</h1> Ongoing Projects
            </div>
            <div className='highlight-2'>
              Highlight 2
            </div>
            <div className='highlight-3'>
              Highlight 3
            </div>
          </div>
        </div>
        {/* Add PO Button? */}
        <div className='po-creation-card'>
          <p>Ready to create a purchase order?</p>
          <button className='btn btn-dark' type='button' onClick={handleCreatePO}>Create PO</button>
        </div>
        {/* View Different Tables */}
        <div className='po-types'>
          <h5>View Tables</h5>
          <div className='po-tables'>
            <div className='po-table-1'>
              <h1><b>Enterprise Service</b> Purchase Orders</h1>
              <Link to='/ES'>
                <button className='btn btn-dark' type='button'>
                  View More
                </button>
              </Link>
            </div>
            <div className='po-table-2'>
              <h1><b>Talent Service</b> Purchase Orders</h1>
              <Link to='/PS'>
                <button className='btn btn-dark' type='button'>
                  View More
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {loadModal && (
        <Modal show={showPOForm} onHide={handlePOFormClose}>
          <Modal.Header closeButton>
            <Modal.Title>Create Purchase Order</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {showPOForm && user && <CreatePO closeModal={handlePOFormClose} />}
          </Modal.Body>
        </Modal>
      )}
    </div>
  );
}

export default Dashboard;
