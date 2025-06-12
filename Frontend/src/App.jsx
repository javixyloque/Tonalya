import './App.css'
// import { useState, useEffect } from 'react';
import { Routes, BrowserRouter, Route } from 'react-router-dom';
import FormClase from './components/FormClase.jsx';
import Home from './Home.jsx';
import Profesores from './components/Profesores.jsx';
const App = () => {

    

    return (
        <>
        <BrowserRouter>
            <Routes>
                <Route path="/" render={<Home />} />
                <Route path="/formclase" render={<FormClase />} />
                <Route path="/profesores" render={<Profesores />} />
            </Routes>
        </BrowserRouter>
        </>
    );
    
}


export default App;
