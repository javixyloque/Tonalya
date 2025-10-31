import { useState } from "react"
import { Modal, Form, Button} from "react-bootstrap"
import { useNavigate, Link } from "react-router-dom";
import "./iniciarSesion.css";

const IniciarSesion = () => {
    const navigate = useNavigate();
    const [mostrar, setMostrar] = useState(false);
    const [rol, setRol] = useState(""); 
    const [email, setEmail] = useState("");
    const [contrasenya, setContrasenya] = useState("");
    
    const mostrarModal = () => setMostrar(true);
    const ocultarModal = () => setMostrar(false);

    const comprobarLogin = async (event) => {
        event.preventDefault();

        if (rol == "profesor") {
            try {
                let respuesta = await fetch('http://localhost:5000/profesor/login', {
                    method: 'POST', 
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        email: email,
                        password: contrasenya
                    })
                });

                const objetoRespuesta = await respuesta.json(); 
                
                console.log(objetoRespuesta);

                if (!respuesta.ok) {
                    alert(objetoRespuesta.mensaje || 'Error en el servidor');
                    return;
                }

                if (objetoRespuesta.mensaje === "Correo electrónico o contraseña incorrectos") {
                    alert(objetoRespuesta.mensaje);
                } else if (objetoRespuesta.mensaje === 'Iniciaste sesión exitosamente') {
                    sessionStorage.setItem('usuario', objetoRespuesta.email);
                    sessionStorage.setItem("profesor", objetoRespuesta.nombre); 
                    sessionStorage.setItem('id', objetoRespuesta.id);
                    sessionStorage.setItem('rol', 'profesor');
                    navigate("/");
                } else {
                    navigate("/"); // Redirigir a página principal por defecto
                }
                
            } catch (error) {
                console.error('Error:', error);
                alert('Error de conexión con el servidor');
            }


        } else if (rol == "alumno") {
            try {
                let respuesta = await fetch (`http://localhost:5000/alumno/login`, {
                    method: 'POST', 
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify( {
                        email: email,
                        password: contrasenya
                    })
                });
                if (respuesta.ok) {
                    const objetoRespuesta = await respuesta.json();
                    sessionStorage.setItem("usuario", objetoRespuesta.email);
                    sessionStorage.setItem("alumno", objetoRespuesta.nombre)
                    sessionStorage.setItem("id", objetoRespuesta.id)
                    sessionStorage.setItem("rol", "alumno")
                    alert(objetoRespuesta.mensaje)
                } else if (respuesta == 0) {
                    alert("Contraseña incorrecta");
                } else {
                    alert("Usuario no encontrado");
                }
            } catch (Exception) {
                console.error(Exception);
            }
        } else if (rol== "admin") {
            try {
                let respuesta = await fetch('http://localhost:5000/admin/login', {
                    method: 'POST',
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        email: email,
                        password: contrasenya
                    })
                })
                if (respuesta.ok) {
                    const objetoRespuesta = await respuesta.json();
                    sessionStorage.setItem("admin", objetoRespuesta.email);
                    sessionStorage.setItem("id", objetoRespuesta.id)
                    sessionStorage.setItem("rol", "admin")
                    alert(objetoRespuesta.mensaje)
                } else {
                    console.log(respuesta.json())
                }
            } catch (exception) {
                console.error(exception)
            }
        }
    }
    return (
        <>

            <Link to="#" className='mx-2 my-2 flex-end' style={{color: "#213448", textDecoration: "none", cursor: "pointer", right: 0}} onClick={mostrarModal}> Iniciar Sesión</Link>
            <Modal centered show={mostrar} onHide={ocultarModal} style={{color: "red"}}>

            {/* CABECERO */}
                <Modal.Header  style={{backgroundColor: "#213448", color: "#ECEFCA"}}>
                    <Modal.Title>Iniciar sesión</Modal.Title>
                </Modal.Header>
                <Form  onSubmit={comprobarLogin}>
                    <Modal.Body style={{backgroundColor: "#213448", color: "#ECEFCA"}}>

                        {/*TIPO DE USUARIO */}
                        <Form.Group className="mb-3">
                                <Form.Label>Selecciona tipo de usuario:</Form.Label>
                                <Form.Select value={rol} onChange={(e) => setRol(e.target.value)}>
                                    <option value="admin">Tipo de usuario</option>
                                    <option value="alumno">Alumno</option>
                                    <option value="profesor">Profesor</option>
                                </Form.Select>
                        </Form.Group>
                        
                        {/* EMAIL */}
                        <Form.Label>EMAIL</Form.Label>
                        <Form.Control className="mb-3"  
                            type="email"
                            placeholder="ejemplo@ejemplo.es"
                            required
                            autoFocus
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />

                        {/* CONTRASENYA */}
                        <Form.Label>CONTRASEÑA</Form.Label>
                        <Form.Control className="mb-3"
                            type="password"
                            placeholder="*****"
                            required
                            value={contrasenya}
                            onChange={e => setContrasenya(e.target.value)}
                        />
                        
                    </Modal.Body>

                    {/* PIE => BOTONES */}
                    <Modal.Footer style={{backgroundColor: "#213448", color: "#ECEFCA"}}>
                            <Button className='mx-2 flex-end' style={{backgroundColor: "#213448", color: "#ECEFCA", ":hover":{backgroundColor: "#94B4C1"}}} onClick={comprobarLogin}>
                                Iniciar sesión
                                </Button>
                    </Modal.Footer>
                </Form>
            </Modal>
        </>
    )
}

export default IniciarSesion;