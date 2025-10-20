
import {useState, useEffect} from "react";
// import {SyncLoader} from "react-spinners"
import { useNavigate } from 'react-router-dom';
import { codificarImagen64 } from "../functions/codificar.js";
import {Container, Row, Col, Button, Form} from "react-bootstrap"
import "./formprofesor.css";
import Header from "../components/templates/Header.jsx";
import { arrayProvincias } from "../functions/variables.js";


const FormProfesor = () => {
    const navigate = new useNavigate();
    const [validated, setValidated] = useState(false);
    const [nombre, setNombre] = useState('');
    const [email, setEmail] = useState('');
    const [telefono, setTelefono] = useState('');
    const [contrasenya, setContrasenya] = useState('');
    const [imagen, setImagen]  = useState('');
    const [provincia, setProvincia] = useState('');
    const [instrumentoP, setInstrumentoP] = useState('');
    const [instrumentos, setInstrumentos] = useState([]);
    const [loading, setLoading] = useState(true);


    const provincias = arrayProvincias();
    useEffect (() => {
        const fetchInstrumentos = async () => {
            try {
                const respuesta = await fetch('http://localhost:5000/instrumentos');
                const bdInstrumentos = await respuesta.json();
                setInstrumentos(bdInstrumentos);
                setLoading(false);
            } catch (error) {
                console.error('Error de red:', error);
            }
        }
        fetchInstrumentos();
    }, [])


        
        const enviarFormulario = async (event) => {
            const formulario =  event.currentTarget;
            event.preventDefault();
            if (formulario.checkValidity() === false ) {
                event.stopPropagation();
                setValidated(true)
            }
            
           
            
            
            
            let imagenCodificada = btoa(imagen);
            
            if (imagen){
                imagenCodificada = await codificarImagen64(imagen) || undefined;
            }


            const datosFormulario = JSON.stringify({
                nombre: nombre,
                email: email,
                telefono: telefono,
                password: contrasenya,
                imagen: imagenCodificada,
                provincia: provincia,
                instrumentos : instrumentoP
            })
            

            try {
                const response = await fetch('http://localhost:5000/profesor', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: datosFormulario,
                });
                const insert = await response.json();
                if (response.ok) {
                    setValidated(true);
                    navigate('/profesores');
                } else {
                    console.error('Error al enviar el formulario', insert);
                    setValidated(true);
                }
            } catch (error) {
                console.error('Error de red:', error);
            }
        };

        
        


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
                        <Form noValidate validated={validated} onSubmit={enviarFormulario} method="POST" encType="multipart/form-data">
                            
                            
                            

                            <Form.Group as={Col} md={12} className="mb-4" >
                                <Form.Label>Dinos tu <strong>NOMBRE COMPLETO</strong>, aquel por el que quieras que te reconozcan tus alumnos:</Form.Label>
                                <Form.Control
                                    required
                                    type="text"
                                    placeholder="Nombre"
                                    value={nombre}
                                    onChange={(e) => setNombre(e.target.value)}
                                />
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
                            </Form.Group>

                            <Form.Group as={Col} md={12} className="mb-4" >
                                <Form.Label>Facilítanos tu <strong>TELEFONO</strong>, servirá para contactar con tus alumnos:</Form.Label>
                                <Form.Control
                                    required
                                    type="text"
                                    placeholder="Teléfono"
                                    value={telefono}
                                    onChange={(e) => setTelefono(e.target.value)}
                                    // defaultValue="Mark"
                                />
                            </Form.Group>
                            <Form.Group as={Col} md={12} className="mb-4" >
                                <Form.Label>Crea tu <strong>contraseña</strong>, para que no te olvides de tu cuenta <em>(no te preocupes, está a salvo con nosotros)</em></Form.Label>
                                <Form.Control
                                    required
                                    type="password"
                                    placeholder="******"
                                    value={contrasenya}
                                    onChange={(e) => setContrasenya(e.target.value)}
                                    // defaultValue="Mark"
                                />
                            </Form.Group>
                            

                            <Form.Group className="mb-5">
                                <Form.Label>Sube tu <strong>imagen de perfil</strong>, para que tus alumnos puedan reconocerte. <em>No te preocupes, podrás editarla o subirla más adelante</em></Form.Label>
                                <Form.Control
                                type="file"
                                required
                                value={imagen}
                                onChange={(e) => setImagen(e.target.value)}
                                />
                                <Form.Control.Feedback type="invalid" tooltip>
                                Así no está bien colega, pon una foto valida
                                </Form.Control.Feedback>
                            </Form.Group>

                            <Form.Group>
                                <Form.Label>Por último, dinos tu <strong>provincia</strong>, para encontrar alumnos cerca de ti</Form.Label>
                                <Form.Select onChange={(e) => setProvincia(e.target.value)} aria-label="provincias">
                                    <option>Selecciona tu provincia </option>
                                    {provincias.map( (provincia, index)=> {
                                        return (
                                            <option key={index} value={provincia}>{provincia}</option>
                                        );
                                    })}
                                    
                                </Form.Select>
                            </Form.Group>

                            <Form.Group>
                                <Form.Label>Por último, dinos tu <strong>provincia</strong>, para encontrar alumnos cerca de ti</Form.Label>
                                <Form.Select onChange={(e) => setInstrumentoP(e.target.value)} aria-label="provincias">
                                    <option>Selecciona tu provincia </option>
                                    {instrumentos.map((familia, index) => {
                                        <optgroup label={familia} key={index}></optgroup>
                                        familia.map((instrumento, index) => {
                                            <option key={index} value={instrumento}>instrumento</option>
                                        })
                                    })}
                                    
                                    
                                </Form.Select>
                            </Form.Group>

                            

                            
                            <label htmlFor="imagen" className='mb-2'></label>
                            
                            
                            <Col xs={12} style={{display: "flex", justifyContent: "center"}}>
                                <Button variant="outline-dark" type="submit">REGISTRARSE</Button>
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