import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { ToastContainer, toast } from 'react-toastify';
import './History.css'

function History() {

  const [ history, setHistory ] = useState([]);
  const role = localStorage.getItem('role');

  const deleteHistoryItem = (id) => {
    setHistory(history.filter((notification) => notification.id !== id))
    axios.delete(`http://localhost:8080/api/finance/notification/${id}`)
      .then(response => {
        console.log(response)
      })
      .catch(error => {
        console.error(`Error deleting notification: ${error}`)
      })
  }

  function fetchHistory() {
    axios
      .get("http://localhost:8080/api/finance/notification/all/Finance")
      .then(response => {
        setHistory(response.data);
      })
      .catch(error => {
        console.error(`Error fetching notifications: ${error}`);
      });
  }

  // - Rendering all notifications for Finance:
  useEffect(() => {
    axios
      .get("http://localhost:8080/api/notification/all/Finance")
      .then(response => {
        setHistory(response.data);
      })
      .catch(error => {
        console.error(`Error fetching notifications: ${error}`);
      });
  }, []);

  // - To fetch Finance notifications periodically (every 10s):
  useEffect(() => {
    fetchHistory();

    const intervalId = setInterval(() => {
      fetchHistory();
    }, 60000);

    // Clean up interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="notification-container">
      <ToastContainer/>
      <h5 className='mb-4'>{role} History</h5>
      {role.toLowerCase() === 'sales'
        ? history.filter(n => !n.message.includes('update') && !n.message.includes('delete') && !n.message.includes('Invoice')).map((n) => (
          <div key={n.id}>
            <p>{n.message}</p>
          </div>
        ))
        : history.map((n) => (
          <div className='mt-3' style={{borderBottom:"1px solid black"}} key={n.id}>
            <p>{n.message}</p>
          </div>
        ))
      }
    </div>
  );
}

export default History