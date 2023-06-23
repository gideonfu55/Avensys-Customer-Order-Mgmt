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
              <Link to='/dashboard' className='nav-link'>
                <tr >
                  <td><i class="fi fi-sr-house-chimney"></i></td>
                  <td>Home</td>
                </tr>
              </Link>
              <tr className='nav-link'>
                <td><i class="fi fi-br-search"></i></td>
                <td>Search</td>
              </tr>
              <tr className='nav-link'>
                <td><i class="fi fi-br-stats"></i></td>
                <td>Insights</td>
              </tr>
              <tr className='nav-link'>
                <td><i class="fi fi-sr-settings"></i></td>
                <td>Settings</td>
              </tr>
              <tr className='nav-link'>
                <td><i class="fi fi-br-sign-out-alt"></i></td>
                <td onClick={handleLogout}>Logout</td>
              </tr>
              {user.role === 'Sales' || user.role === 'Finance' ?
                (<Link to='/adminpanel' className='nav-link'>
                  <tr>
                    <td><i class="fi fi-sr-user"></i></td>
                    <td>Admin Control</td>
                  </tr>
                </Link>) : null}
            </tbody>
          </table>
        </div>
        {/* <Navbar bg="dark" variant="dark" expand="lg" className="fixed-top">
          <Navbar.Brand className="navbar-brand" href="/Welcome">
            <Image src="/logo.png" className='navbar-logo' style={{ paddingLeft: '30px' }}/> TweGram
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav" className="justify-content-between">
            <Nav className="mr-auto">
              <Nav.Link href="/Explore">Explore</Nav.Link>
              <Nav.Link href="/Profile">Profile</Nav.Link>
              {user.role.toLowerCase() === 'admin' && <Nav.Link href="/Adminpanel">Admin Controls</Nav.Link>}
            </Nav>
            <Dropdown className="dropdown" style={{ paddingRight: '30px' }}>
              <Dropdown.Toggle variant="success" id="dropdown-basic" className='dropdown-toggle'>
                <Image src="/avatar.png" className="dropdown-toggle-img" alt="A" />
                <span>
                  {user.username}
                </span>
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item onClick={handleLogout}>Logout</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </Navbar.Collapse>
        </Navbar> */}
        <div className="content">
          {/* Apply padding to the top */}
          {/* Your page content here */}
        </div>
      </div>
    )
  );
}

export default NavBar;
