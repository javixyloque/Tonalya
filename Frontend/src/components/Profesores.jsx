import { useState, useEffect } from 'react';
import {Link} from 'react-router-dom';
// import { Link } from 'react-router-d

const Profesores = () => {
    const [profesores, setProfesores] = useState([]);
    useEffect(() => {
        async function fetchProfesores() {
            try {
                const response = await fetch('http://localhost:5000/admin/profesores', {
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
        <>
            <Link  to="/" >Volver a Inicio</Link> 
            <h1>Profesores</h1>
            <ul>
                {profesores.map((profesor) => (
                    <li key={profesor._id}>
                        {profesor.nombre} {profesor.email} &nbsp; 
                        
                            <img src={profesor.imagen} alt="Imagen del Profesor" style={{ maxWidth: '100px'}} />

                        
                    </li>
                ))}
            </ul>
        </>
    );

}

export default Profesores;