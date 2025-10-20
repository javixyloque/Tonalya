import express from "express";
const router = express.Router();
import bcrypt from "bcrypt";
import Usuario from "../models/Usuario.js";
import Profesor from "../models/Profesor.js";
import Clase from "../models/Clase.js";


const limpiarParametros = (param) => {
    return String(param).trim().toLowerCase();
}

// CREAR USUARIO

router.post('/', async (req, res) => {
    try {
        const usuario = new Usuario({
            nombre: req.body.nombre,
            email: req.body.email,
            telefono: req.body.telefono,
            password: req.body.password,
            imagen: req.body.imagen,
            activo: true
        });
        await usuario.save();
        res.json({ mensaje: 'Usuario creado exitosamente' });
    } catch (error) {
        res.json({ mensaje: 'Error al crear el usuario', error: error.message });
    }
});

// OBTENER DATOS USUARIO
router.get('/:id', async (req, res) => {
    try {
        const usuario = await Usuario.find({_id: req.params.id, activo: true});
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
        const fechaInicio = new Date(Date.parse(req.body.fechaInicio));
        const fechaFin = new Date(Date.parse(req.body.fechaFin));
        const instrumento = req.body.instrumento;
        const idProfesor = req.body.profesorId;


     
        
        
        var minsInicio  = fechaInicio.getMinutes();
        var horaInicio = fechaInicio.getHours();
        var minsFin = fechaFin.getMinutes();
        var horaFin = fechaFin.getHours();
        
        const profesor = await Profesor.findById(idProfesor);
        minsFin+=horaFin*60;
        minsInicio+=horaInicio*60;
        var horas = (minsFin - minsInicio) / 60
        
        const nuevaClase = new Clase({
            descripcion: descripcion,
            precio: profesor.precioHora * horas,
            fechaInicio: fechaInicio.toLocaleString(),
            fechaFin: fechaFin.toLocaleString(),
            estado: 'pendiente',
            asistencia: false,
            completada: false,
            alumno: idAlumno,
            profesor: idProfesor,
            instrumento: instrumento
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
        if (!alumno) {
            return res.json({ mensaje: 'Alumno no encontrado' });
        }
        
        
        
        alumno.clases.push(claseSolicitada._id);
        await alumno.save();


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

// OBTENER INFO CLASES USUARIO
router.get('/clases/:id', async (req, res) => {
    try {
        const idAlumno = limpiarParametros(req.params.id);
        const alumno = await Usuario.findById(req.params.id);
        if (!alumno) {
            return res.json({ mensaje: 'Alumno no encontrado' });
        }
        alumno.clases.forEach( async claseId => {
            return res.json(await Clase.findById(claseId))
        })
    } catch (error) {
        res.json({ mensaje: 'Error al obtener las clases del alumno', error: error.message });
    }
})



// ELIMINAR CLASE USUARIO

router.put('/:id/clase/:claseId', async (req, res) => {
    try {
        const alumno = await Usuario.find({_id: req.params.id, activo: true});
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

router.put('/:id/instrumento', async (req, res) => {
    try {
        const usuario = await Usuario.find({_id: req.params.id, activo: true});
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
        const usuario = await Usuario.find(req.params.id);
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
        if (!usuario || !bcrypt.compareSync(password, usuario.password)) {
            return res.json({ mensaje: 'Correo electrónico o contraseña incorrectos' });
        }
        
        // SESIONES HAY QUE HACERLAS EN FRONT
        // sessionStorage.setItem('usuarioId', usuario._id);
        
        res.json({ mensaje: 'Iniciaste sesión exitosamente' });
    } catch (error) {
        res.json({ mensaje: 'Error al iniciar sesión como alumno', error: error.message });
    }
});



export default router;