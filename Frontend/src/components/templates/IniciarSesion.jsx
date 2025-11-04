import { useState } from "react"
import { Modal, Form, Button, Alert} from "react-bootstrap"
import {  Link } from "react-router-dom";
import "./iniciarSesion.css";

const IniciarSesion = () => {
    const [mostrar, setMostrar] = useState(false);
    const [rol, setRol] = useState(""); 
    const [email, setEmail] = useState("");
    const [contrasenya, setContrasenya] = useState("");

    const [mostrarAlerta, setMostrarAlerta] = useState(false);
    const [mensajeAlerta, setMensajeAlerta] = useState('');
    const [tipoAlerta, setTipoAlerta] = useState('success'); 
    
    const mostrarModal = () => setMostrar(true);
    const ocultarModal = () => setMostrar(false);

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

            <Link to="#" className='mx-2 my-2 flex-end' style={{color: "#213448", textDecoration: "none", cursor: "pointer", right: 0}} onClick={mostrarModal}> Iniciar Sesión</Link>
            <Modal centered show={mostrar} onHide={ocultarModal}>

            {/* CABECERO */}
                <Modal.Header  style={{backgroundColor: "#213448", color: "#ECEFCA"}}>
                    <Modal.Title>Iniciar sesión</Modal.Title>
                </Modal.Header>
                <Form  onSubmit={comprobarLogin}>
                    <Modal.Body style={{backgroundColor: "#213448", color: "#ECEFCA"}}>

                        {mostrarAlerta && (
                            <Alert variant={tipoAlerta} className="mb-3">
                                {mensajeAlerta}
                            </Alert>
                        )}

                        {/*TIPO DE USUARIO */}
                        <Form.Group className="mb-3">
                                <Form.Label>Selecciona tipo de usuario:</Form.Label>
                                <Form.Select style={{color: "#213448", backgroundColor: "#ECEFCA"}}
                                     value={rol} 
                                     onChange={(e) => setRol(e.target.value)}>
                                    <option value="">Selecciona el tipo de usuario</option>
                                    <option value="alumno">Alumno</option>
                                    <option value="profesor">Profesor</option>
                                    <option value="admin">Administrador</option>
                                    
                                </Form.Select>
                        </Form.Group>
                      
                        {/* EMAIL */}
                        <Form.Label>EMAIL</Form.Label>
                        <Form.Control className="mb-3" style={{color: "#213448", backgroundColor: "#ECEFCA"}} 
                            type="email"
                            placeholder="ejemplo@ejemplo.es"
                            required
                            autoFocus
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />

                        {/* CONTRASENYA */}
                        <Form.Label>CONTRASEÑA</Form.Label>
                        <Form.Control className="mb-3" style={{color: "#213448", backgroundColor: "#ECEFCA"}}
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
                            <Button className='mx-2 flex-end' style={{backgroundColor: "#213448", color: "#ECEFCA", ":hover":{backgroundColor: "#94B4C1"}}} onClick={ocultarModal}>
                                Cancelar
                            </Button>
                    </Modal.Footer>
                </Form>
            </Modal>
        </>
    )
}

export default IniciarSesion;