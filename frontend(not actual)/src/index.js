import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import App from './App';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Provider } from "react-redux"
import { socialAppStore } from "./components/redux.js"


ReactDOM.render(
  <React.StrictMode>
    <Router>
    <Provider store={socialAppStore}>
      <App />
    </Provider>
    </Router>
  </React.StrictMode>,
  document.getElementById('root')
);