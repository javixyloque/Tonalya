import { useEffect } from "react";
import {useState} from "react";
// import {SyncLoader} from "react-spinners"

const FormClase = () =>{
        const [nombre, setNombre] = useState('');
        const [email, setEmail] = useState('');
        const [telefono, setTelefono] = useState('');
        const [password, setPassword] = useState('');
        const [imagen, setImagen] = useState('');
        // const [loading, setLoading] = useState(true);
        const [profesores, setProfesores] = useState([]);
        useEffect ( ()  => {

            async function fetchProfesores () {
                try {
                    const profesores = await fetch('http://localhost:5000/profesor', {
                        method: 'GET',
                        headers: {
                        'Content-Type': 'application/json',
                    }
                    });
                    if (profesores.ok) {
                        console.log('Profesores cargados correctamente');
                    } else {
                        console.error('Error al cargar los profesores');
                    }
                    const arrayProfesores = await profesores.json();
                    // setLoading(false);
                    setProfesores(arrayProfesores);
                    return arrayProfesores
                } catch (error) {
                    console.error('Error de red:', error);
                }


            }

            fetchProfesores();

        }, [])





        const enviarFormulario = async (event) => {
            event.preventDefault();
            const formData = { nombre, email, telefono, password, imagen  };
            try {
            const response = await fetch('localhost:5000/profesor', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(formData),
                });
                if (response.ok) {
                    console.log('Formulario enviado correctamente');
                } else {
                    console.error('Error al enviar el formulario');
                }
            } catch (error) {
                console.error('Error de red:', error);
            }
        };


            return (
                <>
                <h1>Eres nuevo? Comencemos</h1>
                <form onSubmit={enviarFormulario} >
                    <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} placeholder="Nombre" />
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
                    <input type="text" value={telefono} onChange={(e) => setTelefono(e.target.value)} placeholder="Telefono" />
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
                    <input type="file" value={imagen} onChange={(e) => setImagen(e.target.value)} placeholder="Imagen" />

                    <button type="submit">Registrarse</button>
                </form>

                <ul>
                    {profesores.map(profesor => <li key={profesor.id}>
                        <h3>{profesor.nombre}</h3>
                        <p>{profesor.email}</p>
                        <p>{profesor.telefono}</p>
                        <p>{profesor.password}</p>
                        <p>{profesor.imagen}</p>
                    </li>)}
                </ul>
                </>
            );
}

export default FormClase;