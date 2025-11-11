import {  Link } from "react-router-dom";
import Header from "./Header";
import { Container, Row, Col } from "react-bootstrap";

const Registrarse = () => {
    if (sessionStorage.email) {
        window.location.href = "/";
    }
    return (
        <>
            <Header/>
            <Container style={{minHeight: "100vh"}}>
                <Row className="mb-5">
                    <Col xs={12} lg={2}></Col>
                    <Col xs={12} lg={8} style={{textAlign: "center"}}>
                        <h1 className="mb-5">¡Bienvenid@!</h1><h2 className="mb-5">Si es tu <strong>primera</strong> vez aquí, <strong> regístrate </strong>y empieza a aprender con nosotros</h2>
                    </Col>
                    <Col xs={12} lg={2}></Col>
                </Row>
                <Row className="mb-5">
                    <Col xs={12} lg={2}></Col>
                    <Col xs={12} lg={8} style={{textAlign: "center"}}>
                        <h2>Primero dinos, <strong>¿qué buscas en la plataforma?</strong></h2>
                    </Col>
                    <Col xs={12} lg={2}></Col> 
                </Row>
                <Row>
                    <Col xs={12} lg={2}></Col>
                    <Col xs={12} lg={8} className="d-flex justify-content-evenly">
                        <Link to="/formprofesor" className="btn btn-dark" >Enseñar</Link>
                        <Link to="/formusuario" className="btn btn-light" >Aprender</Link>
                    </Col>
                    <Col xs={12} lg={2}></Col>
                </Row>
                
            </Container>
        </>
    )
}

export default Registrarse;