import axios from 'axios';
import React, { useEffect, useState } from 'react'

function FinanceNotification() {

  const [ notifications, setNotifications ] = useState([]);

  const deleteNotification = (id) => {
    setNotifications(notifications.filter((notification) => notification.id !== id))
  }

  useEffect(() => {
    axios
      .get("http://localhost:8080/api/finance/notification/all")
      .then(response => {
        setNotifications(response.data);
      })
      .catch(error => {
        console.error(`Error fetching notifications: ${error}`);
      });
  }, []);

  return (
    <div className="notification-container">
      {notifications.map((n) => (
        <div key={n.id}>
          <p>{n.text}</p>
          <button onClick={() => deleteNotification(n.id)}>Dismiss</button>
        </div>
      ))}
    </div>
  );
}

export default FinanceNotification