
// import { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { Container, Row, Col, Button, Form } from "react-bootstrap";

// const PerfilProfesor = () => {
//     const [profesor, setProfesor] = useState(null);
//     const [editando, setEditando] = useState(false);
//     const [formData, setFormData] = useState({});
//     const navigate = useNavigate();

//     useEffect(() => {
//         const cargarPerfil = async () => {
//             const profesorId = sessionStorage.getItem('id');
//             if (!profesorId) {
//                 navigate('/login');
//                 return;
//             }

//             try {
//                 const respuesta = await fetch(`http://localhost:5000/profesor/${profesorId}`);
//                 const datos = await respuesta.json();
//                 setProfesor(datos);
//                 setFormData(datos);
//             } catch (error) {
//                 console.error('Error cargando perfil:', error);
//             }
//         };
//         cargarPerfil();
//     }, [navigate]);

//     const enviarFormulario = async (e) => {
//         e.preventDefault();
//         try {
//             const respuesta = await fetch(`http://localhost:5000/profesor/${profesor._id}`, {
//                 method: 'PUT',
//                 headers: { 'Content-Type': 'application/json' },
//                 body: JSON.stringify(formData)
//             });
            
//             if (respuesta.ok) {
//                 const datosActualizados = await respuesta.json();
//                 setProfesor(datosActualizados);
//                 setEditando(false);
//                 sessionStorage.setItem('profesor', datosActualizados.nombre);
//                 alert('Perfil actualizado correctamente');
//             }
//         } catch (error) {
//             console.error('Error actualizando perfil:', error);
//         }
//     };

//     if (!profesor) return <div>Cargando...</div>;

//     return (
//         <Container fluid className="perfil-container">
//             <Row>
//                 <Col xs={12} md={6}>
//                     <h1>Perfil de Profesor</h1>
//                     <p><strong>Nombre:</strong> {profesor.nombre}</p>
//                     <p><strong>Email:</strong> {profesor.email}</p>
//                     <p><strong>Teléfono:</strong> {profesor.telefono}</p>
//                     <p><strong>Provincia:</strong> {profesor.provincia}</p>
//                     <p><strong>Precio por hora:</strong> ${profesor.precioHora}</p>
//                     <p><strong>Bio:</strong> {profesor.bio}</p>
//                 </Col>
//                 <Col xs={12} md={6}>
//                     {editando ? (
//                         <Form onSubmit={enviarFormulario}>
//                             <Form.Group controlId="nombre">
//                                 <Form.Label>Datos del Profesor</Form.Label>
//                                 <Form.Control
//                                     type="text"
//                                     value={formData.nombre || ''}
//                                     onChange={(e) => setFormData({...formData, nombre: e.target.value})}
//                                     placeholder="Nombre"
//                                 />
//                             </Form.Group>

//                             <Form.Group controlId="email">
//                                 <Form.Control
//                                     type="email"
//                                     value={formData.email || ''}
//                                     onChange={(e) => setFormData({...formData, email: e.target.value})}
//                                     placeholder="Email"
//                                 />
//                             </Form.Group>

//                             <Form.Group controlId="telefono">
//                                 <Form.Control
//                                     type="text"
//                                     value={formData.telefono || ''}
//                                     onChange={(e) => setFormData({...formData, telefono: e.target.value})}
//                                     placeholder="Teléfono"
//                                 />
//                             </Form.Group>

//                             <Form.Group controlId="provincia">
//                                 <Form.Select value={formData.provincia || ''} onChange={(e) => setFormData({...formData, provincia: e.target.value})}>
//                                     {profesor && Object.keys(profesor).map((key, index) => (
//                                         <option key={index} value={profesor[key]}>{profesor[key]}</option>
//                                     ))}
//                                 </Form.Select>
//                             </Form.Group>

//                             <Form.Group controlId="precioHora">
//                                 <Form.Control
//                                     type="number"
//                                     value={formData.precioHora || ''}
//                                     onChange={(e) => setFormData({...formData, precioHora: e.target.value})}
//                                     placeholder="Precio por hora"
//                                 />
//                             </Form.Group>

//                             <Form.Group controlId="bio">
//                                 <Form.Control
//                                     as="textarea"
//                                     rows={3}
//                                     value={formData.bio || ''}
//                                     onChange={(e) => setFormData({...formData, bio: e.target.value})}
//                                     placeholder="Biografía"
//                                 />
//                             </Form.Group>

//                             <Button variant="outline-dark" type="submit">Guardar Cambios</Button>
//                         </Form>
//                     ) : (
//                         <div className="d-flex justify-content-end">
//                             <Button variant="outline-dark" onClick={() => setEditando(true)}>Editar Perfil</Button>
//                         </div>
//                     )}
//                 </Col>
//             </Row>
//         </Container>
//     );
// };

// export default PerfilProfesor;

// Frontend/src/components/templates/PerfilProfesor.jsx (1-112)
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Button, Form } from "react-bootstrap";

