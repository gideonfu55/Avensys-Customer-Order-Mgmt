import React, { useEffect, useState } from 'react'
import { Modal } from 'react-bootstrap';
import './ViewPO.css'
import axios from 'axios';
import UpdateInvoice from './UpdateInvoice';

function ViewPO({ selectedPO }) {

    const [invoices, setInvoices] = useState([]);
    const [selectedInvoice, setSelectedInvoice] = useState(null);
    const [showInvoiceModal, setShowInvoiceModal] = useState(false);

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

    function handleShowInvoiceModalClose() {
        setShowInvoiceModal(false);
    }

    return (
        <div className='modal-fade'>
            {/* Current PO */}
            <div>
                <table className='table table-light table-hover'>
                    <thead>
                        <tr>
                            <th scope="col">PO #</th>
                            <th scope="col">Client</th>
                            <th scope="col">Type</th>
                            <th scope="col">Start Date</th>
                            <th scope="col">End Date</th>
                            <th scope="col">Milestone (%)</th>
                            <th scope="col">Total Value</th>
                            <th scope="col">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>1</td>
                            <td>Avensys Consulting</td>
                            <td>Enterprise Service</td>
                            <td>01-01-2023</td>
                            <td>01-02-2024</td>
                            <td>60%</td>
                            <td>$200,000</td>
                            <td>Outstanding</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            {/* All Invoices */}
            <div>
                <h5>Invoices</h5>
                <table className='table table-light table-hover'>
                    <thead>
                        <tr>
                            <th scope="col">Invoice #</th>
                            <th scope="col">PO Number Ref</th>
                            <th scope="col">Amount</th>
                            <th scope="col">Date Billed</th>
                            <th scope="col">Due Date</th>
                            <th scope="col">Status</th>
                            <th scope='col'></th>
                        </tr>
                    </thead>
                    <tbody>
                        {invoices.map((invoice) => (
                            <tr key={invoice.id}>
                                <td>{invoice.invoiceNumber}</td>
                                <td>{invoice.purchaseOrderRef}</td>
                                <td>{invoice.amount}</td>
                                <td>{invoice.dateBilled}</td>
                                <td>{invoice.dueDate}</td>
                                <td>{invoice.status}</td>
                                <td>
                                    <button
                                        type='button'
                                        className='btn btn-dark'
                                        onClick={() => {
                                            setSelectedInvoice(invoice)
                                            setShowInvoiceModal(true)
                                        }}
                                    >
                                        Update Invoice
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {/* Update Invoice Modal */}
            <Modal show={showInvoiceModal} onHide={handleShowInvoiceModalClose} dialogClassName='custom-modal'>
                <Modal.Header closeButton>
                    <Modal.Title>Update Invoice</Modal.Title>
                </Modal.Header>
                <Modal.Body>{showInvoiceModal && <UpdateInvoice selectedInvoice={selectedInvoice} closeModal={handleShowInvoiceModalClose} />}</Modal.Body>
            </Modal>
            <div>
            </div>
        </div>
    )
}

export default ViewPO