// backend/src/controllers/adminController.js

import express from "express";
const router = express.Router();
import bcrypt from "bcrypt";
import Usuario from "../models/Usuario.js";
import Profesor from "../models/Profesor.js";
import Clase from "../models/Clase.js";
import Instrumento from "../models/Instrumento.js";
import Admin from "../models/Admin.js";


router.get('/', async (req, res) => {
    try {
        const admin = await Admin.findOne({});
        if (!admin) {
            return res.json({ mensaje: 'Administrador no encontrado' });
        }
        res.json(admin);
    } catch (error) {
        res.json({ mensaje: 'Error al obtener el administrador', error: error.message });
    }
})

router.delete('/', async (req, res) => {
    try {
        await Admin.deleteMany({});
        res.json({mensaje: "administrador eliminado correctamente"})

    } catch (exception) {
        res.json({error: exception})
    }
})

// LOGIN ADMIN
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        const admin = await Admin.findOne({ email });
        if (!admin) {
            return res.status(401).json({ mensaje: 'Correo electrónico incorrecto' });
        }

        const contrasenyaValida = bcrypt.compareSync(password, admin.password);
        if (!contrasenyaValida) {
            return res.status(401).json({ mensaje: 'Contraseña incorrecta' });
        }

        // SESIONES HAY QUE HACERLAS EN FRONT
        res.json({ mensaje: 'Sesión iniciada correctamente', email: admin.email, id: admin._id, nombre: admin.email });

    } catch (error) {
        console.log(error);
        res.status(500).json({ mensaje: 'Error al iniciar sesión como administrador', error: error.message });
    }
});


// OBTENER DATOS DE TODOS LOS USUARIOS
router.get('/usuarios', async (req, res) => {
    try {
        const usuarios = await Usuario.find({});
        if (!usuarios) {
            return res.json({ mensaje: 'No se ha encontrado ningún usuario' });
        }
        res.json(usuarios);
    } catch (error) {
        res.json({ mensaje: 'Error al obtener los datos de los usuarios', error: error.message });
    }
});

// MODIFICAR USUARIO
router.put('/usuario/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const usuario = await Usuario.findByIdAndUpdate(id, req.body, { new: true });
        if (!usuario) {
            return res.json({ mensaje: 'Usuario no encontrado' });
        }
        res.json(usuario);
    } catch (error) {
        res.json({ mensaje: 'Error al actualizar el usuario', error: error.message });
    }
});

// BORRAR USUARIO
router.delete('/usuario/:id', async (req, res) => {
    try {
        await Usuario.findByIdAndDelete(req.params.id);
        res.json({ mensaje: 'Usuario eliminado exitosamente' });
    } catch (error) {
        res.json({ mensaje: 'Error al eliminar el usuario', error: error.message });
    }
});

// OBTENER DATOS DE TODOS LOS PROFESORES (ORDEN ALFABETICO POR NOMBRE)
router.get('/profesores', async (req, res) => {
    try {
        const profesores = await Profesor.find({}).sort({ nombre: 1 });
        if (!profesores) {
            return res.json({ mensaje: 'No se ha encontrado ningún profesor' });
        }
        res.json(profesores);
    } catch (error) {
        res.json({ mensaje: 'Error al obtener los datos de los profesores', error: error.message });
    }
});

// MODIFICAR PROFESOR
router.put('/profesor/:id', async (req, res) => {
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

// BORRAR PROFESOR
router.delete('/profesor/:id', async (req, res) => {
    try {
        await Profesor.findByIdAndDelete(req.params.id);
        res.json({ mensaje: 'Profesor eliminado exitosamente' });
    } catch (error) {
        res.json({ mensaje: 'Error al eliminar el profesor', error: error.message });
    }
});

// OBTENER DATOS DE TODOS LOS INSTRUMENTOS
router.get('/instrumentos', async (req, res) => {
    try {
        const instrumentos = await Instrumento.find({});
        if (!instrumentos) {
            return res.json({ mensaje: 'No se ha encontrado ningún instrumento' });
        }
        res.json(instrumentos);
    } catch (error) {
        res.json({ mensaje: 'Error al obtener los datos de los instrumentos', error: error.message });
    }
});

// AÑADIR UN INSTRUMENTO NUEVO 
router.post('/instrumento', async (req, res) => {
    try {
        const instrumento = new Instrumento( {
            nombre: req.body.nombre,
            familia: req.body.familia
        })
        await instrumento.save();
        res.json(instrumento);
    } catch (error) {
        res.json({ mensaje: 'Error al crear el instrumento', error: error.message });
    }

})

// MODIFICAR INSTRUMENTO
router.put('/instrumento/:id', async (req, res) => {
    try {
        const instrumento = await Instrumento.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!instrumento) {
            return res.json({ mensaje: 'Instrumento no encontrado' });
        }
        res.json(instrumento);
    } catch (error) {
        res.json({ mensaje: 'Error al actualizar el instrumento', error: error.message });
    }
});

// BORRAR INSTRUMENTO
router.delete('/instrumento/:id', async (req, res) => {
    try {
        await Instrumento.findByIdAndDelete(req.params.id);
        res.json({ mensaje: 'Instrumento eliminado exitosamente' });
    } catch (error) {
        res.json({ mensaje: 'Error al eliminar el instrumento', error: error.message });
    }
});


export default router;