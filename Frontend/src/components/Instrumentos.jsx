
import { useEffect, useState } from 'react';


const Instrumentos = () => {
    const [instrumentos, setInstrumentos] = useState([]);
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


    return (
        
        <div>  
            <h1>Instrumentos</h1>   
            {instrumentos.map(instrumento => (
                

                <div key={instrumento._id}>
                    <h1>{instrumento.nombre}</h1>
                    <p>Familia: {instrumento.familia}</p>
                    <img src={instrumento.imagen} alt={instrumento.nombre} />
                </div>
            ))}
        </div>
    )

};

export default Instrumentos;