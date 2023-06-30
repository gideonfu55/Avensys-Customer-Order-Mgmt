import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './CreateUser.css'

function CreatePO(props) {

  const username = localStorage.getItem('username');
  const role = localStorage.getItem('role');

  const [poNumber, setPONumber] = useState('');
  const [poNumberError, setPONumberError] = useState(null);

  const [poData, setPoData] = useState({
    poNumber: '',
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
        setPONumberError(null);  // If the PO number is empty, clear the error
      }
    };
  
    validatePONumber();
  }, [poNumber]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    if (name === 'poNumber') {
      setPONumber(value);
    } else {
      setPoData((prevState) => ({ ...prevState, [name]: value }));
    }
  };

  const handlePONumberChange = (event) => {
    setPONumber(event.target.value);
    setPONumberError(null);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const createdAt = new Date().toISOString();
    const newPO = { ...poData, poNumber, createdAt };

    if (poNumberError) {
      return;
    }

    // Send purchase order data to the backend
    axios
      .post('http://localhost:8080/api/po/create', newPO)
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
        setPONumberError(null);

    // Format the date to be displayed in a notification:
    const formattedDate = new Date(newPO.createdAt).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });

    // After a successful PO creation by Sales, create a history item for Finance/Management:
    const notification = {
      message: `New PO ${newPO.poNumber} created by ${username} on ${formattedDate}`,
      userRole: `${role}`
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
      <form onSubmit={handleSubmit} className='create-user-model'>
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
            className='form-control'
            placeholder='Enter Total Value'
          />
        </div>
        <div>
          <label htmlFor="totalValue">Balance Value</label>
          <input
            type="number"
            id="balValue"
            name="balValue"
            value={poData.balValue}
            onChange={handleChange}
            className='form-control'
            placeholder='Enter Balance Value'
          />
        </div>
        <div>
          <label htmlFor="milestone">Milestone</label>
          <input
            type="number"
            id="milestone"
            name="milestone"
            value={poData.milestone}
            onChange={handleChange}
            className='form-control'
            placeholder='Enter Milestone'
          />
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
            <option value="Professional Service">Professional Service</option>
          </select>
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
        
        <button type="submit" className='btn btn-primary'>Create Purchase Order</button>
      </form>
    </div>
  );
}

export default CreatePO;
