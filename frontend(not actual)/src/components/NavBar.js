import React, { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Navbar, Nav, Image, Dropdown } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './NavBar.css';
import axios from 'axios';

function NavBar() {
  const location = useLocation();
  const [user, setUser] = useState(null);

  const handleLogout = async () => {
    window.location.href = '/login';
    await new Promise(resolve => setTimeout(resolve, 100)); 
    localStorage.removeItem('username');
    localStorage.removeItem('role');
    localStorage.removeItem('user');
  };
  

  useEffect(() => {

    const username = localStorage.getItem('username');

    const loggedUser = JSON.parse(localStorage.getItem('user'));
    if(loggedUser) {
      setUser(loggedUser);
    }
  }, [location]);

  return (
    location.pathname !== '/login' && location.pathname !== '/register' && user && (
      <div className='side-nav'>
        <ul className='wrapper'>
          <div className='nav-group'>
            <div>
              <Link to='/dashboard' className="nav-item">
                <i className="fi fi-sr-house-chimney"></i>
                <span>Dashboard</span>
              </Link>
            </div>
            {user.role === 'Admin' || user.role === 'Management'
              ? (<div>
                <Link to='/adminpanel' className="nav-item">
                  <i className="fi fi-sr-user"></i>
                  <span>Admin Panel</span>
                </Link>
              </div>)
              : (null)
            }
            {/* <div className="nav-item">
              <i className="fi fi-br-stats"></i>
              <span>Insights</span>
            </div>
            <div className="nav-item">
              <i className="fi fi-sr-settings"></i>
              <span>Settings</span>
            </div> */}
          </div>
          <div className='nav-group divider'>
            <div className="nav-item" onClick={handleLogout}>
              <i className="fi fi-br-sign-out-alt"></i>
              <span>Logout</span>
            </div>
          </div>
        </ul>
      </div>
    )
  );
}

export default NavBar;
