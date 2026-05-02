import React from 'react';
import ReactDOM from 'react-dom/client';
import SidePanel from './SidePanel.jsx';
import ErrorBoundary from './components/ErrorBoundary.jsx';
import '../styles/reset.css';
import '../styles/tokens.css';
import '../styles/global.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <SidePanel />
    </ErrorBoundary>
  </React.StrictMode>
);
