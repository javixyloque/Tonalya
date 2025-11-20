import {useState, useEffect} from "react";
import {SyncLoader} from "react-spinners";
import { Container, Row, Col, Form, Button, ListGroup, Modal, Alert, Card, Tabs, Tab } from 'react-bootstrap';

import Header from "./templates/Header";
import {arrayProvincias} from "../functions/variables.js";
import { codificarImagen64 } from "../functions/codificar.js";

const PerfilProfesor = () => {
    const [profesor, setProfesor] = useState(null);
    const [loading, setLoading] = useState(true);
    const [clasesPendientes, setClasesPendientes] = useState([]);
    const [clasesAceptadas, setClasesAceptadas] = useState([]);
    const [clasesPagadas, setClasesPagadas] = useState([]);
    const [clasesCompletadas, setClasesCompletadas] = useState([]);
    const [instrumentos, setInstrumentos] = useState([]);
    const [mostrarGestionInstrumentos, setMostrarGestionInstrumentos] = useState(false);
    const [instrumentosDisponibles, setInstrumentosDisponibles] = useState([]);
    const [instrumentoSeleccionado, setInstrumentoSeleccionado] = useState('');
    const provincias = arrayProvincias();
    const [imagen, setImagen] = useState(null);

    const [mostrarModalAsistencia, setMostrarModalAsistencia] = useState(false);
    const [idSeleccionada, setIdSeleccionada] = useState(null);
    const [claseSeleccionada, setClaseSeleccionada] = useState(null);
    const [loadingClase, setLoadingClase] = useState(false);
    const [asistencia, setAsistencia] = useState(null);

    const [mostrarAlerta, setMostrarAlerta] = useState(false);
    const [mensajeAlerta, setMensajeAlerta] = useState('');
    const [tipoAlerta, setTipoAlerta] = useState('success');
    
    const mostrarModal = () => setMostrarModalAsistencia(true);
    const ocultarModal = () => setMostrarModalAsistencia(false);

    // CARGAR TODOS LOS DATOS DEL PROFESOR
    useEffect(() => {
        async function cargarDatosProfesor() {
            if (!sessionStorage.getItem('usuario') || sessionStorage.getItem('rol') !== "profesor") {
                window.location.href = '/';
                return;
            }

            const idProf = sessionStorage.getItem('id');
            
            try {
                const datosProf = await fetch(`http://localhost:5000/profesor/${idProf}`);
                const prof = await datosProf.json();
                setProfesor(prof);

                // CLASES N INSTRUMENTOS PROFESOR
                const [clasesInstrumentos, instrumentosResp] = await Promise.all([
                    // CLASES
                    fetch(`http://localhost:5000/profesor/clases-instrumentos/${idProf}`).then(res => res.json()),
                    // INSTRUMENTOS
                    Promise.all(
                        (prof.instrumentos).map(idInstrumento => 
                            fetch(`http://localhost:5000/instrumentos/${idInstrumento}`).then(res => res.json())
                        )
                    )
                ]);
                const datosClases = clasesInstrumentos;

                let clases = (datosClases.clasesProfesor);
                let tipoClases = {
                    pendiente: [],
                    aceptada: [],
                    pagada: [],
                    rechazada: [],
                    completada: [],
                }
               
                clases.forEach((clase) => {
                    switch (clase.estado){
                        case 'pendiente':
                            tipoClases.pendiente.push(clase);
                            break;
                        case 'aceptada':
                            tipoClases.aceptada.push(clase);
                            break;
                        case 'pagada':
                            tipoClases.pagada.push(clase)
                            break;
                        case 'rechazada':
                            tipoClases.completada.push(clase)
                            break;
                        case 'completada':
                            tipoClases.completada.push(clase)
                            break;
                    } 
                })

                setClasesPendientes(tipoClases.pendiente);
                setClasesAceptadas(tipoClases.aceptada);
                setClasesPagadas(tipoClases.pagada);
                // setClasesRechazadas(tipoClases.rechazada);
                setClasesCompletadas(tipoClases.completada);

                setInstrumentos(instrumentosResp);

            } catch (error) {
                console.error('Error cargando datos:', error);
            } finally {
                setLoading(false);
            }
        }

        cargarDatosProfesor();
    }, []);

    // CARGAR INSTRUMENTOS DISPONIBLES
    useEffect(() => {
        async function cargarInstrumentosDisponibles() {
            if (!mostrarGestionInstrumentos) return;
            
            try {
                const respuesta = await fetch('http://localhost:5000/instrumentos');
                const datos = await respuesta.json();
                setInstrumentosDisponibles(datos);
            } catch (error) {
                console.error('Error cargando instrumentos:', error);
            }
        }

        cargarInstrumentosDisponibles();
    }, [mostrarGestionInstrumentos]);
    

    // EFECTO PARA SELECCIONAR LA CLASE QUE SE VA A COMPLETAR   
    useEffect(() => {
        const fetchClase = async () => {
            try {
                const respuesta = await fetch(`http://localhost:5000/clase/${idSeleccionada}`);
                if (respuesta.ok) {
                    const clase = await respuesta.json();
                    setClaseSeleccionada(clase);
                    setLoadingClase(false)
                } else {
                    console.error("Error cargando la clase seleccionada");
                }
            } catch(error) {
                console.error("Error cargando la clase seleccionada", error);
            }
        }
        fetchClase();
    }, [idSeleccionada])

    const rechazarClase = async (claseId) => {
        const mensaje = window.prompt('Explique al alumno el motivo de su rechazo');

        if (mensaje === null) {
            return;
        } else if (mensaje === '' || mensaje.length < 20) {
            alert('El motivo debe tener al menos 20 caracteres');
            rechazarClase(claseId);
            return;
        }
        
        try {
            const respuesta = await fetch(`http://localhost:5000/profesor/clase/${claseId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ estado: 'rechazada', mensaje: mensaje })
            })
            if (respuesta.ok) {
                alert('Clase rechazada correctamente');
                window.location.reload();
            } else {
                alert('Error al rechazar la clase');
            }
        } catch (error) {
            console.error('Error rechazando clase:', error);
        }
    }

    // ACTUALIZAR PERFIL PROFESOR - CORREGIDO
    const enviarFormulario = async (event) => {
        event.preventDefault();
        
        if (!profesor) return;
        
        try {
            const datosActualizados = {
                nombre: profesor.nombre || '',
                provincia: profesor.provincia || '',
                bio: profesor.bio || '',
                precioHora: profesor.precioHora || 0
            };

            if (imagen) {
                const imagenCodificada = await codificarImagen64(imagen);
                datosActualizados.imagen = imagenCodificada;
            }

            const respuesta = await fetch(`http://localhost:5000/profesor/${profesor._id}`, {
                method: 'PUT',
                headers: { 
                    'Content-Type': 'application/json' 
                },
                body: JSON.stringify(datosActualizados)
            });

            if (respuesta.ok) {
                const profesorActualizado = await respuesta.json();
                setProfesor(profesorActualizado);
                sessionStorage.setItem('profesor', profesorActualizado.nombre);
                alert('Perfil actualizado correctamente');
            } else {
                alert('Error al actualizar el perfil');
            }
        } catch (error) {
            console.error('Error actualizando perfil:', error);
            alert('Error de conexión');
        }
    }

    // AÑADIR INSTRUMENTO AL PROFESOR
    const anadirInstrumento = async () => {
        // if (!instrumentoSeleccionado) {
        //     alert('Selecciona un instrumento');
        //     return;
        // }

        try {
            console.log(instrumentoSeleccionado)

            const respuesta = await fetch(`http://localhost:5000/profesor/${profesor._id}/instrumento`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    instrumento: instrumentoSeleccionado
                })
            });

            if (respuesta.ok) {
                const instrumentoAnadido = await fetch(`http://localhost:5000/instrumentos/${instrumentoSeleccionado}`).then(res => res.json());
                setInstrumentos(prev => [...prev, instrumentoAnadido]);
                setInstrumentoSeleccionado('');
                setMostrarGestionInstrumentos(false);
                alert('Instrumento añadido correctamente');
            } else {
                alert('Error al añadir el instrumento');
            }
        } catch (error) {
            console.error('Error añadiendo instrumento:', error);
            alert(error);
        }
    };

    // ELIMINAR INSTRUMENTO DEL PROFESOR
    const eliminarInstrumento = async (instrumentoId) => {
        if (!confirm('¿Estás seguro de que quieres eliminar este instrumento?')) return;

        try {
            const respuesta = await fetch(`http://localhost:5000/profesor/${profesor._id}/instrumento/${instrumentoId}`, {
                method: 'DELETE'
            });

            if (respuesta.ok) {
                setInstrumentos(prev => prev.filter(instr => instr._id !== instrumentoId));
                alert('Instrumento eliminado correctamente');
            } else {
                alert('Error al eliminar el instrumento');
            }
        } catch (error) {
            console.error('Error eliminando instrumento:', error);
            alert('Error de conexión');
        }
    };

    // FUNCION PARA MOSTRAR EL MODAL DE ASISTENCIA
    const manejarModalAsistencia = (idClase) => {
        setLoadingClase(true);
        setIdSeleccionada(idClase);
        mostrarModal();
    }

    const aceptarClase = async (claseId) => {
        try {
            const respuesta = await fetch(`http://localhost:5000/profesor/clase/${claseId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ estado: 'aceptada' })
            });
            if (respuesta.ok) {
                alert('Clase aceptada correctamente');
                window.location.reload();
            } else {
                alert('Error al aceptar la clase');
            }
        } catch (error) {
            console.error('Error aceptando clase:', error);
        }
    }

    const actualizarAsistencia = async () => {
        try {
            const respuesta = await fetch(`http://localhost:5000/profesor/clase/${idSeleccionada}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ asistencia: asistencia, estado: "completada" })
            });

            if (respuesta.ok) {
                const datosResp = await respuesta.json();
                setTipoAlerta('success');
                setMensajeAlerta(datosResp.mensaje);
                setMostrarAlerta(true);
                setTimeout(() => {
                    setMostrarAlerta(false);
                    window.location.reload();
                }, 2000);
            } else {
                setTipoAlerta('danger');
                setMensajeAlerta('Error al actualizar la asistencia');
                setMostrarAlerta(true);
                setTimeout(() => {
                    setMostrarAlerta(false);    
                }, 2000);
            }
        } catch (error) {
            console.error('Error actualizando asistencia:', error);
        }
    }

    return (
        <>
        {loadingClase && (
            <div className="loader">
                <SyncLoader color="#213448"/><br></br>
                <p style={{color: "#213448"}}>Cargando asistencia...</p>
            </div>
        )}
        {loading ? (
            <div className="loader">
                <SyncLoader color="#213448"/><br></br>
                <p style={{color: "#213448"}}>Cargando perfil...</p>
            </div>
        ) : (
            <>
                <Header/>
                <Container className="mt-4">
                    <Row className="mb-4">
                        <Col xs={12}>
                            <h1>Perfil de {profesor?.nombre}</h1>
                        </Col>
                    </Row>

                    <Tabs defaultActiveKey="perfil" className="mb-4 perfil-tabs">
                        {/* PESTAÑA PERFIL */}
                        <Tab eventKey="perfil" title="Perfil" >
                            <Card>
                        <Row>
                            <Col xs={0} md={3}></Col>
                            <Col xs={12} md={6}>
                                <Card.Body>
                                    {profesor?.imagen && (
                                                
                                                    <img src={profesor.imagen} className="my-5 rounded-circle" alt="Imagen de perfil"  style={{ maxWidth: '100px', alignContent: 'center', display: 'block', margin: '0 auto' }} />
                                            
                                            )}
                                    <Form onSubmit={enviarFormulario}>
                                        <Row className="my-3">
                                            <Col xs={12} md={6}>
                                                <Form.Group controlId="nombre" className="mb-4">
                                                    <Form.Label>Nombre:</Form.Label>
                                                    <Form.Control 
                                                        type="text" 
                                                        value={profesor?.nombre || ''} 
                                                        onChange={(e) => setProfesor({...profesor, nombre: e.target.value})} 
                                                    />
                                                </Form.Group>
                                            </Col>

                                            <Col xs={12} md={6}>
                                                <Form.Group controlId="email" className="mb-4">
                                                    <Form.Label>Email: (no modificable)</Form.Label>
                                                    <Form.Control 
                                                        type="email" 
                                                        value={profesor?.email || ''} 
                                                        disabled 
                                                    />
                                                </Form.Group>
                                            </Col>
                                        </Row>

                                        <Row className="mb-3">
                                            <Col xs={12} md={6}>
                                                <Form.Group controlId="telefono" className="mb-4">
                                                    <Form.Label>Teléfono: (no modificable)</Form.Label>
                                                    <Form.Control 
                                                        type="text" 
                                                        value={profesor?.telefono || ''} 
                                                        disabled 
                                                    />
                                                </Form.Group>
                                            </Col>

                                            <Col xs={12} md={6}>
                                                <Form.Group controlId="precioHora" className="mb-4">
                                                    <Form.Label>Precio por hora (€):</Form.Label>
                                                    <Form.Control 
                                                        type="number" 
                                                        value={profesor?.precioHora || ''} 
                                                        onChange={(e) => setProfesor({...profesor, precioHora: parseFloat(e.target.value)})} 
                                                        step="0.01"
                                                        min="0"
                                                    />
                                                </Form.Group>
                                            </Col>
                                        </Row>

                                        <Row className="mb-3">
                                            <Col xs={12} md={6}>
                                                <Form.Group className="mb-4">
                                                    <Form.Label>Provincia</Form.Label>
                                                    <Form.Select 
                                                        value={profesor?.provincia || ''} 
                                                        onChange={(e) => setProfesor({...profesor, provincia: e.target.value})}
                                                    >
                                                        {provincias.map((provincia, index) => (
                                                            <option key={index} value={provincia}>{provincia}</option>
                                                        ))}
                                                    </Form.Select>
                                                </Form.Group>
                                            </Col>
                                        </Row>

                                        <Row className="mb-3">
                                            <Col xs={12}>
                                                <Form.Group controlId="bio" className="mb-4">
                                                    <Form.Label>Biografía:</Form.Label>
                                                    <Form.Control 
                                                        as="textarea" 
                                                        rows={4}
                                                        value={profesor?.bio || ''} 
                                                        onChange={(e) => setProfesor({...profesor, bio: e.target.value})} 
                                                        placeholder="Cuéntales a tus alumnos todo sobre tu experiencia musical..."
                                                    />
                                                </Form.Group>
                                            </Col>
                                        </Row>

                                        <Row>
                                              
                                            <Col xs={12} md={6}> 
                                                <Form.Group className="mb-5">
                                                    <Form.Label>Actualiza tu <strong>imagen de perfil</strong></Form.Label>
                                                    <Form.Control
                                                        type="file"
                                                        accept="image/*"
                                                        onChange={(e) => setImagen(e.target.files[0])}
                                                    />
                                                </Form.Group>
                                            </Col>
                                        </Row>

                                        <Button variant="primary" type="submit" className="mt-3 ">
                                            Guardar cambios
                                        </Button>
                                    </Form>
                                </Card.Body>
                                </Col>
                                <Col xs={0} md={3}></Col>
                            </Row>
                            </Card>
                        </Tab>

                        {/* PESTAÑA INSTRUMENTOS */}
                        <Tab eventKey="instrumentos" title="Instrumentos" >
                            <Card>
                                <Card.Body>
                                    <div className="d-flex justify-content-between align-items-center mb-3">
                                        <h3>Tus Instrumentos</h3>
                                        <Button 
                                            variant="outline-primary" 
                                            onClick={() => setMostrarGestionInstrumentos(!mostrarGestionInstrumentos)}
                                        >
                                            {mostrarGestionInstrumentos ? 'Cancelar' : 'Añadir Instrumento'}
                                        </Button>
                                    </div>

                                    <ListGroup>
                                        {instrumentos.map((instrumento) => (
                                            <ListGroup.Item key={instrumento._id} className="d-flex justify-content-between align-items-center">
                                                <div>
                                                    <strong>{instrumento.nombre}</strong> - {instrumento.familia}
                                                </div>
                                                <Button 
                                                    variant="outline-danger" 
                                                    size="sm"
                                                    onClick={() => eliminarInstrumento(instrumento._id)}
                                                >
                                                    Eliminar
                                                </Button>
                                                
                                            </ListGroup.Item>
                                        ))}
                                    </ListGroup>

                                    {mostrarGestionInstrumentos && (
                                        <div className="mt-4 p-3 border rounded bg-light">
                                            <h4>Añadir Nuevo Instrumento</h4>
                                            <Form.Group className="mb-3">
                                                <Form.Label>Selecciona un instrumento:</Form.Label>
                                                <Form.Select 
                                                    value={instrumentoSeleccionado} 
                                                    onChange={(e) => setInstrumentoSeleccionado(e.target.value)}
                                                >
                                                    <option value="">-- Selecciona un instrumento --</option>
                                                    {instrumentosDisponibles.map(instr => (
                                                        <option key={instr._id} value={instr._id}>
                                                            {instr.nombre} ({instr.familia})
                                                        </option>
                                                    ))}
                                                </Form.Select>
                                            </Form.Group>
                                            <div className="d-flex gap-2">
                                                <Button 
                                                    variant="primary" 
                                                    onClick={() => anadirInstrumento()}
                                                    disabled={!instrumentoSeleccionado}
                                                >
                                                    Añadir Instrumento
                                                </Button>
                                                <Button 
                                                    variant="secondary" 
                                                    onClick={() => setMostrarGestionInstrumentos(false)}
                                                >
                                                    Cancelar
                                                </Button>
                                            </div>
                                        </div>
                                    )}
                                </Card.Body>
                            </Card>
                        </Tab>

                        {/* PESTAÑA CLASES */}
                        <Tab eventKey="clases" title="Clases" >
                            <Card>
                                <Card.Body>
                                    <Row>
                                        {/* CLASES PAGADAS */}
                                        <Col xs={12} md={6} className="my-3">
                                            <Card>
                                                <Card.Header className="text-center bg-success text-white">
                                                    <h5>Próximas clases</h5>
                                                </Card.Header>
                                                <ListGroup variant="flush">
                                                    {clasesPagadas.length > 0 ? clasesPagadas.map((clase, index) => (
                                                        <ListGroup.Item key={index}>
                                                            <p><strong>{clase.descripcion}</strong></p>
                                                            <small>
                                                                {new Date(clase.fechaInicio).toLocaleDateString()} - {new Date(clase.fechaInicio).getHours()}:{new Date(clase.fechaInicio).getMinutes() === 0 ? '00' : new Date(clase.fechaInicio).getMinutes()} a {new Date(clase.fechaFin).getHours()}:{new Date(clase.fechaFin).getMinutes() === 0 ? '00' : new Date(clase.fechaFin).getMinutes()}
                                                            </small>
                                                            <br/>
                                                            <strong>{clase.instrumento.nombre}</strong>
                                                            <br/>
                                                            <Button variant="outline-primary" size="sm" onClick={() => manejarModalAsistencia(clase._id)}>
                                                                Completada
                                                            </Button>
                                                        </ListGroup.Item>
                                                    )) : <ListGroup.Item>No hay clases próximas</ListGroup.Item>}
                                                </ListGroup>
                                            </Card>
                                        </Col>

                                        {/* CLASES ACEPTADAS */}
                                        <Col xs={12} md={6} className="my-3">
                                            <Card>
                                                <Card.Header className="text-center bg-primary text-white">
                                                    <h5>Clases pendientes de pago</h5>
                                                </Card.Header>
                                                <ListGroup variant="flush">
                                                    {clasesAceptadas.length > 0 ? clasesAceptadas.map((clase, index) => (
                                                        <ListGroup.Item key={index}>
                                                            <p><strong>{clase.descripcion}</strong></p>
                                                            <small>
                                                                {new Date(clase.fechaInicio).toLocaleDateString()} - {new Date(clase.fechaInicio).getHours()}:{new Date(clase.fechaInicio).getMinutes() === 0 ? '00' : new Date(clase.fechaInicio).getMinutes()} a {new Date(clase.fechaFin).getHours()}:{new Date(clase.fechaFin).getMinutes() === 0 ? '00' : new Date(clase.fechaFin).getMinutes()}
                                                            </small>
                                                            <br/>
                                                            <strong>{clase.instrumento.nombre}</strong>
                                                            <br/>
                                                            <Button variant="outline-danger" size="sm" onClick={() => rechazarClase(clase._id)}>
                                                                Rechazar
                                                            </Button>
                                                        </ListGroup.Item>
                                                    )) : <ListGroup.Item>No hay clases pendientes de pago</ListGroup.Item>}
                                                </ListGroup>
                                            </Card>
                                        </Col>

                                        {/* CLASES PENDIENTES */}
                                        <Col xs={12} md={6} className="my-3">
                                            <Card>
                                                <Card.Header className="text-center bg-warning text-dark">
                                                    <h5>Solicitudes pendientes</h5>
                                                </Card.Header>
                                                <ListGroup variant="flush">
                                                    {clasesPendientes.length > 0 ? clasesPendientes.map((clase, index) => (
                                                        <ListGroup.Item key={index}>
                                                            <p><strong>{clase.descripcion}</strong></p>
                                                            <small>
                                                                {new Date(clase.fechaInicio).toLocaleDateString()} - {new Date(clase.fechaInicio).getHours()}:{new Date(clase.fechaInicio).getMinutes() === 0 ? '00' : new Date(clase.fechaInicio).getMinutes()} a {new Date(clase.fechaFin).getHours()}:{new Date(clase.fechaFin).getMinutes() === 0 ? '00' : new Date(clase.fechaFin).getMinutes()}
                                                            </small>
                                                            <br/>
                                                            <strong>{clase.instrumento.nombre}</strong>
                                                            <br/>
                                                            <div className="d-flex gap-2 mt-2">
                                                                <Button variant="outline-success" size="sm" onClick={() => aceptarClase(clase._id)}>
                                                                    Aceptar
                                                                </Button>
                                                                <Button variant="outline-danger" size="sm" onClick={() => rechazarClase(clase._id)}>
                                                                    Rechazar
                                                                </Button>
                                                            </div>
                                                        </ListGroup.Item>
                                                    )) : <ListGroup.Item>No hay solicitudes pendientes</ListGroup.Item>}
                                                </ListGroup>
                                            </Card>
                                        </Col>

                                        {/* CLASES COMPLETADAS */}
                                        <Col xs={12} md={6} className="my-3">
                                            <Card>
                                                <Card.Header className="text-center bg-light text-dark">
                                                    <h5>Clases completadas</h5>
                                                </Card.Header>
                                                <ListGroup variant="flush">
                                                    {clasesCompletadas.length > 0 ? clasesCompletadas.map((clase, index) => (
                                                        <ListGroup.Item key={index} className={clase.estado == "completada" ? 'bg-light' : 'bg-danger'}>
                                                            <p><strong>{clase.descripcion}</strong></p>
                                                            <small>
                                                                {new Date(clase.fechaInicio).toLocaleDateString()} - {new Date(clase.fechaInicio).getHours()}:{new Date(clase.fechaInicio).getMinutes() === 0 ? '00' : new Date(clase.fechaInicio).getMinutes()} a {new Date(clase.fechaFin).getHours()}:{new Date(clase.fechaFin).getMinutes() === 0 ? '00' : new Date(clase.fechaFin).getMinutes()}
                                                            </small>
                                                            <br/>
                                                            <strong>{clase.instrumento.nombre}</strong>
                                                            <br/>
                                                            {clase.estado == "completada" && clase.asistencia && (
                                                                <small className={clase.asistencia ? 'text-success' : 'text-danger'}>
                                                                {clase.asistencia ? 'Asistió' : 'No asistió'}
                                                            </small>
                                                            )}
                                                            
                                                        </ListGroup.Item>
                                                    )) : <ListGroup.Item>No hay clases completadas</ListGroup.Item>}
                                                </ListGroup>
                                            </Card>
                                        </Col>
                                    </Row>
                                </Card.Body>
                            </Card>
                        </Tab>
                    </Tabs>
                </Container>
            </>  
        )}

        {/* MODAL ASISTENCIA */}
        {claseSeleccionada && mostrarModalAsistencia && (
            <Modal centered show={mostrarModalAsistencia} onHide={ocultarModal}>
                <Modal.Header >
                    <Modal.Title>Asistencia de la clase</Modal.Title>
                </Modal.Header>
                <Modal.Body >
                    {mostrarAlerta && (
                        <Alert variant={tipoAlerta} className="mb-3">
                            {mensajeAlerta}
                        </Alert>
                    )}
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Descripción de la clase: </Form.Label>
                            <Form.Control
                                type="text"
                                value={claseSeleccionada.descripcion} 
                                disabled
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Día y hora: </Form.Label>
                            <Form.Control
                                type="text"
                                value={`${new Date(claseSeleccionada.fechaInicio).toLocaleDateString()} ${new Date(claseSeleccionada.fechaInicio).getHours()}:${new Date(claseSeleccionada.fechaInicio).getMinutes() === 0 ? '00' : new Date(claseSeleccionada.fechaInicio).getMinutes()} - ${new Date(claseSeleccionada.fechaFin).getHours()}:${new Date(claseSeleccionada.fechaFin).getMinutes() === 0 ? '00' : new Date(claseSeleccionada.fechaFin).getMinutes()}`}
                                disabled
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Check
                                type="checkbox"
                                label="El alumno se presentó a la clase"
                                name="presente"
                                onChange={(e) => setAsistencia(e.target.checked)}
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="success" onClick={actualizarAsistencia}>
                        Confirmar
                    </Button>
                    <Button variant="secondary" onClick={ocultarModal}>
                        Cerrar
                    </Button>
                </Modal.Footer>
            </Modal>
        )}
        </>
    )
}

export default PerfilProfesor;