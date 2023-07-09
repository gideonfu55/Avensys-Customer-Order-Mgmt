import axios from 'axios';
import React, { useCallback, useEffect, useState } from 'react'
import './History.css'
import { Modal } from 'react-bootstrap';
import Button from 'react-bootstrap/Button'

function History() {

  const [history, setHistory] = useState([]);
  const role = localStorage.getItem('role');
  const user = JSON.parse(localStorage.getItem('user'));
  const [managementUserIDs, setManagementUserIDs] = useState([]); // For checking if a notification has been read by all management users

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
        
        // Also update the current notification locally
        setCurrentNotification(prev => (
          {
            ...prev, 
            readByUser: [...prev.readByUser, user.id.toString()]
          }
        ));
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

  const fetchHistory = useCallback(() => {
    let userRole = 'all'

    if (role.toLowerCase() === 'sales') {
      userRole = 'Sales'
    }

    let url = `http://localhost:8080/api/notification/${userRole}`

    axios
      .get(url)
      .then(response => {
        setHistory(response.data);
      })
      .catch(error => {
        console.error(`Error fetching notifications: ${error}`);
      });

  }, [role]);

  const fetchManagementUserIDs = useCallback(async() => {
    try {
      const { data: users } = await axios.get('http://localhost:8080/users');
      const managementUserIDs = users
        .filter(user => user.role.toLowerCase() === 'management')
        .map(user => user.id.toString());
      setManagementUserIDs(managementUserIDs);
    } catch (error) {
      console.error(`Error fetching management user IDs: ${error}`);
    }
  }, []); // No dependencies here, so the function is only created once.

  // - To fetch notifications by role when page loads:
  useEffect(() => {
    fetchHistory();
    fetchManagementUserIDs();
  }, [fetchHistory, fetchManagementUserIDs]); // fetchHistory is now memoized and won't cause the useEffect to trigger unless its dependencies change


  return (
    <div className="notification-container">
      <h5 className='mb-4'>{role} History</h5>
      {
        history.map((n) => (
          <div
            className='history-card' 
            style={{fontWeight: n.readByUser.includes(user.id.toString()) ? "normal" : "bold"}} 
            key={n.id}
            onClick={() => handleNotificationClick(n)}
          >
            <p className='m-0 notification-item'>{n.message}</p>

          {
            // Conditional rendering only for management role if all management users have read the notification:
            role.toLowerCase() === 'management' &&
            managementUserIDs.every(id => n.readByUser.includes(id)) && (
              <button className='btn' onClick={(event) => deleteHistoryItem(event, n.id)}>
                <i className="fi fi-rr-cross-small"></i>
              </button>
            )
          }
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
            currentNotification && 
            !currentNotification.readByUser.includes(user.id.toString()) && 
            (
              <Button variant="primary" onClick={handleMarkAsRead}>Mark as read</Button>
            )
          }
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default History
