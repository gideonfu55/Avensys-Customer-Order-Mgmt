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
        <ul className='wrapper'>
          <div className='nav-group'>
            <div>
              <Link to='/dashboard' class="nav-item">
                <i className="fi fi-sr-house-chimney"></i>
                <span>Dashboard</span>
              </Link>
            </div>
            {user.role === 'Admin' || user.role === 'Management'
              ? (<div>
                <Link to='/adminpanel' class="nav-item">
                  <i className="fi fi-sr-user"></i>
                  <span>Admin Panel</span>
                </Link>
              </div>)
              : (null)
            }
            <div class="nav-item">
              <i className="fi fi-br-stats"></i>
              <span>Insights</span>
            </div>
            <div class="nav-item">
              <i className="fi fi-sr-settings"></i>
              <span>Settings</span>
            </div>
          </div>
          <div className='nav-group divider'>
            <div class="nav-item" onClick={handleLogout}>
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
