import express from "express";
const router = express.Router();
import bcrypt from "bcrypt";
import Usuario from "../models/Usuario.js";
import Profesor from "../models/Profesor.js";
import Instrumento from "../models/Instrumento.js";
import Clase from "../models/Clase.js";
import { enviarEmailsReserva, enviarEmailsRechazoUsuario, emailBienvenidaAlumno } from "../biblioteca.js";
// SHARP => LIMITAR RESOLUCION IMAGEN
// import sharp from "sharp"
import nodemailer from 'nodemailer';





const limpiarParametros = (param) => {
    return String(param).trim().toLowerCase();
}

// CREAR USUARIO

router.post('/', async (req, res) => {
    try {
        const email  = req.body.email;
        const usuarioExistente = await Usuario.findOne({ "email": email });

        if (usuarioExistente != null) {
            return res.status(401).json({ mensaje: 'El correo electrónico ya está en uso' });
            
        }
        const usuario = new Usuario({
            nombre: req.body.nombre,
            email: req.body.email,
            telefono: req.body.telefono,
            password: req.body.password,
            imagen: req.body.imagen,
            instrumentos: req.body.instrumentos,
            provincia: req.body.provincia,
            activo: true
        });
        await usuario.save();
        
        emailBienvenidaAlumno(usuario);
        res.json({ mensaje: 'Usuario creado exitosamente'});
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al crear el usuario', error: error.message });
    }
});

// OBTENER DATOS USUARIO
router.get('/:id', async (req, res) => {
    try {
        const usuario = await Usuario.findOne({_id: req.params.id, activo: true});
        if (!usuario) {
            return res.json({ mensaje: 'Usuario no encontrado' });
        }
        res.json(usuario);
    } catch (error) {
        res.json({ mensaje: 'Error al obtener el usuario', error: error.message });
    }
});

// MODIFICAR CLASE
router.put('/clase/:id', async (req, res) => {
    try {
        const id = req.params.id;
        
        const clase = await Clase.findByIdAndUpdate(id, req.body, { new: true });
        const [alumno, profesor, instrumento] = await Promise.all([
            Usuario.findById(clase.alumno),
            Profesor.findById(clase.profesor),
            Instrumento.findById(clase.instrumento)
        ])
        if (!clase) {
            return res.json({ mensaje: 'Clase no encontrada' });
        }
        const tipoAccion = req.body.estado;
        if (tipoAccion== 'rechazada') {
            enviarEmailsRechazoUsuario(profesor, alumno, clase, instrumento);
        } else if (tipoAccion =='pagada') {
            enviarEmailsReserva(profesor, alumno, clase, instrumento);
        }
        res.json(clase);
    } catch (error) {
        res.json({ mensaje: 'Error al actualizar la clase', error: error.message });
    }
});


// ELIMINAR CLASE DEL ARRAY DE USUARIO (borrado logico)
router.delete(':idUsuario/clase/:id', async (req, res) => {
    try {
        const id  = req.params.id;
        
        const clase = await Clase.findById(id);
        if (!clase) {
            return res.json({ mensaje: 'Clase no encontrada' });
        }
        await Usuario.updateMany({ clases: id }, { $pull: { clases: id } });
        
        
        res.json({ mensaje: 'Clase eliminada exitosamente' });
    } catch (error) {
        res.json({ mensaje: 'Error al eliminar la clase', error: error.message });
    }
})


// MODIFICAR USUARIO (TAMBIEN BORRADO LÓGICO)
router.put('/:id', async (req, res) => {
    
    try {
        const id = limpiarParametros(req.params.id);    
        const usuario = await Usuario.findByIdAndUpdate(id, req.body, { new: true });
        if (!usuario || !usuario.activo) {
            return res.json({ mensaje: 'Usuario no encontrado' });
        }
        res.json(usuario);
    } catch (error) {
        res.json({ mensaje: 'Error al actualizar el usuario', error: error.message });
    }
});

// BORRAR USUARIO (NO NECESARIO POR BORRADO LÓGICO PERO SE PUEDE (ADMIN))
router.delete('/:id', async (req, res) => {
    try {
        const id = limpiarParametros(req.params.id);
        await Usuario.findByIdAndDelete(id);
        res.json({ mensaje: 'Usuario eliminado exitosamente' });
    } catch (error) {
        res.json({ mensaje: 'Error al eliminar el usuario', error: error.message });
    }
});

// AÑADIR RESERVA DE CLASE ALUMNO


