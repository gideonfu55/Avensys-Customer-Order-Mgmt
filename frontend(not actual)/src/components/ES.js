import React, { useEffect, useState } from 'react';
import NavBar from './NavBar';
import { Modal } from 'react-bootstrap';
import ViewPO from './ViewPO';
import CreateInvoice from './CreateInvoice';
import './ES.css';
import axios from 'axios';

function ES() {
  const [ES, setES] = useState([]);
  const [showPOModal, setShowPOModal] = useState(false);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [selectedPO, setSelectedPO] = useState(null);
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
        setES(response.data);
      })
      .catch((error) => {
        console.error(error);
      });

    console.log("ES POs: ", ES);
  }, []);

  const filteredES = selectedStatus
    ? ES.filter(po => po.status === selectedStatus && po.type === 'Enterprise Service')
    : ES.filter(po => po.type === 'Enterprise Service');

  return (
    <div className='dashboard-body'>
      <NavBar />
      <div className='dashboard-content'>
        <div className='es-intro'>
          <h2>
            <span style={{ fontWeight: '800' }}>Essential Services:</span>{' '}
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
        {/* Table of ES PO's */}
        <table className='table table-light table-hover'>
          <thead>
            <tr>
              <th scope='col' className='text-center'>PO #</th>
              <th scope='col' className='text-center'>Client</th>
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
            {filteredES.map((po) => (
              <tr key={po.id}>
                <td className='text-center'>{po.poNumber}</td>
                <td className='text-center'>{po.clientName}</td>
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
                    onClick={() => {
                      setSelectedPO(po)
                      setShowPOModal(true)
                    }}
                  >
                    View PO
                  </button>
                </td>
                <td>
                  <button
                    className='btn btn-dark'
                    onClick={() => {
                      setSelectedPO(po)
                      setShowInvoiceModal(true)
                    }}
                  >
                    Add Invoice
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div style={{ display: "flex", justifyContent: "center" }}>
          {/* View PO Modal */}
          <Modal show={showPOModal} onHide={handleShowPOModalClose} dialogClassName='custom-modal'>
            <Modal.Header closeButton>
              <Modal.Title>Purchase Order</Modal.Title>
            </Modal.Header>
            <Modal.Body>{showPOModal && <ViewPO selectedPO={selectedPO} closeModal={handleShowPOModalClose} />}</Modal.Body>
          </Modal>

          {/* Create Invoice Modal */}
          <Modal show={showInvoiceModal} onHide={handleShowInvoiceModalClose} dialogClassName='custom-modal w-50'>
            <Modal.Header closeButton>
              <Modal.Title>Create Invoice</Modal.Title>
            </Modal.Header>
            <Modal.Body>{showInvoiceModal && <CreateInvoice selectedPO={selectedPO} closeModal={handleShowInvoiceModalClose} />}</Modal.Body>
          </Modal>
        </div>
      </div>
    </div>
  );
}

export default ES;
