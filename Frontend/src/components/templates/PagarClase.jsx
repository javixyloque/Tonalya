
import { useState, useEffect } from "react";
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


    useEffect(() => {
        if (!sessionStorage.getItem('id') || sessionStorage.getItem('rol') !== "alumno") {
            window.location.href = '/';
            return;
        }  
        const setClasePagada = async () => {
            try {
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
                        window.location.href ='/perfil-usuario'
                    }, 2500);
                }

            } catch (error) {
                console.error(error);
            }

            
        }
        setClasePagada();
    }, [])
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