import {Nav, Navbar, Image} from "react-bootstrap"
// LOGO
import Tipograma from "../../resources/images/tonalya_tipograma.png";
import "./dropdown.css"
import IniciarSesion from "./IniciarSesion.jsx"
import { Link } from "react-router-dom";
const Header = () => {
    const logeado = sessionStorage.getItem("usuario") != null;
    const rol  = sessionStorage.getItem("rol");
    return (
        <>
            {/* style={{, position: "fixed", width: "100%", height: "60px", zIndex: 1 }} */}
            <Navbar  className="py-xs-5 py-md-0 px-3 fixed-top"  expand="lg" style={{zIndex: 50, backgroundColor: "#ECEFCA"}} >
            
                <Navbar.Brand href="/" ><Image height={30} src={Tipograma} alt="Tonalya" rounded></Image></Navbar.Brand>
                <Navbar.Toggle aria-controls="navegacion" />
                <Navbar.Collapse id="navegacion">
                    <Nav className="me-auto" style={{ display: "flex", justifyContent: "center", alignItems: "center"}}>
                        <Nav.Link href="/" style={{color: "#547792"}}>Inicio</Nav.Link>
                        <Nav.Link href="/buscador-profesores" style={{color: "#547792"}}>Encuentra tu profesor</Nav.Link>
                        
                        {/* <NavDropdown title="Utilidades" id="dropdown" style={{color: "#547792"}}>
                            <NavDropdown.Item href="/instrumentos" style={{color: "#213448"}}>Instrumentos</NavDropdown.Item>
                            <NavDropdown.Item href="/" style={{color: "#547792"}}>
                                
                            </NavDropdown.Item>
                            <NavDropdown.Item href="#action/3.3" style={{color: "#213448"}}>Something</NavDropdown.Item>
                            <NavDropdown.Divider />
                            <NavDropdown.Item href="#action/3.4" style={{color: "#213448"}}>
                                Separated link
                            </NavDropdown.Item >
                        </NavDropdown> */}

                        {/* SI ESTA LOGEADO */}
                        {logeado ? (
                            <>
                            {/* SI EL ROL ES PROFESOR  */}
                            {
                            rol == "profesor" ? (
                                <Nav.Link href="/perfil-profesor" className="mx-2 my-2 flex-end">Perfil</Nav.Link>
                                
                                // ELSE SI EL ROL ES ALUMNO 
                            ): rol == "alumno" ? (
                                <Nav.Link href="/perfil-usuario" className="mx-2 my-2 flex-end">Perfil</Nav.Link>
                                
                                // ELSE SI EL ROL ES ADMIN 
                            ): rol == "admin"? (
                                <Nav.Link href="/perfil-admin" className="mx-2 my-2 flex-end" style={{textDecoration: "none", cursor: "pointer"}}>Perfil</Nav.Link>
                            ): null
                            }
                            <Nav.Link className="mx-2 my-2 flex-end" href="/cerrar-sesion" style={{color: "#213448"}}>
                                Cerrar sesión
                            </Nav.Link>
                            </>
                        ) : (
                            <>
                            <IniciarSesion/>
                            <Link to="/registrarse" className='mx-2 my-2 flex-end' style={{color: "#213448", textDecoration: "none", cursor: "pointer", right: 0}} > Registrarse</Link>
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