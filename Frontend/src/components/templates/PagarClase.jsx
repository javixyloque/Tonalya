
import { useState } from "react";
import { SyncLoader } from "react-spinners";
import {useParams} from "react-router-dom";
import { Alert, Container } from "react-bootstrap";

// PANTALLA DE CARGA PARA PAGAR (SIMULACIÓN) Y ENVIAR EMAILS CON LA PETICIÓN
const PagarClase = () => {
    const { id } = useParams();
    // console.log(id)
    const [loading, setLoading] = useState(true);
    const [alerta, setAlerta] = useState(false);
    const [mensajeAlerta, setMensajeAlerta] = useState('');
    const [tipoAlerta, setTipoAlerta] = useState('success');
    const [enviando, setEnviando] = useState(false);


        if (!sessionStorage.getItem('id') || sessionStorage.getItem('rol') !== "alumno") {
            // SI NO HAGO ESTO SE ENVÍA EL FORMULARIO 2 VECES
            window.location.assign('/');
            return;
        }  
        const setClasePagada = async () => {
            try {
                if(enviando){
                    return;
                }
                setEnviando(true);
                const clasePagada = await fetch(`http://localhost:5000/usuario/clase/${id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Connection': 'keep-alive'
                    },
                    body: JSON.stringify({estado: "pagada"})
                })
                
                if (clasePagada.ok) {
                    setLoading(false);
                    setMensajeAlerta('Clase pagada correctamente');
                    setTipoAlerta('success');
                    setAlerta(true);
                    setTimeout(() => {
                        setAlerta(false);
                        setEnviando(false);
                        window.location.replace('/perfil-usuario');
                    }, 2500);
                }

            } catch (error) {
                console.error(error);
            }

            
        }
        setClasePagada();
   
    return (
        <>
            {loading && (
                <div className="loader">
                    <SyncLoader color="#213448"/><br></br>
                    <p style={{color: "#213448"}}>Procesando pago...</p>
                </div>
            )}
            {alerta && (
                <Container className="d-flex justify-content-center align-items-center">
                    <Alert variant={tipoAlerta}>{mensajeAlerta}</Alert>
                </Container>
            )}
        </>
    )
}

export default PagarClase;