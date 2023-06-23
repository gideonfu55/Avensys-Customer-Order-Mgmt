import React, { useEffect, useState } from 'react';
import NavBar from './NavBar';
import { Modal } from 'react-bootstrap';
import ViewPO from './ViewPO';
import CreateInvoice from './CreateInvoice';
import './ES.css'; 
import axios from 'axios';

function PS() { 
  const [PS, setPS] = useState([]); 
  const [showPOModal, setShowPOModal] = useState(false);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState('');

  function handleShowPOModalClose() {
    setShowPOModal(false);
  }

  function handleShowInvoiceModalClose() {
    setShowInvoiceModal(false);
  }

  function handleStatusChange(e) {
    setSelectedStatus(e.target.value);
  }

  useEffect(() => {
    axios
      .get("http://localhost:8080/api/po/all", { maxRedirects: 5 })
      .then((response) => {
        setPS(response.data); 
      })
      .catch((error) => {
        console.error(error);
      });

    console.log("PS POs: ", PS); 
  }, []);

  const filteredPS = selectedStatus
    ? PS.filter(po => po.status === selectedStatus && po.type === 'Professional Service') 
    : PS.filter(po => po.type === 'Professional Service'); 

  return (
    <div className='dashboard-body'>
      <NavBar />
      <div className='dashboard-content'>
        <div className='ps-intro'>
          <h2>
            <span style={{ fontWeight: '800' }}>Professional Services:</span>{' '} 
            <span style={{ fontWeight: '200' }}>Purchase Orders</span>
          </h2>
          <button type='button' className='btn btn-dark'>
            Back
          </button>
        </div>

        {/* Filter by status */}
        <div className='status-filter'>
          <label htmlFor='status-select'>Filter by Status:</label>
          <select
            id='status-select'
            className='form-control'
            value={selectedStatus}
            onChange={handleStatusChange}
          >
            <option value=''>All</option>
            <option value='Outstanding'>Outstanding</option>
            <option value='Completed'>Completed</option>
            <option value='Cancelled'>Cancelled</option>
          </select>
        </div>

        {/* Search? */}
        <form>
          <input type='text' className='form-control search' placeholder='Search..' />
        </form>
        {/* Table of PS PO's */}
        <table className='table table-light table-hover'>
          <thead>
            <tr>
              <th scope='col' className='text-center'>PO #</th>
              <th scope='col' className='text-center'>Vendor</th>
              <th scope='col' className='text-center'>Type</th>
              <th scope='col' className='text-center'>Start Date</th>
              <th scope='col' className='text-center'>End Date</th>
              <th scope='col' className='text-center'>Milestone (%)</th>
              <th scope='col' className='text-center'>Total Value</th>
              <th scope='col' className='text-center'>
                <span>Status</span>
                <i className='fas fa-filter'></i>
              </th>
              <th scope='col'></th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {filteredPS.map((po) => ( 
              <tr key={po.id}>
                <td className='text-center'>{po.id}</td>
                <td className='text-center'>{po.vendorName}</td>
                <td className='text-center'>{po.type}</td>
                <td className='text-center'>{po.startDate}</td>
                <td className='text-center'>{po.endDate}</td>
                <td className='text-center'>{po.milestone}</td>
                <td className='text-center'>{po.totalValue}</td>
                <td className='text-center'>{po.status}</td>
                <td>
                  <button
                    type='button'
                    className='btn btn-dark'
                    onClick={() => setShowPOModal(true)}
                  >
                    View PO
                  </button>
                </td>
                <td>
                  <button className='btn btn-dark'>Add Invoice</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* View PO Modal */}
        <Modal show={showPOModal} onHide={handleShowPOModalClose} dialogClassName='custom-modal'>
          <Modal.Header closeButton>
            <Modal.Title>Purchase Order</Modal.Title>
          </Modal.Header>
          <Modal.Body>{showPOModal && <ViewPO closeModal={handleShowPOModalClose} />}</Modal.Body>
        </Modal>

        {/* Create Invoice Modal */}
        <Modal show={showInvoiceModal} onHide={handleShowInvoiceModalClose} dialogClassName='custom-modal'>
          <Modal.Header closeButton>
            <Modal.Title>Create Invoice</Modal.Title>
          </Modal.Header>
          <Modal.Body>{showInvoiceModal && <CreateInvoice closeModal={handleShowInvoiceModalClose} />}</Modal.Body>
        </Modal>
      </div>
    </div>
  );
}

export default PS; 
