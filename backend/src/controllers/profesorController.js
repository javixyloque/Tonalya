import express from "express";
const router = express.Router();
import bcrypt from "bcrypt";
import Usuario from "../models/Usuario.js";
import Profesor from "../models/Profesor.js";
import Clase from "../models/Clase.js";


// CRUD PROFESOR

    
// AÑADIR PROFESOR
router.post('/', async (req, res) => {
    try {
        const profesor = new Profesor({
            nombre: req.body.nombre,
            bio: req.body.bio,
            email: req.body.email,
            telefono: req.body.telefono,
            password: req.body.password,
            imagen: req.body.imagen,
            provincia: req.body.provincia,
            precioHora: req.body.precioHora,
            activo: true,

        });
        await profesor.save();
        res.json({ mensaje: 'Profesor creado exitosamente' });
    } catch (error) {
        res.json({ mensaje: 'Error al crear el profesor', error: error.message });
    }
});

// OBTENER DATOS PROFESOR
router.get('/:id', async (req, res) => {
    try {
        const profesor = await Profesor.findById(req.params.id);
        if (!profesor) {
            return res.json({ mensaje: 'Profesor no encontrado' });
        }
        res.json(profesor);
    } catch (error) {
        res.json({ mensaje: 'Error al obtener el profesor', error: error.message });
    }
});

router.get(('/'), async (req, res) => {
    try {
        const profesores = await Profesor.find({});
        if (!profesores) {
            res.json({mensaje: "No se ha encontrado ningun profesor"})
        } else {
            res.json(profesores);
        }
    } catch (error) {
        res.json({mensaje: "Error al obtener los profesores", error: error.message})
    }
})

// ACTUALIZAR DATOS PROFESOR
router.put('/:id', async (req, res) => {
    try {
        const profesor = await Profesor.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!profesor) {
            return res.json({ mensaje: 'Profesor no encontrado' });
        }
        res.json(profesor);
    } catch (error) {
        res.json({ mensaje: 'Error al actualizar el profesor', error: error.message });
    }
});

// BORRAR DATOS PROFESOR (NO NECESARIO POR BORRADO LÓGICO PERO SE PUEDE)
router.delete('/:id', async (req, res) => {
    try {
        await Profesor.findByIdAndDelete(req.params.id);
        res.json({ mensaje: 'Profesor eliminado exitosamente' });
    } catch (error) {
        res.json({ mensaje: 'Error al eliminar el profesor', error: error.message });
    }
});

// ANADIR INSTRUMENTO/S PROFESOR
router.put('/:id/instrumento', async (req, res) => {
    try {
        const profesor = await Profesor.findById(req.params.id);
        if (!profesor) {
            return res.json({ mensaje: 'Profesor no encontrado' });
        }
        
        const idInstrumento = req.body.instrumento;
        const existeInstrumento = profesor.instrumentos.includes(idInstrumento);
        
        if (existeInstrumento) {
            return res.json({ mensaje: 'El instrumento ya está agregado' });
        }
        
        profesor.instrumentos.push(idInstrumento);
        await profesor.save();
        
        res.json({ mensaje: 'Instrumento agregado exitosamente', profesor: nuevoProfesor });
    } catch (error) {
        res.json({ mensaje: 'Error al agregar el instrumento', error: error.message });
    }
});

// ELIMINAR INSTRUMENTO PROFESOR
router.delete('/:id/instrumento/:idInstrumento', async (req, res) => {
    try {
        const profesor = await Profesor.findById(req.params.id);
        if (!profesor) {
            return res.json({ mensaje: 'Profesor no encontrado' });
        }
        
        const idInstrumento = req.params.idInstrumento;
        
        profesor.instrumentos.pull(idInstrumento);
        await profesor.save()

            res.json({ mensaje: 'Instrumento eliminado exitosamente', profesor: profesor });
    } catch (error) {
        res.json({ mensaje: 'Error al eliminar el instrumento', error: error.message });
    }
})

// ACEPTAR SOLICITUD DE RESERVA
router.put('/aceptar-solicitud-de-reserva/:id', async (req, res) => {
const idClase = req.params.id;

const clase = await Clase.findById(idClase);
if (!clase) {
    return res.json({ mensaje: 'Clase no encontrada' });
}

// Actualizar el estado de la clase a "aceptada" en la base de datos
clase.estado = 'aceptada';
await clase.save();

const alumno = await Usuario.findById(clase.alumno[0]);
if (alumno) {
    alumno.solicitudesDeReserva.splice(alumno.solicitudesDeReserva.indexOf(idClase), 1);
    await alumno.save();
}

res.json({ mensaje: 'Solicitud de reserva aceptada con éxito' });
});


// AÑADIR CLASE PROFESOR
router.put('/:id/clase', async (req, res) => {
try {
        const profesor = await Profesor.findById(req.params.id);
        if (!profesor) {
            return res.json({ mensaje: 'Profesor no encontrado' });
        }
        
        
        const clase = await Clase.findById(req.body.claseId);
        if (!clase) {
            return res.json({ mensaje: 'Clase no encontrada' });
        }
        
        
        profesor.clases.push(clase._id);
        await profesor.save();
        
        res.json({ mensaje: 'Clase agregada exitosamente' });
    } catch (error) {
        res.json({ mensaje: 'Error al agregar la clase', error: error.message });
    }
});

// INICIO SESION PROFESOR
router.post('/login', async (req, res) => {
    try {
        const email = req.body.email;
        const password = req.body.password;
        
        // Buscar el profesor con el correo electrónico y contraseña
        const profesor = await Profesor.findOne({ "email": email });
        if (!profesor || !bcrypt.compareSync(password, profesor.password)) {
            return res.json({ mensaje: 'Correo electrónico o contraseña incorrectos' });
        }
        
        // SESIONES HAY QUE HACERLAS EN FRONT
        res.json({ mensaje: 'Iniciaste sesión exitosamente', usuario: profesor.nombre, id: profesor.id });
        // sessionStorage.setItem('usuarioId', profesor._id);
        
    } catch (error) {
        res.json({ mensaje: 'Error al iniciar sesión como profesor', error: error.message });
    }
});

export default router;