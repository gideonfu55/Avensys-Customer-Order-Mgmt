/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useState } from 'react';
import NavBar from './NavBar';
import { Modal } from 'react-bootstrap';
import ViewPO from './ViewPO';
import CreateInvoice from './CreateInvoice';
import EditPO from './EditPO';
import './ES.css';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Document, Page, pdfjs } from 'react-pdf';
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

  // For viewing & downloading the document:
  const [showDocumentModal, setShowDocumentModal] = useState(false);
  const [numPages, setNumPages] = useState(0);
  pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

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

  const handleShowDocumentModal = (po) => {
    setSelectedPO(po);
    setShowDocumentModal(true);
  };

  const handlePoUpdateError = () => {
    toast.error('Error updating purchase order!');
  };

  const handleGoBack = () => {
    navigate('/dashboard');
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
  });

  return (
    <div className='dashboard-body'>
      <ToastContainer />
      <NavBar />
      <div className='dashboard-content'>
        <div className='es-intro'>
          <h2>
            <span style={{ fontWeight: '800' }}>Enterprise Services:</span>{' '}
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
            <tr className='text-center align-middle'>
              <th scope='col'>
                PO #
              </th>
              <th scope='col'>
                Project #
              </th>
              <th scope='col'>
                Client
              </th>
              <th scope='col'>
                Type
              </th>
              <th scope='col'>
                Start Date
              </th>
              <th scope='col'>
                End Date
              </th>
              <th scope='col'>
                Milestone (%)
              </th>
              <th scope='col'>
                Total Value
              </th>
              <th scope='col'>
                Balance Value
              </th>
              <th scope='col'>
                Status
              </th>
              {role.toLowerCase() === 'finance' && (
                <th scope='col' className='text-center'>
                  Actions
                </th>
              )}
              {role.toLowerCase() === 'sales' && (
                <th scope='col' className='text-center'>
                  Action
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {searchedES.map((po) => (
              <tr className='text-center align-middle' key={po.id}>
                <td>{po.poNumber}</td>
                <td>{po.prjNumber}</td>
                <td>{po.clientName}</td>
                <td>{po.type}</td>
                <td>{po.startDate}</td>
                <td>{po.endDate}</td>
                <td>{po.milestone}</td>
                <td>{po.totalValue}</td>
                <td>{po.balValue}</td>
                <td>{po.status}</td>
                {role.toLowerCase() === 'finance' && (
                  <td>
                    <div className="dropdown">
                      <button className="btn" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        <i className="fi fi-br-menu-dots"></i>
                      </button>
                      <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                        <a
                          className="dropdown-item"
                          onClick={() => {
                            setSelectedPO(po);
                            setShowPOModal(true);
                          }}>
                          <i className="fi fi-rr-eye"></i> View PO
                        </a>
                        <a className="dropdown-item" onClick={() => handleEditPO(po)}>
                          <i className="fi fi-rr-edit"></i> Edit PO
                        </a>
                        <a className="dropdown-item" onClick={() => {
                          setSelectedPO(po);
                          setShowInvoiceModal(true);
                        }}><i className="fi fi-rr-add-document"></i> Create Invoice
                        </a>
                        <a className="dropdown-item" onClick={() => handleDeletePO(po.id, po.poNumber)}>
                          <i className="fi fi-rr-trash"></i> Delete PO
                        </a>
                        <a className="dropdown-item" onClick={() => handleShowDocumentModal(po)}>
                          <i className="fi fi-rr-file"></i> View PO Document
                        </a>
                      </div>
                    </div>
                  </td>
                )}
                {role.toLowerCase() === 'sales' && (
                  <td>
                    <button className='p-1'>
                      <i className="fi fi-rr-eye view-btn p-1" onClick={() => handleShowDocumentModal(po)}></i>
                    </button>
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

          {/* View PO Document Modal */}
          <Modal show={showDocumentModal} onHide={() => setShowDocumentModal(false)} size="lg">
            <Modal.Header closeButton>
              <Modal.Title>
                View PO Document
              </Modal.Title>
              {/* Download PO Button */}
              {
                selectedPO && selectedPO.fileUrl ? (
                  <a href={selectedPO.fileUrl} download>
                    <button className='download-btn ms-2 p-2'>
                      <i className="fi fi-sr-download download"></i>  
                    </button>
                  </a>
                ) : null
              }
            </Modal.Header>
            <Modal.Body>
              {selectedPO && selectedPO.fileUrl ? (
                <Document
                  file={selectedPO.fileUrl}
                  onLoadSuccess={({ numPages }) => setNumPages(numPages)}
                  onError={(error) => console.log('Error while loading document:', error)}
                >
                  {Array.from(new Array(numPages), (el, index) => (
                    <Page key={`page_${index + 1}`} pageNumber={index + 1} />
                  ))}
                </Document>
              ) : (
                <p>No document available</p>
              )}
            </Modal.Body>
          </Modal>

        </div>
      </div>
    </div>
  );
}

export default ES;
