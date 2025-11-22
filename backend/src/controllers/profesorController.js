import express from "express";
const router = express.Router();
import bcrypt from "bcrypt";
import Usuario from "../models/Usuario.js";
import Profesor from "../models/Profesor.js";
import Clase from "../models/Clase.js";
import Instrumento from "../models/Instrumento.js";
import nodemailer from 'nodemailer';
import { reject } from "bcrypt/promises.js";
import { enviarEmailsRechazoProfesor, enviarEmailsAceptada, emailBienvenidaProfesor } from "../biblioteca.js";
// SI NO ABIERTO, ABRIR: 
// sudo ufw status
// sudo ufw allow 587
// sudo service ufw restart



    
// AÑADIR PROFESOR
router.post('/', async (req, res) => {
    try {
        const email  = req.body.email;
        const profesorExistente = await Profesor.findOne({ "email": email });

        if (profesorExistente != null) {
            return res.json({ mensaje: 'El correo electrónico ya está en uso' });
            
        }
        
        const profesor = new Profesor({
            nombre: req.body.nombre,
            bio: '' ,
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

        
        emailBienvenidaProfesor(profesor);

        // const respuestaCorreo = await transporter.sendMail(cuerpoCorreo);
        
        res.json({ mensaje: 'Profesor creado exitosamente' });
    } catch (error) {
        res.json({ mensaje: 'Error al crear el profesor', error: error.message });
    }
});

// OBTENER TODOS LOS PROFESORES
router.get('/', async (req, res) => {
    try {
        const profesores = await Profesor.find();
        res.json(profesores);
    } catch (error) {
        res.json({ mensaje: 'Error al obtener los profesores', error: error.message });
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

router.get('/instrumento/:instrumentoId', async (req, res) => {
    try {
        const profesores = await Profesor.find({
            instrumentos: { $in: [req.params.instrumentoId] }
        });
        
        if (profesores.length === 0) {
            return res.json({ mensaje: "No se ha encontrado ningún profesor" });
        }
        
        res.json(profesores);
    } catch (error) {
        res.json({ mensaje: "Error al obtener los profesores", error: error.message });
    }
});

router.get('/buscar/:instrumentoId/:provincia', async (req, res) => {
    try {
        const profesores = await Profesor.find({
            instrumentos: { $in: [req.params.instrumentoId] },
            provincia: req.params.provincia
        });
        
        if (profesores.length === 0) {
            return res.json({ mensaje: "No se ha encontrado ningún profesor" });
        }
        
        res.json(profesores);
    } catch (error) {
        res.json({ mensaje: "Error al obtener los profesores", error: error.message });
    }
});

router.get('/provincia/:provincia', async (req, res) => {
    try {
        const profesores = await Profesor.find({ provincia: req.params.provincia });
        
        if (profesores.length === 0) {
            return res.json({ mensaje: "No se ha encontrado ningún profesor" });
        }
        
        res.json(profesores);
    } catch (error) {
        res.json({ mensaje: "Error al obtener los profesores", error: error.message });
    }
});

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
router.post('/:id/instrumento', async (req, res) => {
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
        
        res.json({ mensaje: 'Instrumento agregado exitosamente', profesor: profesor }); 
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

router.get('/clases-instrumentos/:id', async (req, res) => {
    try {
        // CONSULTA PRINCIPAL OBTIENE EL PROFESOR, PERO POPULATE DEVUELVE
        const profesor = await Profesor.findOne({ _id: req.params.id, activo: true })
        //OBTENER CLASES CON INSTRUMENTO Y ALUMNO (es como el join de mongoose)
            .populate({
                path: 'clases',
                //ORDENAR POR FECHA
                options: { sort: { fechaInicio: 1 } },
                populate: [{ 
                        path: 'instrumento',
                    },
                    {
                        path: 'alumno',
                        select: '_id nombre email telefono'
                    }
                ]
            })
            
           
        
        if (!profesor) {
            return res.json({ mensaje: 'Profesor no encontrado' });
        }

        const clasesProfesor = profesor.clases
        
        
        
        res.json({
            clasesProfesor
        });
    } catch (error) {
        res.status(500).json({
            mensaje: 'Error al obtener las clases con instrumentos del usuario',
            error: error.message
        });
    }
});



router.get("/clases/:id", async (req, res) => {
    try {
        const profesor = await Profesor.findById(req.params.id);
        if (!profesor) {
            return res.json({ mensaje: 'Profesor no encontrado' });
        }
        // SI HACIA UN BUCLE DEVOLVIA UN ARRAY VACIO, $IN ES EL OPERADOR DE MONGODB PARA BUSCAR ELEMENTOS EN UN ARRAY, ES COMO EL FILTER
        const clases = await Clase.find({ _id: { $in: profesor.clases } })
        res.json(clases);
    } catch (error) {
        res.json({ mensaje: 'Error al obtener las clases del profesor', error: error.message });
    }
})



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
        const mensaje = req.body.mensaje || '';
        if (tipoAccion== 'rechazada') {
            enviarEmailsRechazoProfesor(profesor, alumno, clase, instrumento, mensaje);
        } else if (tipoAccion =='aceptada') {
            enviarEmailsAceptada(profesor, alumno, clase, instrumento);
        }
        res.json({mensaje: 'Clase actualizada exitosamente' ,clase: clase});
    } catch (error) {
        res.json({ mensaje: 'Error al actualizar la clase', error: error.message });
    }
});

// INICIO SESION PROFESOR
router.post('/login', async (req, res) => {
    try {
        const email = req.body.email;
        const password = req.body.password;
        
        
        const profesor = await Profesor.findOne({ "email": email });

        if (!profesor) {
            return res.status(401).json({ mensaje: 'Correo electrónico incorrecto' });
        }

        const contrasenyaValida = bcrypt.compareSync(password, profesor.password);
        if (!contrasenyaValida) {
            return res.status(401).json({ mensaje: 'Contraseña incorrecta' });
        }
        
        // SESIONES HAY QUE HACERLAS EN FRONT
        res.status(200).json({ mensaje: 'Iniciaste sesión exitosamente', email: profesor.email, id: profesor._id ,nombre: profesor.nombre });
        // sessionStorage.setItem('usuarioId', profesor._id);
        
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al iniciar sesión como profesor', error: error.message });
    }
});

export default router;