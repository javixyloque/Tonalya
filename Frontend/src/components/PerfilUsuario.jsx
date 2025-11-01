import {useState, useEffect} from "react";
import {SyncLoader} from "react-spinners";
import { Container, Row, Col, Form, Button, ListGroup,ListGroupItem } from 'react-bootstrap';
import Header from "./templates/Header";
import  {arrayProvincias} from "../functions/variables.js";
import {Link} from "react-router-dom"



const PerfilUsuario = () => {
    const [usuario, setUsuario] = useState(null);
    const [loading, setLoading] = useState(true);
    const [clases, setClases] = useState([])
    const [instrumentos, setInstrumentos] = useState([]);
    const provincias = arrayProvincias();

    

    useEffect(() => {
        async function cargarUsuario ( ) {
            if (!sessionStorage.getItem('id') || !sessionStorage.getItem('rol')=="alumno") {
                window.location.href = '/';
                return;
            }
            const idUsr = sessionStorage.getItem('id');
            const datosUsr = await fetch(`http://localhost:5000/usuario/${idUsr}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            const usr = await datosUsr.json();
            
            setUsuario(usr);
            setLoading(false);
        }
        cargarUsuario();

        async function cargarClasesUsuario ( ) {
            if (!usuario || !usuario.clases) {
                return
            }
            try {
                const respuesta = await fetch(`http://localhost:5000/usuario/clases/${sessionStorage.getItem('id')}`, {
                    method: 'GET',
                    headers: {
                        "Content-Type": "application/json"
                    }
                })
    
                const arrayClases = await respuesta.json();
                setClases(arrayClases);
                setLoading(false);

            } catch (exception) {
                console.error('Error de red:', exception);
                setLoading(false);
            }
        }
        cargarClasesUsuario();

        async function cargarInstrumentosUsuario () {
            if (!usuario || !usuario.instrumentos) {
                return 
            }
            const idInstrumentos = usuario.instrumentos;
            try {
                const instrumentos = idInstrumentos.map(async (idInstrumento) => {
                    const respuesta = await fetch(`http://localhost:5000/instrumentos/${idInstrumento}`, {
                        method: 'GET',
                        headers: {
                            "Content-Type": "application/json"
                        }
                    });
                    const instrumento = await respuesta.json();
                    return instrumento;
                })

                const arrayInstrumentos = await Promise.all(instrumentos);
                setInstrumentos(arrayInstrumentos);
                setLoading(false);
                    

            } catch (exception) {
                console.error('Error de red:', exception);
                setLoading(false);
            }
        }
        cargarInstrumentosUsuario();
    },);


    const enviarFormulario = async (event) => {
        try {
            const formData = new FormData(event.currentTarget);
            const respuesta = await fetch(`http://localhost:5000/usuario/${usuario._id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            if (respuesta.ok) {
                const datosActualizados = await respuesta.json();
                setUsuario(datosActualizados);
                
                sessionStorage.setItem('profesor', datosActualizados.nombre);
                alert('Perfil actualizado correctamente');
                // NAVEGAR A LA MISMA PAGINA
                window.location.reload()
            }
        } catch (error) {
            console.error('Error actualizando perfil:', error);
        }
    }


    return (
        <>
        {loading ? (
            <div className="loader">
                <SyncLoader color="#ECEFCA"/><br></br>
                <p style={{color: "#ECEFCA"}}>Cargando perfil...</p>
            </div>
        ) : (
            <>
                <Header/>
                <Container>
                <Row className="mb-4">
                    <Col xs={12} md={6}>
                    <h1>Perfil de usuario</h1>
                    </Col>
                </Row>

                <Form onSubmit={enviarFormulario} className="mb-5">
                    <Row className="mb-3">
                    <Col xs={12} md={6}>
                        <Form.Group controlId="nombre" className="mb-4">
                        <Form.Label>Nombre:</Form.Label>
                        {/* EL OPERADOR ... ES PARA CLONAR EL OBJETO */}
                        <Form.Control type="text" value={usuario.nombre} onChange={(e) => setUsuario({...usuario, nombre: e.target.value})} />
                        </Form.Group>
                    </Col>

                    <Col xs={12} md={6}>
                        <Form.Group controlId="email" className="mb-4">
                        <Form.Label>Email: (no modificable)</Form.Label>
                        <Form.Control type="email" value={usuario.email} disabled />
                        </Form.Group>
                    </Col>
                    </Row>

                    <Row className="mb-3">
                    <Col xs={12} md={6}>
                        <Form.Group controlId="telefono" className="mb-4">
                        <Form.Label>Teléfono: (no modificable)</Form.Label>
                        <Form.Control type="text" value={usuario.telefono} disabled />
                        </Form.Group>
                    </Col>

                    <Col xs={12} md={6}>
                         <Form.Group as={Col} md={12} className="mb-4" >
                                <Form.Label>Provincia</Form.Label>
                                <Form.Select value={usuario.provincia} onChange={(e) => setUsuario({...usuario, provincia: e.target.value})}>
                                    {provincias.map((provincia, index) => (
                                        <option key={index} value={provincia}>{provincia}</option>
                                    ))}
                                </Form.Select>
                            </Form.Group>

                    </Col>
                    </Row>

                    {/* <Row className="mb-3">
                    <Col xs={12}>
                        <Form.Group controlId="password">
                        <Form.Label>Password:</Form.Label>
                        <Form.Control type="password" placeholder="Ingrese nuevo password" />
                        </Form.Group>
                    </Col>
                    </Row> */}

                    <Button variant="primary" type="submit">
                    Guardar cambios
                    </Button>
                </Form>

                <Row className="mb-3">
                    <Col xs={12} md={6}>
                        <ListGroup>
                            <ListGroupItem header="Clases del alumno">
                            {clases.map((clase, index) => (
                                
                                <ListGroupItem key={index} active>
                                {clase.descripcion} - {new Date(clase.fechaInicio).toLocaleDateString()}
                                </ListGroupItem>
                            ))}
                            </ListGroupItem>
                        </ListGroup>
                    </Col>
                </Row>

                <Row className="mb-3">
                    <Col xs={12} md={6}>
                        <ListGroup>
                            <ListGroupItem header="Instrumentos del alumno">
                            {instrumentos.map((instrumento, index) => (
                                
                                <ListGroupItem key={index} active>
                                {instrumento.nombre} - {instrumento.familia}
                                </ListGroupItem>
                            ))}
                            </ListGroupItem>
                        </ListGroup>
                    </Col>
                    <Col xs={12} md={6}>
                    <Link to="/modificarinstrumentos"></Link>
                    </Col>
                </Row>







                </Container>
            </>

            
            
        
        )}
        </>
    )
}

export default PerfilUsuario;