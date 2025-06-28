import { Link } from 'react-router-dom';
// import './Home.css';

// PALETA DE COLORES
// https://colorhunt.co/palette/21344854779294b4c1ecefca

const  Home = ()=> {
    return (
        <div className="home">
            <h1>Bienvenido a la página de inicio</h1>
            <p>¡Bienvenido al sitio web de Tonalya!</p>
            <Link to="/formclase" className="btn btn-primary">Formulario Clases</Link>
            <br />
            <Link to="/profesores" className="btn btn-secondary">Profesores</Link>
            <br />
        </div>
    );
}
export default Home;
