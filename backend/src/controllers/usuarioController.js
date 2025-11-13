import express from "express";
const router = express.Router();
import bcrypt from "bcrypt";
import Usuario from "../models/Usuario.js";
import Profesor from "../models/Profesor.js";
import Instrumento from "../models/Instrumento.js";
import Clase from "../models/Clase.js";
// SHARP => LIMITAR RESOLUCION IMAGEN
// import sharp from "sharp"
import nodemailer from 'nodemailer';


const transporter = nodemailer.createTransport({
    service: 'gmail',
    port: 587,
    auth: {
        user: 'tonalyamusica@gmail.com',
        pass: 'ctig qiqw wgqp iirw'
    }
});


const limpiarParametros = (param) => {
    return String(param).trim().toLowerCase();
}

// CREAR USUARIO

router.post('/', async (req, res) => {
    try {
        const email  = req.body.email;
        const usuarioExistente = await Usuario.findOne({ "email": email });

        if (usuarioExistente != null) {
            return res.json({ mensaje: 'El correo electrónico ya está en uso' });
            
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
        if (!usuario) {
            return res.json({ mensaje: 'Usuario no encontrado' });
        }
        const cuerpoCorreo = {
            from: '"TONALYA" <tonalyamusica@gmail.com>',
            to: usuario.email,
            subject: `Bienvenido a TONALYA, ${usuario.nombre}`,
            html: `<h1>Gracias por registrarte en TONALYA, ${usuario.nombre}.<h1><br> <p>¡Nos alegra tenerte con nosotros!</p><br><p>No olvides buscar profesor en ${usuario.provincia} que te pueda servir de ayuda!</p> <p>Para acceder a tu perfil, inicia sesión en nuestro sitio web: <a href="http://localhost:5173/">TONALYA</a></p>`
        };
        const respuestaCorreo = await transporter.sendMail(cuerpoCorreo);
        res.json({ mensaje: 'Usuario creado exitosamente', correo: respuestaCorreo });
    } catch (error) {
        res.json({ mensaje: 'Error al crear el usuario', error: error.message });
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
        
        const profesor = await Profesor.findById(idProfesor);
        // minsFin+=horaFin*60;
        // minsInicio+=horaInicio*60;
        // var horas = (minsFin - minsInicio) / 60
        if (!profesor) {
            return res.json({ mensaje: 'Profesor no encontrado' });
        }
        
        const nuevaClase = new Clase({
            descripcion: descripcion,
            precio: profesor.precioHora * (totalHoras+minutosExtra),
            fechaInicio: fechaInicio,
            fechaFin: fechaFin,
            estado: 'aceptada',
            asistencia: false,
            alumno: idAlumno,
            profesor: idProfesor,
            instrumento: idInstrumento
        });
        
        await nuevaClase.save();
        
        const claseSolicitada = nuevaClase; 
        if (profesor) {
            profesor.clases.push(claseSolicitada._id);
            await profesor.save();
        } else {
            return res.json({ mensaje: 'Profesor no encontrado' });
        }
        
        const alumno = await Usuario.findById(idAlumno);
        const instrumento = await Instrumento.findById(idInstrumento);
        if (!alumno || !instrumento) {
            return res.json({ mensaje: 'Alumno o instrumento no encontrado' });
        }

        const formatoFecha = (fecha) => {
            return fecha.toLocaleString('es-ES');
        };
        
        
        
        alumno.clases.push(claseSolicitada._id);
        await alumno.save();
        const cuerpoCorreoProfesor = {
            from: "TONALYA <tonalyamusica@gmail.com>",
            subject: "Solicitud de reserva de clase",
            to: profesor.email,
            html: `<h1>Solicitud de reserva de clase</h1>
            <p>Alumno: ${alumno.nombre}</p>
            <p>Instrumento: ${instrumento.nombre}</p>
            <p>Descripción: ${descripcion}</p>
            <p>Fecha inicio: ${formatoFecha(fechaInicio)}</p>
            <p>Fecha fin: ${formatoFecha(fechaFin)}</p>
            <p>Duracion: ${totalHoras+minutosExtra} hora${totalHoras+minutosExtra > 1 ? 's' : ''}</p>
            <p>Precio: ${claseSolicitada.precio} &euro;</p>`
        }
        const cuerpoCorreoAlumno = {
            from: "TONALYA <tonalyamusica@gmail.com>",
            subject: "Solicitud de reserva de clase exitosa",
            to: alumno.email,
            html: `<h1>Solicitud de reserva de clase exitosa</h1>
            <p>Profesor: ${profesor.nombre}</p>
            <p>Instrumento: ${instrumento.nombre}</p>
            <p>Descripción: ${descripcion}</p>
            <p>Fecha inicio: ${formatoFecha(fechaInicio)}</p>
            <p>Fecha fin: ${formatoFecha(fechaFin)}</p>
            <p>Duracion: ${totalHoras+minutosExtra} hora${totalHoras+minutosExtra > 1 ? 's' : ''}</p>
            <p>Precio: ${claseSolicitada.precio} &euro;</p>
            <p>En cuanto ${profesor.nombre} acepte tu solicitud, te enviaremos un correo con los detalles de la clase,<br> Gracias por utilizar Tonalya!!</p>
            `
        }

        await transporter.sendMail(cuerpoCorreoProfesor);
        await transporter.sendMail(cuerpoCorreoAlumno);


        res.json({ mensaje: 'Solicitud de reserva enviada con éxito' });

    } catch (error) {
        res.status(500).json({ mensaje: 'Error al enviar la solicitud de reserva', error: error.message });
    }

});

// PAGAR CLASE ALUMNO

router.put('/pagar-clase/:id', async (req, res) => {
    const idAlumno = limpiarParametros(req.params.id);
    const idClasePagada = limpiarParametros(req.body.claseId);

    const alumno = await Usuario.findById(idAlumno);
    if (!alumno) {
        return res.json({ mensaje: 'Alumno no encontrado' });
    }

    const clasePagada = await Clase.findById(idClasePagada);
    if (!clasePagada) {
        return res.json({ mensaje: 'Clase no encontrada' });
    }

    // ACTUALIZAR A PAGADA
    clasePagada.estado = 'pagada';
    await clasePagada.save();

    

    res.json({ mensaje: 'Clase pagada con éxito' });
});

// OBTENER TODAS LAS CLASES DE UN USUARIO (CON INSTRUMENTO)

router.get('/clases-instrumentos/:id', async (req, res) => {
    try {
        const usuario = await Usuario.findOne({ _id: req.params.id, activo: true })
            .populate({
                path: 'clases',
                populate: { 
                    path: 'instrumento'
                }
            });
        
        if (!usuario || !usuario.activo) {
            return res.json({ mensaje: 'Usuario no encontrado' });
        }
        
        const clasesConInstrumentos = usuario.clases.map(clase => ({
            ...clase.toJSON(), 
            instrumento: clase.instrumento
        }));
        
        res.json({
            clasesConInstrumentos
        });
    } catch (error) {
        res.status(500).json({
            mensaje: 'Error al obtener las clases con instrumentos del usuario',
            error: error.message
        });
    }
});


// OBTENER INFO CLASES PENDIENTES USUARIO
router.get('/clases-pendientes/:id', async (req, res) => {
try {
    const alumno = await Usuario.findById(req.params.id);
    if (!alumno) {
        return res.json({ mensaje: 'Alumno no encontrado' });
    }
    // SI HACIA UN BUCLE DEVOLVIA UN ARRAY VACIO, $IN ES EL OPERADOR DE MONGODB PARA BUSCAR ELEMENTOS EN UN ARRAY, ES COMO EL FILTER
    const clases = await Clase.find({ _id: { $in: alumno.clases }, estado: 'pendiente' })
    res.json(clases);
    } catch (error) {
        res.json({ mensaje: 'Error al obtener las clases pendientes del alumno', error: error.message });
    }
})

// OBTENER INFO CLASES ACEPTADAS USUARIO
router.get('/clases-aceptadas/:id', async (req, res) => {
    try {
        const alumno = await Usuario.findById(req.params.id);
        if (!alumno) {
            return res.json({ mensaje: 'Alumno no encontrado' });
        }
        // SI HACIA UN BUCLE DEVOLVIA UN ARRAY VACIO, $IN ES EL OPERADOR DE MONGODB PARA BUSCAR ELEMENTOS EN UN ARRAY, ES COMO EL FILTER
        const clases = await Clase.find({ _id: { $in: alumno.clases } })
        res.json(clases);
    } catch (error) {
        res.json({ mensaje: 'Error al obtener las clases del alumno', error: error.message });
    }
})

// OBTENER INFO CLASES PAGADAS USUARIO
router.get('/clases-pagadas/:id', async (req, res) => {
    try {
        const alumno = await Usuario.findById(req.params.id);
        if (!alumno) {
            return res.json({ mensaje: 'Alumno no encontrado' });
        }
        // SI HACIA UN BUCLE DEVOLVIA UN ARRAY VACIO, $IN ES EL OPERADOR DE MONGODB PARA BUSCAR ELEMENTOS EN UN ARRAY, ES COMO EL FILTER
        const clases = await Clase.find({ _id: { $in: alumno.clases }, estado: 'pagada' })
        res.json(clases);
    } catch (error) {
        res.json({ mensaje: 'Error al obtener las clases pagadas del alumno', error: error.message });
    }
})

// OBTENER INFO CLASES COMPLETADAS USUARIO
router.get('/clases-completadas/:id', async (req, res) => {
    try {
        const alumno = await Usuario.findById(req.params.id);
        if (!alumno) {
            return res.json({ mensaje: 'Alumno no encontrado' });
        } 
        const clases = await Clase.find({_id:  {$in: alumno.clases}, estado: 'completada'})
        res.json(clases)
        
    } catch(error) {
        res.json({ mensaje: 'Error al obtener las clases completadas del alumno', error: error.message });
    }
})




        



// ELIMINAR CLASE USUARIO

router.put('/:id/clase/:claseId', async (req, res) => {
    try {
        const alumno = await Usuario.findOne({_id: req.params.id, activo: true});
        if (!alumno) {
            return res.json({ mensaje: 'Alumno no encontrado' });
        }
        
        const clase = await Clase.findById({_id: req.params.claseId, estado: 'pendiente'});
        if (!clase) {
            return res.json({ mensaje: 'Clase no encontrada' });
        }
        
        alumno.clases.pull(clase._id);
        await alumno.save();
        res.json({ mensaje: 'Clase eliminada exitosamente' });
    } catch (error) {
        res.json({ mensaje: 'Error al eliminar la clase', error: error.message });
    }
});

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