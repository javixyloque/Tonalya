import {Button, Card, Container, Row, Col, Carousel} from 'react-bootstrap'
// import './Home.css';
import Header from './components/templates/Header';
// import Logo from"./resources/images/tonalya_logo.png";
import personalizarCarrusel from "./resources/images/carrusel/personalizarCarrusel.svg";
import organizarCarrusel from "./resources/images/carrusel/organizarCarrusel.svg";
import cobroProfesoresCarrusel from "./resources/images/carrusel/cobroProfesoresCarrusel.svg";
import buscarCarrusel from "./resources/images/carrusel/buscarCarrusel.svg";
import notificacionesCarrusel from "./resources/images/carrusel/notificacionesCarrusel.svg"
import aprenderCarrusel from "./resources/images/carrusel/aprenderCarrusel.svg";
import profesor from "./resources/images/profesor.svg"  
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
const arrayCarrusel = [{ 
        img: aprenderCarrusel, 
        title: "¡Bienvenido a Tonalya!", 
        text: "Siempre dando la nota" 
    },{ 
        img: buscarCarrusel, 
        title: "Encuentra tu profesor", 
        text: "Aprende interactivamente un instrumento y conviértete en un virtuoso" 
    },{ 
        img: notificacionesCarrusel, 
        title: "Gestión de Clases", 
        text: "Organiza y recibe notificaciones de tus clases" 
    }, {
        img: personalizarCarrusel,
        title: "Personaliza tu perfil",
        text: "Hazlo único para que sea reconocible para los usuarios"
    }, {
        img: organizarCarrusel,
        title: "Organiza tus clases",
        text: "Gestiona tu horario y tu perfil de forma sencilla"
    }, {
        img: cobroProfesoresCarrusel,
        title: "Paga y cobra automáticamente",
        text: "Nosotros nos ocuparemos de ello, simplemente disfruta de la música"
    }
]

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
                   <Carousel 
                        data-bs-theme="dark" 
                        className="mb-5 vh-25 vh-md-50 vh-lg-75" 
                        style={{
                            zIndex: 0,
                            overflow: "hidden",
                            backgroundColor: "transparent"
                        }}
                    >
                                                {arrayCarrusel.map((pestanya, index) => (
                            <Carousel.Item key={index} style={{
                                height: "500px", // Agregar altura fija a cada elemento
                                overflow: "hidden" // Ocultar contenido que sobrepasa la altura fija
                            }}>
                                <img src={pestanya.img}  alt={`Pestaña ${index + 1}`} style={{objectFit: "cover", objectPosition: "center"}} />
                                {/* TEXTO SOLO EN DPANTALLAS GRANDES */}
                                <div className="d-block" style={{
                                    position: "absolute",
                                    bottom: "0.4em",
                                    left: 0,
                                    right: 0
                                }}>
                                    <Carousel.Caption>
                                        <h3 style={{
                                            fontSize: "1.8rem",
                                            fontWeight: "700",
                                            textShadow: "2px 2px 4px rgba(0,0,0,0.7)",
                                            marginBottom: "0.5rem",
                                            color: "#FF6584"
                                        }}>
                                            {pestanya.title}
                                        </h3>
                                        {pestanya.text && (
                                            <p style={{
                                                fontSize: "1.2rem",
                                                textShadow: "2px 2px 4px rgba(0,0,0,0.7)",
                                                marginBottom: "0",
                                                color: "#e55a78"
                                            }}>
                                                {pestanya.text}
                                            </p>
                                        )}
                                    </Carousel.Caption>
                                </div>
                            </Carousel.Item>
                        ))}
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
                                <Button variant="primary" href="/formusuario">COMENZAR A APRENDER</Button>
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
                            <Button variant="primary" href="/buscador-profesores">BUSCAR PROFESORES</Button>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
            
           
        </Container>
        </>
    );
}
export default Home;
