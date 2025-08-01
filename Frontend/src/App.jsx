import './App.css'
// import { useState, useEffect } from 'react';
import { Routes, BrowserRouter, Route } from 'react-router-dom';
import FormProfesor from './components/FormProfesor.jsx';
import Home from './Home.jsx';
import Profesores from './components/Profesores.jsx';
import Instrumentos from './components/Instrumentos.jsx';
import InstrumentosProfesor from './components/InstrumentosProfesor.jsx';
import IniciarSesion from './components/IniciarSesion.jsx';


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
                <Route path="/iniciar-sesion" element={<IniciarSesion/>}></Route>
                <Route path="/formprofesor" element={<FormProfesor />} />
                <Route path="/profesores" element={<Profesores />} /> 
                <Route path="/instrumentos" element={<Instrumentos />} />
                <Route path="/instrumentos-profesor" element={<InstrumentosProfesor />} />
            </Routes>
        </BrowserRouter>
        </>
    );
    
}


export default App;
