// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom'; // Importar el BrowserRouter
import { ThemeProvider } from './context/ThemeContext.jsx'; // Importar ThemeProvider
import { SpeedInsights } from '@vercel/speed-insights/react'; // Importar SpeedInsights
import App from './App.jsx';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* 2. Envolver la aplicación con el Proveedor */}
    <ThemeProvider>
      <BrowserRouter>
        <App />
        <SpeedInsights />
      </BrowserRouter>
    </ThemeProvider>
  </React.StrictMode>,
);