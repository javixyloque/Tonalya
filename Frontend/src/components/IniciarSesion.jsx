

import { useNavigate } from 'react-router-dom';
const IniciarSesion = () => {
    const navigate = new useNavigate();


    const iniciarSesion = async (event) => {
        event.preventDefault();
        
        const email = event.target.email.value;
        const password = event.target.password.value;

        try {
            let respuesta = await fetch ("", {
                method: 'GET', 
                headers: {
                    "Content/Type": "application/json"
                },
                body: {

                }
            })
        } catch (Exception) {
            console.error(Exception.getMessage());
        }
    }
}

export default IniciarSesion;