router.post('/reservar-clase', async (req, res) => {
    try {
        const descripcion = req.body.descripcion;
        const idAlumno = req.body.alumnoId;
        const fechaInicio = new Date(req.body.fechaInicio);
        const fechaFin = new Date(req.body.fechaFin);
        const idInstrumento = req.body.instrumento;
        const idProfesor = req.body.profesorId;

        let minsInicio = fechaInicio.getMinutes();
        let minsFin = fechaFin.getMinutes();
        let horasInicio = fechaInicio.getHours();
        let horasFin = fechaFin.getHours();

        if (horasFin > horasInicio) {
            minsFin += 60 * (horasFin - horasInicio);
        } else {
            minsFin -= 60 * (horasInicio - horasFin);
        }
        let totalMinutos = minsFin - minsInicio;
        let totalHoras = Math.floor(totalMinutos / 60);
        let minutosExtra = (totalMinutos % 60)/60;
        let horas = totalHoras + minutosExtra;

        const [profesor, alumno, instrumento] = await Promise.all([
            Profesor.findById(idProfesor),
            Usuario.findById(idAlumno),  
            Instrumento.findById(idInstrumento)
        ])
        
        if (!profesor) {
            return res.json({ mensaje: 'Profesor no encontrado' });
        }
        
        const nuevaClase = new Clase({
            descripcion: descripcion,
            precio: profesor.precioHora * (totalHoras+minutosExtra),
            fechaInicio: fechaInicio,
            fechaFin: fechaFin,
            estado: 'pendiente',
            asistencia: false,
            alumno: idAlumno,
            profesor: idProfesor,
            instrumento: idInstrumento
        });
        
        await nuevaClase.save();
        
        const claseSolicitada = nuevaClase; 
        
        await Promise.all([
            Profesor.findByIdAndUpdate(idProfesor,{
                $push: {clases: claseSolicitada._id}
            }),
            Usuario.findByIdAndUpdate(idAlumno, {
                $push: {clases: claseSolicitada._id}
            })
        ])
        
        if (!alumno || !instrumento || !profesor) {
            return res.json({ mensaje: 'Alumno o instrumento o profesor no encontrado' });
        }

        enviarEmailsReserva(profesor, alumno, instrumento, claseSolicitada, descripcion, horas)
    

        res.json({ mensaje: 'Solicitud de reserva enviada con éxito' , clase: claseSolicitada});

    } catch (error) {
        res.status(500).json({ mensaje: 'Error al enviar la solicitud de reserva', error: error.message });
    }

});

// PAGAR CLASE ALUMNO



// OBTENER TODAS LAS CLASES DE UN USUARIO (CON INSTRUMENTO)

router.get('/clases-instrumentos/:id', async (req, res) => {
    try {
        const usuario = await Usuario.findOne({ _id: req.params.id, activo: true })
        // OBTENER CLASES CON INSSTRUMENTO
            .populate({
                path: 'clases',
                //ORDENAR POR FECHA
                options: { sort: { fechaInicio: 1 } },
                populate: [{ 
                        path: 'instrumento',
                    },
                    {
                        path: 'profesor',
                        select: '_id nombre'
                    }
                ]
            })
        
        if (!usuario || !usuario.activo) {
            return res.json({ mensaje: 'Usuario no encontrado' });
        }
        
        const clasesUsuario = usuario.clases;
        
        res.json({ clasesUsuario });
    } catch (error) {
        res.status(500).json({
            mensaje: 'Error al obtener las clases con instrumentos del usuario',
            error: error.message
        });
    }
});







        





// OBTENER INSTRUMENTOS DEL USUARIO
router.get('/:id/instrumentos', async (req, res) => {
    try {
        const usuario = await Usuario.findById(req.params.id);
        if (!usuario) {
            return res.json({ mensaje: 'Usuario no encontrado' });
        }
        const instrumentos  = await Instrumento.find({ _id: { $in: usuario.instrumentos } });
        res.json({ instrumentos });
    } catch (error) {
        res.json({ mensaje: 'Error al obtener los instrumentos del usuario', error: error.message });
    }
})

// AÑADIR INSTRUMENTOS USUARIO

router.post('/:id/instrumento', async (req, res) => {
    try {
        const usuario = await Usuario.findOne({_id: req.params.id, activo: true});
        if (!usuario) {
            return res.json({ mensaje: 'usuario no encontrado' });
        }
        
        const idInstrumento = req.body.instrumento;
        const existeInstrumento = usuario.instrumentos.includes(idInstrumento);
        
        if (existeInstrumento) {
            return res.json({ mensaje: 'El instrumento ya está agregado' });
        }
        
        usuario.instrumentos.push(idInstrumento);
        await usuario.save();
        
        res.json({ mensaje: 'Instrumento agregado exitosamente', usuario: usuario });
    } catch (error) {
        res.json({ mensaje: 'Error al agregar el instrumento', error: error.message });
    }
});

// ELIMINAR INSTRUMENTO USUARIO
router.delete('/:id/instrumento/:idInstrumento', async (req, res) => {
    try {
        const usuario = await Usuario.findById(req.params.id);
        if (!usuario) {
            res.json({ mensaje: 'Usuario no encontrado' });
        }
        const idInstrumento = req.params.idInstrumento;
        usuario.instrumentos.pull(idInstrumento);
        await usuario.save();
        res.json({ mensaje: 'Instrumento eliminado exitosamente', usuario: usuario });
    } catch(error) {
        res.json({mensaje: 'Error al eliminar instrumentos', error: error.message})
    }
})

// INICIO SESIÓN USUARIO

router.post('/login', async (req, res) => {
    try {
        const email = req.body.email;
        const password = req.body.password;
        
        const usuario = await Usuario.findOne({ "email": email });
        if (!usuario) {
            return res.status(401).json({ mensaje: 'Correo electrónico incorrecto' });
        }
        
        const contrasenyaValida = bcrypt.compareSync(password, usuario.password);
        if (!contrasenyaValida) {
            return res.status(401).json({ mensaje: 'Contraseña incorrecta' });
        }
        
        // SESIONES HAY QUE HACERLAS EN FRONT
        // sessionStorage.setItem('usuarioId', usuario._id);
        
        res.json({ mensaje: 'Iniciaste sesión exitosamente' , email: usuario.email, id: usuario._id, nombre: usuario.nombre});
    } catch (error) {
        res.json({ mensaje: 'Error al iniciar sesión como alumno', error: error.message });
    }
});








export default router;