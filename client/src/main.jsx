import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from "react-router-dom";
import './index.css'
import App from './App.jsx'
import AuthContext from './context/AuthContext';
import { Toaster } from 'react-hot-toast';
import AllUserContext from './context/AllUserContext';

createRoot(document.getElementById('root')).render(
    <AllUserContext>
    <AuthContext>
    <BrowserRouter>
      <App />
      <Toaster position="top-right" reverseOrder={false} />
    </BrowserRouter>
    </AuthContext>
    </AllUserContext>
)