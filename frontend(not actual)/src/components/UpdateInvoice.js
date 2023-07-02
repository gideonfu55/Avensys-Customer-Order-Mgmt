import axios from 'axios';
import React, { useEffect, useState } from 'react';
import './CreateInvoice.css';

function UpdateInvoice({ selectedInvoice, closeModal, onInvoiceUpdated, onInvoiceUpdateError, selectedPO }) {

  const username = localStorage.getItem('username');
  const role = localStorage.getItem('role');

  const [invoiceData, setInvoiceData] = useState({
    invoiceNumber: '',
    amount: '',
    purchaseOrderRef: '',
    dateBilled: '',
    dueDate: '',
    status: ''
  });

  const [validationError, setValidationError] = useState('');

  useEffect(() => {
    if (selectedInvoice) {
      setInvoiceData({
        invoiceNumber: selectedInvoice.invoiceNumber,
        amount: selectedInvoice.amount,
        purchaseOrderRef: selectedInvoice.purchaseOrderRef,
        dateBilled: selectedInvoice.dateBilled,
        dueDate: selectedInvoice.dueDate,
        status: selectedInvoice.status
      });
    }

  }, [selectedInvoice]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setInvoiceData((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (parseFloat(invoiceData.amount) > selectedPO.balValue) {
      setValidationError('Amount cannot exceed the balance value of the selected purchase order.');
      return;
    }

    if (parseFloat(invoiceData.amount) > selectedPO.balValue) {
      setValidationError('Amount cannot exceed the balance value of the selected purchase order.');
      return;
    }

    axios
      .patch(`http://localhost:8080/api/invoices/update/${selectedInvoice.id}`, invoiceData)
      .then((response) => {
        onInvoiceUpdated(invoiceData, selectedInvoice.amount, selectedInvoice.status)
        setValidationError('');

        // Create notification after Invoice is updated:
        const notification = {
          message: `Invoice ${invoiceData.invoiceNumber} has been updated by ${username} on ${new Date().toLocaleDateString()}`,
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

        closeModal()
      })
      .catch((error) => {
        console.error('Error creating invoice:', error);
        onInvoiceUpdateError()
      });
  };

  return (
    <div className="invoice-container">
      <form onSubmit={handleSubmit} className="create-invoice-model">
        <div>
          <label htmlFor="invoiceNumber">Invoice Number</label>
          <input
            type="text"
            id="invoiceNumber"
            name="invoiceNumber"
            value={invoiceData.invoiceNumber}
            onChange={handleChange}
            className="form-control"
          />
        </div>
        <div>
          <label htmlFor="amount">Amount</label>
          <input
            type="number"
            id="amount"
            name="amount"
            value={invoiceData.amount}
            onChange={handleChange}
            placeholder="Enter Amount"
            placeholder="Enter Amount"
            className="form-control"
          />
          {validationError && <div className="text-danger">{validationError}</div>}
          {validationError && <div className="text-danger">{validationError}</div>}
        </div>
        <div>
          <label htmlFor="purchaseOrderRef">Purchase Order Reference</label>
          <input
            type="text"
            id="purchaseOrderRef"
            name="purchaseOrderRef"
            value={invoiceData.purchaseOrderRef}
            onChange={handleChange}
            className="form-control"
          />
        </div>

        <div>
          <label htmlFor="dateBilled">Date Billed</label>
          <input
            type="date"
            id="dateBilled"
            name="dateBilled"
            value={invoiceData.dateBilled}
            onChange={handleChange}
            className="form-control"
          />
        </div>

        <div>
          <label htmlFor="dueDate">Due Date</label>
          <input
            type="date"
            id="dueDate"
            name="dueDate"
            value={invoiceData.dueDate}
            onChange={handleChange}
            className="form-control"
          />
        </div>

        <div>
          <label htmlFor="status">Payment Status</label>
          <select
            id="status"
            name="status"
            value={invoiceData.status}
            onChange={handleChange}
            className="form-control"
          >
            <option value="" disabled>
              Select Status
            </option>
            <option value="Unpaid">Unpaid</option>
            <option value="Paid">Paid</option>
          </select>
        </div>

        <button type="submit" className="btn btn-primary">
          Update Invoice
        </button>
      </form>
    </div>
  );
}

export default UpdateInvoice;
