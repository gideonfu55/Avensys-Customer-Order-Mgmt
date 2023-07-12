import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import './CreatePO.css'

function CreatePO(props) {

  const username = localStorage.getItem('username');
  const role = localStorage.getItem('role');

  const [poNumber, setPONumber] = useState('');

  // For document uploads:
  const [file, setFile] = useState(null);
  const fileInput = useRef();

  // For PO validation:
  const [poNumberError, setPONumberError] = useState(null);
  const [fileError, setFileError] = useState(null);
  const [allFieldsFilled, setAllFieldsFilled] = useState(false);
  const [errors, setErrors] = useState({});

  // For form data and submission:
  const [poData, setPoData] = useState({
    poNumber: '',
    prjNumber: '',
    clientName: '',
    startDate: '',
    endDate: '',
    totalValue: '',
    balValue: '',
    milestone: '',
    type: '',
    status: 'Ongoing'
  })

  // Check if PO Number already exists in the DB:
  useEffect(() => {
    const validatePONumber = async () => {
      if (poNumber) {
        try {
          const response = await axios.get(`http://localhost:8080/api/po/checkPoNum/${poNumber}`);
          if (response.data) {
            setPONumberError('Purchase order number already exists');
          } else {
            setPONumberError(null);
          }
        } catch (error) {
          console.error('Error checking PO number:', error);
        }
      } else {
        setPONumberError(null);
      }
    };

    validatePONumber();
  }, [poNumber]);

  // Handle form changes to update poData and validation errors:
  const handleChange = (event) => {

    const { name, value } = event.target;

    if (name === 'poNumber') {
      setPONumber(value);
      setPoData((prevState) => ({ ...prevState, poNumber: value }));
      return;
    }

    // Handle other fields
    setPoData((prevState) => ({ ...prevState, [name]: value }));
  };

  const generateRandomProjectNumber = () => {
    //const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    //const digits = '0123456789';
    const combine = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  
    let projectNumber = '';
    
    for (let i = 0; i < 8; i++) {
      projectNumber += combine.charAt(Math.floor(Math.random() * combine.length));
    }
    
    // for (let i = 0; i < 4; i++) {
    //   projectNumber += letters.charAt(Math.floor(Math.random() * letters.length));
    // }
    
    // for (let i = 0; i < 2; i++) {
    //   projectNumber += digits.charAt(Math.floor(Math.random() * digits.length));
    // }
    
    return projectNumber;
  }

  const removeFile = () => {
    setFile(null);
    fileInput.current.value = null;
    // Set fileError state to an empty string when file is removed
    setFileError('');
  };

  // For checking if all fields are filled:
  useEffect(() => {
    let filled = true;

    // Check all fields in poData
    for (let key in poData) {
      if (key !== 'prjNumber' && (poData[key] === '' || poData[key] === null || poData[key] === undefined)) {
        filled = false;
        break;
      }
    }

    setAllFieldsFilled(filled);
  }, [poData]);

  // For other field validation:
  useEffect(() => {
    const newErrors = {};

    if (poData.milestone === '') {
      delete newErrors.milestone;
    } else if (poData.milestone < 0 || poData.milestone > 100) {
      newErrors.milestone = 'Milestone must be between 0 and 100';
    }

    if (poData.totalValue === '') {
      delete newErrors.totalValue;
    } else if (poData.totalValue <= 0) {
      newErrors.totalValue = 'Total value must be greater than 0';
    }

    if (poData.balValue === '') {
      delete newErrors.balValue;
    } else if (poData.balValue < 0 || poData.balValue > poData.totalValue) {
      newErrors.balValue = 'Balance value must be between 0 and total value';
    }

    if (poData.endDate === '') {
      delete newErrors.endDate;
    } else if (new Date(poData.endDate) <= new Date(poData.startDate)) {
      newErrors.endDate = 'End date must be after start date';
    }
    
    setErrors(newErrors);
  }, [poData]);

  const handleSubmit = (event) => {

    event.preventDefault();

    const createdAt = new Date().toISOString();
    const prjNumber = generateRandomProjectNumber();
    const newPO = { ...poData, prjNumber, createdAt };

    console.log(newPO);

    if (poNumberError) {
      return;
    }

    if (!file) {
      setFileError('Please select a PO to upload before submitting');
      return;
    }

    // Create and append all form data
    const formData = new FormData();

    for (let key in newPO) {
      formData.append(key, newPO[key]);
    }

    if (file) {
      formData.append('file', file);
    }

    // Send purchase order data to the backend
    axios
      .post('http://localhost:8080/api/po/create', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
      })
      .then((response) => {
        console.log('Purchase order created successfully:', response.data);
        props.onPoCreated(newPO.poNumber);
        
        // Reset the form
        setPoData({
          clientName: '',
          poNumber: '',
          startDate: '',
          endDate: '',
          totalValue: '',
          balValue: '',
          milestone: '',
          type: '',
          status: ''
        });
        setPONumber('');
        setFile(null);
        setPONumberError(null);

    // Format the date to be displayed in a notification:
    const formattedDate = new Date(createdAt).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });

    // After a successful PO creation by Sales, create a history item for Finance/Management:
    const notification = {
      message: `New PO ${poNumber} created by ${username} on ${formattedDate}`,
      userRole: role
    };

    console.log(role);

    // Post to Database:
    axios.post('http://localhost:8080/api/notification/create', notification)
      .then((response) => {
        console.log(response.data)
      })
      .catch((error) => {
        console.log('Error creating notification:', error);
      });

    // Close the modal after creating po successfully:
    props.closeModal();
    
  })
    .catch((error) => {
      console.error('Error creating purchase order:', error);
      props.onPoCreationError();
    });
  };


  return (
    <div className='po-container'>
      <form onSubmit={handleSubmit} encType="multipart/form-data" className='create-po-model'>
        <div>
          <label htmlFor="clientName">Client Name</label>
          <input
            type="text"
            id="clientName"
            name="clientName"
            value={poData.clientName}
            onChange={handleChange}
            placeholder='Enter Client Name'
            className='form-control'
          />
        </div>
        <div>
          <label htmlFor="poNumber">Purchase Order Number</label>
          <input
            type="text"
            id="poNumber"
            name="poNumber"
            value={poNumber}
            onChange={handleChange}
            placeholder='Enter Purchase Order Number'
            className={`form-control ${poNumberError ? 'is-invalid' : ''}`}
          />
          {
            poNumberError && 
            <div className="invalid-feedback">
              {poNumberError}
            </div>
          }
        </div>
        {/* <div className='visually-hidden'>
          <label htmlFor="prjNumber">Project Number</label>
          <input
            type="text"
            id="prjNumber"
            name="prjNumber"
            onChange={handleChange}
          />
        </div> */}
        <div>
          <label htmlFor="startDate">Start Date</label>
          <input
            type="date"
            id="startDate"
            name="startDate"
            value={poData.startDate}
            onChange={handleChange}
            placeholder='Enter Start Date'
            className='form-control'
          />
        </div>
        <div>
          <label htmlFor="endDate">End Date</label>
          <input
            type="date"
            id="endDate"
            name="endDate"
            value={poData.endDate}
            onChange={handleChange}
            className='form-control'
            placeholder='Enter End Date'
          />
          {errors.endDate && 
            <div className="text-danger">
              {errors.endDate}
            </div>
          }
        </div>
        <div>
          <label htmlFor="totalValue">Total Value</label>
          <input
            type="number"
            id="totalValue"
            name="totalValue"
            value={poData.totalValue}
            onChange={handleChange}
            className={'form-control'}
            placeholder='Enter Total Value'
          />
          {errors.totalValue && 
            <div className="text-danger">
              {errors.totalValue}
            </div>
          }
        </div>
        <div>
          <label htmlFor="balValue">Balance Value</label>
          <input
            type="number"
            id="balValue"
            name="balValue"
            value={poData.balValue}
            onChange={handleChange}
            className={'form-control'}
            placeholder='Enter Balance Value'
          />
          {errors.balValue && 
            <div className="text-danger">
              {errors.balValue}
            </div>
          }
        </div>
        <div>
          <label htmlFor="milestone">Milestone</label>
          <input
            type="number"
            id="milestone"
            name="milestone"
            value={poData.milestone}
            onChange={handleChange}
            className={'form-control'}
            placeholder='Enter Milestone'
          />
          {errors.milestone && 
            <div className="text-danger">
              {errors.milestone}
            </div>
          }
        </div>
        <div>
          <label htmlFor="type">Type</label>
          <select
            id="type"
            name="type"
            value={poData.type}
            onChange={handleChange}
            className='form-control'
          >
            <option value="" disabled>Select Type</option>
            <option value="Enterprise Service">Enterprise Service</option>
            <option value="Talent Service">Talent Service</option>
          </select>
        </div>
        <div>
          <label className='me-1' htmlFor="file">File</label>
          <input
            className='w-50'
            type="file"
            id="file"
            name="file"
            ref={fileInput}
            onChange={(event) => {
              setFile(event.target.files[0]);
              // Clear file error when a file is selected:
              setFileError('');
            }}
          />
          {file && (
            <button type="button" onClick={removeFile}>
              <i className="fi fi-ss-cross-circle"></i>
            </button>
          )}
          {fileError && 
            <div className='text-danger mt-1'>
              {fileError}
            </div>
          }
        </div>

        {/* <div>
          <label htmlFor="status">Status</label>
          <select
            id="status"
            name="status"
            value={poData.status}
            onChange={handleChange}
            className='form-control'
          >
            <option value="" disabled>Select Status</option>
            <option value="Approved">Approved</option>
            <option value="Not Approved">Not Approved</option>
            <option value="Outstanding">Outstanding</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div> */}
        
        <button 
          type="submit"
          className='btn btn-primary mt-1'
          disabled={
            !allFieldsFilled ||
            poNumberError ||
            fileError ||
            (errors && Object.keys(errors).length > 0)
          }
        >
          Create Purchase Order
        </button>
      </form>
    </div>
  );
}

export default CreatePO;
