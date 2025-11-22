import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Container, Row, Col, Card, Button, Form, Alert, Modal } from "react-bootstrap";
import Header from "./templates/Header";
import {SyncLoader} from "react-spinners";
/**
 * VISTA DE PROFESOR
 * - Vista de los usuarios del perfil de un profesor
 * - Se puede reservar una clase desde esta vista
 */
const VerProfesor = () => {
    // OBTENER EL ID DEL PROFESOR DESDE LA URL
    const {id}  = useParams();

    // OBTENER EL ID DEL ALUMNO DESDE SESSIONSTORAGE
    const idAlumno = sessionStorage.getItem("id");

    // ESTADOS DE PROFESOR E INSTRUMENTOS
    const [profesor, setProfesor] = useState(null);
    const [instrumentos, setInstrumentos] = useState([]);
    const [fecha, setFecha] = useState("");
    const [descripcion, setDescripcion] = useState("");
    const [horaInicio, setHoraInicio] = useState("");
    const [horaFin, setHoraFin] = useState("");
    const [instrumentoClase, setInstrumentoClase] = useState("");   
    
    const horasDia = ["08:00","08:30", "09:00","09:30", "10:00","10:30", "11:00","11:30", "12:00","12:30", "13:00","13:30", "14:00","14:30", "15:00","15:30", "16:00","16:30", "17:00","17:30", "18:00", "18:30", "19:00", "19:30", "20:00", "20:30", "21:00","21:30", "22:00"];

   // ESTADO SPARA LA FECHA

    const [fechaMinima, setFechaMinima] = useState(null);

    useEffect (() => {
        const minimo = new Date();
        minimo.setDate(minimo.getDate() + 1);
        setFechaMinima(minimo.toISOString().split('T')[0]);
    }, []) 


    // ESTADOS DE USUARIO
    const [cargando, setCargando] = useState(false);
    const [error, setError] = useState(null);
    const [exito, setExito] = useState(null);
    const [mostrarModalReserva, setMostrarModalReserva] = useState(false);

    // EFECTO  => DATOS PROFESOR
    useEffect(() => {
        async function obtenerProfesor() {
            setCargando(true);
            setError(null);

            try {
                const respuesta = await fetch(`http://localhost:5000/profesor/${id}`);
                const datos = await respuesta.json();

                if (datos.mensaje) {
                    setError(datos.mensaje);
                    return;
                }

                setProfesor(datos);

                // CARGAR LOS INSTRUMENTOS QUE ENSEÑA EL PROFESOR
                if (Array.isArray(datos.instrumentos) && datos.instrumentos.length > 0) {
                    const instrumentosCargados = [];
                    for (const idInstrumento of datos.instrumentos) {
                        const resInst = await fetch(`http://localhost:5000/instrumentos/${idInstrumento}`);
                        const datosInst = await resInst.json();
                        instrumentosCargados.push(datosInst);
                    }
                    setInstrumentos(instrumentosCargados);
                }
            } catch (err) {
                setError("Error al obtener los datos del profesor: " + err.message);
            } finally {
                setCargando(false);
            }
        }

        obtenerProfesor();
    }, [id]);

    // FUNCIÓN PARA ENVIAR LA SOLICITUD DE RESERVA
    async function enviarReserva(e) {
        
        e.preventDefault();
        setCargando(true);
        setError(null);
        setExito(null);
        

        if (!fecha || !horaInicio || !horaFin || !instrumentoClase) {
            alert("Por favor, completa todos los campos de la solicitud de reserva.");
            return;
        }
        const fechaInicio = `${fecha}T${horaInicio}`;
        const fechaFin = `${fecha}T${horaFin}`;
        if (fechaInicio >= fechaFin) {
            alert("La clase tiene que empezar antes que acabar.");
            return;
        }

        try {
            const cuerpo = JSON.stringify({
                descripcion: descripcion,
                alumnoId: idAlumno,
                fechaInicio: fechaInicio,
                fechaFin: fechaFin,
                instrumento: instrumentoClase,
                profesorId: profesor._id,
            });
            const respuesta = await fetch("http://localhost:5000/usuario/reservar-clase", {
                method: "POST",
                headers: { 
                    "Connection": "keep-alive",
                    "Content-Type": "application/json",
                },
                body: cuerpo,
            });
           
            const datos = await respuesta.json();

            if (!respuesta.ok) {
                throw new Error(datos.mensaje || "Error al solicitar la clase");
            }
            

            setExito(datos.mensaje || "Solicitud de clase enviada con éxito");
            setMostrarModalReserva(false);
            setDescripcion("");
            setFecha("");
            setHoraInicio("");
            setHoraFin("");
            setInstrumentoClase("");


            // setFormReserva({ descripcion: "", fechaInicio: "", fechaFin: "", instrumento: "" });
            setTimeout(() => setExito(null), 2000);
        } catch (err) {
            setError("Error al enviar la solicitud: " + err.message);
            setTimeout(() => setError(null), 2000);
        } finally {
            setCargando(false);
        }
    }

    // SI ESTÁ CARGANDO Y NO HAY DATOS AÚN
    if (cargando && !profesor) {
        return (
            <div className="loader">
                    <SyncLoader color="#213448"/><br></br>
                    <p style={{color: "#213448"}}>Cargando datos del profesor...</p>
            </div>
        );
    }

    // SI HAY ERROR Y NO HAY DATOS
    if (error && !profesor) {
        return (
            <Container className="py-5">
                <Alert variant="danger">{error}</Alert>
            </Container>
        );
    }

    return (
        <>
        <Header/>
        <Container  >
            {/* ALERTAS DE ERROR O ÉXITO */}
            {error && <Alert variant="danger">{error}</Alert>}
            {exito && <Alert variant="success">{exito}</Alert>}

            {/* INFORMACIÓN DEL PROFESOR */}
            {profesor && (
                <Row className="justify-content-center">
                    <Col xs={12} md={8} lg={6}>
                        <Card className="shadow-sm mb-4">
                            {profesor.imagen && (
                                <Card.Img
                                    variant="top"
                                    src={profesor.imagen} 
                                    alt={profesor.nombre}
                                    style={{  objectFit: "cover" }}
                                />
                            )}
                            <Card.Body>
                                <Card.Title>{profesor.nombre}</Card.Title>
                                {profesor.bio && <Card.Text>{profesor.bio}</Card.Text>}

                                {instrumentos.length > 0 && (
                                    <>
                                        <h6>Instrumentos que enseña:</h6>
                                        <ul>
                                            {instrumentos.map((inst) => (
                                                <li key={inst._id}>{inst.nombre}</li>
                                            ))}
                                        </ul>
                                    </>
                                )}
                                <h6>Precio por hora de clase: <strong>{profesor.precioHora}€</strong></h6>

                                <Button
                                    variant="primary"
                                    onClick={() =>{ 
                                        if (!sessionStorage.getItem("usuario") || sessionStorage.getItem("rol") !== "alumno") {
                                           
                                            setError("Debes estar logueado como alumno para solicitar una clase")
                                            setTimeout(() => setError(null), 3000)
                                      
                                        } else {
                                            setMostrarModalReserva(true)
                                        }
                                    }
                                }
                                >
                                    Solicitar clase
                                </Button>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            )}

            {/* MODAL DE RESERVA */}
            <Modal
                show={mostrarModalReserva}
                onHide={() => setMostrarModalReserva(false)}
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title>Solicitar clase con {profesor?.nombre}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={enviarReserva}>
                        {/* DESCRIPCIÓN */}
                        <Form.Group className="mb-3">
                            <Form.Label>Descripción</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                placeholder="Describe brevemente la clase que deseas..."
                                value={descripcion}
                                maxLength={80}
                                onChange={(e) =>setDescripcion(e.target.value)}
                                required
                            />
                        </Form.Group>

                        {/* FECHAS */}
                        <Row>
                            <Form.Group className="mb-3">
                            <Form.Label>Día</Form.Label>
                            <Form.Control type="date" min={fechaMinima} onChange={(e) => setFecha(e.target.value)} defaultValue=''>

                            
                            </Form.Control>
                            </Form.Group>
                        </Row>

                        <Row>
                            
                            
                            <Col xs={12} md={6} className="mb-3">
                                <Form.Label>Hora inicio</Form.Label>
                                <Form.Select value={horaInicio} onChange={(e) => setHoraInicio(e.target.value)}>
                                    <option value="">Selecciona una hora</option>
                                    {horasDia.map((hora) => (
                                        <option key={hora} value={hora}>{hora}</option>
                                    ))}
                                </Form.Select>
                            </Col>
                            <Col xs={12} md={6} className="mb-3">
                                <Form.Label>Hora fin</Form.Label>
                                <Form.Select value={horaFin} onChange={(e) => setHoraFin(e.target.value)}>
                                    <option value="">Selecciona una hora</option>
                                    {horasDia.map((hora) => (
                                        <option key={hora} value={hora}>{hora}</option>
                                    ))}
                                </Form.Select>
                            </Col>
                        </Row>

                        {/* INSTRUMENTO */}
                        <Form.Group className="mb-3">
                            <Form.Label>Instrumento</Form.Label>
                            <Form.Select
                                value={instrumentoClase}
                                onChange={(e) => setInstrumentoClase(e.target.value)}
                                required
                            >
                                <option value="">Selecciona un instrumento</option>
                                {instrumentos.map((inst) => (
                                    <option key={inst._id} value={inst._id}>
                                        {inst.nombre}
                                    </option>
                                ))}
                            </Form.Select>
                        </Form.Group>

                        <div className="text-end">
                            <Button
                                variant="secondary"
                                className="me-2"
                                onClick={() => setMostrarModalReserva(false)}
                            >
                                Cancelar
                            </Button>
                            <Button type="submit" variant="primary">
                                Enviar solicitud
                            </Button>
                        </div>
                    </Form>
                </Modal.Body>
            </Modal>
        </Container>
        </>
    );
}

export default VerProfesor