import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

function EditPO({ selectedPO, closeModal, onPoUpdated, onPoUpdateError }) {

  const username = localStorage.getItem('username');
  const role = localStorage.getItem('role');

  const [poData, setPOData] = useState(selectedPO);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPOData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .patch(`http://localhost:8080/api/po/update/${poData.id}`, poData)
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
    <form onSubmit={handleSubmit}>
      <div className='form-group'>
        <label htmlFor='poNumber'>PO Number</label>
        <input
          type='text'
          className='form-control'
          id='poNumber'
          name='poNumber'
          value={poData.poNumber}
          onChange={handleChange}
          required
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
      <button type='submit' className='btn btn-primary'>
        Save
      </button>
    </form>
  );
}

export default EditPO;
