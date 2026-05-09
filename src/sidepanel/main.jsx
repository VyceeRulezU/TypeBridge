import React from 'react';
import ReactDOM from 'react-dom/client';
import ErrorBoundary from './components/ErrorBoundary.jsx';
import SidePanel from './SidePanel.jsx';
import '../styles/reset.css';
import '../styles/tokens.css';
import '../styles/global.css';

const rootElement = document.getElementById('root');
if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <ErrorBoundary>
        <SidePanel />
      </ErrorBoundary>
    </React.StrictMode>
  );
}
