import {Nav, Navbar, NavDropdown, Image} from "react-bootstrap"
// LOGO
import Tipograma from "../../resources/images/tonalya_tipograma.png";
import "./dropdown.css"
import IniciarSesion from "./IniciarSesion.jsx"
import { Link } from "react-router-dom";
const Header = () => {
    const logeado = sessionStorage.getItem("usuario") != null;

    return (
        <>
            {/* style={{, position: "fixed", width: "100%", height: "60px", zIndex: 1 }} */}
            <Navbar  className="py-xs-5 py-md-0 px-3 fixed-top"  expand="lg" style={{zIndex: 1, backgroundColor: "#547792"}} >
            
                <Navbar.Brand href="/" ><Image height={30} src={Tipograma} alt="Tonalya" rounded></Image></Navbar.Brand>
                <Navbar.Toggle aria-controls="navegacion" />
                <Navbar.Collapse id="navegacion">
                    <Nav className="me-auto" style={{ display: "flex", justifyContent: "center", alignItems: "center"}}>
                        <Nav.Link href="/" style={{color: "#213448"}}>Inicio</Nav.Link>
                        <Nav.Link href="/instrumentos" style={{color: "#213448"}}>Instrumentos</Nav.Link>
                        
                        <NavDropdown title="Utilidades" id="dropdown" style={{color: "#213448"}}>
                            <NavDropdown.Item href="/instrumentos" style={{color: "#213448"}}>Instrumentos</NavDropdown.Item>
                            <NavDropdown.Item href="/" style={{color: "#213448"}}>
                                
                            </NavDropdown.Item>
                            <NavDropdown.Item href="#action/3.3" style={{color: "#213448"}}>Something</NavDropdown.Item>
                            <NavDropdown.Divider />
                            <NavDropdown.Item href="#action/3.4" style={{color: "#213448"}}>
                                Separated link
                            </NavDropdown.Item >
                        </NavDropdown>

                        {logeado ? (
                            <Nav.Link className="mx-2 my-2 flex-end iniciar-sesion-link" href="/cerrar-sesion" style={{color: "#213448"}}>
                                Cerrar sesión
                            </Nav.Link>
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