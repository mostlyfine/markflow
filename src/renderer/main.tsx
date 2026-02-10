import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles/default.css';

console.log('🚀 React app starting');

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
