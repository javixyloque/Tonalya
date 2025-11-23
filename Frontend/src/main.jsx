import {  StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import 'bootstrap/dist/css/bootstrap.min.css';

// COMPONENTE QUE RENDERIZA LA APLICACIÓN (EL COMPONENTE PRINCIPAL)
createRoot(document.getElementById('root')).render(

    <StrictMode>    
        <App />
    </StrictMode>
    
);

