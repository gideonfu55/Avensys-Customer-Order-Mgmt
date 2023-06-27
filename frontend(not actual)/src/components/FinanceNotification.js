import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { ToastContainer, toast } from 'react-toastify';
import './FinanceNotification.css'

function FinanceNotification() {

  const [ notifications, setNotifications ] = useState([]);

  const deleteNotification = (id) => {
    setNotifications(notifications.filter((notification) => notification.id !== id))
    axios.delete(`http://localhost:8080/api/finance/notification/${id}`)
      .then(response => {
        console.log(response)
        toast.success('Notification deleted successfully')
      })
      .catch(error => {
        console.error(`Error deleting notification: ${error}`)
        toast.error('Error deleting notification')
      })
  }

  function fetchNotifications() {
    axios
      .get("http://localhost:8080/api/finance/notification/all/Finance")
      .then(response => {
        setNotifications(response.data);
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
        setNotifications(response.data);
      })
      .catch(error => {
        console.error(`Error fetching notifications: ${error}`);
      });
  }, []);

  // - To fetch Finance notifications periodically (every 10s):
  useEffect(() => {
    fetchNotifications();

    const intervalId = setInterval(() => {
      fetchNotifications();
    }, 10000);

    // Clean up interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="notification-container">
      <ToastContainer/>
      <h5 className='mb-4'>Finance Notifications</h5>
      {notifications.map((n) => (
        <div key={n.id}>
          <p>{n.message}</p>
        </div>
      ))}
    </div>
  );
}

export default FinanceNotification