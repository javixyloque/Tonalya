
import './App.css'
import { useState, useEffect } from 'react';
// import { Route, BrowserRouter, Routes } from 'react-router-dom';
// import FormClase from './components/FormClase.jsx';

 function App() {

    const [profesores, setProfesores] = useState([]);
    useEffect(() => {
        async function fetchProfesores() {
            try {
                const response = await fetch('localhost:5000/profesor', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                if (response.ok) {
                    console.log('Profesores cargados correctamente');
                } else {
                    console.error('Error al cargar los profesores');
                }
                const arrayProfesores = await response.json();
                // setLoading(false);
                setProfesores(arrayProfesores);
                return arrayProfesores;
            } catch (error) {
                console.error('Error de red:', error);
            }
        };
        fetchProfesores();
    }, []);

    return (
        <div className="App">
            <h1>Profesores</h1>
            <ul>
                {profesores.map((profesor) => (
                    <li key={profesor._id}>
                        {profesor.nombre} {profesor.email}
                    </li>
                ))}
            </ul>
        </div>
    );
    
}


export default App
