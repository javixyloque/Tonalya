import {Nav, Navbar, NavDropdown, Image, Dropdown, DropdownButton} from "react-bootstrap"
import Tipograma from "../../resources/images/tonalya_tipograma.png";
import "./dropdown.css"
import IniciarSesion from "./IniciarSesion.jsx"
const Header = () => {

    return (
        <div>
            {/* style={{backgroundColor: "#ECEFCA", position: "fixed", width: "100%", height: "60px", zIndex: 1 }} */}
            <Navbar  variant="primary" className="py-xs-5 py-md-0 px-3 fixed-top bg-body-secondary"  expand="lg" style={{zIndex: 1}} >
            
                <Navbar.Brand href="/" ><Image height={30} src={Tipograma} alt="Tonalya" rounded></Image></Navbar.Brand>
                <Navbar.Toggle aria-controls="navegacion" />
                <Navbar.Collapse id="navegacion">
                    <Nav className="me-auto">
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
                        <IniciarSesion/>
                        <DropdownButton className="custom-dropdown-toggle" title="Utilidades">
                            <Dropdown.Item href="#/action-1">Action</Dropdown.Item>
                            <Dropdown.Item href="#/action-2">Another action</Dropdown.Item>
                            <Dropdown.Item href="#/action-3">Something else</Dropdown.Item>
                        </DropdownButton>
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
        </div>
    );
}

export default Header;