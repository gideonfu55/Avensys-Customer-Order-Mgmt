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
  const [totalValueError, setTotalValueError] = useState(null);
  const [balValueError, setBalValueError] = useState(null);
  const [milestoneError, setMilestoneError] = useState(null);

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

  useEffect(() => {
    const validatePONumber = async () => {
      if (poNumber) {
        try {
          const response = await axios.get(`http://localhost:8080/api/po/check/${poNumber}`);
  
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

  const handleChange = (event) => {

    const { name, value } = event.target;

    if (name === 'poNumber') {
      setPONumber(value);
      return;
    }

    if (name === 'milestone') {
      if (value >= 0 && value <= 100) {
        setPoData((prevState) => ({ ...prevState, milestone: value }));
        setMilestoneError(null);
      } else {
        setMilestoneError('Milestone must be a number between 0 and 100');
      }
      return;
    }

    if (name === 'totalValue' || name === 'balValue') {
      if (value >= 0) {
        setPoData((prevState) => ({ ...prevState, [name]: value }));
        name === 'totalValue' ? setTotalValueError(null) : setBalValueError(null);
      } else {
        name === 'totalValue' ? setTotalValueError('Total value must be a positive number') : setBalValueError('Balance value must be a positive number');
      }
      return;
    }

    // Handle other fields
    setPoData((prevState) => ({ ...prevState, [name]: value }));
  };

  const handlePONumberChange = (event) => {
    setPONumber(event.target.value);
    setPONumberError(null);
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
  };

  const handleSubmit = (event) => {

    event.preventDefault();

    const createdAt = new Date().toISOString();
    const prjNumber = generateRandomProjectNumber();

    if (poNumberError) {
      return;
    }

    // Form data
    const formData = new FormData();
    formData.append('poNumber', poNumber);
    formData.append('prjNumber', prjNumber);
    formData.append('clientName', poData.clientName);
    formData.append('startDate', poData.startDate);
    formData.append('endDate', poData.endDate);
    formData.append('totalValue', poData.totalValue);
    formData.append('balValue', poData.balValue);
    formData.append('milestone', poData.milestone);
    formData.append('type', poData.type);
    formData.append('status', poData.status);
    formData.append('createdAt', createdAt);
    formData.append('file', file);

    // Send purchase order data to the backend
    axios
      .post('http://localhost:8080/api/po/create', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
      })
      .then((response) => {
        console.log('Purchase order created successfully:', response.data);
        props.onPoCreated(poData.poNumber);
        
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
    <div>
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
            onChange={handlePONumberChange}
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
        </div>
        <div>
          <label htmlFor="totalValue">Total Value</label>
          <input
            type="number"
            id="totalValue"
            name="totalValue"
            value={poData.totalValue}
            onChange={handleChange}
            className={`form-control ${totalValueError ? 'is-invalid' : ''}`}
            placeholder='Enter Total Value'
          />
          {
            totalValueError &&
            <div className="invalid-feedback">
              {totalValueError}
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
            className={`form-control ${balValueError ? 'is-invalid' : ''}`}
            placeholder='Enter Balance Value'
          />
          {
            balValueError &&
            <div className="invalid-feedback">
              {balValueError}
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
            className={`form-control ${milestoneError ? 'is-invalid' : ''}`}
            placeholder='Enter Milestone'
          />
          {
            milestoneError &&
            <div className="invalid-feedback">
              {milestoneError}
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
            {/* <option value="Professional Service">Professional Service</option> */}
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
            onChange={(event) => setFile(event.target.files[0])}
          />
          {file && (
            <button type="button" onClick={removeFile}>
              <i class="fi fi-ss-cross-circle"></i>
            </button>
          )}
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
          className='btn btn-primary'
          disabled={ totalValueError || balValueError || milestoneError || poNumberError }
        >
          Create Purchase Order
        </button>
      </form>
    </div>
  );
}

export default CreatePO;
