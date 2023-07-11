import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import './UpdateInvoice.css';

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

  // For updating and uploading a new invoice:
  const [file, setFile] = useState(null);
  const fileInput = useRef();

  // For form validation:
  const [amountError, setAmountError] = useState('');
  const [dueDateError, setDueDateError] = useState('');
  const [fileError, setFileError] = useState('');
  const [allFieldsFilled, setAllFieldsFilled] = useState(false);

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

    if (name === 'amount') {
      setAmountError('');
    } else if (name === 'dueDate') {
      setDueDateError('');
    }

    setInvoiceData((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const removeFile = () => {
    setFile(null);
    fileInput.current.value = null;
  };

  // For checking if all fields are filled:
  useEffect(() => {
    let filled = true;

    // Check all fields in poData
    for (let key in invoiceData) {
      if (invoiceData[key] === '' || invoiceData[key] === null || invoiceData[key] === undefined) {
        filled = false;
        break;
      }
    }

    setAllFieldsFilled(filled);
  }, [invoiceData]);

  const handleSubmit = (event) => {
    event.preventDefault();

    // Validations before submitting:
    let hasErrors = false;

    if (parseFloat(invoiceData.amount) > selectedPO.balValue) {
      setAmountError('Amount cannot exceed the balance value of the selected purchase order.');
      hasErrors = true;
    } else if (parseFloat(invoiceData.amount) <= 0) {
      setAmountError('Amount must be greater than 0.');
      hasErrors = true;
    } else if (!Number.isFinite(parseFloat(invoiceData.amount))) {
      setAmountError('Amount must be a number.');
      hasErrors = true;
    } else {
      setAmountError('');
    }

    if (new Date(invoiceData.dueDate) < new Date(invoiceData.dateBilled)) {
      setDueDateError('Due date cannot be earlier than date billed.');
      hasErrors = true;
    }

    if (hasErrors) {
      return;
    }

    const formData = new FormData();

    for (let key in invoiceData) {
      formData.append(key, invoiceData[key]);
    }

    if (file) {
      formData.append('file', file);
    }

    axios
      .patch(`http://localhost:8080/api/invoices/update/${selectedInvoice.id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      .then((response) => {
        onInvoiceUpdated(invoiceData, selectedInvoice.amount, selectedInvoice.status)
        setFile(null);
        setAmountError('');
        setDueDateError('');
        setFileError('');
        setAllFieldsFilled(false);

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
    <div className="update-invoice-container">
      <form onSubmit={handleSubmit} className="update-invoice-model">
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
            className="form-control"
          />
          {amountError &&
            <div className="text-danger mt-0">{amountError}</div>
          }
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
            disabled
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
            className="form-control mb-0"
          />
          {dueDateError && 
            <div className="text-danger mt-0">{dueDateError}</div>
          }
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

        <div>
          <label htmlFor="file">New Invoice File</label>
          <input
            className="form-control-file ms-1"
            type="file"
            id="file"
            name="file"
            ref={fileInput}
            onChange={handleFileChange}
          />
          {file && (
            <button type="button" onClick={removeFile}>
              <i className="fi fi-ss-cross-circle"></i>
            </button>
          )}
        </div>

        <button type="submit" className="btn btn-primary">
          Update Invoice
        </button>
      </form>
    </div>
  );
}

export default UpdateInvoice;
