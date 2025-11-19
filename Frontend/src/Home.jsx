import {Button, Card, Container, Row, Col, Carousel} from 'react-bootstrap'
// import './Home.css';
import Header from './components/templates/Header';
// import Logo from"./resources/images/tonalya_logo.png";
import InstrumentosCarrusel from "./resources/images/carrusel/instrumentos-carrusel.png";
import ViolinCarrusel from "./resources/images/carrusel/violin-carrusel.jpg"
import CasetteCarrusel from "./resources/images/carrusel/casette-carrusel.jpg";
import profesor from "./resources/images/profesor.svg"
// import aprender from "./resources/images/aprender.svg"
import pianoProfe from "./resources/images/pianoProfe.svg"
import buscarProfesores from "./resources/images/buscarProfesores.svg"

// PALETA DE COLORES
// https://colorhunt.co/palette/21344854779294b4c1ecefca

/*
Copyright (c) [2025] [Tonalya]. Todos los derechos reservados.

Se prohíbe expresamente:
- Uso comercial por terceros
- Distribución, modificación o copia
- Reverse engineering
- Integración en otros productos comerciales"
*/

// MODAL PARA INICIAR SESION, PAGINA APARTE PARA REGISTRARSE

const  Home = () => {
    
    

    return (
        <>
        <Header/>
        <Container style={{minHeight: "100vh"}}>
            
            {/* <Row>
               <Col xs={12} className='mb-5 text-center' style={{color: "#213448", fontSize: "4em"}}>
                    <h1>Bienvenido a Tonalya</h1>
               </Col>
            </Row>
             */}

            <Row>
                <Col xs={0} lg={2}></Col>
                <Col xs={12} lg={8}>
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
                            <img src={InstrumentosCarrusel} className="d-block w-100" style={{height: "95%", padding: "2%"}} alt="Instrumentos" />
                            <Carousel.Caption>
                                <h3>Aprende con nosotros!</h3>
                                <h4>Intentamos hacer de tu aprendizaje axlo más fácil</h4>
                            </Carousel.Caption>
                        </Carousel.Item>

                        <Carousel.Item>
                            <img src={ViolinCarrusel} className="d-block w-100" alt="casette" style={{height: "95%"}}/>
                        </Carousel.Item>

                    </Carousel>
                </Col>
                <Col xs={0} lg={2} className="mb-5"></Col>
                
            </Row>

            <Row>
                <Col xs={0} lg={2}></Col>
                <Col xs={12} lg={8}>
                    <h5 className='mb-5' style={{color: "#213448"}}>
                        Tonalya es una plataforma online que te ayuda a contactar con profesores para aprender música en cualquiera de 
                        sus variedades, cualquier instrumento o incluso lenguaje musical, armonía, análisis... <br /> <br /> 
                        Simplemente regístrate, busca un profesor cerca de ti y, lo más importante ¡disfruta aprendiendo!  </h5>
                </Col>      
                <Col xs={0} lg={2}></Col>
            </Row>

            <Row>
                <Col xs={12} lg={6} xl={4} className='mb-3 '>
                    <Card className='h-100 shadow-sm'>
                        <Card.Img variant="top"  src={pianoProfe} alt='Imagen Guitarra'  style={{   maxHeight: "15rem", objectFit: "cover" }} />
                        <Card.Body>
                            <h4>Aprende con nosotros</h4>
                            <p>Regístrate, busca un profesor cerca de ti y, lo más importante ¡disfruta dando la nota como nosotros!</p>
                            <div>
                                <Button variant="primary" href="/">COMENZAR A APRENDER</Button>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>

                <Col xs={12} lg={6} xl={4}  className='mb-3'>
                    <Card className='h-100 shadow-sm'>
                        <Card.Img variant="top" src={profesor} alt="Imagen Acordeón"  style={{ maxHeight: "15rem", objectFit: "cover" }} />
                        <Card.Body>
                            <h4>Date a conocer como profesor</h4>
                            <p>Registrate como profesor y sírvete de Tonalya para organizar tus clases y atraer nuevos alumnos</p>
                            <Button style={{display: "inline-block"}} variant="primary" href="/formprofesor" >DAR CLASE</Button>
                        </Card.Body>
                    </Card>
                </Col>

                <Col xs={12} lg={12} xl={4}  className='mb-3'>
                    <Card className='h-100 shadow-sm'>
                        <Card.Img variant="top" src={buscarProfesores} alt="Imagen Acordeón"  style={{ maxHeight: "15rem", objectFit: "cover" }} />
                        <Card.Body>
                            <h4>Busca profesores en tu zona</h4>
                            <p>Descubre nuestro buscador de profesores para encontrar el profesor perfecto para ti</p>
                            <Button variant="primary" href="/formprofesor">BUSCAR PROFESORES</Button>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
            
           
        </Container>
        </>
    );
}
export default Home;
