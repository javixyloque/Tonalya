
import { useState, useEffect } from "react";
import { SyncLoader } from "react-spinners";
import {useParams} from "react-router-dom";

const PagarClase = () => {
    const { id } = useParams();
    console.log(id)
    const [loading, setLoading] = useState(true);

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
                    setTimeout(() => {
                        setLoading(false);
                        alert('Clase pagada correctamente');
                        window.location.href ='/perfil-usuario'
                    }, 1000);
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
        </>
    )
}

export default PagarClase;