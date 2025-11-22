

import {useState, useEffect} from "react";
import {SyncLoader} from "react-spinners";
import { Container, Row, Col, Form, Button, ListGroup, Card, Tabs, Tab, Alert, Table  } from 'react-bootstrap';
import Header from "./templates/Header";
import {arrayProvincias} from "../functions/variables.js";
import { codificarImagen64 } from "../functions/codificar.js";
import {CheckSquareFill, XSquareFill} from "react-bootstrap-icons";
import "./perfil.css"

const PerfilUsuario = () => {
    const [usuario, setUsuario] = useState(null);
    const [loading, setLoading] = useState(true);
    const [clasesPendientes, setClasesPendientes] = useState([]);
    const [clasesAceptadas, setClasesAceptadas] = useState([]);    
    const [clasesPagadas, setClasesPagadas] = useState([]);
    const [clasesCompletadas, setClasesCompletadas] = useState([]);
    const [instrumentos, setInstrumentos] = useState([]);
    const [mostrarGestionInstrumentos, setMostrarGestionInstrumentos] = useState(false);
    const [instrumentosDisponibles, setInstrumentosDisponibles] = useState([]);
    const [instrumentoSeleccionado, setInstrumentoSeleccionado] = useState('');
    const [imagen, setImagen] = useState(null);
    const provincias = arrayProvincias();
    const [alerta, setAlerta] = useState(false);
    const [mensajeAlerta, setMensajeAlerta] = useState('');
    const [tipoAlerta, setTipoAlerta] = useState('success');

    // CARGAR TODOS LOS DATOS DEL USUARIO
    useEffect(() => {
        async function cargarDatosUsuario() {
            if (!sessionStorage.getItem('id') || sessionStorage.getItem('rol') !== "alumno") {
                window.location.href = '/';
                return;
            }

            const idUsr = sessionStorage.getItem('id');
            
            try {
                const [datosUsr, clasesInstrumentos, instrumentosUsu] = await Promise.all([
                    fetch(`http://localhost:5000/usuario/${idUsr}`).then(res => res.json()),
                    fetch(`http://localhost:5000/usuario/clases-instrumentos/${idUsr}`).then(res => res.json()),
                    fetch(`http://localhost:5000/usuario/${idUsr}/instrumentos`).then(res => res.json())
                ])
                console.log(clasesInstrumentos)
                

                


                const usr =  datosUsr;
                const instrumentosUsuario = instrumentosUsu.instrumentos;
                setUsuario(usr);
                setInstrumentos(instrumentosUsuario);
                console.log(instrumentosUsuario)

                // SE ME DUPLICABAN LOS DATOS, NO SE POR QUÉ, Y HE CAMBIADO LA LOGICA A ESTO
                let tipoClases = {
                    pendiente: [],
                    aceptada: [],
                    pagada: [],
                    rechazada: [],
                    completada: [],
                }
               
                let clases = clasesInstrumentos.clasesUsuario;
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
                setClasesCompletadas(tipoClases.completada);
                
                

            } catch (error) {
                console.error('Error cargando datos:', error);
            } finally {
                setLoading(false);
            }
        }

        cargarDatosUsuario();
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

    // ACTUALIZAR PERFIL
    const enviarFormulario = async (event) => {
        event.preventDefault();
        
        try {
            
            const datosActualizados = {
                nombre: usuario.nombre,
                provincia: usuario.provincia,
                
            }
            if (imagen) {
                const imagenCodificada = await codificarImagen64(imagen);
                datosActualizados.imagen = imagenCodificada;
            }
            
            const respuesta = await fetch(`http://localhost:5000/usuario/${usuario._id}`, {
                method: 'PUT',
                headers: { 
                    'Content-Type': 'application/json' 
                },
                body: JSON.stringify(datosActualizados)
            });

            if (respuesta.ok) {
                const usuarioActualizado = await respuesta.json();
                setUsuario(usuarioActualizado);
                sessionStorage.setItem('usuario', usuarioActualizado.nombre);
                alert('Perfil actualizado correctamente');
            } else {
                alert('Error al actualizar el perfil');
            }
        } catch (error) {
            console.error('Error actualizando perfil:', error);
            alert('Error de conexión');
        }
    }

    // AÑADIR INSTRUMENTO
    const anadirInstrumento = async () => {
        if (!instrumentoSeleccionado) {
            alert('Selecciona un instrumento');
            return;
        }

        try {
            const respuesta = await fetch(`http://localhost:5000/usuario/${usuario._id}/instrumento`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ instrumento: instrumentoSeleccionado })
            });

            if (respuesta.ok) {
                const instrumentoAñadido = await fetch(`http://localhost:5000/instrumentos/${instrumentoSeleccionado}`);
                const nuevoInstrumento = await instrumentoAñadido.json();
                setInstrumentos(prev => [...prev, nuevoInstrumento]);
                setInstrumentoSeleccionado('');
                setMostrarGestionInstrumentos(false);
                setAlerta(true);
                setTipoAlerta('success');
                setMensajeAlerta('Instrumento añadido correctamente');
                setTimeout(() => {
                    setAlerta(false);
                }, 2000);
            } else {
                setAlerta(true);
                setTipoAlerta('danger');
                setMensajeAlerta('Error al añadir el instrumento');
                setTimeout(() => {
                    setAlerta(false);
                }, 2000);
            }
        } catch (error) {
            console.error('Error añadiendo instrumento:', error);
            alert('Error de conexión');
        }
    };

    // ELIMINAR INSTRUMENTO
    const eliminarInstrumento = async (instrumentoId) => {
        if (!confirm('¿Estás seguro de que quieres eliminar este instrumento?')) return;

        try {
            const respuesta = await fetch(`http://localhost:5000/usuario/${usuario._id}/instrumento/${instrumentoId}`, {
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

    const rechazarClase = async  (claseId) => {
        const decisionFinal = window.confirm('¿Estas seguro de que quieres rechazar esta clase?');

        if (!decisionFinal) { 
            return 
        };
        try {
            const respuesta = await fetch(`http://localhost:5000/usuario/clase/${claseId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                    
                },
                body: JSON.stringify({ estado: 'rechazada' })
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

    const pagarClase = async (idClase) => {
        window.location.href = `/form-pagar/${idClase}`;
    }

    return (
        <>
        {loading ? (
            <div className="loader">
                <SyncLoader color="213448"/><br></br>
                <p style={{color: "#213448"}}>Cargando perfil...</p>
            </div>
        ) : (
            <>
                <Header/>
                <Container className="mt-4">
                    <Row className="mb-4">
                        <Col xs={12}>
                            <h1 className="text-center">Perfil de {usuario.nombre}</h1>
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
                                    {usuario.imagen && (
                                                
                                                    <img src={usuario.imagen} className="my-5 rounded-circle" alt="Imagen de perfil"  style={{ maxWidth: '100px', alignContent: 'center', display: 'block', margin: '0 auto' }} />
                                            
                                            )}
                                    <Form onSubmit={enviarFormulario}>
                                        <Row className="my-3">
                                            <Col xs={12} md={6}>
                                                <Form.Group controlId="nombre" className="mb-4">
                                                    <Form.Label>Nombre:</Form.Label>
                                                    <Form.Control 
                                                        type="text" 
                                                        value={usuario?.nombre || ''} 
                                                        onChange={(e) => setUsuario({...usuario, nombre: e.target.value})} 
                                                    />
                                                </Form.Group>
                                            </Col>

                                            <Col xs={12} md={6}>
                                                <Form.Group controlId="email" className="mb-4">
                                                    <Form.Label>Email: (no modificable)</Form.Label>
                                                    <Form.Control 
                                                        type="email" 
                                                        value={usuario?.email || ''} 
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
                                                        value={usuario?.telefono || ''} 
                                                        disabled 
                                                    />
                                                </Form.Group>
                                            </Col>

                                            
                                            <Col xs={12} md={6}>
                                                <Form.Group className="mb-4">
                                                    <Form.Label>Provincia</Form.Label>
                                                    <Form.Select 
                                                        value={usuario?.provincia || ''} 
                                                        onChange={(e) => setUsuario({...usuario, provincia: e.target.value})}
                                                    >
                                                        {provincias.map((provincia, index) => (
                                                            <option key={index} value={provincia}>{provincia}</option>
                                                        ))}
                                                    </Form.Select>
                                                </Form.Group>
                                            </Col>
                                        
                                              
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
                                        {alerta && (
                                            <Alert variant={tipoAlerta} className="my-3">
                                                {mensajeAlerta}
                                            </Alert>
                                        )}

                                        <Button variant="primary" type="submit" className="my-3  mx-auto d-block">
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

                                    {alerta && (
                                        <Alert variant={tipoAlerta} className="my-3">
                                            {mensajeAlerta}
                                        </Alert>
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
                                        <Col xs={12}  className="my-3">
                                            <Card>
                                                <Card.Header className="text-center bg-success text-white">
                                                    <h5>Próximas clases</h5>
                                                </Card.Header>
                                                <Card.Body className="table-responsive">
                                                {clasesPagadas.length > 0 ? (
                                                <Table className="table-striped border-secondary align-middle">
                                                    <thead style={{position: 'sticky', top: 0}}>
                                                        <tr>
                                                            <th>Clase</th>
                                                            <th>Profesor</th>
                                                            <th>Fecha</th>
                                                            <th>Instrumento</th>
                                                            <th>Horas</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                    {clasesPagadas.map((clase, index) => (
                                                        
                                                        <tr key={index}>
                                                            <td>{clase.descripcion}</td>
                                                            <td>{clase.profesor[0].nombre}</td>
                                                            <td>{new Date(clase.fechaInicio).toLocaleDateString()}</td>
                                                            <td>{clase.instrumento.nombre}</td>
                                                            <td>{new Date(clase.fechaInicio).getHours()}:{new Date(clase.fechaInicio).getMinutes() ?   new Date(clase.fechaInicio).getMinutes() :'00' } - {new Date(clase.fechaFin).getHours()}:{new Date(clase.fechaFin).getMinutes() ?   new Date(clase.fechaFin).getMinutes() :'00' }</td>
                                                            
                                                        </tr>
                                                    ))}
                                                        </tbody>
                                                    </Table>
                                                    ) : <ListGroup.Item>No hay clases próximas</ListGroup.Item>}

                                                    </Card.Body>
                                            </Card>
                                        </Col>

                                        {/* CLASES ACEPTADAS */}
                                        <Col xs={12} xl={6} className="my-3">
                                            <Card>
                                                <Card.Header className="text-center bg-primary text-white">
                                                    <h5>Clases pendientes de pago</h5>
                                                </Card.Header>

                                                <Card.Body className="table-responsive">
                                                {clasesAceptadas.length > 0 ? (
                                                <Table className="table-striped border-secondary align-middle">
                                                    <thead style={{position: 'sticky', top: 0}}>
                                                        <tr>
                                                            <th>Clase</th>
                                                            <th>Profesor</th>
                                                            <th>Fecha</th>
                                                            <th>Instrumento</th>
                                                            <th>Horas</th>
                                                            <th>Pagar</th>
                                                            <th>Rechazar</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                    {clasesAceptadas.map((clase, index) => (
                                                        <tr key={index}>
                                                            <td>{clase.descripcion}</td>
                                                            <td>{clase.profesor[0].nombre}</td>
                                                            <td>{new Date(clase.fechaInicio).toLocaleDateString()}</td>
                                                            <td>{clase.instrumento.nombre}</td>
                                                            <td>{new Date(clase.fechaInicio).getHours()}:{new Date(clase.fechaInicio).getMinutes() ?   new Date(clase.fechaInicio).getMinutes() :'00' } - {new Date(clase.fechaFin).getHours()}:{new Date(clase.fechaFin).getMinutes() ?   new Date(clase.fechaFin).getMinutes() :'00' }</td>

                                                            <td>
                                                                <Button variant="outline-primary" size="sm" onClick={() => pagarClase(clase._id)}>Pagar</Button>
                                                            </td>
                                                            <td>
                                                            <Button variant="outline-danger" size="sm" onClick={() => rechazarClase(clase._id)}>
                                                                Rechazar
                                                            </Button>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                        </tbody>
                                                    </Table>
                                                    ) : <ListGroup.Item>No hay clases pendientes de pago</ListGroup.Item>}

                                                    </Card.Body>
                                                
                                            </Card>
                                        </Col>

                                        {/* CLASES PENDIENTES */}
                                        <Col xs={12} xl={6} className="my-3">
                                            <Card>
                                                <Card.Header className="text-center bg-warning text-dark">
                                                    <h5>Solicitudes pendientes</h5>
                                                </Card.Header>

                                                <Card.Body className="table-responsive">
                                                {clasesPendientes.length > 0 ? (
                                                <Table className="table-striped border-secondary align-middle">
                                                    <thead style={{position: 'sticky', top: 0}}>
                                                        <tr>
                                                            <th>Clase</th>
                                                            <th>Profesor</th>
                                                            <th>Fecha</th>
                                                            <th>Instrumento</th>
                                                            <th>Horas</th>
                                                            <th>Cancelar</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                    {clasesPendientes.map((clase, index) => (
                                                        <tr key={index}>
                                                            <td>{clase.descripcion}</td>
                                                            <td>{clase.profesor[0].nombre}</td>
                                                            <td>{new Date(clase.fechaInicio).toLocaleDateString()}</td>
                                                            <td>{clase.instrumento.nombre}</td>
                                                            <td>{new Date(clase.fechaInicio).getHours()}:{new Date(clase.fechaInicio).getMinutes() ?   new Date(clase.fechaInicio).getMinutes() :'00' } - {new Date(clase.fechaFin).getHours()}:{new Date(clase.fechaFin).getMinutes() ?   new Date(clase.fechaFin).getMinutes() :'00' }</td>
                                                            
                                                            <td>
                                                                <Button variant="outline-danger" size="sm" onClick={() => rechazarClase(clase._id)}>
                                                                    Rechazar
                                                                </Button>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                        </tbody>
                                                    </Table>
                                                    ) : <ListGroup.Item>No hay solicitudes nuevas</ListGroup.Item>}

                                                    </Card.Body>


                                            </Card>
                                        </Col>

                                        {/* CLASES COMPLETADAS */}
                                        <Col xs={12} className="my-3">
                                            <Card>
                                                <Card.Header className="text-center bg-light text-dark">
                                                    <h5>Clases completadas</h5>
                                                </Card.Header>

                                                <Card.Body className="table-responsive">
                                                {clasesCompletadas.length > 0 ? (
                                                <Table className="table-striped border-secondary align-middle">
                                                    <thead style={{position: 'sticky', top: 0}}>
                                                        <tr>
                                                            <th>Clase</th>
                                                            <th>Alumno</th>
                                                            <th>Fecha</th>
                                                            <th>Instrumento</th>
                                                            <th>Horas</th>
                                                            <th>Asistió</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                    {clasesCompletadas.map((clase, index) => (
                                                        clase.estado=== 'completada' ? (
                                                            <tr key={index} className="table-success">
                                                                <td>{clase.descripcion}</td>
                                                                <td>{clase.profesor[0].nombre}</td>
                                                                <td>{new Date(clase.fechaInicio).toLocaleDateString()}</td>
                                                                <td>{clase.instrumento.nombre}</td>
                                                                <td>{new Date(clase.fechaInicio).getHours()}:{new Date(clase.fechaInicio).getMinutes() ?   new Date(clase.fechaInicio).getMinutes() :'00' } - {new Date(clase.fechaFin).getHours()}:{new Date(clase.fechaFin).getMinutes() ?   new Date(clase.fechaFin).getMinutes() :'00' }</td>
                                                                <td>
                                                                    {clase.asistencia ? (
                                                                        <CheckSquareFill className="text-success"/>
                                                                    ): (
                                                                        <XSquareFill className="text-danger"/>
                                                                    )}
                                                                </td>
                                                                
                                                            </tr>
                                                        ): (
                                                            <tr key={index} className="table-danger">
                                                            <td>{clase.descripcion}</td>
                                                            <td>{clase.profesor[0].nombre}</td>
                                                            <td>{new Date(clase.fechaInicio).toLocaleDateString()}</td>
                                                            <td>{clase.instrumento.nombre}</td>
                                                            <td>{new Date(clase.fechaInicio).getHours()}:{new Date(clase.fechaInicio).getMinutes() ?   new Date(clase.fechaInicio).getMinutes() :'00' } - {new Date(clase.fechaFin).getHours()}:{new Date(clase.fechaFin).getMinutes() ?   new Date(clase.fechaFin).getMinutes() :'00' }</td>
                                                            <td>Rechazada</td>
                                                            
                                                        </tr>
                                                        )
                                                        
                                                    ))}
                                                        </tbody>
                                                    </Table>
                                                    ) : <ListGroup.Item>No hay clases completadas</ListGroup.Item>}

                                                    </Card.Body>

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
        </>
    )
}

export default PerfilUsuario;