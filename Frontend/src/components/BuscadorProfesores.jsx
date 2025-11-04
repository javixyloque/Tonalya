import { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Card, Alert } from 'react-bootstrap';
import Header from "./templates/Header";
import { arrayProvincias } from "../functions/variables.js";
import {SyncLoader} from "react-spinners";

const BuscadorProfesores = () => {
    const [profesores, setProfesores] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    
    const [provinciaSeleccionada, setProvinciaSeleccionada] = useState('');
    const [instrumentoSeleccionado, setInstrumentoSeleccionado] = useState('');
    const [instrumentosDisponibles, setInstrumentosDisponibles] = useState([]);
    
    const provincias = arrayProvincias();

    useEffect(() => {
        cargarInstrumentosDisponibles();
    }, []);

    const cargarInstrumentosDisponibles = async () => {
        try {
            const respuesta = await fetch('http://localhost:5000/instrumentos');
            const datos = await respuesta.json();
            setInstrumentosDisponibles(datos);
        } catch (error) {
            console.error('Error cargando instrumentos:', error);
        }
    };

    const buscarProfesores = async (e) => {
        if (e) e.preventDefault();
        setLoading(true);
        setError('');

        try {
            let url = '';
            
            // PRO PROVINCIA E INSTRUMENTO
            if (provinciaSeleccionada && instrumentoSeleccionado) {
                
                url = `http://localhost:5000/profesor/profesor/${instrumentoSeleccionado}/${provinciaSeleccionada}`;

                // SOLO POR PROVINCIA
            } else if (provinciaSeleccionada && !instrumentoSeleccionado) {

                url = `http://localhost:5000/profesor/profesor/${provinciaSeleccionada}`;

                // SOLO PRO ISNTRUMENTO
            } else if (instrumentoSeleccionado && !provinciaSeleccionada) {
            
                url = `http://localhost:5000/profesor/${instrumentoSeleccionado}`;


                // SIN FILTROS => TODOS
            } else {
                url = 'http://localhost:5000/profesor';
            }

            const respuesta = await fetch(url);
            const datos = await respuesta.json();
            
            if (Array.isArray(datos)) {
                setProfesores(datos);
                if (datos.length === 0) {
                    setError('No se encontraron profesores con los criterios seleccionados');
                }
            } else if (datos.mensaje) {

                setProfesores([]);
                setError(datos.mensaje);
            }
        } catch (error) {
            console.error('Error buscando profesores:', error);
            setError('Error al buscar profesores');
        } finally {
            setLoading(false);
        }
    };

    const limpiarFiltros = () => {
        setProvinciaSeleccionada('');
        setInstrumentoSeleccionado('');
        setProfesores([]);
        setError('');
    };

    return (
        <>
            <Header />
            <Container className="my-4">
                <Row className="mb-4">
                    <Col xs={12}>
                        <h1 className="text-center">Encuentra tu Profesor Ideal</h1>
                        <p className="text-center text-muted">
                            Filtra por instrumento y provincia para encontrar el profesor perfecto para ti
                        </p>
                    </Col>
                </Row>

                {/* FORMULARIO DE BÚSQUEDA */}
                <Row className="mb-4">
                    <Col xs={12}>
                        <Card className="shadow-sm" style={{backgroundColor: "#213448", color: "#ECEFCA"}}>
                            <Card.Body>
                                <Form onSubmit={buscarProfesores}>
                                    <Row>
                                        <Col xs={12} md={4} className="mb-3">
                                            <Form.Group>
                                                <Form.Label>Instrumento</Form.Label>
                                                <Form.Select style={{color: "#213448", backgroundColor: "#ECEFCA"}}
                                                    value={instrumentoSeleccionado}
                                                    onChange={(e) => setInstrumentoSeleccionado(e.target.value)}
                                                >
                                                    <option value="" >Todos los instrumentos</option>
                                                    {instrumentosDisponibles.map(instrumento => (
                                                        <option key={instrumento._id} value={instrumento._id} >
                                                            {instrumento.nombre} ({instrumento.familia})
                                                        </option>
                                                    ))}
                                                </Form.Select>
                                            </Form.Group>
                                        </Col>

                                        <Col xs={12} md={4} className="mb-3">
                                            <Form.Group>
                                                <Form.Label>Provincia</Form.Label>
                                                <Form.Select style={{color: "#213448", backgroundColor: "#ECEFCA"}}
                                                    value={provinciaSeleccionada}
                                                    onChange={(e) => setProvinciaSeleccionada(e.target.value)}
                                                >
                                                    <option value="" >Todas las provincias</option>
                                                    {provincias.map((provincia, index) => (
                                                        <option key={index} value={provincia}>
                                                            {provincia}
                                                        </option>
                                                    ))}
                                                </Form.Select>
                                            </Form.Group>
                                        </Col>

                                        <Col xs={12} md={4} className="mb-3 d-flex align-items-end">
                                            <div className="d-flex gap-2 w-100">
                                                <Button 
                                                    variant="primary" 
                                                    type="submit" 
                                                    className="flex-grow-1"
                                                    disabled={loading}
                                                >
                                                  Buscar Profesores
                                                </Button>
                                                <Button 
                                                    variant="secondary" 
                                                    onClick={limpiarFiltros}
                                                    disabled={loading}
                                                >
                                                    Limpiar
                                                </Button>
                                            </div>
                                        </Col>
                                    </Row>
                                </Form>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>

                {/* RESULTADOS */}
                <Row>
                    <Col xs={12}>
                        {error && (
                            <Alert variant="warning" className="text-center">
                                {error}
                            </Alert>
                        )}

                        {loading ? (
                           <>
                                <div className="loader">
                                    <SyncLoader color="#213448"/><br></br>
                                    <p style={{color: "#213448"}}>Buscando...</p>
                                </div>
                            </>
                        ) : (
                            <>
                                {profesores.length > 0 && (
                                    <div className="mb-3">
                                        <h4>
                                            {profesores.length} profesor{profesores.length > 1 ? 'es' : ''} encontrado{profesores.length > 1 ? 's' : ''}
                                        </h4>
                                    </div>
                                )}

                                <Row>
                                    {profesores.map(profesor => (
                                        <Col xs={12} md={6} lg={4} key={profesor._id} className="mb-4">
                                            <Card className="h-100 shadow-sm" style={{backgroundColor: "#ECEFCA"}}>
                                                {profesor.imagen && (
                                                    <Card.Img 
                                                        variant="top" 
                                                        src={profesor.imagen} 
                                                        style={{ height: '200px', objectFit: 'cover' }}
                                                    />
                                                )}
                                                <Card.Body className="d-flex flex-column">
                                                    <Card.Title>{profesor.nombre}</Card.Title>
                                                    <Card.Text className="text-muted">
                                                        <strong>Provincia:</strong> {profesor.provincia}
                                                    </Card.Text>
                                                    <Card.Text>
                                                        <strong>Precio/hora:</strong> {profesor.precioHora}€
                                                    </Card.Text>
                                                    {profesor.bio && (
                                                        <Card.Text className="flex-grow-1">
                                                            {profesor.bio.length > 100 
                                                                ? `${profesor.bio.substring(0, 100)}...` 
                                                                : profesor.bio
                                                            }
                                                        </Card.Text>
                                                    )}
                                                    <div className="mt-auto">
                                                        <Button 
                                                            variant="outline-primary" 
                                                            size="sm" 
                                                            className="w-100"
                                                            onClick={() => {
                                                                window.location.href = `/ver-profesor/${profesor._id}`;
                                                                console.log('Ver perfil de:', profesor._id);
                                                            }}
                                                        >
                                                            Ver Perfil Completo
                                                        </Button>
                                                    </div>
                                                </Card.Body>
                                            </Card>
                                        </Col>
                                    ))}
                                </Row>

                                {profesores.length === 0 && !error && (
                                    <div className="text-center my-5 text-muted">
                                        <h5>No hay profesores para mostrar</h5>
                                        <p>Usa los filtros para buscar profesores</p>
                                    </div>
                                )}
                            </>
                        )}
                    </Col>
                </Row>
            </Container>
        </>
    );
};

export default BuscadorProfesores;