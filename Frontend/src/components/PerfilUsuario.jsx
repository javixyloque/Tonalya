

import {useState, useEffect} from "react";
import {SyncLoader} from "react-spinners";
import { Container, Row, Col, Form, Button, ListGroup } from 'react-bootstrap';
import Header from "./templates/Header";
import {arrayProvincias} from "../functions/variables.js";
// import {Link} from "react-router-dom"
import { codificarImagen64 } from "../functions/codificar.js";

const PerfilUsuario = () => {
    const [usuario, setUsuario] = useState(null);
    const [loading, setLoading] = useState(true);
    const [clases, setClases] = useState([]);
    const [instrumentos, setInstrumentos] = useState([]);
    const [mostrarGestionInstrumentos, setMostrarGestionInstrumentos] = useState(false);
    const [instrumentosDisponibles, setInstrumentosDisponibles] = useState([]);
    const [instrumentoSeleccionado, setInstrumentoSeleccionado] = useState('');
    const [imagen, setImagen] = useState(null);
    const provincias = arrayProvincias();

    // CARGAR TODOS LOS DATOS DEL USUARIO
    useEffect(() => {
        async function cargarDatosUsuario() {
            if (!sessionStorage.getItem('id') || sessionStorage.getItem('rol') !== "alumno") {
                window.location.href = '/';
                return;
            }

            const idUsr = sessionStorage.getItem('id');
            
            try {
                const datosUsr = await fetch(`http://localhost:5000/usuario/${idUsr}`);
                const usr = await datosUsr.json();
                setUsuario(usr);

                // CLASES E INSTRUMENTOS
                const [clasesResp, instrumentosResp] = await Promise.all([
                    fetch(`http://localhost:5000/usuario/clases/${idUsr}`).then(res => res.json()),

                    // USUARIOS NO TIENEN ORDEN PARA OBTENER SUS INSTRUMENTOS (NO OCUPA MUCHO TAMPOCO)
                    Promise.all(
                        (usr.instrumentos).map(idInstrumento => 
                            fetch(`http://localhost:5000/instrumentos/${idInstrumento}`).then(res => res.json())
                        )
                    )
                ]);

                setClases(clasesResp);
                setInstrumentos(instrumentosResp);

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
            if (usuario.imagen) {
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
                sessionStorage.setItem('profesor', usuarioActualizado.nombre);
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
    const añadirInstrumento = async () => {
        if (!instrumentoSeleccionado) {
            alert('Selecciona un instrumento');
            return;
        }

        try {
            const respuesta = await fetch(`http://localhost:5000/usuario/${usuario._id}/instrumento`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ instrumentoId: instrumentoSeleccionado })
            });

            if (respuesta.ok) {
                const instrumentoAñadido = await fetch(`http://localhost:5000/instrumentos/${instrumentoSeleccionado}`);
                const nuevoInstrumento = await instrumentoAñadido.json();
                setInstrumentos(prev => [...prev, nuevoInstrumento]);
                setInstrumentoSeleccionado('');
                setMostrarGestionInstrumentos(false);
                alert('Instrumento añadido correctamente');
            } else {
                alert('Error al añadir el instrumento');
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
                    <h1>Perfil de {usuario.nombre}</h1>
                    </Col>
                </Row>

                {/* FORMULARIO PERFIL */}
                <Form onSubmit={enviarFormulario} className="mb-5">
                    <Row className="mb-3">
                    <Col xs={12} md={6}>
                        <Form.Group controlId="nombre" className="mb-4">
                        <Form.Label>Nombre:</Form.Label>
                        <Form.Control 
                            type="text" 
                            value={usuario.nombre} 
                            onChange={(e) => setUsuario({...usuario, nombre: e.target.value})} 
                        />
                        </Form.Group>
                    </Col>

                    <Col xs={12} md={6}>
                        <Form.Group controlId="email" className="mb-4">
                        <Form.Label>Email: (no modificable)</Form.Label>
                        <Form.Control 
                            type="email" 
                            value={usuario.email} 
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
                            value={usuario.telefono} 
                            disabled 
                        />
                        </Form.Group>
                    </Col>

                    <Col xs={12} md={6}>
                         <Form.Group as={Col} md={12} className="mb-4" >
                                <Form.Label>Provincia</Form.Label>
                                <Form.Select 
                                    value={usuario.provincia} 
                                    onChange={(e) => setUsuario({...usuario, provincia: e.target.value})}
                                >
                                    {provincias.map((provincia, index) => (
                                        <option key={index} value={provincia}>{provincia}</option>
                                    ))}
                                </Form.Select>
                            </Form.Group>
                    </Col>
                    </Row>

                    <Row>
                        {usuario.imagen && (
                            <Col xs={12} md={6} style={{display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-evenly"}}>
                                <h4>Imagen de perfil</h4>
                                <img src={usuario.imagen} alt="Imagen de perfil"  style={{ maxWidth: '100px'}} />
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

                    <Row className="d-flex d-md-block justify-content-center w-100 w-md-25 mt-0 mt-md-5" >
                        <Button variant="success" type="submit" className="mx-auto text-center justify-content-center d-flex" style={{maxWidth: "200px"}} >
                        Guardar cambios
                        </Button>
                        
                    </Row>
                </Form>

                {/* CLASES DEL ALUMNO */}
                <Row className="mb-3">
                    <Col xs={12} md={6}>
                        <h3>Clases del alumno</h3>
                        <ListGroup>
                            {clases.map((clase, index) => (
                                <ListGroup.Item key={index} variant="primary">
                                {clase.descripcion} - {new Date(clase.fechaInicio).toLocaleDateString()}
                                </ListGroup.Item>
                            ))}
                        </ListGroup>
                    </Col>
                </Row>

                {/* INSTRUMENTOS DEL ALUMNO */}
                <Row className="mb-3">
                    <Col xs={12}>
                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <h3>Tus Instrumentos</h3>
                            <Button 
                                variant="outline-primary" 
                                onClick={() => setMostrarGestionInstrumentos(!mostrarGestionInstrumentos)}
                            >
                                {mostrarGestionInstrumentos ? 'Cancelar' : 'Añadir instrumento'}
                            </Button>
                        </div>

                        <ListGroup>
                            {/* BUCLE MOSTRAR INSTRUMENTOS (Y BORRAR) */}
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

                </Container>
            </>  
        )}
        </>
    )
}

export default PerfilUsuario;