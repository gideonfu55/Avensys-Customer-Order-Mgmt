import axios from 'axios';
import React, { useEffect, useState } from 'react'
import './History.css'
import { Modal } from 'react-bootstrap';
import Button from 'react-bootstrap/Button'

function History() {

  const [ history, setHistory ] = useState([]);
  const role = localStorage.getItem('role');
  const user = JSON.parse(localStorage.getItem('user'));

  // For notification modal:
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentNotification, setCurrentNotification] = useState(null);

  const handleNotificationClick = (notification) => {
    setCurrentNotification(notification);
    setIsModalOpen(true);
  };

  const handleMarkAsRead = () => {

    // Send the user ID in the request body
    axios.put(`http://localhost:8080/api/notification/${currentNotification.id}/read`, user)
      .then(() => {
        console.log(user.id)
        fetchHistory();  // Refresh the history after marking a notification as read
      })
      .catch(error => {
        console.error(`Error updating notification: ${error}`)
      });

    setIsModalOpen(false);
  };

  const deleteHistoryItem = (event, id) => {

    event.stopPropagation() // Prevents the notification from being clicked

    setHistory(history.filter((notification) => notification.id !== id))

    axios.delete(`http://localhost:8080/api/notification/${id}`)
      .then(response => {
        console.log(response)
      })
      .catch(error => {
        console.error(`Error deleting notification: ${error}`)
      })
  }

  function fetchHistory() {
    let userRole = 'all'

    if (role.toLowerCase() === 'sales') {
      userRole = 'Sales'
    }
    
    let url  = `http://localhost:8080/api/notification/${userRole}`

    axios
      .get(url)
      .then(response => {
        setHistory(response.data);
      })
      .catch(error => {
        console.error(`Error fetching notifications: ${error}`);
      });

  }

  // - To fetch notifications by role periodically (every 60s):
  useEffect(() => {
    fetchHistory();

    const intervalId = setInterval(() => {
      fetchHistory();
    }, 60000);

    // Clean up interval on component unmount
    return () => clearInterval(intervalId);
  });

  return (
    <div className="notification-container">
      <h5 className='mb-4'>{role} History</h5>
      {
        history.map((n) => (
          <div className='mt-3 d-flex align-items-center' style={{borderBottom:"1px solid black", fontWeight: n.readByUser.includes(user.id.toString()) ? "normal" : "bold"}} key={n.id} onClick={() => handleNotificationClick(n)}>
            <p className='notification-item'>{n.message}</p>
            <p className='text-muted'>{n.date}</p>
            <button className='delete-btn p-1' onClick={(event) => deleteHistoryItem(event, n.id)}>
              <i class="fi fi-sr-trash delete"></i>
            </button>
          </div>
        ))
      }

      {/* Modal for message */}
      <Modal show={isModalOpen} onHide={() => setIsModalOpen(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Notification</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {currentNotification && currentNotification.message}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setIsModalOpen(false)}>Close</Button>
          {
            currentNotification && (
              <Button variant="primary" onClick={handleMarkAsRead}>Mark as read</Button>
            )
          }
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default History