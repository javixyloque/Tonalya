
// import {useState} from "react";
// import {SyncLoader} from "react-spinners"
import { useNavigate } from 'react-router-dom';
import { codificarImagen64 } from "../functions/codificar.js";
const FormClase = () =>{
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
                <h1>Eres nuevo? Comencemos</h1>
                <form onSubmit={enviarFormulario}>
                    <input type="text" name="nombre"  placeholder="Nombre" />
                    <input type="email" name="email" placeholder="Email" />
                    <input type="text" name="telefono" placeholder="Telefono" />
                    <input type="password" name="password"   placeholder="Contraseña" />
                    <input type="file" name="imagen" />

                    <button type="submit">Registrarse</button>
                </form>

                
                </>
            );
        
}

export default FormClase;