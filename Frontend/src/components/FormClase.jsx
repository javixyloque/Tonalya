
import {useState} from "react";
// import {SyncLoader} from "react-spinners"

const FormClase = () =>{
        const [nombre, setNombre] = useState('');
        const [email, setEmail] = useState('');
        const [telefono, setTelefono] = useState('');
        const [password, setPassword] = useState('');
        

        const enviarFormulario = async (event) => {
            event.preventDefault();
            
            const nombre = event.target.nombre.value;
            const email = event.target.email.value;
            const telefono = event.target.telefono.value;
            const password = event.target.password.value;
            const imagen = event.target.imagen.files[0] || null;
            
            const formData = new FormData();
            formData.append('nombre', nombre);
            formData.append('email', email);
            formData.append('telefono', telefono);
            formData.append('password', password);
            formData.append('imagen', imagen);

            try {
                const response = await fetch('http://localhost:5000/profesor', {
                        method: 'POST',
                        
                        body: formData,
                    });
                const insert = await response.json();
                if (response.ok) {
                    console.log('Formulario enviado correctamente', insert);
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
                <form onSubmit={enviarFormulario} encType="multipart/form-data">
                    <input type="text" name="nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} placeholder="Nombre" />
                    <input type="email" name="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
                    <input type="text" name="telefono" value={telefono} onChange={(e) => setTelefono(e.target.value)} placeholder="Telefono" />
                    <input type="password" name="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
                    <input type="file" name="imagen" />

                    <button type="submit">Registrarse</button>
                </form>

                
                </>
            );
        
}

export default FormClase;