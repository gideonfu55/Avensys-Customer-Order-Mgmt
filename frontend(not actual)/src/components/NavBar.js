import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
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
    setUser(loggedUser);
  }, [location]);

  return (
    location.pathname !== '/login' && location.pathname !== '/register' && user && (
      <div>
        <Navbar bg="dark" variant="dark" expand="lg" className="fixed-top">
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
        </Navbar>
        <div className="content" style={{ paddingTop: '90px' }}> {/* Apply padding to the top */}
          {/* Your page content here */}
        </div>
      </div>
    )
  );
}

export default NavBar;
