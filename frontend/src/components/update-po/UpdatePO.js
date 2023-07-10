import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import "./UpdatePO.css";

function UpdatePO({ selectedPO, closeModal, onPoUpdated, onPoUpdateError }) {

  const username = localStorage.getItem('username');
  const role = localStorage.getItem('role');

  const [poData, setPOData] = useState(selectedPO);

  // For updating and uploading a new PO:
  const [file, setFile] = useState(null);
  const fileInput = useRef();

  // For validation errors:
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPOData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const removeFile = () => {
    setFile(null);
    fileInput.current.value = null;
  };

  // For validation errors:
  useEffect(() => {

    const newErrors = {};

    if (poData.milestone < 0 || poData.milestone > 100) {
      newErrors.milestone = 'Milestone must be between 0 and 100';
    }

    if (poData.totalValue <= 0) {
      newErrors.totalValue = 'Total value must be greater than 0';
    }

    if (poData.balValue < 0 || poData.balValue > poData.totalValue) {
      newErrors.balValue = 'Balance value must be between 0 and total value';
    }

    setErrors(newErrors);

  }, [poData]);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Create formData and append form values:
    const formData = new FormData();
    
    for (let name in poData) {
      formData.append(name, poData[name]);
    }

    // Append file to formData:
    if (file) {
      formData.append('file', file);
    }

    axios
      .patch(`http://localhost:8080/api/po/update/${poData.id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      .then((response) => {
        onPoUpdated(poData.poNumber);

        // Create notification after PO is updated:
        const notification = {
          message: `PO ${poData.poNumber} has been updated by ${username} on ${new Date().toLocaleDateString()}`,
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

        closeModal();
      })
      .catch((error) => {
        console.error(error);
        onPoUpdateError();
      });
  };

  return (
    <form onSubmit={handleSubmit} className='update-po-model'>
      <div className='form-group'>
        <label htmlFor='poNumber'>PO Number</label>
        <input
          type='text'
          className='form-control'
          id='poNumber'
          name='poNumber'
          value={poData.poNumber}
          onChange={handleChange}
          disabled
        />
      </div>
      <div className='form-group'>
        <label htmlFor='clientName'>Client Name</label>
        <input
          type='text'
          className='form-control'
          id='clientName'
          name='clientName'
          value={poData.clientName}
          onChange={handleChange}
          required
        />
      </div>
      <div className='form-group'>
        <label htmlFor='startDate'>Start Date</label>
        <input
          type='date'
          className='form-control'
          id='startDate'
          name='startDate'
          value={poData.startDate}
          onChange={handleChange}
          required
        />
      </div>
      <div className='form-group'>
        <label htmlFor='endDate'>End Date</label>
        <input
          type='date'
          className='form-control'
          id='endDate'
          name='endDate'
          value={poData.endDate}
          onChange={handleChange}
          required
        />
      </div>
      <div className='form-group'>
        <label htmlFor='milestone'>Milestone (%)</label>
        <input
          type='number'
          className='form-control'
          id='milestone'
          name='milestone'
          value={poData.milestone}
          onChange={handleChange}
          required
        />
        {errors.milestone && <div className="text-danger">{errors.milestone}</div>}
      </div>
      <div className='form-group'>
        <label htmlFor='totalValue'>Total Value</label>
        <input
          type='number'
          className='form-control'
          id='totalValue'
          name='totalValue'
          value={poData.totalValue}
          onChange={handleChange}
          required
        />
        {errors.totalValue && <div className="text-danger">{errors.totalValue}</div>}
      </div>
      <div className='form-group'>
        <label htmlFor='balValue'>Balance Value</label>
        <input
          type='number'
          className='form-control'
          id='balValue'
          name='balValue'
          value={poData.balValue}
          onChange={handleChange}
          required
        />
        {errors.balValue && <div className="text-danger">{errors.balValue}</div>}
      </div>
      <div className='form-group'>
        <label htmlFor='status'>Status</label>
        <select
          className='form-control'
          id='status'
          name='status'
          value={poData.status}
          onChange={handleChange}
          required
        >
          <option value='Ongoing'>Ongoing</option>
          <option value='Completed'>Completed</option>
          <option value='Cancelled'>Cancelled</option>
        </select>
      </div>
      <div className='form-group'>
        <label htmlFor='file'>New PO File</label>
        <div className='d-flex'>
          <input
            className='form-control-file w-25'
            type='file'
            id='file'
            name='file'
            ref={fileInput}
            onChange={handleFileChange}
          />
          {file && (
            <button type="button" onClick={removeFile}>
              <i className="fi fi-ss-cross-circle"></i>
            </button>
          )}
        </div>
      </div>
      <button 
        type='submit' 
        className='btn btn-primary mt-2'
        disabled={ errors && Object.keys(errors).length > 0 }
      >
        Save
      </button>
    </form>
  );
}

export default UpdatePO;
