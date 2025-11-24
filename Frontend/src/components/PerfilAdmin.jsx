import { useState, useEffect } from "react";
import { SyncLoader } from "react-spinners";
import { Container, Row, Col, Form, Button, Modal, Alert, Card, Tabs, Tab, Table, Badge } from 'react-bootstrap';
import {  PencilFill, TrashFill, EyeFill, EyeSlashFill } from "react-bootstrap-icons";

import Header from "./templates/Header";
import { arrayProvincias } from "../functions/variables.js";
import { codificarImagen64 } from "../functions/codificar.js";

const PerfilAdmin = () => {
    const [loading, setLoading] = useState(true);
    const [usuarios, setUsuarios] = useState([]);
    const [profesores, setProfesores] = useState([]);
    const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null);
    const [profesorSeleccionado, setProfesorSeleccionado] = useState(null);
    const [mostrarModalUsuario, setMostrarModalUsuario] = useState(false);
    const [mostrarModalProfesor, setMostrarModalProfesor] = useState(false);
    const [modoEdicion, setModoEdicion] = useState(false);

    
    const [alerta, setAlerta] = useState(false);
    const [mensajeAlerta, setMensajeAlerta] = useState('');
    const [tipoAlerta, setTipoAlerta] = useState('success');
    
    const provincias = arrayProvincias();
    const [imagenUsuario, setImagenUsuario] = useState(null);
    const [imagenProfesor, setImagenProfesor] = useState(null);

    // CARGAR TODOS LOS DATOS
    useEffect(() => {
        async function cargarDatos() {
            if (!sessionStorage.getItem('usuario') || sessionStorage.getItem('rol') !== "admin") {
                window.location.href = '/';
                return;
            }

            try {
                const [usuariosResp, profesoresResp] = await Promise.all([
                    fetch('http://localhost:5000/admin/usuarios-completos').then(res => res.json()),
                    fetch('http://localhost:5000/admin/profesores-completos').then(res => res.json())
                ]);

                setUsuarios(usuariosResp);
                setProfesores(profesoresResp);
            } catch (error) {
                console.error('Error cargando datos:', error);
                mostrarAlerta('Error al cargar los datos', 'danger');
            } finally {
                setLoading(false);
            }
        }

        cargarDatos();
    }, []);

    const mostrarAlerta = (mensaje, tipo = 'success') => {
        setMensajeAlerta(mensaje);
        setTipoAlerta(tipo);
        setAlerta(true);
        setTimeout(() => setAlerta(false), 3000);
    };

    // FUNCIONES PARA USUARIOS
    const abrirModalUsuario = (usuario = null) => {
        if (usuario) {
            // SI USUARIO => EDITAR
            setUsuarioSeleccionado({ 
                _id: usuario._id,
                nombre: usuario.nombre,
                email: usuario.email,
                telefono: usuario.telefono,
                provincia: usuario.provincia,
                activo: usuario.activo
            });
            setModoEdicion(true);
        } else {
            // SI NO USUARIO => CREAR (POST)
            setUsuarioSeleccionado({
                nombre: '',
                email: '',
                telefono: '',
                provincia: '',
                activo: true
            });
            setModoEdicion(false);
        }
        setMostrarModalUsuario(true);
        setImagenUsuario(null);
    };

    const cerrarModalUsuario = () => {
        setMostrarModalUsuario(false);
        setUsuarioSeleccionado(null);
    };

    const guardarUsuario = async () => {
        try {
            const datosActualizados = {
                nombre: usuarioSeleccionado.nombre,
                email: usuarioSeleccionado.email,
                telefono: usuarioSeleccionado.telefono,
                provincia: usuarioSeleccionado.provincia,
                activo: usuarioSeleccionado.activo
            };

            if (imagenUsuario) {
                const imagenCodificada = await codificarImagen64(imagenUsuario);
                datosActualizados.imagen = imagenCodificada;
            }

            let url;
            let method;
            
            if (modoEdicion) {
                url = 'http://localhost:5000/admin/usuario/' + usuarioSeleccionado._id;
                method = 'PUT';
            } else {
                url = 'http://localhost:5000/admin/usuario';
                method = 'POST';
            }

            const respuesta = await fetch(url, {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(datosActualizados)
            });

            if (respuesta.ok) {
                mostrarAlerta(modoEdicion ? 'Usuario actualizado correctamente' : 'Usuario creado correctamente');
                
                
                const respuestaUsuarios = await fetch('http://localhost:5000/admin/usuarios-completos');
                const usuariosActualizados = await respuestaUsuarios.json();
                setUsuarios(usuariosActualizados);
                
                cerrarModalUsuario();
            } else {
                mostrarAlerta('Error al guardar el usuario', 'danger');
            }
        } catch (error) {
            console.error('Error guardando usuario:', error);
            mostrarAlerta('Error al guardar el usuario', 'danger');
        }
    };

    const eliminarUsuario = async (id, definitivo = false) => {
        let mensaje;
        if (definitivo) {
            mensaje = '¿Estás seguro de que quieres eliminar definitivamente este usuario? Esta acción no se puede deshacer.';
        } else {
            mensaje = '¿Estás seguro de que quieres desactivar este usuario?';
        }

        if (!confirm(mensaje)){
            return;
        };

        try {
            if (definitivo) {
                await fetch('http://localhost:5000/admin/usuario/' + id, { 
                    method: 'DELETE' 
                });
                mostrarAlerta('Usuario eliminado definitivamente');
            } else {
                await fetch('http://localhost:5000/admin/usuario/' + id, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ activo: false })
                });
                mostrarAlerta('Usuario desactivado correctamente');
            }

            
            const respuestaUsuarios = await fetch('http://localhost:5000/admin/usuarios-completos');
            const usuariosActualizados = await respuestaUsuarios.json();
            setUsuarios(usuariosActualizados);
        } catch (error) {
            console.error('Error eliminando usuario:', error);
            mostrarAlerta('Error al eliminar el usuario', 'danger');
        }
    };

    const activarUsuario = async (id) => {
        try {
            await fetch(`http://localhost:5000/admin/usuario/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ activo: true })
            });
            
            mostrarAlerta('Usuario activado correctamente');
            
            
            const usuariosActualizados = await fetch('http://localhost:5000/admin/usuarios-completos').then(res => res.json());
            setUsuarios(usuariosActualizados);
        } catch (error) {
            console.error('Error activando usuario:', error);
            mostrarAlerta('Error al activar el usuario', 'danger');
        }
    };

    // PRFOESORES


    const abrirModalProfesor = (profesor = null) => {
        if (profesor) {
            // SI PROFSEOR => EDITAR
            setProfesorSeleccionado({
                _id: profesor._id,
                nombre: profesor.nombre,
                email: profesor.email,
                telefono: profesor.telefono,
                provincia: profesor.provincia,
                bio: profesor.bio,
                precioHora: profesor.precioHora,
                activo: profesor.activo
            });
            setModoEdicion(true);
        } else {
            // SI NO PROFESOR => CREAR
            setProfesorSeleccionado({
                nombre: '',
                email: '',
                telefono: '',
                provincia: '',
                bio: '',
                precioHora: 0,
                activo: true
            });
            setModoEdicion(false);
        }
        setMostrarModalProfesor(true);
        setImagenProfesor(null);
    };

    const cerrarModalProfesor = () => {
        setMostrarModalProfesor(false);
        setProfesorSeleccionado(null);
    };

    const guardarProfesor = async () => {
        try {
            const datosActualizados = {
                nombre: profesorSeleccionado.nombre,
                email: profesorSeleccionado.email,
                telefono: profesorSeleccionado.telefono,
                provincia: profesorSeleccionado.provincia,
                bio: profesorSeleccionado.bio,
                precioHora: profesorSeleccionado.precioHora,
                activo: profesorSeleccionado.activo
            };

            if (imagenProfesor) {
                const imagenCodificada = await codificarImagen64(imagenProfesor);
                datosActualizados.imagen = imagenCodificada;
            }

            let url;
            let method;
            
            if (modoEdicion) {
                url = 'http://localhost:5000/admin/profesor/' + profesorSeleccionado._id;
                method = 'PUT';
            } else {
                url = 'http://localhost:5000/admin/profesor';
                method = 'POST';
            }

            const respuesta = await fetch(url, {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(datosActualizados)
            });

            if (respuesta.ok) {
                mostrarAlerta(modoEdicion ? 'Profesor actualizado correctamente' : 'Profesor creado correctamente');
                
                
                const respuestaProfesores = await fetch('http://localhost:5000/admin/profesores-completos');
                const profesoresActualizados = await respuestaProfesores.json();
                setProfesores(profesoresActualizados);
                
                cerrarModalProfesor();
            } else {
                mostrarAlerta('Error al guardar el profesor', 'danger');
            }
        } catch (error) {
            console.error('Error guardando profesor:', error);
            mostrarAlerta('Error al guardar el profesor', 'danger');
        }
    };

    const eliminarProfesor = async (id, definitivo = false) => {
        try {
            // DEFINITIVO => BOOLEANO PASADO COMO PARAMETRO EN LA FUNCIÓN DE LOS BOTONES
            if (definitivo) {
                const decision = confirm('¿Estás seguro de que quieres eliminar definitivamente este profesor para siempre? Esta acción no se puede deshacer.');
                if (!decision) {
                    return;
                }

                await fetch(`http://localhost:5000/admin/profesor/${id}`, { method: 'DELETE' });
                mostrarAlerta('Profesor eliminado definitivamente');
            } else {
                const decision = confirm('¿Estás seguro de que quieres desactivar este profesor?');
                if (!decision) {
                    return;
                }

                await fetch(`http://localhost:5000/admin/profesor/${id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ activo: false })
                });
                mostrarAlerta('Profesor desactivado correctamente');
            }

            // RECARGAR PRFOESORES
            const profesoresActualizados = await fetch('http://localhost:5000/admin/profesores-completos').then(res => res.json());
            setProfesores(profesoresActualizados);
        } catch (error) {
            console.error('Error eliminando profesor:', error);
            mostrarAlerta('Error al eliminar el profesor', 'danger');
        }
    };

    const activarProfesor = async (id) => {
        try {
            await fetch(`http://localhost:5000/admin/profesor/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ activo: true })
            });
            
            mostrarAlerta('Profesor activado correctamente');
            
            // Recargar lista
            const profesoresActualizados = await fetch('http://localhost:5000/admin/profesores-completos').then(res => res.json());
            setProfesores(profesoresActualizados);
        } catch (error) {
            console.error('Error activando profesor:', error);
            mostrarAlerta('Error al activar el profesor', 'danger');
        }
    };

    // FUNCIÓN PARA CONTAR CLASES COMPLETADAS
    const contarClasesCompletadas = (clases) => {
        return clases ? clases.filter(clase => clase.estado === 'completada').length : 0;
    };

    return (
        <>
            {loading ? (
                <div className="loader">
                    <SyncLoader color="#213448"/><br/>
                    <p style={{color: "#213448"}}>Cargando panel de administración...</p>
                </div>
            ) : (
                <>
                    <Header/>
                    <Container className="mt-4">
                        <Row className="mb-4">
                            <Col xs={12}>
                                <h1 className="text-center">Panel de Administración</h1>
                                <p className="text-center text-muted">Gestiona usuarios y profesores del sistema</p>
                            </Col>
                        </Row>

                        {alerta && (
                            <Alert variant={tipoAlerta} className="my-3">
                                {mensajeAlerta}
                            </Alert>
                        )}

                        <Tabs defaultActiveKey="usuarios" className="mb-4 perfil-tabs">


                            {/*  USUARIOS */}

                            <Tab eventKey="usuarios" title={`Usuarios (${usuarios.length})`}>
                                <Card>
                                    <Card.Header className="d-flex justify-content-between align-items-center">
                                        <h4 className="mb-0">Gestión de Usuarios</h4>
                                        
                                    </Card.Header>
                                    <Card.Body>
                                        <div className="table-responsive" style={{ maxHeight: '65vh', overflowY: 'auto' }}>
                                            <Table striped bordered hover  >
                                                <thead style={{ position: 'sticky', top: 0, backgroundColor: 'white', zIndex: 1 }}>
                                                    <tr>
                                                        <th>Estado</th>
                                                        <th>Nombre</th>
                                                        <th>Email</th>
                                                        <th>Teléfono</th>
                                                        <th>Provincia</th>
                                                        <th>Instrumentos</th>
                                                        <th>Clases Completadas</th>
                                                        <th>Acciones</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {usuarios.map(usuario => (
                                                        <tr key={usuario._id} className={!usuario.activo ? 'table-secondary' : ''}>
                                                            <td>
                                                                <Badge bg={usuario.activo ? "success" : "secondary"}>
                                                                    {usuario.activo ? "Activo" : "Inactivo"}
                                                                </Badge>
                                                            </td>
                                                            <td>
                                                                <div className="d-flex align-items-center">
                                                                    {usuario.imagen && (
                                                                        <img 
                                                                            src={usuario.imagen} 
                                                                            className="rounded-circle me-2" 
                                                                            alt="Avatar" 
                                                                            style={{ width: '30px', height: '30px' }} 
                                                                        />
                                                                    )}
                                                                    {usuario.nombre}
                                                                </div>
                                                            </td>
                                                            <td>{usuario.email}</td>
                                                            <td>{usuario.telefono}</td>
                                                            <td>{usuario.provincia}</td>
                                                            <td>{usuario.instrumentos ? usuario.instrumentos.length : 0}</td>
                                                            <td>{contarClasesCompletadas(usuario.clases)}</td>
                                                            <td>
                                                                <div className="d-flex gap-1">
                                                                    <Button  variant="outline-primary" size="sm"
                                                                        onClick={() => abrirModalUsuario(usuario)}>
                                                                        <PencilFill/>
                                                                    </Button>
                                                                    {usuario.activo ? (
                                                                        <Button   variant="outline-warning" size="sm"  onClick={() => eliminarUsuario (usuario._id, false)}>
                                                                            <EyeSlashFill/>
                                                                        </Button>
                                                                    ) : (
                                                                        <Button 
                                                                            variant="outline-success" 
                                                                            size="sm"
                                                                            onClick={() => activarUsuario(usuario._id)}
                                                                        >
                                                                            <EyeFill/>
                                                                        </Button>
                                                                    )}
                                                                    <Button 
                                                                        variant="secondary" 
                                                                        size="sm"
                                                                        onClick={() => eliminarUsuario(usuario._id, true)}
                                                                    >
                                                                        <TrashFill/>
                                                                    </Button>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </Table>
                                        </div>
                                    </Card.Body>
                                </Card>
                            </Tab>

                            {/* PESTAÑA PROFESORES */}
                            <Tab eventKey="profesores" title={`Profesores (${profesores.length})`}>
                                <Card>
                                    <Card.Header className="d-flex justify-content-between align-items-center">
                                        <h4 className="mb-0">Gestión de Profesores</h4>
                                        
                                    </Card.Header>
                                    <Card.Body>
                                        <div className="table-responsive" style={{ maxHeight: '65vh', overflowY: 'auto' }}>
                                            <Table striped bordered hover>
                                                <thead style={{ position: 'sticky', top: 0, backgroundColor: 'white', zIndex: 1 }}>
                                                    <tr>
                                                        <th>Estado</th>
                                                        <th>Nombre</th>
                                                        <th>Email</th>
                                                        <th>Teléfono</th>
                                                        <th>Provincia</th>
                                                        <th>Precio/Hora</th>
                                                        <th>Instrumentos</th>
                                                        <th>Clases Completadas</th>
                                                        <th>Acciones</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {profesores.map(profesor => (
                                                        <tr key={profesor._id} className={!profesor.activo ? 'table-secondary' : ''}>
                                                            <td>
                                                                <Badge bg={profesor.activo ? "success" : "secondary"}>
                                                                    {profesor.activo ? "Activo" : "Inactivo"}
                                                                </Badge>
                                                            </td>
                                                            <td>
                                                                <div className="d-flex align-items-center">
                                                                    {profesor.imagen && (
                                                                        <img 
                                                                            src={profesor.imagen} 
                                                                            className="rounded-circle me-2" 
                                                                            alt="Avatar" 
                                                                            style={{ width: '30px', height: '30px' }} 
                                                                        />
                                                                    )}
                                                                    {profesor.nombre}
                                                                </div>
                                                            </td>
                                                            <td>{profesor.email}</td>
                                                            <td>{profesor.telefono}</td>
                                                            <td>{profesor.provincia}</td>
                                                            <td>{profesor.precioHora}€</td>
                                                            {/* BUCLE MOSTRAR INSTRUMENTOS */}
                                                            <td>{profesor.instrumentos ? profesor.instrumentos.length : 0}</td>
                                                            <td>{contarClasesCompletadas(profesor.clases)}</td>
                                                            <td>
                                                                <div className="d-flex gap-1">
                                                                    <Button 
                                                                        variant="outline-primary" 
                                                                        size="sm"
                                                                        onClick={() => abrirModalProfesor(profesor)}
                                                                    >
                                                                        <PencilFill/>
                                                                    </Button>
                                                                    {profesor.activo ? (
                                                                        <Button 
                                                                            variant="outline-warning" 
                                                                            size="sm"
                                                                            onClick={() => eliminarProfesor(profesor._id, false)}
                                                                        >
                                                                            <EyeSlashFill/>
                                                                        </Button>
                                                                    ) : (
                                                                        <Button 
                                                                            variant="outline-success" 
                                                                            size="sm"
                                                                            onClick={() => activarProfesor(profesor._id)}
                                                                        >
                                                                            <EyeFill/>
                                                                        </Button>
                                                                    )}
                                                                    <Button 
                                                                        variant="secondary" 
                                                                        size="sm"
                                                                        onClick={() => eliminarProfesor(profesor._id, true)}
                                                                    >
                                                                        <TrashFill/>
                                                                    </Button>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </Table>
                                        </div>
                                    </Card.Body>
                                </Card>
                            </Tab>
                        </Tabs>
                    </Container>

                    {/* MODAL USUARIO */}
                    <Modal show={mostrarModalUsuario} onHide={cerrarModalUsuario} size="lg">
                        <Modal.Header closeButton>
                            <Modal.Title>Editar Usuario</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            {usuarioSeleccionado && (
                                <Form>
                                    <Row>
                                        <Col xs={12} md={6}>
                                            <Form.Group className="mb-3">
                                                <Form.Label>Nombre </Form.Label>
                                                <Form.Control 
                                                    type="text" 
                                                    value={usuarioSeleccionado.nombre}
                                                    onChange={(e) => setUsuarioSeleccionado({...usuarioSeleccionado, nombre: e.target.value})}
                                                    required
                                                />
                                            </Form.Group>
                                        </Col>
                                        <Col xs={12} md={6}>
                                            <Form.Group className="mb-3">
                                                <Form.Label>Email </Form.Label>
                                                <Form.Control 
                                                    type="email" 
                                                    value={usuarioSeleccionado.email}
                                                    onChange={(e) => setUsuarioSeleccionado({...usuarioSeleccionado, email: e.target.value})}
                                                    required
                                                />
                                            </Form.Group>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col xs={12} md={6}>
                                            <Form.Group className="mb-3">
                                                <Form.Label>Teléfono </Form.Label>
                                                <Form.Control 
                                                    type="text" 
                                                    value={usuarioSeleccionado.telefono}
                                                    onChange={(e) => setUsuarioSeleccionado({...usuarioSeleccionado, telefono: e.target.value})}
                                                    required
                                                />
                                            </Form.Group>
                                        </Col>
                                        <Col xs={12} md={6}>
                                            <Form.Group className="mb-3">
                                                <Form.Label>Provincia </Form.Label>
                                                <Form.Select 
                                                    value={usuarioSeleccionado.provincia}
                                                    onChange={(e) => setUsuarioSeleccionado({...usuarioSeleccionado, provincia: e.target.value})}
                                                    required
                                                >
                                                    <option value="">Selecciona una provincia</option>
                                                    {provincias.map((provincia, index) => (
                                                        <option key={index} value={provincia}>{provincia}</option>
                                                    ))}
                                                </Form.Select>
                                            </Form.Group>
                                        </Col>
                                    </Row>
                                    <Row>
                                        {/* {ME SALIA EL HASH} */}
                                        {/* <Col xs={12} md={6}>
                                            <Form.Group className="mb-3">
                                                <Form.Label>Contraseña {modoEdicion ? '(dejar en blanco para no cambiar)' : '*'}</Form.Label>
                                                <Form.Control 
                                                    type="password" 
                                                    value={usuarioSeleccionado.password || ''}
                                                    onChange={(e) => setUsuarioSeleccionado({...usuarioSeleccionado, password: e.target.value})}
                                                    required={!modoEdicion}
                                                />
                                            </Form.Group>
                                        </Col> */}
                                        <Col xs={12} md={6}>
                                            <Form.Group className="mb-3">
                                                <Form.Label>Estado</Form.Label>
                                                <Form.Check 
                                                    type="switch"
                                                    label="Usuario activo"
                                                    checked={usuarioSeleccionado.activo}
                                                    onChange={(e) => setUsuarioSeleccionado({...usuarioSeleccionado, activo: e.target.checked})}
                                                />
                                            </Form.Group>
                                        </Col>
                                    </Row>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Imagen de perfil</Form.Label>
                                        <Form.Control 
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => setImagenUsuario(e.target.files[0])}
                                        />
                                    </Form.Group>
                                </Form>
                            )}
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={cerrarModalUsuario}>
                                Cancelar
                            </Button>
                            <Button variant="primary" onClick={guardarUsuario}>
                                {modoEdicion ? 'Actualizar' : 'Crear'} Usuario
                            </Button>
                        </Modal.Footer>
                    </Modal>

                    {/* MODAL PROFESOR */}
                    <Modal show={mostrarModalProfesor} onHide={cerrarModalProfesor} size="lg">
                        <Modal.Header closeButton>
                            <Modal.Title>{modoEdicion ? 'Editar Profesor' : 'Nuevo Profesor'}</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            {profesorSeleccionado && (
                                <Form>
                                    <Row>
                                        <Col xs={12} md={6}>
                                            <Form.Group className="mb-3">
                                                <Form.Label>Nombr </Form.Label>
                                                <Form.Control 
                                                    type="text" 
                                                    value={profesorSeleccionado.nombre}
                                                    onChange={(e) => setProfesorSeleccionado({...profesorSeleccionado, nombre: e.target.value})}
                                                    required
                                                />
                                            </Form.Group>
                                        </Col>
                                        <Col xs={12} md={6}>
                                            <Form.Group className="mb-3">
                                                <Form.Label>Emai </Form.Label>
                                                <Form.Control 
                                                    type="email" 
                                                    value={profesorSeleccionado.email}
                                                    onChange={(e) => setProfesorSeleccionado({...profesorSeleccionado, email: e.target.value})}
                                                    required
                                                />
                                            </Form.Group>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col xs={12} md={6}>
                                            <Form.Group className="mb-3">
                                                <Form.Label>Teléfono </Form.Label>
                                                <Form.Control 
                                                    type="text" 
                                                    value={profesorSeleccionado.telefono}
                                                    onChange={(e) => setProfesorSeleccionado({...profesorSeleccionado, telefono: e.target.value})}
                                                    required
                                                />
                                            </Form.Group>
                                        </Col>
                                        <Col xs={12} md={6}>
                                            <Form.Group className="mb-3">
                                                <Form.Label>Provincia </Form.Label>
                                                <Form.Select 
                                                    value={profesorSeleccionado.provincia}
                                                    onChange={(e) => setProfesorSeleccionado({...profesorSeleccionado, provincia: e.target.value})}
                                                    required
                                                >
                                                    <option value="">Selecciona una provincia</option>
                                                    {provincias.map((provincia, index) => (
                                                        <option key={index} value={provincia}>{provincia}</option>
                                                    ))}
                                                </Form.Select>
                                            </Form.Group>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col xs={12} md={6}>
                                            <Form.Group className="mb-3">
                                                <Form.Label>Precio por Hora (€) </Form.Label>
                                                <Form.Control 
                                                    required type="number" step={1} defaultValue={10}  placeholder="Precio por hora" min={5} max={100}
                                                    value={profesorSeleccionado.precioHora}
                                                    onChange={(e) => setProfesorSeleccionado({...profesorSeleccionado, precioHora: parseFloat(e.target.value)})}
                                                />
                                            </Form.Group>
                                        </Col>

                                        {/* {ME SALIA EL HASH} */}
                                        {/* <Col xs={12} md={6}>
                                            <Form.Group className="mb-3">
                                                <Form.Label>Contraseña {modoEdicion ? '(dejar en blanco para no cambiar)' : '*'}</Form.Label>
                                                <Form.Control 
                                                    type="password" 
                                                    value={profesorSeleccionado.password || ''}
                                                    onChange={(e) => setProfesorSeleccionado({...profesorSeleccionado, password: e.target.value})}
                                                    required={!modoEdicion}
                                                />
                                            </Form.Group>
                                        </Col> */}
                                    </Row>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Biografía</Form.Label>
                                        <Form.Control 
                                            as="textarea" 
                                            rows={3}
                                            value={profesorSeleccionado.bio || ''}
                                            onChange={(e) => setProfesorSeleccionado({...profesorSeleccionado, bio: e.target.value})}
                                            placeholder="Biografía del profesor..."
                                        />
                                    </Form.Group>
                                    <Row>
                                        <Col xs={12} md={6}>
                                            <Form.Group className="mb-3">
                                                <Form.Label>Estado</Form.Label>
                                                <Form.Check 
                                                    type="switch"
                                                    label="Profesor activo"
                                                    checked={profesorSeleccionado.activo}
                                                    onChange={(e) => setProfesorSeleccionado({...profesorSeleccionado, activo: e.target.checked})}
                                                />
                                            </Form.Group>
                                        </Col>
                                        <Col xs={12} md={6}>
                                            <Form.Group className="mb-3">
                                                <Form.Label>Imagen de perfil</Form.Label>
                                                <Form.Control 
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={(e) => setImagenProfesor(e.target.files[0])}
                                                />
                                            </Form.Group>
                                        </Col>
                                    </Row>
                                </Form>
                            )}
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={cerrarModalProfesor}>
                                Cancelar
                            </Button>
                            <Button variant="primary" onClick={guardarProfesor}>
                                {modoEdicion ? 'Actualizar' : 'Crear'} Profesor
                            </Button>
                        </Modal.Footer>
                    </Modal>
                </>
            )}
        </>
    );
};

export default PerfilAdmin;