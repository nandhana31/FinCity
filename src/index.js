import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css'; // Keep for potential global styles

// Optional: MUI CSS Baseline for consistent styling
import CssBaseline from '@mui/material/CssBaseline';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <CssBaseline /> {/* Adds basic CSS resets */}
    <App />
  </React.StrictMode>
);