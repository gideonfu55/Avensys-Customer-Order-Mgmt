import React, { useState, useEffect } from 'react';
import './Dashboard.css';
import { Modal } from 'react-bootstrap';
import NavBar from './NavBar';
import CreatePO from './CreatePO';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import History from './History';

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
          const outstandingCount = data.filter(po => po.status.toLowerCase() === "ongoing").length;
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

  const handlePoCreated = (poNumber) => {
    toast.success(`Purchase order ${poNumber} created successfully!`);
  }

  const handlePOFormClose = () => {
    setShowPOForm(false);
  };

  const handlePoCreationError = () => {
    toast.error(`Error creating purchase order. Please check again.`);
  };

  if (!user) {
    return <p>Loading...</p>;
  }

  localStorage.setItem('role', user.role);

  return (
    <div className='dashboard-body'>
      <ToastContainer />
      <NavBar />
      <div className='dashboard-content'>
        <h1>Welcome back, {user.username}!</h1>
        {/* Highlights */}
        <div className='highlight-overview'>
          <h5>Overview</h5>
          <div className='highlights'>

          <div className="highlight-1">
            <h1 className="title">{outstandingCount}</h1>
            <div className="content">
              <span>Ongoing Projects</span>
            </div>
          </div>

            
            {/* Used for rendering notifications by role */}
            <div className='highlight-3'>
              <>
                <History />
              </>
            </div>
          </div>
        </div>
        {/* Add PO Button? */}
        {user.role.toLowerCase() === 'sales' && (
            <div className='po-creation-card'>
              <p>Ready to create a purchase order?</p>
              <button className='btn btn-dark' type='button' onClick={handleCreatePO}>Create PO</button>
            </div>
          )}
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
            <Modal.Title>Submit Purchase Order</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {
              showPOForm && 
              user && 
              <CreatePO 
                onPoCreated={handlePoCreated} 
                onPoCreationError={handlePoCreationError} 
                closeModal={handlePOFormClose} 
              />
            }
          </Modal.Body>
        </Modal>
      )}
    </div>
  );
}

export default Dashboard;
