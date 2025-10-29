// import { useState } from "react"
// import { Modal, Form, Button } from "react-bootstrap"
// import { useNavigate } from "react-router-dom";

// const IniciarSesion = () => {
//     const navigate = new useNavigate();

//     const [mostrar, setMostrar] = useState(false);
//     const [email, setEmail] = useState("");
//     const [contrasenya, setContrasenya] = useState("");
    
//     const mostrarModal = () => setMostrar(true);
//     const ocultarModal = () => setMostrar(false);

//     const comprobarLogin = async (event) => {
//         event.preventDefault();

        
        
//         try {
//             let respuesta = await fetch (`http://localhost:5000/profesor/${email}`, {
//                 method: 'POST', 
//                 headers: {
//                     "Content/Type": "application/json"
//                 },
//                 body: {
//                     password: contrasenya
//                 }
//             });
//             if (respuesta == 1) {
//                 navigate("/profesor");
//             } else if (respuesta == 0) {
//                 alert("Contraseña incorrecta");
//             } else {
//                 alert("Usuario no encontrado");
//                 navigate()
//             }
//         } catch (Exception) {
//             console.error(Exception);
//         }
//     }
//     return (
//         <>

//         <Button className='btn-success' onClick={mostrarModal}> Iniciar Sesión</Button>
//         <Modal centered show={mostrar} onHide={ocultarModal} >
//                 <Modal.Header closeButton>
//                     <Modal.Title>Iniciar sesión</Modal.Title>
//                 </Modal.Header>
//                 <Form  onSubmit={comprobarLogin}>
//                     <Modal.Body>
                        
//                             <Form.Label>EMAIL</Form.Label>
//                             <Form.Control  
//                                 type="email"
//                                 placeholder="ejemplo@ejemplo.es"
//                                 required
//                                 autoFocus
//                                 value={email}
//                                 onChange={(e) => setEmail(e.target.value)}
//                             />
//                             <Form.Label>CONTRASEÑA</Form.Label>
//                             <Form.Control
//                                 type="password"
//                                 placeholder="*****"
//                                 required
//                                 value={contrasenya}
//                                 onChange={e => setContrasenya(e.target.value)}
//                             />
                        
//                     </Modal.Body>
//                     <Modal.Footer>
//                             <Button className="btn btn-secondary" onClick={ocultarModal}>Cancelar</Button>
//                             <Button className="btn btn-primary" type="submit">INICIAR SESIÓN</Button>
//                     </Modal.Footer>
//                 </Form>
//             </Modal>
//         </>
//     )
// }

// export default IniciarSesion;


import { useState } from "react"
import { Modal, Form, Button} from "react-bootstrap"
import { useNavigate } from "react-router-dom";

const IniciarSesion = () => {
    const navigate = useNavigate();
    const [mostrar, setMostrar] = useState(false);
    const [rol, setRol] = useState(""); // Nuevo estado para almacenar la opción seleccionada
    const [email, setEmail] = useState("");
    const [contrasenya, setContrasenya] = useState("");
    
    const mostrarModal = () => setMostrar(true);
    const ocultarModal = () => setMostrar(false);

    const comprobarLogin = async (event) => {
        event.preventDefault();

        if (rol === "profesor") {
            try {
                let respuesta = await fetch (`http://localhost:5000/profesor/login`, {
                    method: 'POST', 
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        email: email,
                        password: contrasenya
                    })
                });
                if (respuesta.ok) {
                    const objetoRespuesta = await respuesta.json()
        console.log('Credenciales guardadas:', objetoRespuesta);
                    sessionStorage.setItem('profesor', objetoRespuesta.email) 
                    sessionStorage.setItem('id', objetoRespuesta.id)
                    navigate("/profesores");
                } else if (respuesta == 0) {
                    alert("Contraseña incorrecta");
                } else {
                    alert("Usuario no encontrado");
                    navigate()
                }
            } catch (Exception) {
                console.error(Exception);
            }
        } else if (rol === "alumno") {
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
                    sessionStorage.setItem("alumno", objetoRespuesta.email);
                    sessionStorage.setItem("id", objetoRespuesta.id)
                    navigate("/alumno");
                } else if (respuesta == 0) {
                    alert("Contraseña incorrecta");
                } else {
                    alert("Usuario no encontrado");
                    navigate()
                }
            } catch (Exception) {
                console.error(Exception);
            }
        } else if (rol== "admin") {
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
                sessionStorage.setItem("admin", objetoRespuesta.id)
            } else {
                console.log(respuesta.json())
            }
        }
    }
    return (
        <>

        <Button className='btn-success' onClick={mostrarModal}> Iniciar Sesión</Button>
        <Modal centered show={mostrar} onHide={ocultarModal} >
                <Modal.Header closeButton>
                    <Modal.Title>Iniciar sesión</Modal.Title>
                </Modal.Header>
                <Form  onSubmit={comprobarLogin}>
                    <Modal.Body>
                        <Form.Group className="mb-3">
                                <Form.Label>Selecciona tipo de usuario:</Form.Label>
                                <Form.Select value={rol} onChange={(e) => setRol(e.target.value)}>
                                    <option value="admin"></option>
                                    <option value="alumno">Alumno</option>
                                    <option value="profesor">Profesor</option>
                                </Form.Select>
                         
                        </Form.Group>
                        
                            <Form.Label>EMAIL</Form.Label>
                            <Form.Control className="mb-3"  
                                type="email"
                                placeholder="ejemplo@ejemplo.es"
                                required
                                autoFocus
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            <Form.Label>CONTRASEÑA</Form.Label>
                            <Form.Control className="mb-3"
                                type="password"
                                placeholder="*****"
                                required
                                value={contrasenya}
                                onChange={e => setContrasenya(e.target.value)}
                            />
                        
                    </Modal.Body>
                    <Modal.Footer>
                            <Button className="btn btn-secondary" onClick={ocultarModal}>Cancelar</Button>
                            <Button className="btn btn-primary" type="submit">INICIAR SESIÓN</Button>
                    </Modal.Footer>
                </Form>
            </Modal>
        </>
    )
}

export default IniciarSesion;