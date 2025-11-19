import {Nav, Navbar, Image} from "react-bootstrap"
// LOGO
import Tipograma from "../../resources/images/tonalya_tipograma.png";
import "./dropdown.css"
import IniciarSesion from "./IniciarSesion.jsx"
const Header = () => {
    const logeado = sessionStorage.getItem("usuario") != null;
    const rol  = sessionStorage.getItem("rol");
    return (
        <>
            {/* style={{, position: "fixed", width: "100%", height: "60px", zIndex: 1 }} */}
            <Navbar  className="py-xs-5 py-md-0 px-3 fixed-top border-bottom border-3 border-secondary"  expand="lg" style={{zIndex: 50, backgroundColor: "#213448"}} >
            
                <Navbar.Brand href="/" ><Image height={30} src={Tipograma} alt="Tonalya" rounded></Image></Navbar.Brand>
                <Navbar.Toggle aria-controls="navegacion" />
                <Navbar.Collapse id="navegacion">
                    <Nav className="me-auto" style={{ display: "flex", justifyContent: "center", alignItems: "center"}}>
                        <Nav.Link href="/" >Inicio</Nav.Link>
                        <Nav.Link href="/buscador-profesores" >Encuentra tu profesor</Nav.Link>
                        
                        

                        {/* SI ESTA LOGEADO */}
                        {logeado ? (
                            <>
                            {/* SI EL ROL ES PROFESOR  */}
                            {
                            rol == "profesor" ? (
                                <Nav.Link href="/perfil-profesor" className="mx-2 my-2 flex-end" >Perfil</Nav.Link>
                                
                                // ELSE SI EL ROL ES ALUMNO 
                            ): rol == "alumno" ? (
                                <Nav.Link href="/perfil-usuario" className="mx-2 my-2 flex-end" >Perfil</Nav.Link>
                                
                                // ELSE SI EL ROL ES ADMIN 
                            ): rol == "admin"? (
                                <Nav.Link href="/perfil-admin" className="mx-2 my-2 flex-end" >Perfil</Nav.Link>
                            ): null
                            }
                            <Nav.Link className="mx-2 my-2 flex-end" href="/cerrar-sesion" >
                                Cerrar sesión
                            </Nav.Link>
                            </>
                        ) : (
                            <>
                            <IniciarSesion/>
                            <Nav.Link href="/registrarse" className='mx-2 my-2 flex-end' > Registrarse</Nav.Link>
                            </>
                        )}
                        {/* <div id="user-ops" className="mx-2 flex-end position-absolute  end-0" >
                            <IniciarSesion/>
                            <Link className="btn btn-info mx-2" to="/registrarse">Registrarse</Link>
                        </div> */}
                        
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
        </>
    );
}

export default Header;