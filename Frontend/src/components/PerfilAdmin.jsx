import { useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  Button,
  Tabs,
  Tab,
  Table,
  Dropdown,
  Modal,
  Form,
  Spinner,
  Alert,
  InputGroup,
  Accordion,
  Card,
} from "react-bootstrap";

import Header from "./templates/Header";


/**
 * PANEL DE ADMINISTRACIÓN - REACT BOOTSTRAP
 *  - USA FETCH NATIVO
 *  - VARIABLES EN ESPAÑOL
 *  - COMENTARIOS EN MAYÚSCULAS
 *  - FUNCIONES LLAMADAS POR useEffect INSTANTIADAS DENTRO DE useEffect
 */

const PerfilAdmin = () =>  {
  // BASE URL DEL ENDPOINT ADMIN (PUERTO 5000)
  const baseApi = "http://localhost:5000/admin";

  // ESTADOS PRINCIPALES
  const [usuarios, setUsuarios] = useState([]);
  const [profesores, setProfesores] = useState([]);
  const [instrumentos, setInstrumentos] = useState([]);

  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);
  const [tabActiva, setTabActiva] = useState("usuarios");

  // ESTADOS PARA ORDEN
  const [claveOrden, setClaveOrden] = useState("nombre"); // 'nombre' | 'provincia'
  const [direccionOrden, setDireccionOrden] = useState("asc"); // 'asc' | 'desc'

  // ESTADOS PARA MODALES
  const [mostrarModalEditar, setMostrarModalEditar] = useState(false);
  const [objetivoEditar, setObjetivoEditar] = useState(null); // { tipo: 'usuario'|'profesor'|'instrumento', datos: {} }

  const [mostrarModalEliminar, setMostrarModalEliminar] = useState(false);
  const [objetivoEliminar, setObjetivoEliminar] = useState(null);

  const [formInstrumento, setFormInstrumento] = useState({ nombre: "", familia: "" });
  const [mostrandoAlerta, setMostrandoAlerta] = useState(null); // texto de aviso temporal

  // FUNCIÓN AUXILIAR PARA ORDENAR LISTAS (CLIENT-SIDE)
    function ordenarLista(lista) {
        const clave = claveOrden;
        const dir = direccionOrden === "asc" ? 1 : -1;
        return [...lista].sort((a, b) => {
        const va = ((a[clave] || "") + "").toString().toLowerCase();
        const vb = ((b[clave] || "") + "").toString().toLowerCase();
        if (va < vb) {
            return -1 * dir;
        } 
        if (va > vb){ 
            return 1 * dir
        };
        return 0;
        });
    }

    // CADA VEZ QUE CAMBIA EL ORDEN SE MANTIENE EN EL ESTADO
    function toggleOrden(nuevaClave) {
        if (claveOrden === nuevaClave) {
            setDireccionOrden(direccionOrden === "asc" ? "desc" : "asc");
        } else {
            setClaveOrden(nuevaClave);
            setDireccionOrden("asc");
        }
    }

  // USEEFFECT QUE CARGA DATOS AL INICIAR
  useEffect(() => {
    // FUNCIONES INSTANTIADAS DENTRO DEL USEEFFECT (PETICIONES INICIALES)
    async function obtenerDatosIniciales() {
      setCargando(true);
      setError(null);
      try {
        // OBTENER USUARIOS, PROFESORES E INSTRUMENTOS EN PARALELO
        const [resUsuarios, resProfesores, resInstrumentos] = await Promise.all([
            fetch(`${baseApi}/usuarios`, { 
                method: "GET" ,
                headers: {
                    "Content-Type": "application/json",
                }
            }),
            fetch(`${baseApi}/profesores`, { 
                    method: "GET" ,
                    headers: {
                        "Content-Type": "application/json",
                    }
                }),
            fetch(`${baseApi}/instrumentos`, { 
                    method: "GET" ,
                    headers: {
                        "Content-Type": "application/json",
                    }
                }),
        ]);

        // LEER JSON (SI HAY ERROR EN STATUS, INTENTAR LEER MENSAJE)
        const datosUsuarios = resUsuarios.ok ? await resUsuarios.json() : await resUsuarios.json();
        const datosProfesores = resProfesores.ok ? await resProfesores.json() : await resProfesores.json();
        const datosInstrumentos = resInstrumentos.ok ? await resInstrumentos.json() : await resInstrumentos.json();

        // ACTUALIZAR ESTADOS (COMPROBANDO QUE SON ARRAYS)
        setUsuarios(Array.isArray(datosUsuarios) ? datosUsuarios : []);
        setProfesores(Array.isArray(datosProfesores) ? datosProfesores : []);
        setInstrumentos(Array.isArray(datosInstrumentos) ? datosInstrumentos : []);
      } catch (err) {
        setError("Error al cargar datos: " + (err.message || err));
      } finally {
        setCargando(false);
      }
    }

    // LLAMADA INICIAL
    obtenerDatosIniciales();

  }, []); 

  // FUNCIONES DE REFRESCO / CRUD (DEFINIDAS FUERA PARA SER REUSADAS)
  async function refrescarDatos() {
    setCargando(true);
    setError(null);
    try {
      const [rU, rP, rI] = await Promise.all([
        fetch(`${baseApi}/usuarios`),
        fetch(`${baseApi}/profesores`),
        fetch(`${baseApi}/instrumentos`),
      ]);
      const dU = await rU.json();
      const dP = await rP.json();
      const dI = await rI.json();
      setUsuarios(Array.isArray(dU) ? dU : []);
      setProfesores(Array.isArray(dP) ? dP : []);
      setInstrumentos(Array.isArray(dI) ? dI : []);
    } catch (err) {
      setError("Error al refrescar datos: " + (err.message || err));
    } finally {
      setCargando(false);
    }
  }

  // ELIMINAR RECURSO (USUARIO/PROFESOR/INSTRUMENTO)
  async function eliminarRecurso() {
    if (!objetivoEliminar) return;
    setCargando(true);
    setError(null);
    try {
        const { tipo, datos } = objetivoEliminar;
        let url = baseApi;
        if (tipo === "usuario") url += `/usuario/${datos._id}`;
        if (tipo === "profesor") url += `/profesor/${datos._id}`;
        if (tipo === "instrumento") url += `/instrumento/${datos._id}`;

        const res = await fetch(url, { method: "DELETE" });
        if (!res.ok) {
            const cuerpo = await res.json().catch(() => ({}));
            throw new Error(cuerpo.mensaje || "Error al eliminar");
        }
        setMostrandoAlerta(`${tipo.charAt(0).toUpperCase() + tipo.slice(1)} eliminado correctamente`);

        setTimeout(() => {
            setMostrandoAlerta(null)
        }, 2500);

        setMostrarModalEliminar(false);
        setObjetivoEliminar(null);
        await refrescarDatos();
    } catch (err) {
        setError("Error al eliminar: " + (err.message || err));
    } finally {
        setCargando(false);
    }
  }

  // ABRIR MODAL DE EDICIÓN
  function abrirModalEditar(tipo, datos) {
    // COPIA PARA EVITAR MUTACIONES DIRECTAS
    setObjetivoEditar({ tipo, datos: { ...datos } });
    if (tipo === "instrumento") {
      setFormInstrumento({ nombre: datos.nombre || "", familia: datos.familia || "" });
    }
    setMostrarModalEditar(true);
  }

  // GUARDAR CAMBIOS (USUARIO / PROFESOR / INSTRUMENTO)
  async function guardarCambios() {
        if (!objetivoEditar) return;
        setCargando(true);
        setError(null);
        try {
        const { tipo, datos } = objetivoEditar;
        if (tipo === "usuario") {
            const res = await fetch(`${baseApi}/usuario/${datos._id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(datos),
            });
            if (!res.ok) {
            const body = await res.json().catch(() => ({}));
            throw new Error(body.mensaje || "Error al actualizar usuario");
            }
        } else if (tipo === "profesor") {
            const res = await fetch(`${baseApi}/profesor/${datos._id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(datos),
            });
            if (!res.ok) {
            const body = await res.json().catch(() => ({}));
            throw new Error(body.mensaje || "Error al actualizar profesor");
            }
        } else if (tipo === "instrumento") {
            // USAMOS formInstrumento PARA ACTUALIZAR
            const res = await fetch(`${baseApi}/instrumento/${datos._id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formInstrumento),
            });
            if (!res.ok) {
            const body = await res.json().catch(() => ({}));
            throw new Error(body.mensaje || "Error al actualizar instrumento");
            }
        }
        setMostrarModalEditar(false);
        setObjetivoEditar(null);
        setMostrandoAlerta("Guardado correctamente");
        setTimeout(() => setMostrandoAlerta(null), 2000);
        await refrescarDatos();
        } catch (err) {
        setError("Error al guardar cambios: " + (err.message || err));
        } finally {
        setCargando(false);
        }
  }

  // AÑADIR NUEVO INSTRUMENTO
  async function anadirInstrumento(e) {
    e.preventDefault();
    setCargando(true);
    setError(null);
    try {
      const res = await fetch(`${baseApi}/instrumento`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formInstrumento),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.mensaje || "Error al crear instrumento");
      }
      setFormInstrumento({ nombre: "", familia: "" });
      setMostrandoAlerta("Instrumento creado");
      setTimeout(() => setMostrandoAlerta(null), 2000);
      await refrescarDatos();
    } catch (err) {
      setError("Error al crear instrumento: " + (err.message || err));
    } finally {
      setCargando(false);
    }
  }

  // RENDER: LISTA DE USUARIOS
  function ListaUsuarios() {
    const listaOrdenada = ordenarLista(usuarios);
    return (
      <>
      <Container>
        <Row className="mb-3 align-items-center">
          <Col xs={12} md={6}>
            <h5>Usuarios ({listaOrdenada.length})</h5>
          </Col>
          <Col xs={12} md={6} className="text-md-end">
            <InputGroup style={{ maxWidth: 360 }}>
              <Dropdown onSelect={(k) => toggleOrden(k)}>
                <Dropdown.Toggle variant="outline-secondary" id="orden-usuarios">
                  ORDENAR: {claveOrden.toUpperCase()} ({direccionOrden})
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item eventKey="nombre">Nombre</Dropdown.Item>
                  <Dropdown.Item eventKey="provincia">Provincia</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
              <Button variant="outline-secondary" onClick={refrescarDatos} className="ms-2">
                REFRESCAR
              </Button>
            </InputGroup>
          </Col>
        </Row>

        <Table responsive bordered hover size="sm" >
          <thead >
            <tr>
              <th style={{backgroundColor: "#ECEFCA"}}>Nombre</th>
              <th style={{backgroundColor: "#ECEFCA"}}>Email</th>
              <th style={{backgroundColor: "#ECEFCA"}}>Teléfono</th>
              <th style={{backgroundColor: "#ECEFCA"}}>Provincia</th>
              <th style={{backgroundColor: "#ECEFCA"}}>Instrumentos</th>
              <th style={{backgroundColor: "#ECEFCA"}}>Acciones</th>
            </tr>
          </thead>
          <tbody >
            {listaOrdenada.map((u) => (
              <tr key={u._id}>
                <td>{u.nombre}</td>
                <td>{u.email}</td>
                <td>{u.telefono}</td>
                <td>{u.provincia}</td>
                <td>{Array.isArray(u.instrumentos) ? u.instrumentos.join(", ") : ""}</td>
                <td style={{ minWidth: 180 }}>
                  <Button size="sm" className="me-2" onClick={() => abrirModalEditar("usuario", u)}>
                    Editar
                  </Button>
                  <Button size="sm" variant="danger" onClick={() => { setObjetivoEliminar({ tipo: "usuario", datos: u }); setMostrarModalEliminar(true); }}>
                    Eliminar
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
        </Container>
      </>
    );
  }

  // RENDER: LISTA DE PROFESORES
  function ListaProfesores() {
    const listaOrdenada = ordenarLista(profesores);
    return (
      <>
        <Container>
        <Row className="mb-3 align-items-center">
          <Col xs={12} md={6}>
            <h5>Profesores ({listaOrdenada.length})</h5>
          </Col>
          <Col xs={12} md={6} className="text-md-end">
            <InputGroup style={{ maxWidth: 360 }}>
              <Dropdown onSelect={(k) => toggleOrden(k)}>
                <Dropdown.Toggle variant="outline-secondary" id="orden-profesores">
                  ORDENAR: {claveOrden.toUpperCase()} ({direccionOrden})
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item eventKey="nombre">Nombre</Dropdown.Item>
                  <Dropdown.Item eventKey="provincia">Provincia</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
              <Button variant="outline-secondary" onClick={refrescarDatos} className="ms-2">
                REFRESCAR
              </Button>
            </InputGroup>
          </Col>
        </Row>

        <Table responsive bordered hover size="sm">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Email</th>
              <th>Provincia</th>
              <th>Precio / h</th>
              <th>Instrumentos</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {listaOrdenada.map((p) => (
              <tr key={p._id}>
                <td>{p.nombre}</td>
                <td>{p.email}</td>
                <td>{p.provincia}</td>
                <td>{p.precioHora}</td>
                <td>{Array.isArray(p.instrumentos) ? p.instrumentos.join(", ") : ""}</td>
                <td style={{ minWidth: 180 }}>
                  <Button size="sm" className="me-2" onClick={() => abrirModalEditar("profesor", p)}>
                    Editar
                  </Button>
                  <Button size="sm" variant="danger" onClick={() => { setObjetivoEliminar({ tipo: "profesor", datos: p }); setMostrarModalEliminar(true); }}>
                    Eliminar
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
        </Container>
      </>
    );
  }

  // RENDER: LISTA DE INSTRUMENTOS
  function ListaInstrumentos() {
    return (
      <>
      <Container>
        <Row className="mb-3 align-items-center">
          <Col xs={12} md={6}>
            <h5>Instrumentos ({instrumentos.length})</h5>
          </Col>
          <Col xs={12} md={6} className="text-md-end">
            <Form onSubmit={anadirInstrumento} className="d-flex justify-content-end">
              <InputGroup style={{ maxWidth: 560 }}>
                <Form.Control
                  placeholder="Nombre"
                  value={formInstrumento.nombre}
                  onChange={(e) => setFormInstrumento({ ...formInstrumento, nombre: e.target.value })}
                  required
                />
                <Form.Control
                  placeholder="Familia"
                  value={formInstrumento.familia}
                  onChange={(e) => setFormInstrumento({ ...formInstrumento, familia: e.target.value })}
                  required
                />
                <Button type="submit">Añadir</Button>
              </InputGroup>
            </Form>
          </Col>
        </Row>

        <Accordion>
          {instrumentos.map((inst) => (
            <Card key={inst._id} className="mb-2">
              <Accordion.Item eventKey={inst._id}>
                <Accordion.Header>{inst.nombre} — {inst.familia}</Accordion.Header>
                <Accordion.Body>
                  <Row>
                    <Col md={8}>
                      <p><strong>Nombre:</strong> {inst.nombre}</p>
                      <p><strong>Familia:</strong> {inst.familia}</p>
                    </Col>
                    <Col md={4} className="text-md-end">
                      <Button size="sm" className="me-2" onClick={() => abrirModalEditar("instrumento", inst)}>Editar</Button>
                      <Button size="sm" variant="danger" onClick={() => { setObjetivoEliminar({ tipo: "instrumento", datos: inst }); setMostrarModalEliminar(true); }}>
                        Eliminar
                      </Button>
                    </Col>
                  </Row>
                </Accordion.Body>
              </Accordion.Item>
            </Card>
          ))}
        </Accordion>
        </Container>
      </>
    );
  }

  return (
    <Container >
        <Header/>
      <Row>
        <Col>
          <h3>Panel de Administración</h3>
          <p className="text-muted">Gestiona usuarios, profesores e instrumentos.</p>
        </Col>
      </Row>

      {error && (
        <Row className="mb-3">
          <Col><Alert variant="danger" onClose={() => setError(null)} dismissible>{error}</Alert></Col>
        </Row>
      )}

      {mostrandoAlerta && (
        <Row className="mb-3">
          <Col><Alert variant="success">{mostrandoAlerta}</Alert></Col>
        </Row>
      )}

      <Row className="mb-3">
        <Col>
          <Tabs activeKey={tabActiva} onSelect={(k) => setTabActiva(k)} className="mb-3">
            <Tab eventKey="usuarios" title="Usuarios">
              {cargando ? <Spinner animation="border" /> : <ListaUsuarios />}
            </Tab>
            <Tab eventKey="profesores" title="Profesores">
              {cargando ? <Spinner animation="border" /> : <ListaProfesores />}
            </Tab>
            <Tab eventKey="instrumentos" title="Instrumentos">
              {cargando ? <Spinner animation="border" /> : <ListaInstrumentos />}
            </Tab>
          </Tabs>
        </Col>
      </Row>

      {/* MODAL EDITAR */}
        <Modal show={mostrarModalEditar} onHide={() => { setMostrarModalEditar(false); setObjetivoEditar(null); }} centered>
            <Modal.Header closeButton>
            <Modal.Title>EDITAR {objetivoEditar?.tipo?.toUpperCase()}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
            {objetivoEditar && objetivoEditar.tipo === "usuario" && (
                <Form>
                <Form.Group className="mb-2">
                    <Form.Label>NOMBRE</Form.Label>
                    <Form.Control value={objetivoEditar.datos.nombre || ""} onChange={(e) => setObjetivoEditar(prev => ({ ...prev, datos: { ...prev.datos, nombre: e.target.value } }))} />
                </Form.Group>
                <Form.Group className="mb-2">
                    <Form.Label>EMAIL</Form.Label>
                    <Form.Control value={objetivoEditar.datos.email || ""} onChange={(e) => setObjetivoEditar(prev => ({ ...prev, datos: { ...prev.datos, email: e.target.value } }))} />
                </Form.Group>
                <Form.Group className="mb-2">
                    <Form.Label>PROVINCIA</Form.Label>
                    <Form.Control value={objetivoEditar.datos.provincia || ""} onChange={(e) => setObjetivoEditar(prev => ({ ...prev, datos: { ...prev.datos, provincia: e.target.value } }))} />
                </Form.Group>
                </Form>
            )}

            {objetivoEditar && objetivoEditar.tipo === "profesor" && (
                <Form>
                <Form.Group className="mb-2">
                    <Form.Label>NOMBRE</Form.Label>
                    <Form.Control value={objetivoEditar.datos.nombre || ""} onChange={(e) => setObjetivoEditar(prev => ({ ...prev, datos: { ...prev.datos, nombre: e.target.value } }))} />
                </Form.Group>
                <Form.Group className="mb-2">
                    <Form.Label>EMAIL</Form.Label>
                    <Form.Control value={objetivoEditar.datos.email || ""} onChange={(e) => setObjetivoEditar(prev => ({ ...prev, datos: { ...prev.datos, email: e.target.value } }))} />
                </Form.Group>
                <Form.Group className="mb-2">
                    <Form.Label>PROVINCIA</Form.Label>
                    <Form.Control value={objetivoEditar.datos.provincia || ""} onChange={(e) => setObjetivoEditar(prev => ({ ...prev, datos: { ...prev.datos, provincia: e.target.value } }))} />
                </Form.Group>
                <Form.Group className="mb-2">
                    <Form.Label>PRECIO POR HORA</Form.Label>
                    <Form.Control type="number" value={objetivoEditar.datos.precioHora || ""} onChange={(e) => setObjetivoEditar(prev => ({ ...prev, datos: { ...prev.datos, precioHora: e.target.value } }))} />
                </Form.Group>
                </Form>
            )}

            {objetivoEditar?.tipo === "instrumento" && (
                <Form>
                <Form.Group className="mb-2">
                    <Form.Label>NOMBRE</Form.Label>
                    <Form.Control value={formInstrumento.nombre} onChange={(e) => setFormInstrumento(prev => ({ ...prev, nombre: e.target.value }))} />
                </Form.Group>
                <Form.Group className="mb-2">
                    <Form.Label>FAMILIA</Form.Label>
                    <Form.Control value={formInstrumento.familia} onChange={(e) => setFormInstrumento(prev => ({ ...prev, familia: e.target.value }))} />
                </Form.Group>
                </Form>
            )}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={() => { setMostrarModalEditar(false); setObjetivoEditar(null); }}>CANCELAR</Button>
                <Button variant="primary" onClick={guardarCambios}>GUARDAR</Button>
            </Modal.Footer>
        </Modal>

      {/* MODAL ELIMINAR */}
      <Modal show={mostrarModalEliminar} onHide={() => { setMostrarModalEliminar(false); setObjetivoEliminar(null); }} centered>
        <Modal.Header closeButton>
          <Modal.Title>CONFIRMAR ELIMINACIÓN</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          ¿Seguro que deseas eliminar {objetivoEliminar?.tipo} <strong>{objetivoEliminar?.datos?.nombre || objetivoEliminar?.datos?.email}</strong>? Esta acción es irreversible.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => { setMostrarModalEliminar(false); setObjetivoEliminar(null); }}>CANCELAR</Button>
          <Button variant="danger" onClick={eliminarRecurso}>ELIMINAR</Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

export default PerfilAdmin