// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom'; // Importar el BrowserRouter
import { ThemeProvider } from './context/ThemeContext.jsx'; // Importar ThemeProvider
import { AuthProvider } from './context/AuthContext.jsx'; // Importar AuthProvider
import { GoogleOAuthProvider } from '@react-oauth/google'; // Importar Google Auth
import { SpeedInsights } from '@vercel/speed-insights/react'; // Importar SpeedInsights
import App from './App.jsx';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID || 'ID_PENDIENTE'}>
      <ThemeProvider>
        <AuthProvider>
        <BrowserRouter>
          <App />
          <SpeedInsights />
        </BrowserRouter>
        </AuthProvider>
      </ThemeProvider>
    </GoogleOAuthProvider>
  </React.StrictMode>,
);