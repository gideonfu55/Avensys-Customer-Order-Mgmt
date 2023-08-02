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
    if (loggedUser) {
      setUser(loggedUser);
    }
  }, [location]);

  return (
    location.pathname !== '/login' && location.pathname !== '/register' && user && (
      <nav className='navbar'>
        <span className='oms-logo align-self-center'><span style={{ 'color': '#000000' }}>O</span>MS</span>
        <hr/>
        <div className='side-nav'>
          <Link to='/' style={{ textDecoration: 'none' }}>
            <div className='p-2'>
              <i class="fi fi-sr-apps"></i>
              <span>Dashboard</span>
            </div>
          </Link>

          <Link style={{ textDecoration: 'none' }}>
            <div className='p-2'>
              <i class="fi fi-sr-head-side-thinking"></i>
              <span>Purchase Orders</span>
            </div>
          </Link>

          <Link style={{ textDecoration: 'none' }}>
            <div className='p-2'>
              <i class="fi fi-sr-users-alt"></i>
              <span>PO Types</span>
            </div>
          </Link>

          <Link style={{ textDecoration: 'none' }}>
            <div className='p-2'>
              <i class="fi fi-br-chat-arrow-grow"></i>
              <span>Reports</span>
            </div>
          </Link>

          <Link style={{ textDecoration: 'none' }}>
            <div className='p-2'>
              <i class="fi fi-sr-user"></i>
              <span>Users</span>
            </div>
          </Link>

          <hr />

          <Link style={{ textDecoration: 'none' }}>
            <div className='p-2'>
              <i class="fi fi-sr-settings"></i>
              <span>Settings</span>
            </div>
          </Link>

          {user.role === 'Admin' | user.role === 'Management' ?
            (<Link to='/adminpanel' style={{ textDecoration: 'none' }}>
              <div className='p-2'>
                <i class="fi fi-sr-shield-check"></i>
                <span>Admin Panel</span>
              </div>
            </Link>) :
            (null)}

          <Link style={{ textDecoration: 'none' }}>
            <div className='p-2' onClick={handleLogout}>
              <i class="fi fi-br-sign-out-alt"></i>
              <span>Logout</span>
            </div>
          </Link>
        </div>

      </nav>

      // <div className='side-nav'>
      //   <ul className='wrapper'>
      //     <div className='nav-group'>
      //       <div>
      //         <Link to='/dashboard' className="nav-item">
      //           <i className="fi fi-sr-house-chimney"></i>
      //           <span>Dashboard</span>
      //         </Link>
      //       </div>
      //       {user.role === 'Admin' || user.role === 'Management'
      //         ? (<div>
      //           <Link to='/adminpanel' className="nav-item">
      //             <i className="fi fi-sr-user"></i>
      //             <span>Admin Panel</span>
      //           </Link>
      //         </div>)
      //         : (null)
      //       }
      //     </div>
      //     <div className='nav-group divider'>
      //       <div className="nav-item" onClick={handleLogout}>
      //         <i className="fi fi-br-sign-out-alt"></i>
      //         <span>Logout</span>
      //       </div>
      //     </div>
      //   </ul>
      // </div>
    )
  );
}

export default NavBar;
