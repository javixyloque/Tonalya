import { Link } from 'react-router-dom';
import {Button, Card, Container, Row, Col, Carousel} from 'react-bootstrap'
// import './Home.css';
import Header from './components/templates/Header';
// import Logo from"./resources/images/tonalya_logo.png";
import InstrumentosCarrusel from "./resources/images/carrusel/instrumentos-carrusel.png";
import ViolinCarrusel from "./resources/images/carrusel/violin-carrusel.jpg"
import CasetteCarrusel from "./resources/images/carrusel/casette-carrusel.jpg";
// PALETA DE COLORES
// https://colorhunt.co/palette/21344854779294b4c1ecefca

const  Home = () => {
    return (
        <>
        <Header/>
        <Container>
            <Row>
               <Col sm={12} >
                    <h1>Bienvenido a TONALYA</h1>
               </Col>
            </Row>
            

            <Row>
                <Col sm={12} md={2}></Col>
                <Col sm={12} md={8}>
                    {/* ZINDEX 0 PARA Q NO SE VEAN LAS FLECHAS POR ENCIMA DEL NAVBAR */}
                    <Carousel data-bs-theme="primary" className="mb-5" style={{zIndex: 0 , backgroundColor: "#213448"}}>
                        {/* IMAGEN CARRUSEL -> IMG. IMAGE NO FUNCIONA BIEN */}
                        <Carousel.Item style={{}}>
                            <img src={CasetteCarrusel} className="img-fluid w-100" alt="Logo" ></img>
                            <Carousel.Caption>
                                <h2>¡BIENVENIDO A TONALYA!</h2>
                            </Carousel.Caption>
                        </Carousel.Item>

                        <Carousel.Item>
                            <img src={InstrumentosCarrusel} className="d-block w-100" style={{height: "95%"}} alt="Instrumentos" />
                            <Carousel.Caption>
                                <h3>Aprende con nosotros!</h3>
                                <h4>Intentamos hacer de tu aprendizaje algo más fácil</h4>
                            </Carousel.Caption>
                        </Carousel.Item>

                        <Carousel.Item>
                            <img src={ViolinCarrusel} className="d-block w-100" alt="casette" style={{height: "95%"}}/>
                        </Carousel.Item>

                    </Carousel>
                </Col>
                <Col sm={0} md={2}></Col>
                
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
