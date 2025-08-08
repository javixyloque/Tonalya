
import { useNavigate } from 'react-router-dom';
const IniciarSesion = () => {
    const navigate = new useNavigate();


    const iniciarSesion = async (event) => {
        event.preventDefault();
        
        const email = event.target.email.value;
        const password = event.target.password.value;
        try {
            let respuesta = await fetch (`http://localhost:5000/profesor/${email}`, {
                method: 'POST', 
                headers: {
                    "Content/Type": "application/json"
                },
                body: {
                    password: password
                }
            });
            if (respuesta == 1) {
                navigate("/profesor");
            } else if (respuesta == 0) {
                alert("Contraseña incorrecta");
            } else {
                alert("Usuario no encontrado");
                navigate()
            }
        } catch (Exception) {
            console.error(Exception.getMessage());
        }
    }

    return (
        <>
            <form onSubmit={iniciarSesion}></form>
        </>
    );


}

export default IniciarSesion;