import { useState } from "react"
import { Modal, Form, Button } from "react-bootstrap"
import { useNavigate } from "react-router-dom";

const IniciarSesion = () => {
    const navigate = new useNavigate();

    const [mostrar, setMostrar] = useState(false);
    const [email, setEmail] = useState("");
    const [contrasenya, setContrasenya] = useState("");
    
    const mostrarModal = () => setMostrar(true);
    const ocultarModal = () => setMostrar(false);

    const comprobarLogin = async (event) => {
        event.preventDefault();

        
        
        try {
            let respuesta = await fetch (`http://localhost:5000/profesor/${email}`, {
                method: 'POST', 
                headers: {
                    "Content/Type": "application/json"
                },
                body: {
                    password: contrasenya
                }
            });
            if (respuesta == 1) {
                navigate("/profesor");
            } else if (respuesta == 0) {
                alert("Contraseña incorrecta");
            } else {
                alert("Usuario no encontrado");
                navigate()
            }
        } catch (Exception) {
            console.error(Exception);
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
                        
                            <Form.Label>EMAIL</Form.Label>
                            <Form.Control  
                                type="email"
                                placeholder="ejemplo@ejemplo.es"
                                required
                                autoFocus
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            <Form.Label>CONTRASEÑA</Form.Label>
                            <Form.Control
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