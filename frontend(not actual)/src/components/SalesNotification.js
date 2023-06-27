import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { ToastContainer, toast } from 'react-toastify';

function SalesNotification() {

  const [ notifications, setNotifications ] = useState([]);

  const deleteNotification = (id) => {
    setNotifications(notifications.filter((notification) => notification.id !== id))
    axios.delete(`http://localhost:8080/api/sales/notification/${id}`)
      .then(response => {
        console.log(response)
        toast.success('Notification deleted successfully')
      })
      .catch(error => {
        console.error(`Error deleting notification: ${error}`)
        toast.error('Error deleting notification')
      })
  }

  useEffect(() => {
    axios
      .get("http://localhost:8080/api/sales/notification/all/Sales")
      .then(response => {
        setNotifications(response.data);
      })
      .catch(error => {
        console.error(`Error fetching notifications: ${error}`);
      });
  }, []);

  return (
    <div className="notification-container">
      <ToastContainer/>
      <h2>Sales Notifications</h2>
      {notifications.map((n) => (
        <div key={n.id}>
          <p>{n.text}</p>
          <button onClick={() => deleteNotification(n.id)}>Dismiss</button>
        </div>
      ))}
    </div>
  );
}

export default SalesNotification