import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { faArrowAltCircleLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

function PageNotFound() {
  const [isBlinking, setIsBlinking] = useState(true);

  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setIsBlinking((prevIsBlinking) => !prevIsBlinking);
    }, 500);

    return () => {
      clearInterval(blinkInterval);
    };
  }, []);

  return (
    <div style={styles.container}>
      <div style={styles.iconContainer}>
        <span style={styles.iconPlaceholder}></span>
        {isBlinking && <span style={styles.icon}>❌</span>}
      </div>
      <h2 style={styles.title}>PAGE NOT FOUND</h2>
      <p style={styles.message}>Oops! The page you are looking for does not exist.</p>
      <Link to="/welcome" style={styles.button}>
        <FontAwesomeIcon icon={faArrowAltCircleLeft} style={styles.buttonIcon} />
        Go to Welcome Page
      </Link>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    backgroundColor: '#f8f8f8',
  },
  iconContainer: {
    position: 'relative',
    marginBottom: '16px',
  },
  iconPlaceholder: {
    display: 'inline-block',
    width: '32px', // Adjust the width as needed
  },
  icon: {
    position: 'absolute',
    top: -190,
    left: -75,
    fontSize: '164px',
    color: 'red',
    animation: 'blink 1s infinite',
  },
  title: {
    fontSize: '36px',
    fontWeight: 'bold',
    color: '#333',
    marginBottom: '16px',
  },
  message: {
    fontSize: '18px',
    color: '#666',
    marginBottom: '24px',
  },
  button: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '12px 24px',
    borderRadius: '4px',
    backgroundColor: '#007bff',
    color: '#fff',
    textDecoration: 'none',
    fontSize: '16px',
    fontWeight: 'bold',
    transition: 'background-color 0.3s ease',
    border: 'none',
    outline: 'none',
    cursor: 'pointer',
    position: 'relative',
  },
  buttonIcon: {
    marginRight: '8px',
  },
  '@keyframes blink': {
    '0%': { opacity: 0 },
    '50%': { opacity: 1 },
    '100%': { opacity: 0 },
  },
};

export default PageNotFound;
