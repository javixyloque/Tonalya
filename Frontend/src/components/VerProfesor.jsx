import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Container, Row, Col, Card, Button, Form, Alert, Spinner, Modal } from "react-bootstrap";

/**
 * PERFIL PROFESOR
 * ----------------------------------------------------------
 * MUESTRA LOS DATOS DEL PROFESOR SELECCIONADO DESDE LA URL.
 * PERMITE AL ALUMNO (CON SESIÓN INICIADA) SOLICITAR UNA CLASE.
 * LAS PETICIONES SE HACEN CON FETCH NATIVO.
 * SIN TYPESCRIPT. VARIABLES Y COMENTARIOS EN ESPAÑOL.
 * ----------------------------------------------------------
 */

const VerProfesor = () => {
    // OBTENER EL ID DEL PROFESOR DESDE LA URL
    const { id } = useParams();

    // OBTENER EL ID DEL ALUMNO DESDE SESSIONSTORAGE
    const idAlumno = sessionStorage.getItem("id");

    // ESTADOS DE PROFESOR E INSTRUMENTOS
    const [profesor, setProfesor] = useState(null);
    const [instrumentos, setInstrumentos] = useState([]);

    // ESTADOS DE FORMULARIO DE RESERVA
    const [formReserva, setFormReserva] = useState({
        descripcion: "",
        fechaInicio: "",
        fechaFin: "",
        instrumento: "",
    });

    // ESTADOS DE UI
    const [cargando, setCargando] = useState(false);
    const [error, setError] = useState(null);
    const [exito, setExito] = useState(null);
    const [mostrarModalReserva, setMostrarModalReserva] = useState(false);

    // FUNCIÓN PARA OBTENER DATOS DEL PROFESOR
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

        try {
            const cuerpo = {
                descripcion: formReserva.descripcion,
                alumnoId: idAlumno,
                fechaInicio: formReserva.fechaInicio,
                fechaFin: formReserva.fechaFin,
                instrumento: formReserva.instrumento,
                profesorId: id,
            };

            const respuesta = await fetch("http://localhost:5000/usuario/reservar-clase", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(cuerpo),
            });

            const datos = await respuesta.json();

            if (!respuesta.ok) {
                throw new Error(datos.mensaje || "Error al solicitar la clase");
            }

            setExito(datos.mensaje || "Solicitud de clase enviada con éxito");
            setMostrarModalReserva(false);
            setFormReserva({ descripcion: "", fechaInicio: "", fechaFin: "", instrumento: "" });
        } catch (err) {
            setError("Error al enviar la solicitud: " + err.message);
        } finally {
            setCargando(false);
        }
    }

    // SI ESTÁ CARGANDO Y NO HAY DATOS AÚN
    if (cargando && !profesor) {
        return (
            <Container className="py-5 text-center">
                <Spinner animation="border" />
            </Container>
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
        <Container className="py-4">
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
                                    src={profesor.imagen} // SE ASUME BASE64 YA CODIFICADO
                                    alt={profesor.nombre}
                                    style={{ maxHeight: "300px", objectFit: "cover" }}
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

                                <Button
                                    variant="primary"
                                    onClick={() => setMostrarModalReserva(true)}
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
                                value={formReserva.descripcion}
                                onChange={(e) =>
                                    setFormReserva({
                                        ...formReserva,
                                        descripcion: e.target.value,
                                    })
                                }
                                required
                            />
                        </Form.Group>

                        {/* FECHAS */}
                        <Row>
                            <Col>
                                <Form.Group className="mb-3">
                                    <Form.Label>Fecha de inicio</Form.Label>
                                    <Form.Control
                                        type="datetime-local"
                                        value={formReserva.fechaInicio}
                                        onChange={(e) =>
                                            setFormReserva({
                                                ...formReserva,
                                                fechaInicio: e.target.value,
                                            })
                                        }
                                        required
                                    />
                                </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group className="mb-3">
                                    <Form.Label>Fecha de fin</Form.Label>
                                    <Form.Control
                                        type="datetime-local"
                                        value={formReserva.fechaFin}
                                        onChange={(e) =>
                                            setFormReserva({
                                                ...formReserva,
                                                fechaFin: e.target.value,
                                            })
                                        }
                                        required
                                    />
                                </Form.Group>
                            </Col>
                        </Row>

                        {/* INSTRUMENTO */}
                        <Form.Group className="mb-3">
                            <Form.Label>Instrumento</Form.Label>
                            <Form.Select
                                value={formReserva.instrumento}
                                onChange={(e) =>
                                    setFormReserva({
                                        ...formReserva,
                                        instrumento: e.target.value,
                                    })
                                }
                                required
                            >
                                <option value="">Selecciona un instrumento</option>
                                {instrumentos.map((inst) => (
                                    <option key={inst._id} value={inst.nombre}>
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
                            <Button type="submit" variant="primary" disabled={cargando}>
                                {cargando ? "Enviando..." : "Enviar solicitud"}
                            </Button>
                        </div>
                    </Form>
                </Modal.Body>
            </Modal>
        </Container>
    );
}

export default VerProfesor