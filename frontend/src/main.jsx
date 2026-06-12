import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import App from './App.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#18181b',
              color: '#f4f4f5',
              border: '1px solid #3f3f46',
              fontFamily: 'DM Sans, sans-serif',
              fontSize: '14px',
              borderRadius: '12px',
            },
            success: {
              iconTheme: { primary: '#22a265', secondary: '#f4f4f5' },
            },
            error: {
              iconTheme: { primary: '#dc2626', secondary: '#f4f4f5' },
            },
          }}
        />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
