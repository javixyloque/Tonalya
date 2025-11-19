import {useState, useEffect} from "react";
import {SyncLoader} from "react-spinners";
import { Container, Row, Col, Form, Button, ListGroup, Modal, Alert, Card } from 'react-bootstrap';

import Header from "./templates/Header";
import {arrayProvincias} from "../functions/variables.js";
import { codificarImagen64 } from "../functions/codificar.js";

const PerfilProfesor = () => {
    const [profesor, setProfesor] = useState(null);
    const [loading, setLoading] = useState(true);
    const [clasesPendientes, setClasesPendientes] = useState([]);
    const [clasesAceptadas, setClasesAceptadas] = useState([]);
    const [clasesPagadas, setClasesPagadas] = useState([]);
    const [clasesRechazadas, setClasesRechazadas] = useState([]);
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
    
    const mostrarModal =( ) => setMostrarModalAsistencia(true);
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
                // SE ME DUPLICABAN LOS DATOS, NO SE POR QUÉ, Y HE CAMBIADO LA LOGICA A ESTO
                let tipoClases = {
                    pendiente: [],
                    aceptada: [],
                    pagada: [],
                    rechazada: [],
                    completada: [],
                }
                console.log(clases)
               
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
                            tipoClases.rechazada.push(clase)
                            break;
                        case 'completada':
                            tipoClases.completada.push(clase)
                            break;
                    } 
                })
                console.log(clases)
                setClasesPendientes(tipoClases.pendiente);
                setClasesAceptadas(tipoClases.aceptada);
                setClasesPagadas(tipoClases.pagada);
                setClasesRechazadas(tipoClases.rechazada);
                setClasesCompletadas(tipoClases.completada);

                // setClases(clasesResp);
                setInstrumentos(instrumentosResp);

            } catch (error) {
                console.error('Error cargando datos:', error);
            } finally {
                setLoading(false);
            }
        }

        cargarDatosProfesor();
    }, []);

    // CARGAR INSTRUMENTOS DISPONIBLES (CUANDO SE ACTIVA MOSTRARGESTIONINSTRUMETNOS)
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


    const rechazarClase = async  (claseId) => {
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

    // ACTUALIZAR PERFIL PROFESOR
    const enviarFormulario = async (event) => {
        event.preventDefault();
        
        try {
            const datosActualizados = {
                nombre: profesor.nombre,
                provincia: profesor.provincia,
                bio: profesor.bio,
                precioHora: profesor.precioHora
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
    const añadirInstrumento = async () => {
        if (!instrumentoSeleccionado) {
            alert('Selecciona un instrumento');
            return;
        }

        try {
            const respuesta = await fetch(`http://localhost:5000/profesor/${profesor._id}/instrumento`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    instrumento: instrumentoSeleccionado
                })
            });

            if (respuesta.ok) {
                const instrumentoAñadido = await fetch(`http://localhost:5000/instrumentos/${instrumentoSeleccionado}`).then(res => res.json());
                setInstrumentos(prev => [...prev, instrumentoAñadido]);
                setInstrumentoSeleccionado('');
                setMostrarGestionInstrumentos(false);
                alert('Instrumento añadido correctamente');
            } else {
                alert('Error al añadir el instrumento');
            }
        } catch (error) {
            console.error('Error añadiendo instrumento:', error);
            alert( error);
        }
    };

    // ELIMINAR INSTRUMENTO DEL PROFESOR
    const eliminarInstrumento = async (instrumentoId) => {
        if (!confirm('¿Estás seguro de que quieres eliminar este instrumento?')) return;

        try {
            const respuesta = await fetch(`http://localhost:5000/profesor/${profesor._id}/instrumentos/${instrumentoId}`, {
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

    // FUNCION PARA MOSTRAR EL MODAL DE ASISTENCIA DE LA CLASE SELECCIONADA
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
                <Container>
                <Row className="mb-4">
                    <Col xs={12} md={6}>
                    <h1>Perfil de {profesor.nombre}</h1>
                    </Col>
                </Row>

                {/* FORMULARIO PERFIL PROFESOR */}
                <Form onSubmit={enviarFormulario} className="mb-5">
                    <Row className="mb-3">
                        <Col xs={12} md={6}>
                            <Form.Group controlId="nombre" className="mb-4">
                                <Form.Label>Nombre:</Form.Label>
                                <Form.Control 
                                    type="text" 
                                    value={profesor.nombre || ''} 
                                    onChange={(e) => setProfesor({...profesor, nombre: e.target.value})} 
                                />
                            </Form.Group>
                        </Col>

                        <Col xs={12} md={6}>
                            <Form.Group controlId="email" className="mb-4">
                                <Form.Label>Email: (no modificable)</Form.Label>
                                <Form.Control 
                                    type="email" 
                                    value={profesor.email || ''} 
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
                                    value={profesor.telefono || ''} 
                                    disabled 
                                />
                            </Form.Group>
                        </Col>

                        <Col xs={12} md={6}>
                            <Form.Group controlId="precioHora" className="mb-4">
                                <Form.Label>Precio por hora (€):</Form.Label>
                                <Form.Control 
                                    type="number" 
                                    value={profesor.precioHora || ''} 
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
                                    value={profesor.provincia} 
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
                                    value={profesor.bio} 
                                    onChange={(e) => setProfesor({...profesor, bio: e.target.value})} 
                                    placeholder="Cuéntanos sobre tu experiencia musical..."
                                />
                            </Form.Group>
                        </Col>
                    </Row>

                    <Row>
                        {profesor.imagen && (
                            <Col xs={12} md={6} style={{display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-evenly"}}>
                                <h4>Imagen de perfil</h4>
                                <img src={profesor.imagen} alt="Imagen de perfil"  style={{ maxWidth: '100px'}} />
                            </Col>
                        )}  
                            <Col xs={12} md={6} > 
                            <Form.Group className="mb-5">
                                <Form.Label>Actualiza tu <strong>imagen de perfil</strong></Form.Label>
                                <Form.Control
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => setImagen(e.target.files[0])}
                                />
                                <Form.Control.Feedback type="invalid">
                                    Por favor sube una imagen válida
                                </Form.Control.Feedback>
                            </Form.Group>
                            </Col>
                    </Row>

                    
                </Form>

                

                {/* INSTRUMENTOS DEL PROFESOR */}
                <Row className="mb-3">
                    <Col xs={12}>
                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <h3>Tus Instrumentos</h3>
                            <Button 
                                variant="outline-primary" 
                                onClick={() => setMostrarGestionInstrumentos(!mostrarGestionInstrumentos)}
                            >
                                {mostrarGestionInstrumentos ? 'Cancelar' : 'Gestionar Instrumentos'}
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
                    </Col>
                </Row>

                {/* FORMULARIO AÑADIR INSTRUMENTO */}
                {mostrarGestionInstrumentos && (
                    <Row className="mb-4 p-3 border rounded bg-light">
                        <Col xs={12}>
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
                                    variant="success" 
                                    onClick={añadirInstrumento}
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
                        </Col>
                    </Row>
                )}

                <Row className="d-flex d-md-block justify-content-center w-100 w-md-25 mt-0 mt-md-5" >
                        <Button variant="success" type="submit" className="mx-auto text-center justify-content-center d-flex" style={{maxWidth: "200px"}} >
                        Guardar cambios
                        </Button>
                        
                    </Row>

                 <hr className="my-5" />

                {/* CLASES DEL PROFESOR */}

                {/* CLASES PAGADAS  */}
                <Row className="mb-5">
                    <Col xs={12} md={6} className="my-3">
                     <Card>
                            <Card.Header className="text-center mx-auto w-100 rounded">
                                <h3>Próximas clases</h3>
                            </Card.Header>
                        <ListGroup>
                            {clasesPagadas.length>0 && clasesPagadas.map((clase, index) => (
                                <ListGroup.Item key={index} variant="success">
                                    
                                <p>{clase.descripcion} <br/>{new Date(clase.fechaInicio).toLocaleDateString()}<br/>{new Date(clase.fechaInicio).getHours()}:{new Date(clase.fechaInicio).getMinutes() == 0 ?"00": new Date(clase.fechaInicio).getMinutes()}  - {new Date(clase.fechaFin).getHours()}:{new Date(clase.fechaInicio).getMinutes() == 0 ?"00": new Date(clase.fechaInicio).getMinutes()} <br/> <strong>{clase.instrumento.nombre}</strong>
                                </p>
                                
                                <Button variant="outline-primary" onClick={() => manejarModalAsistencia(clase._id)}>Completada</Button>
                                </ListGroup.Item>
                            ))}
                        </ListGroup>
                        </Card>
                    </Col>

                {/*CLASES ACEPTADAS */}
                
                    <Col xs={12} md={6} className="my-3">
                    <Card>
                            <Card.Header className="text-center mx-auto w-100 rounded">
                                <h3>Clases pendientes de confirmar</h3>
                            </Card.Header>
                        <ListGroup>
                            {clasesAceptadas.length>0 && clasesAceptadas.map((clase, index) => (
                                <ListGroup.Item key={index} variant="primary">
                                    
                                {clase.descripcion} <br/>{new Date(clase.fechaInicio).toLocaleDateString()}<br/>{new Date(clase.fechaInicio).getHours()}:{new Date(clase.fechaInicio).getMinutes() == 0 ?"00": new Date(clase.fechaInicio).getMinutes()}  - {new Date(clase.fechaFin).getHours()}:{new Date(clase.fechaInicio).getMinutes() == 0 ?"00": new Date(clase.fechaInicio).getMinutes()} <br/> <strong>{clase.instrumento.nombre}</strong>

                                <Button variant="outline-danger" onClick={() => rechazarClase(clase._id)}>Rechazar</Button>

                                </ListGroup.Item>
                            ))}
                        </ListGroup>
                        </Card>
                    </Col>
                </Row>

                {/*CLASES PENDIENTES DE ACEPTAR */}
                    <Col xs={12} md={6} className="my-3">
                         <Card>
                            <Card.Header className="text-center mx-auto w-100 rounded">
                                <h3>Solicitudes pendientes</h3>
                            </Card.Header>
                        <ListGroup>
                            {clasesPendientes.length>0 && clasesPendientes.map((clase, index) => (
                                <ListGroup.Item style={{display: "flex", justifyContent: "space-between", alignItems: "center"}} key={index} variant="warning">
                                    
                                {clase.descripcion} <br/>{new Date(clase.fechaInicio).toLocaleDateString()}<br/>{new Date(clase.fechaInicio).getHours()}:{new Date(clase.fechaInicio).getMinutes() == 0 ?"00": new Date(clase.fechaInicio).getMinutes()}  - {new Date(clase.fechaFin).getHours()}:{new Date(clase.fechaInicio).getMinutes() == 0 ?"00": new Date(clase.fechaInicio).getMinutes()} <br/> <strong>{clase.instrumento.nombre}</strong>

                                <Button variant="outline-success" onClick={() => aceptarClase(clase._id)}>Aceptar</Button>
                                <Button variant="outline-danger" onClick={() =>rechazarClase(clase._id)}>Rechazar</Button>

                                </ListGroup.Item>
                            ))}
                        </ListGroup>
                        </Card>
                    </Col>

                {/* CLASES COMPLETADAS */}
                <Row className="mb-5" >
                    <Col xs={12} md={6} className="my-3">
                        <Card>
                            <Card.Header className="text-center mx-auto w-100 rounded">
                                <h3>Clases completadas</h3>
                            </Card.Header>
                            <ListGroup variant="flush">
                                {clasesCompletadas.length>0 && clasesCompletadas.map((clase, index) => (
                                    clase.asistencia === true ?(
                                    <ListGroup.Item style={{display: "flex", justifyContent: "space-between", alignItems: "center"}} key={index} variant="info">
                                        
                                    {clase.descripcion} <br/>{new Date(clase.fechaInicio).toLocaleDateString()}<br/>{new Date(clase.fechaInicio).getHours()}:{new Date(clase.fechaInicio).getMinutes() == 0 ?"00": new Date(clase.fechaInicio).getMinutes()}  - {new Date(clase.fechaFin).getHours()}:{new Date(clase.fechaInicio).getMinutes() == 0 ?"00": new Date(clase.fechaInicio).getMinutes()} <br/> <strong>{clase.instrumento.nombre}</strong>
                                    </ListGroup.Item>
                                    ):(
                                        <ListGroup.Item style={{display: "flex", justifyContent: "space-between", alignItems: "center"}} key={index} variant="secondary">
                                        
                                    {clase.descripcion} <br/>{new Date(clase.fechaInicio).toLocaleDateString()}<br/>{new Date(clase.fechaInicio).getHours()}:{new Date(clase.fechaInicio).getMinutes() == 0 ?"00": new Date(clase.fechaInicio).getMinutes()}  - {new Date(clase.fechaFin).getHours()}:{new Date(clase.fechaInicio).getMinutes() == 0 ?"00": new Date(clase.fechaInicio).getMinutes()} <br/> <strong>{clase.instrumento.nombre}</strong>
                                    </ListGroup.Item>
                                    )
                                ))}

                            </ListGroup>
                        </Card>
                    </Col>
            

                {/* CLASES RECHAZADAS */}
                
                    <Col xs={12} md={6} className="my-3">
                        <Card>
                        <Card.Header className="text-center mx-auto w-100 rounded">
                                <h3>Clases rechazadas</h3>
                            </Card.Header>
                        <ListGroup>
                            {clasesRechazadas.length>0 && clasesRechazadas.map((clase, index) => (
                                <ListGroup.Item style={{display: "flex", justifyContent: "space-between", alignItems: "center"}} key={index} variant="danger">
                                    
                                {clase.descripcion} <br/>{new Date(clase.fechaInicio).toLocaleDateString()}<br/>{new Date(clase.fechaInicio).getHours()}:{new Date(clase.fechaInicio).getMinutes() == 0 ?"00": new Date(clase.fechaInicio).getMinutes()}  - {new Date(clase.fechaFin).getHours()}:{new Date(clase.fechaInicio).getMinutes() == 0 ?"00": new Date(clase.fechaInicio).getMinutes()} <br/> <strong>{clase.instrumento.nombre}</strong>
                                
                                </ListGroup.Item>
                            ))}
                        </ListGroup>
                        </Card>
                    </Col>
                </Row>

                </Container>
            </>  
        )}

        {claseSeleccionada && mostrarModalAsistencia && (
            <Modal centered show={mostrarModalAsistencia} onHide={ocultarModal}>
            <Modal.Header style={{backgroundColor: "#213448", color: "#ECEFCA"}}>
            <Modal.Title>Asistencia de la clase</Modal.Title>
            
            
            </Modal.Header>
            <Modal.Body style={{backgroundColor: "#213448", color: "#ECEFCA"}}>
                {mostrarAlerta && (
                            <Alert variant={tipoAlerta} className="mb-3">
                                {mensajeAlerta}
                            </Alert>
                        )}
                <Form onSubmit={actualizarAsistencia}>
                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label>Descripcion de la clase: </Form.Label>
                        <Form.Control
                        type="text"
                        placeholder="Alumnos presentes"
                        value={claseSeleccionada.descripcion} disabled
                        />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label>Día y hora: </Form.Label>
                        <Form.Control
                        type="text"
                        placeholder="Alumnos presentes"
                        value={`${new Date(claseSeleccionada.fechaInicio).toLocaleDateString()} ${new Date(claseSeleccionada.fechaInicio).getHours()}:${new Date(claseSeleccionada.fechaInicio).getMinutes() === 0 ? '00' : new Date(claseSeleccionada.fechaInicio).getMinutes()} - ${new Date(claseSeleccionada.fechaFin).getHours()}:${new Date(claseSeleccionada.fechaFin).getMinutes() === 0 ? '00' : new Date(claseSeleccionada.fechaFin).getMinutes()}`}
                        disabled
                        > </Form.Control>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formBasicPassword">
                        {/* <Form.Label>Estuvo presente el alumno?</Form.Label> */}
                        <Form.Check
                        type="checkbox"
                        label="El alumno se presentó a la clase"
                        name="presente"
                        onChange={(e) => setAsistencia(e.target.checked)}
                        />
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer style={{backgroundColor: "#213448", color: "#ECEFCA"}}>
            <Button variant="success" onClick={() => actualizarAsistencia(claseSeleccionada._id)} >Confirmar</Button>
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