import { useNavigate } from "react-router-dom"
import { useEffect, useState } from "react";
import { SyncLoader } from "react-spinners"



const CerrarSesion = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const rutaHome = "/";
    sessionStorage.clear();

    useEffect(() => {
        setTimeout(() => {
            // SIN REPLACE USA HISTORIAL DE NAVEGACION => RUTA ACTUAL
            navigate(rutaHome, {replace: true});
            setLoading(false);
        }, 1000)
    }, [])


    return (
        <>
            {loading && (
                <div className="loader">
                    <SyncLoader color="#ECEFCA"/><br></br>
                    <p style={{color: "#ECEFCA"}}>Cerrando sesión...</p>
                </div>
            )}
        </>
    )

}

export default CerrarSesion