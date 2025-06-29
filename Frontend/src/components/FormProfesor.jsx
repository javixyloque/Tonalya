
// import {useState} from "react";
// import {SyncLoader} from "react-spinners"
import { useNavigate } from 'react-router-dom';
import { codificarImagen64 } from "../functions/codificar.js";
import "./formprofesor.css";
const FormProfesor = () => {
    const navigate = new useNavigate();
        
        const enviarFormulario = async (event) => {
            event.preventDefault();
            
            const nombre = event.target.nombre.value;
            const email = event.target.email.value;
            const telefono = event.target.telefono.value;
            const password = event.target.password.value;
            let imagen = event.target.imagen.files[0] || null;
            
            let imagenCodificada = null;
            
            if (imagen){
                imagenCodificada = await codificarImagen64(imagen);
            }

            const datosFormulario = JSON.stringify({
                nombre: nombre,
                email: email,
                telefono: telefono,
                password: password,
                imagen: imagenCodificada
            })
            

            try {
                const response = await fetch('http://localhost:5000/profesor', {

                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: datosFormulario,
                });
                const insert = await response.json();
                if (response.ok) {
                    console.log('Formulario enviado correctamente', insert);
                    navigate('/profesores');
                } else {
                    console.error('Error al enviar el formulario', insert);
                }
            } catch (error) {
                console.error('Error de red:', error);
            }
        };

        
        


            return (
                <>
                <h1>¿Quieres empezar a dar clases? <br />Comencemos</h1>
                <form onSubmit={enviarFormulario}>
                    <label htmlFor="nombre">Dinos tu <strong>nombre completo</strong>, aquel por el que quieras que te reconozcan tus alumnos:</label>
                    <input type="text" name="nombre"  placeholder="Nombre" />
                    <label htmlFor="email">Ingresa tu <strong>email</strong>, servirá como usuario de inicio de sesión</label>
                    <input type="email" name="email" placeholder="Email" />
                    <label htmlFor="telefono">Facilítanos tu <strong>teléfono</strong>, servirá para contactarte con tus alumnos:</label>
                    <input type="text" name="telefono" placeholder="Telefono" />
                    <label htmlFor="contraseña">Crea tu <strong>contraseña</strong>, para que no te olvides de tu cuenta <em>(no te preocupes, está a salvo con nosotros)</em></label>
                    <input type="password" name="password"   placeholder="Contraseña" />
                    <label htmlFor="imagen">Sube tu <strong>imagen de perfil</strong>, para que tus alumnos puedan reconocerte. <em>No te preocupes, podrás editarla o subirla más adelante</em></label>
                    <input type="file" name="imagen" />

                    <button type="submit">REGISTRARSE</button>
                </form>

                
                </>
            );
        
}

export default FormProfesor;