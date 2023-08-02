import React, { useState, useEffect } from 'react';
import './Dashboard.css';
import { Modal } from 'react-bootstrap';
import CreatePO from '../create-po/CreatePO';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import History from '../history/History';
import NavBar from '../navbar/NavBar.js';
import POTrend from '../po-trend/POTrend';


function Dashboard() {
  const [user, setUser] = useState(null);
  const [showPOForm, setShowPOForm] = useState(false);
  const navigate = useNavigate();
  const [loadModal, setLoadModal] = useState(false);
  const [outstandingCount, setOutstandingCount] = useState(0);
  const [outstandingAmount, setOutstandingAmount] = useState(0);

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

  // UseEffect for:
  // 1.) finding number of ongoing/outstanding POs & 
  // 2.) finding total amount outstanding for all ongoing POs:
  useEffect(() => {
    axios
      .get("http://localhost:8080/api/po/all")
      .then(response => {
        const data = response.data;
        if (Array.isArray(data)) {
          const outstandingCount = data.filter(po => po.status.toLowerCase() === "ongoing").length;
          setOutstandingCount(outstandingCount);
          console.log(response.data)

          const outstandingAmount = data.filter(po => po.status.toLowerCase() === "ongoing").reduce((total, po) => total + po.balValue, 0);
          setOutstandingAmount(outstandingAmount);
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

  const formatCurrency = value => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'SGD'
    }).format(value);
  }

  if (!user) {
    return <p>Loading...</p>;
  }

  localStorage.setItem('role', user.role);
  console.log(user.role)

  return (
    <div className='dashboard-body'>
      <ToastContainer />
      <NavBar />
      <div className='d-flex flex-column'>
        <nav className='custom-nav'>
          <div className='navbar-brand'>
            Hello, {user.username}!
          </div>
          <ul className='navbar-nav mr-auto'>
            <li className='nav-item'>
              <a className='nav-link'>{user.email}</a>
            </li>
          </ul>
        </nav>
        <div className='dashboard-content'>
          <div className='dashboard-content-inner'>
            <div className='dashboard-details'>
              <div className='highlight-container'>
                <div className='ongoing-card text-center'>
                  <b>Total PO</b>
                  <h1 className="title font-weight-bold">{outstandingCount}</h1>
                </div>
                <div className='ongoing-card text-center'>
                  <b>Total Amount Outstanding</b>
                  <h3 className="title font-weight-bold mt-2">{formatCurrency(outstandingAmount)}</h3>
                </div>
                <div className='ongoing-card text-center'>
                  <b>Pending Payments</b>
                  <h1 className="title font-weight-bold">95%</h1>
                </div>
                {user.role.toLowerCase() === 'sales' && (
                  <div className='createpo-card'>
                    <div className='po-creation-card'>
                      <p>Ready to create a purchase order?</p>
                      <button className='btn btn-light' type='button' onClick={handleCreatePO}>Create PO</button>
                    </div>
                  </div>
                )} 
              </div>

              {/* PO Trend Component: Pie Chart for PO Status and Barchart for Period of Selected Status */}
              <POTrend />

              <div className='notification-container'>
                <History />
              </div> 
            </div>
            <div className='po-tables' >
              <div className='es-po'>
                <h1>Enterprise Service <span style={{ fontWeight: 'bold' }}>Purchase Orders</span></h1>
                <Link to='/es'><button type='button' className='btn btn-dark'>View More</button></Link>
              </div>
              <div className='ts-po'>
                <h1>Talent Service <span style={{ fontWeight: 'bold' }}>Purchase Orders</span></h1>
                <Link to='/ts'><button className='btn btn-dark'>View More</button></Link>
              </div>
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
