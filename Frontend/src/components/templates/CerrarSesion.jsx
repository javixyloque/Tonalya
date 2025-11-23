
import { useEffect, useState } from "react";
import { SyncLoader } from "react-spinners"



const CerrarSesion = () => {
    const [loading, setLoading] = useState(true);
    sessionStorage.clear();

    useEffect(() => {
        setTimeout(() => {
            // VOLVER A INICIO
            window.location.href = "/";
            setLoading(false);
        }, 1000)
    }, [])


    return (
        <>
            {loading && (
                <div className="loader">
                    <SyncLoader color="#213448"/><br></br>
                    <p style={{color: "#213448"}}>Cerrando sesión...</p>
                </div>
            )}
        </>
    )

}

export default CerrarSesion