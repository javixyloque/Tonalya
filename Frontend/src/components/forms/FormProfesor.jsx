import {useState, useEffect} from "react";
import {SyncLoader} from "react-spinners"
import { useNavigate } from 'react-router-dom';
import { codificarImagen64 } from "../../functions/codificar.js";
import {Container, Row, Col, Button, Form} from "react-bootstrap"
import "./formprofesor.css";
import Header from "../templates/Header.jsx";
import { arrayProvincias } from "../../functions/variables.js";



const FormProfesor = () => {
    if (sessionStorage.getItem('usuario')) {
        window.location.href = "/";
    } 
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
    const [precio, setPrecio] = useState(0);

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
            precioHora: precio,
            instrumentos: instrumentoP
        });

        try {
            const response = await fetch('http://localhost:5000/profesor', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: datosFormulario,
            });
            
            if (response.ok) {
                const objetoRespuesta = await response.json();
                if (objetoRespuesta.mensaje == "El correo electrónico ya está en uso") {
                    alert(objetoRespuesta.mensaje)
                } else {
                    alert(objetoRespuesta.mensaje)
                    setLoading(true);
                    setTimeout(() => {
                        setLoading(false);
                        navigate('/', {replace: true});
                    }, 1000)
                }
            } else {
                const errorData = await response.json();
                console.error('Error al enviar el formulario', errorData);
            }
        } catch (error) {
            console.error('Error de red:', error);
        }
    };

    if (loading) {
        return (
            <div className="loader">
                    <SyncLoader color="#213448"/><br></br>
                    <p style={{color: "#213448"}}>Registrando usuario</p>
            </div>
        );
    }

    return (
        <>
            <Header/>
            <Container style={{maxWidth: "80vw"}}>
                <Row className="mb-5" >
                    <Col xs={12}>
                        <h1 style={{textAlign: "center"}}>¿Quieres empezar a dar clases?</h1> 
                    </Col>
                    <Col xs={12}>
                        <h1 style={{textAlign: "center"}}>Comencemos</h1>
                    </Col>
                </Row>
                <Row>
                    <Col xs={0} md={4}></Col>
                    <Col xs={12} md={4}>
                        <Form noValidate validated={validated} onSubmit={enviarFormulario}>
                            <Form.Group as={Col} md={12} className="mb-4" >
                                <Form.Label>Dinos tu <strong>NOMBRE COMPLETO</strong>, aquel por el que quieras que te reconozcan tus alumnos:</Form.Label>
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

                            <Form.Group as={Col} md={12} className="mb-4" >
                                <Form.Label>Escribe tu <strong>CORREO ELECTRÓNICO</strong>, nos servirá para contactar contigo y enviarte alertas:</Form.Label>
                                <Form.Control
                                    required
                                    type="email"
                                    placeholder="Correo electrónico"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                                <Form.Control.Feedback type="invalid">
                                    Por favor ingresa un email válido
                                </Form.Control.Feedback>
                            </Form.Group>

                            <Form.Group as={Col} md={12} className="mb-4" >
                                <Form.Label>Facilítanos tu <strong>TELEFONO</strong>, servirá para contactar con tus alumnos:</Form.Label>
                                <Form.Control
                                    required
                                    type="text"
                                    placeholder="Teléfono"
                                    value={telefono}
                                    onChange={(e) => setTelefono(e.target.value)}
                                />
                                <Form.Control.Feedback type="invalid">
                                    Por favor ingresa tu teléfono
                                </Form.Control.Feedback>
                            </Form.Group>

                            <Form.Group as={Col} md={12} className="mb-4" >
                                <Form.Label>Crea tu <strong>contraseña</strong>, para que no te olvides de tu cuenta <em>(no te preocupes, está a salvo con nosotros)</em></Form.Label>
                                <Form.Control
                                    required
                                    type="password"
                                    placeholder="******"
                                    value={contrasenya}
                                    onChange={(e) => setContrasenya(e.target.value)}
                                />
                                <Form.Control.Feedback type="invalid">
                                    Por favor crea una contraseña
                                </Form.Control.Feedback>
                            </Form.Group>

                            <Form.Group className="mb-5">
                                <Form.Label>Sube tu <strong>imagen de perfil</strong>, para que tus alumnos puedan reconocerte. <em>No te preocupes, podrás editarla o subirla más adelante</em></Form.Label>
                                <Form.Control
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => setImagen(e.target.files[0])}
                                />
                                <Form.Control.Feedback type="invalid">
                                    Por favor sube una imagen válida
                                </Form.Control.Feedback>
                            </Form.Group>

                            <Form.Group className="mb-4">
                                <Form.Label>Por último, dinos tu <strong>provincia</strong>, para encontrar alumnos cerca de ti</Form.Label>
                                <Form.Select 
                                    value={provincia} 
                                    onChange={(e) => setProvincia(e.target.value)} 
                                    required
                                >
                                    <option value="">Selecciona tu provincia</option>
                                    {provincias.map((provincia, index) => (
                                        <option key={index} value={provincia}>
                                            {provincia}
                                        </option>
                                    ))}
                                </Form.Select>
                                <Form.Control.Feedback type="invalid">
                                    Por favor selecciona tu provincia
                                </Form.Control.Feedback>
                            </Form.Group>

                            <Form.Group className="mb-4">
                                <Form.Label>Selecciona tu <strong>instrumento principal</strong></Form.Label>
                                <Form.Select 
                                    value={instrumentoP} 
                                    onChange={(e) => setInstrumentoP(e.target.value)} 
                                    required>
                                    <option value="">Selecciona tu instrumento</option>
                                    {instrumentos.map((instrumento, index) => (
                                        <option key={index} value={instrumento._id }>
                                            {instrumento.nombre}
                                        </option>
                                    ))}
                                </Form.Select>
                                <Form.Control.Feedback type="invalid">
                                    Por favor selecciona tu instrumento
                                </Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>Indica el <strong>precio por hora</strong> que vas a querer cobrar a tus alumnos</Form.Label>
                                <Form.Control
                                    required
                                    type="number"
                                    placeholder="Precio por hora"
                                    value={precio}
                                    onChange={(e) => setPrecio(e.target.value)}
                                />
                                <Form.Control.Feedback type="invalid">
                                    Por favor ingresa un precio
                                </Form.Control.Feedback>
                            </Form.Group>

                            <Col xs={12} style={{display: "flex", justifyContent: "center"}}>
                                <Button variant="outline-dark" type="submit" className="mt-4">REGISTRARSE</Button>
                            </Col>
                        </Form>
                    </Col>
                    <Col xs={0} md={4}></Col>
                </Row>
            </Container>
        </>
    );
}

export default FormProfesor;