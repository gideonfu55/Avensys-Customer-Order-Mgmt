import axios from 'axios';
import React, { useEffect, useState } from 'react';
import './CreateInvoice.css';

function UpdateInvoice({ selectedInvoice }) {
  const [invoiceData, setInvoiceData] = useState({
    invoiceNumber: '',
    amount: '',
    purchaseOrderRef: '',
    dateBilled: '',
    dueDate: '',
    status: ''
  });

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
    const createdAt = new Date().toISOString();
    const newInvoice = { ...invoiceData, createdAt };

    // Submit invoice data to REST API:
    console.log(invoiceData);

    axios
      .post('http://localhost:8080/api/invoices/create', newInvoice)
      .then((response) => {
        console.log('New invoice created successfully: ', response.data);

        // Reset form data:
        setInvoiceData({
          invoiceNumber: '',
          amount: '',
          purchaseOrderRef: '',
        });
      })
      .catch((error) => {
        console.error('Error creating invoice:', error);
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
            placeholder="Enter Invoice Number"
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
        </div>
        <div>
          <label htmlFor="purchaseOrderRef">Purchase Order Reference</label>
          <input
            type="text"
            id="purchaseOrderRef"
            name="purchaseOrderRef"
            value={invoiceData.purchaseOrderRef}
            onChange={handleChange}
            placeholder="Enter Purchase Order Reference"
            className="form-control"
          />
        </div>

        <div>
          <label htmlFor="purchaseOrderRef">Date Billed</label>
          <input
            type="date"
            id="purchaseOrderRef"
            name="purchaseOrderRef"
            value={invoiceData.dateBilled}
            onChange={handleChange}
            placeholder="Enter Purchase Order Reference"
            className="form-control"
          />
        </div>

        <div>
          <label htmlFor="purchaseOrderRef">Due Date</label>
          <input
            type="date"
            id="purchaseOrderRef"
            name="purchaseOrderRef"
            value={invoiceData.dueDate}
            onChange={handleChange}
            placeholder="Enter Purchase Order Reference"
            className="form-control"
          />
        </div>

        <div>
          <label htmlFor="purchaseOrderRef">Status</label>
          <input
            type="text"
            id="purchaseOrderRef"
            name="purchaseOrderRef"
            value={invoiceData.status}
            onChange={handleChange}
            placeholder="Enter Purchase Order Reference"
            className="form-control"
          />
        </div>

        <button type="submit" className="btn btn-primary">
          Create Invoice
        </button>
      </form>
    </div>
  );
}

export default UpdateInvoice;
