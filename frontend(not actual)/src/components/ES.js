import React, { useEffect, useState } from 'react';
import NavBar from './NavBar';
import { Modal, Toast } from 'react-bootstrap';
import ViewPO from './ViewPO';
import CreateInvoice from './CreateInvoice';
import EditPO from './EditPO';
import './ES.css';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faPlus, faFilter, faSearch, faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';


function ES() {

  const username = localStorage.getItem('username');
  const role = localStorage.getItem('role');
  const navigate = useNavigate();
  
  const [ES, setES] = useState([]);
  const [showPOModal, setShowPOModal] = useState(false);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedPO, setSelectedPO] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [searchType, setSearchType] = useState('poNumber');

  function handleShowPOModalClose() {
    setShowPOModal(false);
  }

  function handleShowInvoiceModalClose() {
    setShowInvoiceModal(false);
  }

  function handleStatusChange(e) {
    setSelectedStatus(e.target.value);
  }

  const handleSearchTermChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSearchTypeChange = (e) => {
    setSearchType(e.target.value);
  };

  useEffect(() => {
    axios
      .get('http://localhost:8080/api/po/all', { maxRedirects: 5 })
      .then((response) => {
        setES(response.data);
      })
      .catch((error) => {
        console.error(error);
      });

    console.log('ES POs: ', ES);
  }, []);

  const filteredES = selectedStatus
    ? ES.filter((po) => po.status === selectedStatus && po.type === 'Enterprise Service')
    : ES.filter((po) => po.type === 'Enterprise Service');

  const searchedES = searchTerm
    ? filteredES.filter((po) => po[searchType].toString().toLowerCase().includes(searchTerm.toLowerCase()))
    : filteredES;

  const handleDeletePO = (id, poNumber) => {
    if (window.confirm(`Are you sure you want to delete purchase order ${poNumber}?`)) {
    axios
      .delete(`http://localhost:8080/api/po/delete/${id}`)
      .then((response) => {
        setES((prevES) => prevES.filter((po) => po.id !== id));

        // Create delete notification:
        const notification = {
          message: `PO ${poNumber} has been deleted by ${username} on ${new Date().toLocaleDateString()}`,
          userRole: `${role}`,
        };

        // Post notification to Database:
        axios.post('http://localhost:8080/api/notification/create', notification)
        .then((response) => {
          console.log(response.data)
        })
        .catch((error) => {
          console.log('Error creating notification:', error);
        });

        toast.success(`Purchase order ${poNumber} deleted successfully!`)
      })

      .catch((error) => {
        console.error(error);
        toast.error(`Error deleting purchase order ${poNumber}!`);
      });
    }
  };

  const handleEditPO = (po) => {
    setSelectedPO(po);
    setShowEditModal(true);
  };

  const handlePoUpdate = (poNumber) => {
    toast.success(`Purchase order ${poNumber} updated successfully!`);

    // Fetch updated data after successful update
    axios
      .get('http://localhost:8080/api/po/all', { maxRedirects: 5 })
      .then((response) => {
        setES(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleInvUpdate = () => {
    axios
      .get('http://localhost:8080/api/po/all', { maxRedirects: 5 })
      .then((response) => {
        setES(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }
  const handleInvoiceUpdate = (invoiceNumber) => {
    toast.success(`Invoice ${invoiceNumber} created successfully!`);

    axios
      .get('http://localhost:8080/api/po/all', { maxRedirects: 5 })
      .then((response) => {
        setES(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handlePoUpdateError = () => {
    toast.error('Error updating purchase order!');
  };

  const handleGoBack = () => {
    navigate('/dashboard');
  };

  return (
    <div className='dashboard-body'>
      <ToastContainer />
      <NavBar />
      <div className='dashboard-content'>
        <div className='es-intro'>
          <h2>
            <span style={{ fontWeight: '800' }}>Essential Services:</span>{' '}
            <span style={{ fontWeight: '200' }}>Purchase Orders</span>
          </h2>
          <button type='button' className='btn btn-dark' onClick={handleGoBack}>
            Back
          </button>
        </div>

        {/* Filter by status */}
        <div className='status-filter'>
          <label htmlFor='status-select'>Filter by Status:</label>
          <select id='status-select' className='form-control' value={selectedStatus} onChange={handleStatusChange}>
            <option value=''>All</option>
            <option value='Ongoing'>Ongoing</option>
            <option value='Completed'>Completed</option>
            <option value='Cancelled'>Cancelled</option>
          </select>
        </div>

        <div className='search-wrapper'>
          <label htmlFor='search-box'>Search:</label>
          <form className='d-flex'>
            <select
              style={{ width: 100 }}
              id='search-type-select'
              className='form-control'
              value={searchType}
              onChange={handleSearchTypeChange}
            >
              <option value='poNumber'>PO#</option>
              <option value='clientName'>Client</option>
            </select>
            <input
              id='search-box'
              type='text'
              className='form-control search'
              placeholder='Search...'
              value={searchTerm}
              onChange={handleSearchTermChange}
            />
          </form>
        </div>

        {/* Table of ES PO's */}
        <table className='table table-light table-hover'>
          <thead>
            <tr>
              <th scope='col' className='text-center'>
                PO #
              </th>
              <th scope='col' className='text-center'>
                Client
              </th>
              <th scope='col' className='text-center'>
                Type
              </th>
              <th scope='col' className='text-center'>
                Start Date
              </th>
              <th scope='col' className='text-center'>
                End Date
              </th>
              <th scope='col' className='text-center'>
                Milestone (%)
              </th>
              <th scope='col' className='text-center'>
                Total Value
              </th>
              <th scope='col' className='text-center'>
                Balance Value
              </th>
              <th scope='col' className='text-center'>
                Status
              </th>
              {role.toLowerCase() === 'finance' && (
              <th scope='col' className='text-center'>
                Actions
              </th>
              )}
            </tr>
          </thead>
          <tbody>
            {searchedES.map((po) => (
              <tr key={po.id}>
                <td className='text-center'>{po.poNumber}</td>
                <td className='text-center'>{po.clientName}</td>
                <td className='text-center'>{po.type}</td>
                <td className='text-center'>{po.startDate}</td>
                <td className='text-center'>{po.endDate}</td>
                <td className='text-center'>{po.milestone}</td>
                <td className='text-center'>{po.totalValue}</td>
                <td className='text-center'>{po.balValue}</td>
                <td className='text-center'>{po.status}</td>
                {role.toLowerCase() === 'finance' && (
                <td>
                  <div className='button-container'>
                    <button
                      type='button'
                      className='btn btn-dark'
                      onClick={() => {
                        setSelectedPO(po);
                        setShowPOModal(true);
                      }}
                    >
                      <FontAwesomeIcon icon={faEye} />
                    </button>
                    <button
                      type='button'
                      className='btn btn-dark'
                      onClick={() => handleEditPO(po)}
                    >
                      <FontAwesomeIcon icon={faEdit} />
                    </button>
                    <button
                      className='btn btn-dark'
                      onClick={() => {
                        setSelectedPO(po);
                        setShowInvoiceModal(true);
                      }}
                    >
                      <FontAwesomeIcon icon={faPlus} />
                    </button>
                    <button className='btn btn-dark' onClick={() => handleDeletePO(po.id, po.poNumber)}>
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                  </div>
                </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>

        <div style={{ display: 'flex', justifyContent: 'center' }}>
          {/* View PO Modal */}
          <Modal show={showPOModal} onHide={handleShowPOModalClose} dialogClassName='custom-modal'>
            <Modal.Header closeButton>
              <Modal.Title>Purchase Order</Modal.Title>
            </Modal.Header>
            <Modal.Body>{showPOModal && <ViewPO selectedPO={selectedPO} onInvUpdated={handleInvUpdate} isPS={false} closeModal={handleShowPOModalClose} />}</Modal.Body>
          </Modal>

          {/* Create Invoice Modal */}
          <Modal show={showInvoiceModal} onHide={handleShowInvoiceModalClose} dialogClassName='custom-modal w-50'>
            <Modal.Header closeButton>
              <Modal.Title>Create Invoice</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              {showInvoiceModal && (
                <CreateInvoice
                  selectedPO={selectedPO}
                  isPS={false}
                  closeModal={handleShowInvoiceModalClose}
                  onInvUpdated={handleInvoiceUpdate}
                />
              )}
            </Modal.Body>
          </Modal>

          {/* Edit PO Modal */}
          <Modal show={showEditModal} onHide={() => setShowEditModal(false)} dialogClassName='custom-modal w-50'>
            <Modal.Header closeButton>
              <Modal.Title>Edit Purchase Order</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              {showEditModal && (
                <EditPO
                  selectedPO={selectedPO}
                  closeModal={() => setShowEditModal(false)}
                  onPoUpdated={handlePoUpdate}
                  onPoUpdateError={handlePoUpdateError}
                />
              )}
            </Modal.Body>
          </Modal>
        </div>
      </div>
    </div>
  );
}

export default ES;
