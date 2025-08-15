import {Nav, Navbar, NavDropdown, Image} from "react-bootstrap"
import Logo from "../../resources/images/tonalya_logo.png";


const Header = () => {

    return (
        <div style={{  marginBottom: "50px"}}>
            <Navbar className="px-3 "  expand="lg" style={{backgroundColor: "#213448", position: "fixed", width: "100%", height: "60px", zIndex: 1 }}>
            
                <Navbar.Brand href="/" style={{color: "#ECEFCA"}}><Image height={30} src={Logo} alt="Tonalya" rounded></Image></Navbar.Brand>
                <Navbar.Toggle aria-controls="navegacion" />
                <Navbar.Collapse id="navegacion">
                    <Nav className="me-auto">
                        <Nav.Link href="/" style={{color: "#ECEFCA"}}>Inicio</Nav.Link>
                        <Nav.Link href="/instrumentos" style={{color: "#ECEFCA"}}>Iniciar sesión</Nav.Link>
                        <NavDropdown title="Utilidades" id="dropdown" style={{color: "#ECEFCA"}}>
                            <NavDropdown.Item href="/instrumentos" style={{color: "#213448"}}>Instrumentos</NavDropdown.Item>
                            <NavDropdown.Item href="/" style={{color: "#213448"}}>
                                
                            </NavDropdown.Item>
                            <NavDropdown.Item href="#action/3.3" style={{color: "#213448"}}>Something</NavDropdown.Item>
                            <NavDropdown.Divider />
                            <NavDropdown.Item href="#action/3.4" style={{color: "#213448"}}>
                                Separated link
                            </NavDropdown.Item >
                        </NavDropdown>
                        <Nav.Link href="/iniciar-sesion">Iniciar sesión</Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
            <Nav></Nav>
        </div>
    );
}

export default Header;