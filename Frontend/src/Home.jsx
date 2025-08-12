import { Link } from 'react-router-dom';
import {Button, Card, Container, Row, Col} from 'react-bootstrap'
// import './Home.css';
import TopBanner from './components/templates/TopBanner';
// PALETA DE COLORES
// https://colorhunt.co/palette/21344854779294b4c1ecefca

const  Home = () => {
    return (
        <>
        <TopBanner/>
        <Container>
            <Row>
               <Col sm={12} >
                    <h1>Bienvenido a la página de inicio</h1>
               </Col>
            </Row>
            <Row>
                <p>Bienvenido al sitio web de Tonalya</p>
            </Row>

            <Row>
                <Col sm={12} md={6} lg={4} className='mb-3'>
                    <Card style={{ backgroundColor: '#94B4C1' }}>
                        <Card.Img variant="top" src="https://cdn.pixabay.com/photo/2014/09/03/22/06/guitar-435094_1280.jpg" alt='Imagen Guitarra'  style={{ width: '100%', height: "auto" }} />
                        <Card.Body>
                            <h5>Empieza a aprender con nosotros!</h5>
                            <div style={{display: "flex", justifyContent: "center"}}>
                                <Button variant="outline-secondary" href="/">REGISTRARSE</Button>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>

                <Col sm={12} md={6} lg={4}  className='mb-3'>
                    <Card style={{backgroundColor: '#94B4C1' }}>
                        <Card.Img variant="top" src="https://cdn.pixabay.com/photo/2021/03/12/21/25/keys-6090560_1280.jpg" alt="Imagen Acordeón"  style={{ width: '100%', height: "auto" }} />
                        <Card.Body>
                            <h5>Date a conocer como profesor</h5>
                            <Button style={{display: "inline-block"}} variant="secondary" href="/formprofesor" >EMPEZAR A DAR CLASE</Button>
                        </Card.Body>
                    </Card>
                </Col>

                <Col sm={12} md={12} lg={4}  className='mb-3'>
                    <Card style={{  backgroundColor: '#94B4C1' }}>
                        <Card.Body>
                            <h5>Date a conocer como profesor</h5>
                            <Button variant="secondary" href="/formprofesor">EMPEZAR A DAR CLASE</Button>
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
