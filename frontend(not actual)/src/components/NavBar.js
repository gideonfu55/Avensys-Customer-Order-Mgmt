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
      <div>
        <div className='side-nav'>
          <table>
            <tbody>
              
              <tr className='nav-link'>
                <td>
                  <i className="fi fi-sr-house-chimney"></i>
                </td>
                <td>
                      <Link to='/dashboard' className='nav-bar-link'>
                          Dashboard
                      </Link>
                  </td>
              </tr>
              
              <tr className='nav-link'>
                <td><i className="fi fi-br-stats"></i></td>
                <td>Insights</td>
              </tr>
              <tr className='nav-link'>
                <td><i className="fi fi-sr-settings"></i></td>
                <td>Settings</td>
              </tr>
              {user.role === 'Admin' || user.role === 'Management' ?
                (<tr className='nav-link'>
                  <td>
                    <i className="fi fi-sr-user"></i>
                  </td>
                  <td>
                      <Link to='/adminpanel' className='nav-bar-link'>
                          Admin Control
                      </Link>
                  </td>
                </tr>) : null}

                <tr className='nav-link'>
                <td><i className="fi fi-br-sign-out-alt"></i></td>
                <td onClick={handleLogout}>Logout</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="content">
          {/* Apply padding to the top */}
          {/* Your page content here */}
        </div>
      </div>
    )
  );
}

export default NavBar;
