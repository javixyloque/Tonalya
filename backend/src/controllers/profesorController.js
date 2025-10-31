import express, { text } from "express";
const router = express.Router();
import bcrypt from "bcrypt";
import Usuario from "../models/Usuario.js";
import Profesor from "../models/Profesor.js";
import Clase from "../models/Clase.js";
import nodemailer from 'nodemailer';
import { reject } from "bcrypt/promises.js";

// SI NO ABIERTO, ABRIR: 
// sudo ufw status
// sudo ufw allow 587
// sudo service ufw restart

const transporter = nodemailer.createTransport({
    service: 'gmail',
    port: 587,
    auth: {
        user: 'tonalyamusica@gmail.com',
        pass: 'ctig qiqw wgqp iirw'
    }
});


    
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
            instrumentos: req.body.instrumentos,
            activo: true,

        });
           
        await profesor.save();

        const cuerpoCorreo = {
            from: '"TONALYA" <tonalyamusica@gmail.com>',
            to: profesor.email,
            subject: 'Bienvenido a TONALYA',
            html: `<h1>Gracias por registrarte en TONALYA, ${profesor.nombre}.<h1><br> <p>¡Nos alegra tenerte con nosotros!</p>`
        };

        const respuestaCorreo = await transporter.sendMail(cuerpoCorreo);
        
        res.json({ mensaje: 'Profesor creado exitosamente', correo: respuestaCorreo });
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

router.get(('/:instrumento'), async (req, res) => {
    try {
        const profesores = await Profesor.find({instrumentos: req.params.instrumento});
        if (!profesores) {
            res.json({mensaje: "No se ha encontrado ningun profesor"})
        } else {
            res.json(profesores);
        }
    } catch (error) {
        res.json({mensaje: "Error al obtener los profesores", error: error.message})
    }
})

router.get(('/profesor/:instrumento/:provincia'), async (req, res) => {
    try {
        const profesores = await Profesor.find({instrumentos: req.body.instrumento, provincia: req.params.provincia});
        if (!profesores) {
            res.json({mensaje: "No se ha encontrado ningun profesor"})
        } else {
            res.json(profesores);
        }
    } catch (error) {
        res.json({mensaje: "Error al obtener los profesores", error: error.message})
    }
})

router.get(('/profesor/:provincia'), async (req, res) => {
    try {
        const profesores = await Profesor.find({provincia: req.params.provincia});
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
    const idProfesor = (req.params.id);
    const idInstrumento = (req.params.idInstrumento);
    try {
        const profesor = await Profesor.findById(idProfesor);
        if (!profesor) {
            return res.json({ mensaje: 'Profesor no encontrado' });
        }
        
        profesor.instrumentos.pull(idInstrumento);
        await profesor.save()

            res.json({ mensaje: 'Instrumento eliminado exitosamente', profesor: profesor });
    } catch (error) {
        res.json({ mensaje: 'Error al eliminar el instrumento', error: error.message });
    }
})

// ACEPTAR SOLICITUD DE RESERVA
router.put('/aceptar-reserva/:id', async (req, res) => {
    const idClase = (req.params.id);

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
        const idProfesor = (req.params.id);   
        const profesor = await Profesor.findById(idProfesor);
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
        
        
        const profesor = await Profesor.findOne({ "email": email });
        
        if (!profesor || !bcrypt.compareSync(password, profesor.password)) {
            return res.json({ mensaje: 'Correo electrónico o contraseña incorrectos' });
        }
        
        // SESIONES HAY QUE HACERLAS EN FRONT
        res.json({ mensaje: 'Iniciaste sesión exitosamente', email: profesor.email, id: profesor._id ,nombre: profesor.nombre });
        // sessionStorage.setItem('usuarioId', profesor._id);
        
    } catch (error) {
        res.json({ mensaje: 'Error al iniciar sesión como profesor', error: error.message });
    }
});

export default router;