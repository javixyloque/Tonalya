// Frontend/src/components/FormAlumno.jsx (1-245)

import { useState, useEffect } from "react";
import { SyncLoader } from "react-spinners";
import { useNavigate } from 'react-router-dom';
import { codificarImagen64 } from "../functions/codificar.js";
import { Container, Row, Col, Button, Form } from "react-bootstrap";
// import "./formalumno.css";
import Header from "../components/templates/Header.jsx";
import {arrayProvincias} from "../functions/variables.js";


const FormUsuario = () => {
    const navigate = useNavigate();
    const [validated, setValidated] = useState(false);
    const [nombre, setNombre] = useState('');
    const [email, setEmail] = useState('');
    const [telefono, setTelefono] = useState('');
    const [contrasenya, setContrasenya] = useState('');
    const [imagen, setImagen] = useState(null);
    const [provincia, setProvincia] = useState('');
    const [instrumentoP, setInstrumentoP] = useState('');
    const [instrumentos, setInstrumentos] = useState([]);
    const [loading, setLoading] = useState(true);
    const provincias = arrayProvincias();

    useEffect(() => {
        const fetchInstrumentos = async () => {
            try {
                const respuesta = await fetch('http://localhost:5000/instrumentos');
                const bdInstrumentos = await respuesta.json();
                setInstrumentos(bdInstrumentos);
                setLoading(false);
            } catch (error) {
                console.error('Error de red:', error);
                setLoading(false);
            }
        }
        fetchInstrumentos();

       

    }, []);

    const enviarFormulario = async (event) => {
        event.preventDefault();
        const formulario = event.currentTarget;

        // VALIDAR EL FORMULARIO 
        if (formulario.checkValidity() === false) {
            event.stopPropagation();
            setValidated(true);
            return;
        }

        let imagenCodificada = null;
        if (imagen) {
            try {
                imagenCodificada = await codificarImagen64(imagen);
            } catch (error) {
                console.error('Error codificando imagen:', error);
            }
        }

        const datosFormulario = JSON.stringify({
            nombre: nombre,
            email: email,
            telefono: telefono,
            password: contrasenya,
            imagen: imagenCodificada,
            provincia: provincia,
            instrumentos: instrumentoP,
        });

        try {
            const response = await fetch('http://localhost:5000/usuario', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: datosFormulario,
            });
            
            if (response.ok) {
                navigate('/');
            } else {
                const errorData = await response.json();
                console.error('Error al enviar el formulario', errorData);
            }
        } catch (error) {
            console.error('Error de red:', error);
        }

    };

    return (
        

        
        <>
        {loading ? (
            <>
            <Header/>
            <div className="loader">

            <SyncLoader size={150} color={'#213448'} loading={loading} />
            </div>
            </>
        ) : (

            <Container style={{ maxWidth: "80vw" }}>
                <Row className="mb-5">
                    <Col xs={12}>
                        <h1 style={{ textAlign: "center" }}>¿Quieres empezar a aprender?</h1>
                    </Col>
                    <Col xs={12}>
                        <h1 style={{ textAlign: "center" }}>Comencemos</h1>
                    </Col>
                </Row>
                <Row>
                    <Col xs={0} md={4}></Col>
                    <Col xs={12} md={4}>
                        <Form noValidate validated={validated} onSubmit={enviarFormulario}>
                            <Form.Group as={Col} md={12} className="mb-4">
                                <Form.Label>Dinos tu <strong>NOMBRE COMPLETO</strong>, aquel por el que quieras que te reconozcan tus profesores:</Form.Label>
                                <Form.Control
                                    required
                                    type="text"
                                    placeholder="Nombre"
                                    value={nombre}
                                    onChange={(e) => setNombre(e.target.value)}
                                />
                                <Form.Control.Feedback type="invalid">
                                    Por favor ingresa tu nombre
                                </Form.Control.Feedback>
                            </Form.Group>

                            <Form.Group as={Col} md={12} className="mb-4">
                                <Form.Label>Dinos tu <strong>EMAIL</strong>, para que los profesores puedan contactarte:</Form.Label>
                                <Form.Control
                                    required
                                    type="email"
                                    placeholder="Email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                                <Form.Control.Feedback type="invalid">
                                    Por favor ingresa un email válido
                                </Form.Control.Feedback>
                            </Form.Group>

                            <Form.Group as={Col} md={12} className="mb-4">
                                <Form.Label>Dinos tu <strong>TELÉFONO</strong>, para que los profesores puedan contactarte:</Form.Label>
                                <Form.Control
                                    required
                                    type="tel"
                                    placeholder="Teléfono"
                                    value={telefono}
                                    onChange={(e) => setTelefono(e.target.value)}
                                />
                                <Form.Control.Feedback type="invalid">
                                    Por favor ingresa un teléfono válido
                                </Form.Control.Feedback>
                            </Form.Group>

                            <Form.Group as={Col} md={12} className="mb-4">
                                <Form.Label>Dinos tu <strong>CONTRASEÑA</strong>, para que puedas acceder a tus clases:</Form.Label>
                                <Form.Control
                                    required
                                    type="password"
                                    placeholder="Contraseña"
                                    value={contrasenya}
                                    onChange={(e) => setContrasenya(e.target.value)}
                                />
                                <Form.Control.Feedback type="invalid">
                                    Por favor ingresa una contraseña válida
                                </Form.Control.Feedback>
                            </Form.Group>

                            <Form.Group as={Col} md={12} className="mb-4">
                                <Form.Label>Sube tu <strong>FOTO</strong>, para que los profesores puedan conocerte:</Form.Label>
                                <Form.Control
                                    type="file"
                                    accept=".jpg, .png"
                                    onChange={(e) => setImagen(e.target.files[0])}
                                />
                            </Form.Group>

                            <Form.Group as={Col} md={12} className="mb-4">
                                <Form.Label>¿En qué <strong>PROVINCIA</strong> estás ubicado?</Form.Label>
                                <Form.Select value={provincia} onChange={(e) => setProvincia(e.target.value)}>
                                    {provincias.map((provincia, index) => (
                                        <option key={index} value={provincia}>{provincia}</option>
                                    ))}
                                </Form.Select>
                            </Form.Group>

                            <Form.Group as={Col} md={12} className="mb-4">
                                <Form.Label>¿Cuál es tu <strong>INSTRUMENTO</strong> favorito?</Form.Label>
                                <Form.Select value={instrumentoP} onChange={(e) => setInstrumentoP(e.target.value)}>
                                    {instrumentos.map((instrumento, index) => (
                                        <option key={index} value={instrumento._id}>{instrumento.nombre}</option>
                                    ))}
                                </Form.Select>
                            </Form.Group>

                            <Col xs={12} style={{display: "flex", justifyContent: "center"}}>
                                <Button variant="outline-dark" type="submit" className="mt-4">
                                    ¡Crear cuenta!
                                </Button>
                            </Col>
                            
                        </Form>
                    </Col>
                    <Col xs={0} md={4}></Col>
                </Row>
            </Container>
        )
        }
            
        </>
    );
}

export default FormUsuario;