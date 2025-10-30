import { useNavigate } from "react-router-dom"




const CerrarSesion = () => {
    const navigate = useNavigate();

    sessionStorage.clear();
    navigate("/");

}

export default CerrarSesion