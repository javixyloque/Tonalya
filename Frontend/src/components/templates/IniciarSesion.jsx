import { useState } from "react"
import { Modal, Form, Button, Alert, InputGroup, Nav} from "react-bootstrap"
import {Eye, EyeSlash} from "react-bootstrap-icons";
const IniciarSesion = () => {
    
    const [mostrar, setMostrar] = useState(false);
    const [rol, setRol] = useState(""); 
    const [email, setEmail] = useState("");
    const [contrasenya, setContrasenya] = useState("");
    
    const [mostrarContrasenya, setMostrarContrasenya] = useState(false);

    const [mostrarAlerta, setMostrarAlerta] = useState(false);
    const [mensajeAlerta, setMensajeAlerta] = useState('');
    const [tipoAlerta, setTipoAlerta] = useState('success'); 
    
    const mostrarModal = () => setMostrar(true);
    const ocultarModal = () => setMostrar(false);

    const manejarMostrarContrasenya = () => {
        setMostrarContrasenya(!mostrarContrasenya);
    }

    const comprobarLogin = async (event) => {
        event.preventDefault();
        let urlPeticion;
        switch (rol) {
            case "profesor":
                urlPeticion = "http://localhost:5000/profesor/login";
                break;
            case "alumno":
                urlPeticion = "http://localhost:5000/usuario/login";
                break;
            case "admin":
                urlPeticion = "http://localhost:5000/admin/login";
                break;
            case "":
                setTipoAlerta("warning");
                setMensajeAlerta("Debes seleccionar el tipo de usuario");
                setMostrarAlerta(true);
                setTimeout(() => {
                    setMostrarAlerta(false);
                }, 2000)
                break;
        }
        
        const respuesta = await fetch(urlPeticion, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email: email,
                password: contrasenya
            })
        });
        console.log(email, contrasenya, rol);
        console.log("Status de respuesta:", respuesta.status);
        
        const objetoRespuesta = await respuesta.json();
        console.log("Respuesta completa:", objetoRespuesta);
        
        if (respuesta.ok) {
            sessionStorage.setItem("usuario", objetoRespuesta.email);
            sessionStorage.setItem("id", objetoRespuesta.id);
            sessionStorage.setItem("rol", rol);
            
            setMensajeAlerta(`Bienvenido de nuevo ${objetoRespuesta.nombre}, ¡Es un placer tenerte de vuelta!`);
            setTipoAlerta('success');
            setMostrarAlerta(true);
            
            // window.location.href = '/';

            setTimeout(() => {
                setMostrarAlerta(false);
                ocultarModal();
                window.location.href='/';
            }, 2000);
        } else {
            setMensajeAlerta(objetoRespuesta.mensaje);
            setTipoAlerta('danger');
            setMostrarAlerta(true);

            setTimeout(() => {
                setMostrarAlerta(false);
            }, 2000);
        }

        
         
        
    }




    return (
        <>

            <Nav.Link href="#" className='mx-2 my-2 flex-end'  onClick={mostrarModal}> Iniciar Sesión</Nav.Link>
            <Modal centered show={mostrar} onHide={ocultarModal}>

            {/* CABECERO */}
                <Modal.Header className="modal-header" >
                    <Modal.Title>Iniciar sesión</Modal.Title>
                </Modal.Header>
                <Form  onSubmit={comprobarLogin}>
                    <Modal.Body >

                        {mostrarAlerta && (
                            <Alert variant={tipoAlerta} className="mb-3">
                                {mensajeAlerta}
                            </Alert>
                        )}

                        {/*TIPO DE USUARIO */}
                        <Form.Group className="mb-3">
                                <Form.Label>Selecciona tipo de usuario:</Form.Label>
                                <Form.Select 
                                     value={rol} 
                                     onChange={(e) => setRol(e.target.value)}
                                     onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        comprobarLogin(e);
                                    }
                                }}>
                                    <option value="">Selecciona el tipo de usuario</option>
                                    <option value="alumno">Alumno</option>
                                    <option value="profesor">Profesor</option>
                                    <option value="admin">Administrador</option>
                                    
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
                            onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        comprobarLogin(e);
                                    }
                                }}
                        />

                        {/* CONTRASEÑA  => INPUTGROUP PARA EL BOTON DE MOSTRAR */}
                        <Form.Group>
                            <Form.Label>CONTRASEÑA</Form.Label>
                            <InputGroup>
                            <Form.Control   
                                type={mostrarContrasenya ? "text" : "password"}
                                placeholder="*****"
                                required
                                value={contrasenya}
                                onChange={e => setContrasenya(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        comprobarLogin(e);
                                    }
                                }}
                            />
                            <Button variant="outline-primary" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={() => manejarMostrarContrasenya()}>
                                {mostrarContrasenya ? <EyeSlash/> : <Eye/>}
                                </Button>
                            </InputGroup>
                        </Form.Group>
                        
                    </Modal.Body>

                    {/* PIE => BOTONES */}
                    <Modal.Footer >
                            <Button className='mx-2 flex-end' variant="primary"  onClick={comprobarLogin}>
                                Iniciar sesión
                            </Button>
                            <Button className='mx-2 flex-end' variant="secondary"  onClick={ocultarModal}>
                                Cancelar
                            </Button>
                    </Modal.Footer>
                </Form>
            </Modal>
        </>
    )
}

export default IniciarSesion;