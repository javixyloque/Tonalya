// Frontend/src/components/FormAlumno.jsx (1-245)

import { useState, useEffect } from "react";
import { SyncLoader } from "react-spinners";
import { codificarImagen64 } from "../../functions/codificar.js";
import { Container, Row, Col, Button, Form, Alert, InputGroup } from "react-bootstrap";
import {Eye, EyeSlash} from 'react-bootstrap-icons';
// import "./formalumno.css";
import Header from "../templates/Header.jsx";
import {arrayProvincias} from "../../functions/variables.js";


const FormUsuario = () => {
    if (sessionStorage.getItem('usuario')) {
        window.location.href = "/";
    }
    const [validated, setValidated] = useState(false);
    const [nombre, setNombre] = useState('');
    const [email, setEmail] = useState('');
    const [telefono, setTelefono] = useState('');
    const [contrasenya, setContrasenya] = useState('');
    const [contrasenyaValida, setContrasenyaValida] = useState(false);
    const [imagen, setImagen] = useState(null);
    const [provincia, setProvincia] = useState('');
    const [instrumentoP, setInstrumentoP] = useState('');
    const [instrumentos, setInstrumentos] = useState([]);
    const [loading, setLoading] = useState(true);
    const provincias = arrayProvincias();
    const [mostrarContrasenya, setMostrarContrasenya] = useState(false);    
    const [alerta, setAlerta] = useState(false);
    const [mensajeAlerta, setMensajeAlerta] = useState('');
    const [tipoAlerta, setTipoAlerta] = useState('success');
    
    const manejarMostrarContrasenya = () => {
        setMostrarContrasenya(!mostrarContrasenya);
    }   

    const verificarContrasenya = (password) => {
        // ESTA ME LA HA HECHO EL CHATGPT PORQUE NUNCA HE ENTENDIDO Y CREO QUE NUNCA LO VOY A ENTENDER
        const patron = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
        return patron.test(password);
    }
    const manejarCambioContrasenya = (event) => {
        const contrasenya = event.target.value;
        setContrasenya(contrasenya);
        setContrasenyaValida(verificarContrasenya(contrasenya));
    };

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
        if (!contrasenyaValida) {
            setAlerta(true);
            setTipoAlerta('danger');
            setMensajeAlerta('La contraseña debe tener al menos 8 caracteres, una letra y un número');
            setTimeout(() => {
                setAlerta(false);
            }, 2000);
            return;
        }
        event.preventDefault();
        const formulario = event.currentTarget;
        // setLoading(true)

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
            
            const objetoRespuesta = await response.json();

            if (objetoRespuesta.ok) {
                setMensajeAlerta(objetoRespuesta.mensaje)
                setTipoAlerta('success');
                setAlerta(true);
                setTimeout(() => {
                    setAlerta(false);
                    window.location.href = '/';
                }, 3000)
                
            } else {
                setMensajeAlerta(objetoRespuesta.mensaje)
                setTipoAlerta('danger');
                setAlerta(true);
                setTimeout(() => {
                    setAlerta(false);
                }, 2000);
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

                <SyncLoader color={'#213448'} loading={loading} />
                <p style={{color: "#213448"}}>Cargando...</p>
            </div>
            </>
        ) : (
            <>
            <Header/>
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
                    <Col xs={0} sm={2} md={3} xl={4}></Col>
                    <Col xs={12} sm={8} md={6} xl={4}>
                        <Form noValidate validated={validated} onSubmit={enviarFormulario}>
                            <Form.Group as={Col} md={12} className="mb-4">
                                <Form.Label>Dinos tu <strong>nombre completo</strong>, aquel por el que quieras que te reconozcan:</Form.Label>
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
                                <Form.Label>Dinos tu <strong>email</strong>, para que los profesores puedan contactarte:</Form.Label>
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
                                <Form.Label>Dinos tu <strong>teléfono</strong>, para que los profesores puedan contactarte:</Form.Label>
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

                            <Form.Group as={Col} md={12} className="mb-4" >
                                <Form.Label><strong>Contraseña</strong><br /><em>(Mínimo 8 caracteres, una letra y un número)</em></Form.Label>
                                <InputGroup>
                                <Form.Control required type={mostrarContrasenya ? "text" : "password"} placeholder="******"  value={contrasenya} onChange={manejarCambioContrasenya} 
                                    isInvalid={contrasenya && !contrasenyaValida}
                                    isValid={contrasenyaValida} />
                                    <Button variant="outline-primary" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={() => manejarMostrarContrasenya()}>
                                        {mostrarContrasenya ? <EyeSlash/> : <Eye/>}
                                        </Button>
                                        </InputGroup>

                                    {contrasenya && !contrasenyaValida && (
                                        <span className="text-danger ms-2">Formato Incorrecto</span>
                                    )}
                                    {contrasenyaValida && (
                                        <span className="text-success ms-2">Formato Correcto</span>
                                    )}
                                
                            </Form.Group>

                            <Form.Group as={Col} md={12} className="mb-4">
                                <Form.Label>Sube tu <strong>foto</strong><br /><em>(No te preocupes, no tienes por qué hacerlo ahora)</em></Form.Label>
                                <Form.Control
                                    type="file"
                                    accept=".jpg, .png, .jpeg"
                                    onChange={(e) => setImagen(e.target.files[0])}
                                />
                            </Form.Group>

                            <Form.Group as={Col} md={12} className="mb-4">
                                <Form.Label>¿En qué <strong>provincia</strong> estás ubicado?</Form.Label>
                                <Form.Select value={provincia} onChange={(e) => setProvincia(e.target.value)}>
                                    {provincias.map((provincia, index) => (
                                        <option key={index} value={provincia}>{provincia}</option>
                                    ))}
                                </Form.Select>
                            </Form.Group>

                            <Form.Group as={Col} md={12} className="mb-4">
                                <Form.Label>¿Cuál es tu <strong>instrumento</strong> favorito?</Form.Label>
                                <Form.Select value={instrumentoP} onChange={(e) => setInstrumentoP(e.target.value)}>
                                    {instrumentos.map((instrumento, index) => (
                                        <option key={index} value={instrumento._id}>{instrumento.nombre}</option>
                                    ))}
                                </Form.Select>
                            </Form.Group>

                            {alerta && <Alert style={{transition: "all 0.5s ease-in-out"}} variant={tipoAlerta} className="my-4">{mensajeAlerta}</Alert>}

                            <Col xs={12} style={{display: "flex", justifyContent: "center"}}>
                                <Button variant="primary" type="submit" className="mt-4">
                                    ¡Crear cuenta!
                                </Button>
                            </Col>
                            
                        </Form>
                    </Col>
                    <Col xs={0} sm={2} md={3} xl={4}></Col>
                </Row>
            </Container>
            </>
        )
        }
            
        </>
    );
}

export default FormUsuario;