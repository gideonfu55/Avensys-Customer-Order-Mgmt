import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './CreateInvoice.css';

function CreateInvoicePS({ selectedPO, closeModal, onInvUpdated }) {
  const [invoiceData, setInvoiceData] = useState({
    purchaseOrderRef: '',
    invoiceNumber: '',
    amount: '',
    dateBilled: '',
    dueDate: '',
    status: '',
  });

  useEffect(() => {
    if (selectedPO) {
      setInvoiceData((prevState) => ({
        ...prevState,
        purchaseOrderRef: selectedPO.poNumber,
      }));
    }
  }, [selectedPO]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setInvoiceData((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const createdAt = new Date().toISOString();
    const newInvoice = { ...invoiceData, createdAt };

    axios
      .post('http://localhost:8080/api/invoices/create', newInvoice)
      .then((response) => {
        onInvUpdated(newInvoice.invoiceNumber)
        console.log('New invoice created successfully: ', response.data);
        setInvoiceData({
          purchaseOrderRef: '',
          invoiceNumber: '',
          amount: '',
          dateBilled: '',
          dueDate: '',
          status: '',
        });
        closeModal();
      })
      .catch((error) => {
        console.error('Error creating invoice:', error);
      });

    if (newInvoice.status === "Paid") {
      const updatedBalValue = selectedPO.balValue - newInvoice.amount;

      const startDate = new Date(selectedPO.startDate);
      const endDate = new Date(selectedPO.endDate)
      const numberOfYears = endDate.getFullYear() - startDate.getFullYear();
      const numberOfMonths = numberOfYears * 12 + (endDate.getMonth() - startDate.getMonth());

      const percentageIncrement = 100 / numberOfMonths;
      const milestoneAsNumber = parseInt(selectedPO.milestone, 10);
      const updatedMilestone = (milestoneAsNumber + percentageIncrement).toFixed(2).toString();

      const patchData = {
        balValue: updatedBalValue,
        milestone: updatedMilestone
      };

      axios
        .patch(`http://localhost:8080/api/po/update/${selectedPO.id}`, patchData)
        .then((response) => {
          console.log('Purchase order updated successfully:', response.data);

          closeModal();
        })
        .catch((error) => {
          console.error('Error updating purchase order:', error);
        });

    }
  };

  return (
    <div className="invoice-container">
      <form onSubmit={handleSubmit} className="create-invoice-model">
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
          Create Invoice
        </button>
      </form>
    </div>
  );
}

export default CreateInvoicePS;
