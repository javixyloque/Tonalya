import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { SyncLoader } from "react-spinners";
import {Container, Row, Col} from "react-bootstrap";
import Header from "./templates/Header";

const FormPagar = () => {
    const {id} = useParams();
    const [loading, setLoading] = useState(true);
    const [clase, setClase] = useState({});
    const [profesor, setProfesor] = useState({});
    const [alumno, setAlumno] = useState({});
    const [instrumento, setInstrumento] = useState({})
    

    useEffect(() => {
        if (!sessionStorage.getItem('usuario') || sessionStorage.getItem('rol') !== "alumno") {
            window.location.href = '/';
            return;
        }
        const obtenerDatosClase = async () => {
            try {
                const [claseResp, alumnoResp] = await Promise.all([
                    fetch(`http://localhost:5000/clase/${id}`).then(res => res.json()),
                    fetch(`http://localhost:5000/usuario/${sessionStorage.getItem('id')}`).then(res => res.json())
                ])
                const [profesorResp, instrumentoResp] = await Promise.all([
                    fetch(`http://localhost:5000/profesor/${claseResp.profesor}`).then(res => res.json()),
                    fetch(`http://localhost:5000/instrumentos/${claseResp.instrumento}`).then(res => res.json())
                ]);
                setClase(claseResp);
                setAlumno(alumnoResp);
                setProfesor(profesorResp);
                setInstrumento(instrumentoResp);
                setLoading(false);
            } catch (error) {
                console.error(error);
            }
        }
        obtenerDatosClase();

    }, [ id ]);

    return (
        // SI LOADING SYNCLOADER, SI NO, CONTAINER CON ELEMENTOS DE LA CLASE
        <>
            {loading ? (
                <>
                <Header/>
                <div className="loader">
                    <SyncLoader color="#213448"/><br></br>
                    <p style={{color: "#213448"}}>Cargando datos de la clase...</p>
                </div>
            </>
            ) : (
                <>
                <Header/>
                    <Container>
                        <Row>
                            <Col xs={0} md={3}></Col>
                            <Col xs={12} md={6} >
                            {/* TÍTULO (INSTRUMENTO)*/}
                            <h1>Clase de {instrumento.nombre}</h1>
                            
                            {/* ALUMNO Y PROFESOR */}
                            <dl>
                                <dt>Profesor:</dt>
                                <dd>{profesor.nombre}</dd>
                                <dt>Alumno:</dt>
                                <dd>{alumno.nombre}</dd>
                            </dl>
                            
                            {/* FECHA Y HORA */}
                            <p>
                                {new Date(clase.fechaInicio).getDate()}/{new Date(clase.fechaInicio).getMonth()}/{new Date(clase.fechaInicio).getFullYear()} - 
                                <strong> de {new Date(clase.fechaInicio).getHours()}:{new Date(clase.fechaInicio).getMinutes() > 0 ? new Date(clase.fechaInicio).getMinutes() : '00'} a {new Date(clase.fechaFin).getHours()}:{new Date(clase.fechaFin).getMinutes() > 0 ? new Date(clase.fechaFin).getMinutes() : '00'}</strong>
                            </p>
                            
                            {/* DESCRIPCION */}
                            <p>{clase.descripcion}</p>
                            
                            {/* IMPORTE TOTAL DESGLOSADO */}
                            <dl style={{textAlign: "right"}}>
                                <dt>Precio:</dt>
                                <dd>{clase.precio.toFixed(2)}€</dd>
                                <dt>Comisión de Tonalya:</dt>
                                <dd>{(clase.precio * 0.07).toFixed(2)}€</dd>
                            </dl>
                            <hr />
                            {/* TOTAL =>    con espacioes en blacno para que no quede feo */}
                            <h2 style={{textAlign: "right"}} >Total a pagar:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; {(clase.precio * 1.07).toFixed(2)}€</h2>
                            <Link className="btn btn-primary w-100 mt-3"  to={`/pagar-clase/${clase._id}`}>Pagar</Link>
                            </Col>
                        </Row>
                        <Col xs={0} md={3}></Col>
                    </Container>
                </>
            )}
        </>
        
    )
}

export default FormPagar;
