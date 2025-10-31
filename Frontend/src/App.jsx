// import './App.css'
// import { useState, useEffect } from 'react';
import { Routes, BrowserRouter, Route } from 'react-router-dom';
import FormProfesor from './components/FormProfesor.jsx';
import Home from './Home.jsx';
import Profesores from './components/Profesores.jsx';
import Instrumentos from './components/Instrumentos.jsx';
import InstrumentosProfesor from './components/InstrumentosProfesor.jsx';
import Registrarse from './components/templates/Registrarse.jsx';
import CerrarSesion from './components/templates/CerrarSesion.jsx';
import FormUsuario from './components/FormUsuario.jsx';
import PerfilProfesor from './components/templates/PerfilProfesor.jsx';
// FONTAWESOME => ICONOS FAMILIAS INSTRUMENTOS
// <script type="module"> import react-bootstrap from https://cdn.jsdelivr.net/npm/react-bootstrap@2.10.10/+esm </script>
/**
 * Componente que renderiza las rutas de la aplicación
 * @returns Rutas de la aplicación que se renderizan en el navegador (archivos jsx)
 */
const App = () => {
    return (
        <>
        
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/registrarse" element={<Registrarse/>}></Route>
                <Route path="/formprofesor" element={<FormProfesor />} />
                <Route path="/profesores" element={<Profesores />} /> 
                <Route path="/instrumentos" element={<Instrumentos />} />
                <Route path="/instrumentos-profesor" element={<InstrumentosProfesor />} />
                <Route path="/cerrar-sesion" element={<CerrarSesion/>} />
                <Route path="/formusuario" element={<FormUsuario/>}/>
                <Route path="/perfil-profesor" element={<PerfilProfesor/>} />
            </Routes>
        </BrowserRouter>
        
        </>
    );
    
}


export default App;
