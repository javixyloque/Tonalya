// import './App.css'
// import { useState, useEffect } from 'react';
import { Routes, BrowserRouter, Route } from 'react-router-dom';
import FormProfesor from './components/forms/FormProfesor.jsx';
import FormUsuario from './components/forms/FormUsuario.jsx';
import Home from './Home.jsx';
import Registrarse from './components/templates/Registrarse.jsx';
import CerrarSesion from './components/templates/CerrarSesion.jsx';
import PerfilProfesor from './components/PerfilProfesor.jsx';
import PerfilUsuario from './components/PerfilUsuario.jsx';
import BuscadorProfesores from './components/BuscadorProfesores.jsx';
// import PerfilAdmin from './components/PerfilAdmin.jsx';
import VerProfesor from './components/VerProfesor.jsx';
import FormPagar from './components/FormPagar.jsx';
import PagarClase from './components/templates/PagarClase.jsx';



// RENDERIZA LAS RUTAS DE LA APLICACIÓN
const App = () => {
    return (
        <>
        
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/registrarse" element={<Registrarse/>}></Route>
                <Route path="/formprofesor" element={<FormProfesor />} />
                <Route path="/cerrar-sesion" element={<CerrarSesion/>} />
                <Route path="/formusuario" element={<FormUsuario/>}/>
                <Route path="/perfil-profesor" element={<PerfilProfesor/>} />
                <Route path="/perfil-usuario" element={<PerfilUsuario/>} />
                <Route path="/buscador-profesores" element={<BuscadorProfesores/>} />
                {/* <Route path="/perfil-admin" element={<PerfilAdmin/>}/> */}
                <Route path="/ver-profesor/:id" element={<VerProfesor/>}/>
                <Route path="/form-pagar/:id" element={<FormPagar/>} />
                <Route path="/pagar-clase/:id" element={<PagarClase/>}/>
            </Routes>
        </BrowserRouter>
        
        </>
    );
    
}


export default App;
