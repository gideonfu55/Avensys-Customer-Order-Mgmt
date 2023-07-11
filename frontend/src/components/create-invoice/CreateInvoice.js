import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import './CreateInvoice.css';

function CreateInvoice({ selectedPO, closeModal, isTS, onInvUpdated }) {

  const username = localStorage.getItem('username');
  const role = localStorage.getItem('role');
  const [invoiceNumber, setInvoiceNumber] = useState('');

  const [invoiceData, setInvoiceData] = useState({
    purchaseOrderRef: '',
    invoiceNumber: '',
    amount: '',
    dateBilled: '',
    dueDate: '',
    status: '',
  });

  // For document uploads:
  const [file, setFile] = useState(null);
  const fileInput = useRef();

  // For form validation:
  const [invoiceNumberError, setInvoiceNumberError] = useState('');
  const [amountError, setAmountError] = useState('');
  const [dueDateError, setDueDateError] = useState('');
  const [fileError, setFileError] = useState('');
  const [allFieldsFilled, setAllFieldsFilled] = useState(false);

  useEffect(() => {
    if (selectedPO) {
      setInvoiceData((prevState) => ({
        ...prevState,
        purchaseOrderRef: selectedPO.poNumber,
      }));
    }
  }, [selectedPO]);

  // Check if invoice number already exists in DB:
  useEffect(() => {
    const validateInvoiceNumber = async () => {
      if (invoiceNumber) {
        try {
          const response = await axios.get(`http://localhost:8080/api/invoices/checkInvNum/${invoiceNumber}`);
          if (response.data) {
            setInvoiceNumberError('Invoice Number already exists.');
          } else {
            setInvoiceNumberError(null);
          }
        } catch (error) {
          console.error('Error checking invoice number:', error);
        }
      } else {
        setInvoiceNumberError(null);
      }
    };
    validateInvoiceNumber();
  }, [invoiceNumber]);

  const handleChange = (event) => {

    const { name, value } = event.target;

    if (name === 'invoiceNumber') {
      setInvoiceNumber(value);
      setInvoiceData((prevState) => ({ ...prevState, [name]: value }));
      return;
    }

    if (name === 'amount') {
      setAmountError('');
    } else if (name === 'dueDate') {
      setDueDateError('');
    }

    setInvoiceData((prevState) => ({ ...prevState, [name]: value }));
  };

  const removeFile = () => {
    setFile(null);
    fileInput.current.value = null;
    setFileError('');
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

    // Validations before submission can be made
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
      setDueDateError('Due Date cannot be before Date Billed.');
      hasErrors = true;
    } else {
      setDueDateError('');
    }

    if (!file) {
      setFileError('Please select an invoice to upload before submitting');
      hasErrors = true;
    } else {
      setFileError('');
    }

    if (hasErrors || invoiceNumberError) {
      return;
    }

    const createdAt = new Date().toISOString();
    const newInvoice = { ...invoiceData, createdAt };

    // Create a new form
    const formData = new FormData();

    // Append all values to the form
    for (let name in newInvoice) {
      formData.append(name, newInvoice[name]);
    }

    // Append the file to the form
    if (file) {
      formData.append('file', file);
    }

    axios
      .post('http://localhost:8080/api/invoices/create', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
      })
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
        setFile(null);  // Clear the file state
        setInvoiceNumberError('');
        setAmountError('');
        setDueDateError('');
        setFileError('');
        setAllFieldsFilled(false);

        // Create history item after invoice is created:
        const formattedDate = new Date().toLocaleDateString('en-GB');

        const notification = {
          message: `New Invoice ${newInvoice.invoiceNumber} created by ${username} on ${formattedDate}`,
          userRole: `${role}`
        };

        axios
          .post('http://localhost:8080/api/notification/create', notification)
          .then(response => {
            console.log('Notification created successfully')
          })
          .catch(error => {
            console.error(`Error creating notification: ${error}`)
          });

        closeModal();
      })
      .catch((error) => {
        console.error('Error creating invoice:', error);
      });

    if (newInvoice.status === "Paid" && selectedPO.balValue >= newInvoice.amount) {
      const updatedBalValue = selectedPO.balValue - newInvoice.amount;
      let updatedMilestone;
      let updatedStatus;

      if (isTS) {
        updatedMilestone = ((selectedPO.totalValue - updatedBalValue) / selectedPO.totalValue) * 100;
      }

      if (updatedBalValue === 0) {
        updatedStatus = "Completed"
      }

      const patchData = {
        balValue: updatedBalValue,
        milestone: updatedMilestone,
        status: updatedStatus
      };

      console.log(patchData)

      axios
        .patch(`http://localhost:8080/api/po/update/${selectedPO.id}`, patchData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          },
        })
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
            disabled
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
          {invoiceNumberError &&
            <div className="text-danger mt-0">
              {invoiceNumberError}
            </div>
          }
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
            className="form-control mb-0 pb-0"
          />
        </div>
        {dueDateError && <div className="text-danger m-0 p-0">{dueDateError}</div>}
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
          <label className='me-1' htmlFor="file">File</label>
          <input
            type="file"
            id="file"
            name="file"
            ref={fileInput}
            onChange={(event) => {
              setFile(event.target.files[0])
              setFileError('')
            }}
          />
          {file && (
            <button className='ms-2' type="button" onClick={removeFile}>
              <i className="fi fi-ss-cross-circle"></i>
            </button>
          )}
          {fileError && 
            <div className="text-danger mt-1">
              {fileError}
            </div>
          }
        </div>

        <button 
          type="submit" 
          className="btn btn-primary"
          disabled={
            !allFieldsFilled ||
            invoiceNumberError ||
            amountError ||
            dueDateError ||
            fileError
          }
        >
          Create Invoice
        </button>
      </form>
    </div>
  );
}

export default CreateInvoice;
