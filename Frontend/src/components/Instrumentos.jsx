
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
            <link
          rel="stylesheet"
          href="https://use.fontawesome.com/releases/v5.15.4/css/all.css"></link>
            <i className="fa-solid fa-guitar"></i>
            <h1>Instrumentos</h1>   
            {instrumentos.map(instrumento => (
                <div key={instrumento._id}>
                    <h1>{instrumento.nombre}</h1>
                    <p>Familia: {instrumento.familia}</p>
                    {/* Aquí, dependiendo de la categoría del instrumento, se mostrará un icono u otro */}
                    {instrumento.familia === 'Cuerda' ? (
                          <svg height={"1em"} width={"1em"} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><path d="M529 71C519.6 61.6 504.4 61.6 495.1 71L447 119C444.6 121.4 442.7 124.3 441.5 127.5L426.1 168.5L348.6 246.1C303.5 216.7 249.3 215.9 217.6 247.7C206.6 258.7 199.6 272.3 196.2 287.3C192.5 303.9 177.1 318 160.1 318.9C134.5 320.2 110.8 329.6 92.8 347.5C48 392.3 56.4 473.3 111.5 528.4C166.6 583.5 247.6 592 292.4 547.2C310.3 529.3 319.8 505.5 321 479.9C321.9 462.9 336 447.6 352.6 443.8C367.6 440.4 381.2 433.3 392.2 422.4C424 390.6 423.2 336.5 393.8 291.4L471.4 213.8L512.4 198.4C515.6 197.2 518.5 195.3 520.9 192.9L568.9 144.9C578.3 135.5 578.3 120.3 568.9 111L529 71zM272 320C298.5 320 320 341.5 320 368C320 394.5 298.5 416 272 416C245.5 416 224 394.5 224 368C224 341.5 245.5 320 272 320z"/></svg>
                    ) : instrumento.familia === 'viento' ? (
                        <i className="fa-solid fa-trumpet"></i> // Trompeta (por ejemplo)
                    ) : (
                        <i className="fa-solid fa-question-circle"></i> // Pregunta (si no coincide con ninguna categoría)
                    )}
                </div>
                
                

            ))}
        </div>
    )

};

export default Instrumentos;