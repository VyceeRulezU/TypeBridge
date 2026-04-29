import React from 'react';
import ReactDOM from 'react-dom/client';
import SidePanel from './SidePanel.jsx';
import '../styles/reset.css';
import '../styles/tokens.css';
import '../styles/global.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <SidePanel />
  </React.StrictMode>
);
