import React, { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Navbar, Nav, Image, Dropdown } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './NavBar.css';

function NavBar() {
  const location = useLocation();
  const [user, setUser] = useState(null);

  const handleLogout = () => {
    localStorage.removeItem('username');
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  useEffect(() => {
    const loggedUser = JSON.parse(localStorage.getItem('user'));
    console.log(loggedUser.role)
    setUser(loggedUser);
  }, [location]);

  return (
    location.pathname !== '/login' && location.pathname !== '/register' && user && (
      <div className='side-nav'>
        <ul className='nav flex-column'>
          <div className='nav-group'>
            <li>
              <Link to='/dashboard' class="nav-item">
                <i className="fi fi-sr-house-chimney"></i>
                <span>Dashboard</span>
              </Link>
            </li>
            {user.role === 'Admin' || user.role === 'Management'
              ? (<li>
                <Link to='/adminpanel' class="nav-item">
                  <i className="fi fi-sr-user"></i>
                  <span>Admin Panel</span>
                </Link>
              </li>)
              : (null)
            }
            <li class="nav-item">
              <i className="fi fi-br-stats"></i>
              <span>Notifications</span>
            </li>
            <li class="nav-item">
              <i className="fi fi-sr-settings"></i>
              <span>Settings</span>
            </li>
          </div>
          <div className='nav-group'>
            <li class="nav-item" onClick={handleLogout}>
              <i className="fi fi-br-sign-out-alt"></i>
              <span>Logout</span>
            </li>
          </div>
        </ul>
      </div>
    )
  );
}

export default NavBar;
