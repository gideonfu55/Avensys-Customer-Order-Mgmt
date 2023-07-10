import React, { useState, useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import Loading from './components/loading-page/Loading';
import Login from './components/login/Login';
import Dashboard from './components/dashboard/Dashboard';
import Adminpanel from './components/admin-panel/Adminpanel';
import PageNotFound from './components/pagenotfound/PageNotFound';
import ES from './components/enterprise-service/ES';
import TS from './components/talent-service/TS';

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
          <Route path='/PS' element={<TS/>} />
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
