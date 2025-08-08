import { Link } from 'react-router-dom';
import {Button, Card, Container, Row, Col} from 'react-bootstrap'
// import './Home.css';

// PALETA DE COLORES
// https://colorhunt.co/palette/21344854779294b4c1ecefca

const  Home = () => {
    return (
        <>
        
        <Container>
            <Row>
               <Col md={6}>
                <h1>Bienvenido a la página de inicio</h1>
               </Col>
            </Row>
            <Row>
                <p>Bienvenido al sitio web de Tonalya</p>
            </Row>

            <Row>
                <Col>
                    <Card style={{ width: '18rem', backgroundColor: '#94B4C1' }}>
                        <Card.Body>
                            <h5>Date a conocer como profesor</h5>
                            <Button variant="secondary" href="/formprofesor">REGISTRARSE</Button>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
            
            <Button variant="secondary" href="/formprofesor">AGREGAR PROFESOR</Button>
            <Link to="/iniciar-sesion" className="btn btn-primary"></Link>
            <Link to="/formprofesor" className="btn btn-primary">Formulario Clases</Link>
            <br />
            <Link to="/profesores" className="btn btn-secondary">Profesores</Link>
            <br />
            <Link to="/iniciar-sesion" className="btn btn-primary">Iniciar Sesión</Link>
        </Container>
        </>
    );
}
export default Home;
