import React, { useEffect, useState } from 'react'
import { Modal } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './ViewPO.css'
import axios from 'axios';
import EditPO from './EditPO';
import UpdateInvoice from './UpdateInvoice';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Document, Page, pdfjs } from 'react-pdf';


function ViewPO({ selectedPO, onInvUpdated, isPS, closeModal }) {

    const username = localStorage.getItem('username');
    const role = localStorage.getItem('role');

    const [invoices, setInvoices] = useState([]);
    const [showInvoiceModal, setShowInvoiceModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedInvoice, setSelectedInvoice] = useState(null);
    const [updatedPO, setUpdatedPO] = useState({ ...selectedPO });
    const [balValue, setBalValue] = useState(selectedPO.balValue);

    // For viewing & downloading the invoice:
    const [showDocumentModal, setShowDocumentModal] = useState(false);
    const [numPages, setNumPages] = useState(0);
    pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

    useEffect(() => {
        axios
            .get("http://localhost:8080/api/invoices/all")
            .then((response) => {
                // Get filtered invoices using the purchaseOrderRef in each invoice that's corresponding to the selected PO's number
                const filteredInvoices = response.data.filter(invoice => invoice.purchaseOrderRef === selectedPO.poNumber);
                setInvoices(filteredInvoices);
            })
            .catch((error) => {
                console.error("Error fetching data: ", error);
            });
    }, [selectedPO]);

    const handleDeleteInvoice = (id, invoiceNumber) => {
        toast.success(`Invoice ${invoiceNumber} deleted successfully!`);
        axios
            .delete(`http://localhost:8080/api/invoices/delete/${id}`)
            .then((response) => {
                setInvoices((prevInvoices) => prevInvoices.filter((invoice) => invoice.id !== id));
                console.log('Invoice deleted successfully')

                // Create notification after invoice is deleted:
                const notification = {
                    message: `Invoice ${invoiceNumber} has been deleted by ${username} on ${new Date().toLocaleDateString()}`,
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

            })
            .catch((error) => {
                console.error(error);
            });
    };

    const handleInvoiceUpdate = (invoiceData, amount, status) => {
        toast.success(`Invoice ${invoiceData.invoiceNumber} updated successfully!`);

        let updatedBalValue;
        let updatedMilestone;
        let updatedStatus;

        // const startDate = new Date(selectedPO.startDate);
        // const endDate = new Date(selectedPO.endDate);
        // const numberOfYears = endDate.getFullYear() - startDate.getFullYear();
        // const numberOfMonths = numberOfYears * 12 + (endDate.getMonth() - startDate.getMonth());

        // const percentageIncrement = 100 / numberOfMonths;
        // const milestoneAsNumber = parseInt(selectedPO.milestone, 10);
        // updatedMilestone = (milestoneAsNumber + percentageIncrement).toString();

        if (invoiceData.status !== status) {
            if (invoiceData.status === 'Paid' && selectedPO.balValue >= invoiceData.amount) {
                updatedBalValue = selectedPO.balValue - invoiceData.amount;
            } else if (invoiceData.status === 'Unpaid') {
                updatedBalValue = selectedPO.balValue + invoiceData.amount;
            }

            setBalValue(updatedBalValue);

            if (isPS) {
                updatedMilestone = ((selectedPO.totalValue - updatedBalValue) / selectedPO.totalValue) * 100;
            }
        }

        if (updatedBalValue === 0) {
            updatedStatus = "Completed"
        }

        const patchData = {
            balValue: updatedBalValue,
            milestone: updatedMilestone,
            status: updatedStatus
        };

        axios
            .patch(`http://localhost:8080/api/po/update/${selectedPO.id}`, patchData)
            .then((response) => {
                console.log('Purchase order updated successfully:', response.data);
                setUpdatedPO(response.data)
                onInvUpdated()
            })
            .catch((error) => {
                console.error('Error updating purchase order:', error);
            });

        // Fetch updated data after successful update
        axios
            .get('http://localhost:8080/api/invoices/all', { maxRedirects: 5 })
            .then((response) => {
                const filteredInvoices = response.data.filter(invoice => invoice.purchaseOrderRef === selectedPO.poNumber);
                setInvoices(filteredInvoices);
            })
            .catch((error) => {
                console.error(error);
            });
    };

    const handleInvoiceUpdateError = () => {
        toast.error('Error updating invoice!');
    };

    function handleShowInvoiceModalClose() {
        setShowInvoiceModal(false);
    }

    function handleShowDocumentModal(invoice) {
        setSelectedInvoice(invoice);
        setShowDocumentModal(true);
    }

    return (
        <div className='modal-fade'>
            {/* Current PO */}
            <div>
                <table className='table table-light table-hover'>
                    <thead>
                        <tr className='text-center align-middle'>
                            <th scope="col">PO #</th>
                            <th scope="col">Client</th>
                            <th scope="col">Type</th>
                            <th scope="col">Start Date</th>
                            <th scope="col">End Date</th>
                            <th scope="col">Milestone (%)</th>
                            <th scope="col">Total Value</th>
                            <th scope="col">Total Balance</th>
                            <th scope="col">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr className='text-center align-middle'>
                            <td>{selectedPO.poNumber}</td>
                            <td>{selectedPO.clientName}</td>
                            <td>{selectedPO.type}</td>
                            <td>{selectedPO.startDate}</td>
                            <td>{selectedPO.endDate}</td>
                            <td>{parseFloat(updatedPO.milestone).toFixed(2)}</td>
                            <td>{selectedPO.totalValue}</td>
                            <td>{updatedPO.balValue}</td>
                            <td>{updatedPO.status}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            {/* All Invoices */}
            <div>
                <h5>Invoices</h5>
                <table className='table table-light table-hover'>
                    <thead>
                        <tr className='text-center align-middle'>
                            <th scope="col">Invoice #</th>
                            <th scope="col">PO Number Ref</th>
                            <th scope="col">Amount</th>
                            <th scope="col">Date Billed</th>
                            <th scope="col">Due Date</th>
                            <th scope="col">Status</th>
                            <th scope='col'>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {invoices.map((invoice) => (
                            <tr className='text-center align-middle' key={invoice.id}>
                                <td>{invoice.invoiceNumber}</td>
                                <td>{invoice.purchaseOrderRef}</td>
                                <td>{invoice.amount}</td>
                                <td>{invoice.dateBilled}</td>
                                <td>{invoice.dueDate}</td>
                                <td>{invoice.status}</td>
                                <td>
                                    <button
                                        type='button'
                                        className='update-btn p-1'
                                        onClick={() => {
                                            setSelectedInvoice(invoice)
                                            setShowInvoiceModal(true)
                                        }}
                                    >
                                        <i className="fi fi-sr-file-edit p-1"></i>
                                    </button>
                                    <button
                                        className='delete-btn p-1'
                                        onClick={() => {
                                            handleDeleteInvoice(invoice.id, invoice.invoiceNumber)
                                        }}
                                    >
                                        <i className="fi fi-sr-trash delete p-1"></i>
                                    </button>
                                    <button
                                        className='view-btn p-1'
                                        onClick={() => {
                                            handleShowDocumentModal(invoice);
                                        }}
                                    >
                                        <i className="fi fi-sr-eye view p-1"></i>
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {/* Edit PO Modal */}
            <Modal show={showEditModal} onHide={() => setShowEditModal(false)} dialogClassName='custom-modal w-50'>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Purchase Order</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {showEditModal && <EditPO selectedPO={selectedPO} closeModal={() => setShowEditModal(false)} />}
                </Modal.Body>
            </Modal>

            {/* Update Invoice Modal */}
            <Modal show={showInvoiceModal} onHide={handleShowInvoiceModalClose} dialogClassName='custom-modal'>
                <Modal.Header closeButton>
                    <Modal.Title>Update Invoice</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {showInvoiceModal &&
                        <UpdateInvoice
                            selectedInvoice={selectedInvoice}
                            selectedPO={selectedPO}
                            onInvoiceUpdated={handleInvoiceUpdate}
                            onInvoiceUpdateError={handleInvoiceUpdateError}
                            closeModal={handleShowInvoiceModalClose}
                        />
                    }
                </Modal.Body>
            </Modal>

            {/* View Invoice Document Modal */}
            <Modal show={showDocumentModal} onHide={() => setShowDocumentModal(false)} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>View Invoice Document</Modal.Title>
                    {/* Download Invoice Button */}
                    {
                        selectedInvoice && selectedInvoice.fileUrl ? (
                            <a href={selectedInvoice.fileUrl} download>
                                <button className='download-btn ms-2 p-2'>
                                    <i className="fi fi-sr-download download"></i>  
                                </button>
                            </a>
                        ) : null
                    }
                </Modal.Header>
                <Modal.Body>
                {selectedInvoice && selectedInvoice.fileUrl ? (
                    <Document
                    file={selectedInvoice.fileUrl}
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
    )
}

export default ViewPO