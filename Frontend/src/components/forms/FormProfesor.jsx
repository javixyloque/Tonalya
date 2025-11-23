import {useState, useEffect} from "react";
import {SyncLoader} from "react-spinners"
import { codificarImagen64 } from "../../functions/codificar.js";
import {Container, Row, Col, Button, Form, Alert, InputGroup} from "react-bootstrap"
import {Eye, EyeSlash} from 'react-bootstrap-icons';
// import "./formprofesor.css";
import Header from "../templates/Header.jsx";
import { arrayProvincias } from "../../functions/variables.js";



const FormProfesor = () => {
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
    const [precio, setPrecio] = useState(0);
    const [alerta, setAlerta] = useState(false);
    const [mensajeAlerta, setMensajeAlerta] = useState('');
    const [tipoAlerta, setTipoAlerta] = useState('success');
    const [mostrarContrasenya, setMostrarContrasenya] = useState(false);

    const manejarMostrarContrasenya = () => {
        setMostrarContrasenya(!mostrarContrasenya);
    }

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

    const enviarFormulario = async (event) => {
        event.preventDefault();
        const formulario = event.currentTarget;
        
        if (!contrasenyaValida) {
            setAlerta(true);
            setTipoAlerta('danger');
            setMensajeAlerta('La contraseña debe tener al menos 8 caracteres, una letra y un número');
            setTimeout(() => {
                setAlerta(false);
            }, 2000);
            return;
        } 

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
            precioHora: precio ? precio : 10,
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
                    setMensajeAlerta(objetoRespuesta.mensaje)
                    setAlerta(true);
                    setTipoAlerta('danger');
                    setTimeout(() => {
                        setAlerta(false);
                    }, 5000);
                } else {
                    setMensajeAlerta(objetoRespuesta.mensaje+ ", ¡Bienvenido a Tonalya!");
                    setAlerta(true);
                    setTipoAlerta('success');
                    setTimeout(() => {
                        setAlerta(false);
                        setLoading(true);
                    }, 4000);
                    setTimeout(() => {
                        setLoading(false);
                        window.location.href = '/';
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
                    <p style={{color: "#213448"}}>Cargando...</p>
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
                    <Col xs={0} sm={2} md={3} xl={4}></Col>
                    <Col xs={12} sm={8} md={6} xl={4}>
                        <Form noValidate validated={validated} onSubmit={enviarFormulario}>
                            <Form.Group as={Col} md={12} className="mb-4" >
                                <Form.Label><strong>Nombre completo</strong>, es el que aparecerá en tu perfil:</Form.Label>
                                <Form.Control required type="text" placeholder="Nombre" value={nombre} onChange={(e) => setNombre(e.target.value)}/>
                                <Form.Control.Feedback type="invalid">
                                    Por favor ingresa tu nombre
                                </Form.Control.Feedback>
                            </Form.Group>

                            <Form.Group as={Col} md={12} className="mb-4" >
                                <Form.Label><strong>Correo electrónico</strong>, nos servirá para contactarte y comunicarte con los alumnos:</Form.Label>
                                <Form.Control required type="email" placeholder="Correo electrónico" value={email} onChange={(e) => setEmail(e.target.value)}/>
                                <Form.Control.Feedback type="invalid"> Por favor ingresa un email válido </Form.Control.Feedback>
                            </Form.Group>

                            <Form.Group as={Col} md={12} className="mb-4" >
                                <Form.Label><strong>Teléfono</strong>, útil para incidencias y contactar:</Form.Label>
                                <Form.Control required type="text" placeholder="Teléfono" value={telefono} onChange={(e) => setTelefono(e.target.value)} />
                                <Form.Control.Feedback type="invalid"> Por favor ingresa tu teléfono</Form.Control.Feedback>
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

                            <Form.Group className="mb-5">
                                <Form.Label><strong>Imagen de perfil</strong>, para que tus alumnos puedan reconocerte. <br /><em>No te preocupes, podrás editarla o subirla más adelante</em></Form.Label>
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
                                <Form.Label><strong>Provincia</strong>, para que te encuentren fácilmente tus alumnos</Form.Label>
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
                                <Form.Label><strong>Instrumento principal</strong></Form.Label>
                                <Form.Select 
                                    value={instrumentoP} 
                                    onChange={(e) => setInstrumentoP(e.target.value)} required>
                                    <option value="">Selecciona tu instrumento</option>
                                    {instrumentos.map((instrumento, index) => (
                                        <option key={index} value={instrumento._id }> {instrumento.nombre} </option> ))}
                                </Form.Select>
                                <Form.Control.Feedback type="invalid">
                                    Por favor selecciona tu instrumento
                                </Form.Control.Feedback>
                            </Form.Group>


                            <Form.Group>
                                <Form.Label><strong>Precio por hora</strong> que tendrán tus clases</Form.Label>
                                <Form.Control
                                    required type="number" step={1} defaultValue={10}  placeholder="Precio por hora" min={5} max={100} onChange={(e) => setPrecio(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            enviarFormulario(e)
                                        }
                                    }}
                                    />
                                <Form.Control.Feedback type="invalid">
                                    Por favor ingresa un precio válido (entre 5 y 100 euros)
                                </Form.Control.Feedback>
                            </Form.Group>

                            {alerta && <Alert style={{transition: "all 0.5s ease-in-out"}} variant={tipoAlerta} className="my-4">{mensajeAlerta}</Alert>}

                            <Col xs={12} style={{display: "flex", justifyContent: "center"}}>
                                <Button variant="primary" type="submit" className="mt-4">Registrarse</Button>
                            </Col>
                        </Form>
                    </Col>
                </Row>
            </Container>
        </>
    );
}

export default FormProfesor;