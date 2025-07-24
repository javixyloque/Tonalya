import {useState, useEffect } from "react";


const InstrumentosProfesor = () => {
    const[instrumentos,setInstrumentos]= useState([]);

    useEffect(() => {
        async function fetchInstrumentos() {
                try {
                    const instruments = await fetch('http://localhost:5000/instrumentos',{
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                        }
                    });
                    if (instruments.ok) {
                        const bdInstrumentos = await instruments.json();
                        setInstrumentos(bdInstrumentos);
                    } else {
                        console.error('Error al obtener los instrumentos', instruments);
                    }
                } catch (error) {
                    console.error('Error de red:', error);
                }
        };
        fetchInstrumentos();
    }, []);

    const actualizarEstado = async(evento) => {
        // Aquí puedes actualizar el estado del componente para mostrar los cambios en la interfaz de usuario
        evento.preventDefault();
        const nombre = evento.target.value;
        // const 
        
    };
    return (
        <>
        <form onSubmit={actualizarEstado}>
            
                <select name="instrumento" id="instrumento">
                            
                {instrumentos.map((instrumento) => {
                    return(
                        <option key={instrumento.id} value={instrumento.nombre}>{instrumento.nombre}</option>
                        
                        );
                })}
                        </select>
                        <button type="submit">Anadir</button>
        </form>

            {/* Agrega tu código aquí */}
        </>
    );
};
export default InstrumentosProfesor;