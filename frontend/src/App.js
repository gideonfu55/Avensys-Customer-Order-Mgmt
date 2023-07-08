import React, { useState, useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import Loading from './components/Loading'; 
import Login from './components/Login';
import Adminpanel from './components/Adminpanel';
import PageNotFound from './components/PageNotFound';
import Dashboard from './components/Dashboard';
import ES from './components/ES';
import PS from './components/PS';

function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const role = localStorage.getItem('role');
    if (role !== '') {
      setIsLoading(false);
    }
  }, []);

  const isAdmin = localStorage.getItem('role')?.toLowerCase() === 'management';

  return (
    <div className="App">
      {isLoading ? (
        <Loading /> 
      ) : (
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path='/ES' element={<ES/>} />
          <Route path='/PS' element={<PS/>} />
          {isAdmin ? (
            <Route path="/adminpanel" element={<Adminpanel />} />
          ) : null}
          <Route path="/*" element={<PageNotFound />} />
        </Routes>
      )}
    </div>
  );
}

export default App;