const PerfilProfesor = () => {
    const [profesor, setProfesor] = useState(null);
    const [editando, setEditando] = useState(false);
    const [formData, setFormData] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
        const cargarPerfil = async () => {
            const profesorId = sessionStorage.getItem('id');
            if (!profesorId) {
                navigate('/login');
                return;
            }

            try {
                const respuesta = await fetch(`http://localhost:5000/profesor/${profesorId}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                const datos = await respuesta.json();
                setProfesor(datos);
                setFormData(datos);
            } catch (error) {
                console.error('Error cargando perfil:', error);
            }
        };
        cargarPerfil();
    }, [navigate]);

    useEffect(() => {
        if (editando) {
            const fetchInstrumentos = async () => {
                try {
                    const respuesta = await fetch(`http://localhost:5000/instrumentos`, {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    });
                    setFormData((prevState) => ({ ...prevState, instrumentos: respuesta.data }));
                } catch (error) {
                    console.error('Error cargando instrumentos:', error);
                }
            };
            fetchInstrumentos();
        }
    }, [editando]);

    const enviarFormulario = async (e) => {
        e.preventDefault();
        try {
            const respuesta = await fetch(`http://localhost:5000/profesor/${profesor._id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            
            if (respuesta.ok) {
                const datosActualizados = await respuesta.json();
                setProfesor(datosActualizados);
                setEditando(false);
                sessionStorage.setItem('profesor', datosActualizados.nombre);
                alert('Perfil actualizado correctamente');
                // NAVEGAR A LA MISMA PAGINA
                navigate(0);
            }
        } catch (error) {
            console.error('Error actualizando perfil:', error);
        }
    };

    if (!profesor) return <div>Cargando...</div>;

    return (
        <Container fluid className="perfil-container">
            <Row>
                <Col xs={12} md={6}>
                    <h1>Perfil de Profesor</h1>
                    {editando ? (
                        <Form onSubmit={enviarFormulario}>
                            <Form.Group controlId="nombre">
                                <Form.Label>Datos del Profesor</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={formData.nombre || ''}
                                    onChange={(e) => setFormData({...formData, nombre: e.target.value})}
                                    placeholder="Nombre"
                                />
                            </Form.Group>

                            <Form.Group controlId="email">
                                <Form.Label>Email:</Form.Label>
                                <Form.Control
                                    type="email"
                                    value={formData.email || ''}
                                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                                    placeholder="Email"
                                />
                            </Form.Group>

                            <Form.Group controlId="telefono">
                                <Form.Label>Teléfono:</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={formData.telefono || ''}
                                    onChange={(e) => setFormData({...formData, telefono: e.target.value})}
                                    placeholder="Teléfono"
                                />
                            </Form.Group>

                            <Form.Group controlId="provincia">
                                <Form.Label>Provincia:</Form.Label>
                                <Form.Select value={formData.provincia || ''} onChange={(e) => setFormData({...formData, provincia: e.target.value})}>
                                    {profesor && Object.keys(profesor).map((key, index) => (
                                        <option key={index} value={profesor[key]}>{profesor[key]}</option>
                                    ))}
                                </Form.Select>
                            </Form.Group>

                            <Form.Group controlId="precioHora">
                                <Form.Label>Precio por hora:</Form.Label>
                                <Form.Control
                                    type="number"
                                    value={formData.precioHora || ''}
                                    onChange={(e) => setFormData({...formData, precioHora: e.target.value})}
                                    placeholder="Precio por hora"
                                />
                            </Form.Group>

                            <Form.Group controlId="bio">
                                <Form.Label>Bio:</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    rows={3}
                                    value={formData.bio || ''}
                                    onChange={(e) => setFormData({...formData, bio: e.target.value})}
                                    placeholder="Biografía"
                                />
                            </Form.Group>

                            {editando && (
                                <div>
                                    <Button variant="outline-dark" onClick={() => {
                                        const newFormData = { ...formData };
                                        newFormData.instrumentos.push({ nombre: '' });
                                        setFormData(newFormData);
                                    }}>
                                        Agregar instrumento
                                    </Button>
                                </div>
                            )}
                            {editando && (
                                formData.instrumentos.map((instrumento, index) => (
                                    <div key={index}>
                                        <p>{instrumento.nombre}</p>
                                        <Button variant="outline-dark" size="sm" onClick={() => {
                                            const newFormData = { ...formData };
                                            newFormData.instrumentos.splice(index, 1);
                                            setFormData(newFormData);
                                        }}>
                                            Eliminar
                                        </Button>
                                    </div>
                                ))
                            )}
                        </Form>
                    ) : (
                        <div className="d-flex justify-content-end">
                            <Button variant="outline-dark" onClick={() => setEditando(true)}>Editar Perfil</Button>
                        </div>
                    )}
                </Col>

                <Col xs={12} md={6}>
                    <p><strong>Nombre:</strong> {profesor.nombre}</p>
                    <p><strong>Email:</strong> {profesor.email}</p>
                    <p><strong>Teléfono:</strong> {profesor.telefono}</p>
                    <p><strong>Provincia:</strong> {profesor.provincia}</p>
                    <p><strong>Precio por hora:</strong> ${profesor.precioHora}</p>
                    <p><strong>Bio:</strong> {profesor.bio}</p>

                    {editando && (
                        <div>
                            <Button variant="outline-dark" type="submit">Guardar Cambios</Button>
                            <Button variant="outline-dark" onClick={() => setEditando(false)}>Cancelar</Button>
                        </div>
                    )}
                </Col>
            </Row>
        </Container>
    );
};

export default PerfilProfesor;