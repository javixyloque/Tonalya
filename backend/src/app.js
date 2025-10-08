// IMPORTAR LAS DEPENDENCIAS
// require("dotenv").config();
// EXPRESS => RUTEAR Y HTTP
// BODY-PARSER => PARSEAR LOS DATOS ENVIADOS EN FORMATO JSON
// MONGOOSE => CONECTAR CON MONGODB Y OPERAR
// MONGOOSE-BCRYPT => ENCRIPTAR CONTRASEÑAS
// CORS => SOLICITUDES DESDE EL CLIENTE
// MULTER => MIDDLEWARE FORMULARIOS MULTIPART/FORM-DATA (SUBIR ARCHIVOS)
// UUIDV4 => GENERAR IDENTIFICADORES UNICOS (EVITAR ERROR DUPLICADOS)

import express from "express";
import 'dotenv/config';
import mongoose from "mongoose";
import cors from "cors";
import Clase from "./models/Clase.js";
import Profesor from "./models/Profesor.js";
import Usuario from "./models/Usuario.js";
import Admin from "./models/Admin.js";
import Instrumento from "./models/Instrumento.js";
import arrInstrumentos from "./bdInstrumentos.js";
import multer from "multer";
import bcrypt from "bcrypt"


// PUERTO => EXPRESS
const PORT = process.env.PORT || 5000;

// CONFIGURACION DE MULTER
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // DIRECTORIO ARCHIVOS GUARDADOS
    cb(null, './uploads')
  },
  filename: function (req, file, cb) {
    // NOMBRE ARCHIVO GUARDADO
    const nombreArchivo = Date.now() + '_'+file.originalname;
    cb(null, nombreArchivo)
  }
})

// INSTAR MULTER
const upload = multer({storage});




const app = express();
// Middleware
app.use(express.json());

async function main() { 
    //CORS => SOLICITUDES DESDE EL CLIENTE, LIMITAMOS LAS OPCIONES A LO QUE VAMOS A UTILIZAR
    
    app.use(cors( {
        origin: 'http://localhost:5173',
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        allowedHeaders: ['Content-Type', 'Authorization'],
    }));


// MONGOOSE => CONECTAR A MONGODB
    mongoose.connect('mongodb://127.0.0.1:27017/Tonalya', {})
    .then(() => {
        console.log('Conectado a MongoDB');
    }).catch(err => {
        console.error('Error de conexión', err);
    });




    // ROOT => EJEMPLO DE RUTA
    app.get('/', (req, res) => {
        res.send('API de Tonalya');
    })


    // PETICIONES

    // CRUD USUARIO

    // CREAR USUARIO
    app.post('/usuario', async (req, res) => {
        try {
            const usuario = new Usuario({
                nombre: req.body.nombre,
                email: req.body.email,
                telefono: req.body.telefono,
                password: req.body.password,
                imagen: req.body.imagen,
                tipo: 'ALUMNO'
            });
            await usuario.save();
            res.json({ mensaje: 'Usuario creado exitosamente' });
        } catch (error) {
            res.status(500).json({ mensaje: 'Error al crear el usuario', error: error.message });
        }
    });

    // OBTENER DATOS USUARIO
    app.get('/usuario/:id', async (req, res) => {
        try {
            const usuario = await Usuario.findById(req.params.id);
            if (!usuario) {
                return res.status(404).json({ mensaje: 'Usuario no encontrado' });
            }
            res.json(usuario);
        } catch (error) {
            res.status(500).json({ mensaje: 'Error al obtener el usuario', error: error.message });
        }
    });

    // MODIFICAR USUARIO
    app.put('/usuario/:id', async (req, res) => {
        try {
            const usuario = await Usuario.findByIdAndUpdate(req.params.id, req.body, { new: true });
            if (!usuario) {
                return res.status(404).json({ mensaje: 'Usuario no encontrado' });
            }
            res.json(usuario);
        } catch (error) {
            res.status(500).json({ mensaje: 'Error al actualizar el usuario', error: error.message });
        }
    });

    // BORRAR USUARIO
    app.delete('/usuario/:id', async (req, res) => {
        try {
            await Usuario.findByIdAndDelete(req.params.id);
            res.json({ mensaje: 'Usuario eliminado exitosamente' });
        } catch (error) {
            res.status(500).json({ mensaje: 'Error al eliminar el usuario', error: error.message });
        }
    });

    // AÑADIR CLASE A UN ALUMNO
    app.put('/alumno/:id/clase', async (req, res) => {
        try {
            const alumno = await Usuario.findById(req.params.id);
            if (!alumno || alumno.tipo !== 'ALUMNO') {
                return res.status(404).json({ mensaje: 'Alumno no encontrado o no es un alumno' });
            }
            
            
            const clase = await Clase.findById(req.body.claseId);
            if (!clase) {
                return res.status(404).json({ mensaje: 'Clase no encontrada' });
            }
            
            
            alumno.clases.push(clase._id);
            await alumno.save();
            
            res.json({ mensaje: 'Clase agregada exitosamente' });
        } catch (error) {
            res.status(500).json({ mensaje: 'Error al agregar la clase', error: error.message });
        }
    });
    
    // INICIO SESIÓN ALUMNO

    app.post('/alumno/login', async (req, res) => {
        try {
            const email = req.body.email;
            const password = req.body.password;
            
            // Buscar el alumno con el correo electrónico y contraseña
            const usuario = await Usuario.findOne({ "email": email });
            if (!usuario || !bcrypt.compareSync(password, usuario.password)) {
                return res.status(401).json({ mensaje: 'Correo electrónico o contraseña incorrectos' });
            }
            
            // Almacenar el ID del usuario en sesión
            sessionStorage.setItem('usuarioId', usuario._id);
            
            res.json({ mensaje: 'Iniciaste sesión exitosamente' });
        } catch (error) {
            res.status(500).json({ mensaje: 'Error al iniciar sesión como alumno', error: error.message });
        }
    });
    
    // CRUD PROFESOR

    // INICIO SESION PROFESOR
    app.post('/profesor/login', async (req, res) => {
        try {
            const email = req.body.email;
            const password = req.body.password;
            
            // Buscar el profesor con el correo electrónico y contraseña
            const profesor = await Profesor.findOne({ "email": email });
            if (!profesor || !bcrypt.compareSync(password, profesor.password)) {
                return res.status(401).json({ mensaje: 'Correo electrónico o contraseña incorrectos' });
            }
            
            // Almacenar el ID del usuario en sesión
            res.json({ mensaje: 'Iniciaste sesión exitosamente', usuario: profesor.nombre, id: profesor.id });
            sessionStorage.setItem('usuarioId', profesor._id);
            
        } catch (error) {
            res.status(500).json({ mensaje: 'Error al iniciar sesión como profesor', error: error.message });
        }
    });
    // AÑADIR PROFESOR
    app.post('/profesor', async (req, res) => {
        try {
            const profesor = new Profesor({
                nombre: req.body.nombre,
                email: req.body.email,
                telefono: req.body.telefono,
                password: req.body.password,
                imagen: req.body.imagen,
                provincia: req.body.provincia
            });
            await profesor.save();
            res.json({ mensaje: 'Profesor creado exitosamente' });
        } catch (error) {
            res.status(500).json({ mensaje: 'Error al crear el profesor', error: error.message });
        }
    });

    // OBTENER DATOS PROFESOR
    app.get('/profesor/:id', async (req, res) => {
        try {
            const profesor = await Profesor.findById(req.params.id);
            if (!profesor) {
                return res.status(404).json({ mensaje: 'Profesor no encontrado' });
            }
            res.json(profesor);
        } catch (error) {
            res.status(500).json({ mensaje: 'Error al obtener el profesor', error: error.message });
        }
    });

    app.get(('/profesor'), async (req, res) => {
        try {
            const profesores = await Profesor.find({});
            if (!profesores) {
                res.json({mensaje: "No se ha encontrado ningun profesor"})
            } else {
                res.json(profesores);
            }
        } catch (error) {
            res.status(500).json({mensaje: "Error al obtener los profesores", error: error.message})
        }
    })

    // ACTUALIZAR DATOS PROFESOR
    app.put('/profesor/:id', async (req, res) => {
        try {
            const profesor = await Profesor.findByIdAndUpdate(req.params.id, req.body, { new: true });
            if (!profesor) {
                return res.status(404).json({ mensaje: 'Profesor no encontrado' });
            }
            res.json(profesor);
        } catch (error) {
            res.status(500).json({ mensaje: 'Error al actualizar el profesor', error: error.message });
        }
    });

    // BORRAR DATOS PROFESOR
    app.delete('/profesor/:id', async (req, res) => {
        try {
            await Profesor.findByIdAndDelete(req.params.id);
            res.json({ mensaje: 'Profesor eliminado exitosamente' });
        } catch (error) {
            res.status(500).json({ mensaje: 'Error al eliminar el profesor', error: error.message });
        }
    });

    // ANADIR INSTRUMENTO/S PROFESOR
    app.put('/profesor/:id/instrumento', async (req, res) => {
        try {
            const profesor = await Profesor.findById(req.params.id);
            if (!profesor) {
                return res.status(404).json({ mensaje: 'Profesor no encontrado' });
            }
            const instrumento = await Instrumento.findById(req.body.instrumento);
            if (!instrumento) {
                return res.status(404).json({ mensaje: 'Instrumento no encontrado' });
            }
            // PROFESOR._DOC -> ACCEDE AL OBJETO (LO MAPEA) Y AÑADE UNO AL ARRAY INSTRUMENTOS
            const nuevoProfesor = new Profesor({ ...profesor._doc, instrumentos: [...profesor.instrumentos, instrumento] });
            const guardado = await nuevoProfesor.save();
            res.json({ mensaje: 'Instrumento agregado exitosamente', instrumento: guardado });
        } catch(error) {
            console.log(error);
            res.status(500).json({ mensaje: 'Error al agregar el instrumento' });
        }
    });


    // AÑADIR CLASE PROFESOR
    app.put('/profesor/:id/clase', async (req, res) => {
    try {
            const profesor = await Profesor.findById(req.params.id);
            if (!profesor) {
                return res.status(404).json({ mensaje: 'Profesor no encontrado' });
            }
            
            
            const clase = await Clase.findById(req.body.claseId);
            if (!clase) {
                return res.status(404).json({ mensaje: 'Clase no encontrada' });
            }
            
            
            profesor.clases.push(clase._id);
            await profesor.save();
            
            res.json({ mensaje: 'Clase agregada exitosamente' });
        } catch (error) {
            res.status(500).json({ mensaje: 'Error al agregar la clase', error: error.message });
        }
    });


    // CRUD CLASE

    // AÑADIR CLASE
    app.post('/clase', async (req, res) => {
        try {
            const clase = new Clase({
                titulo: req.body.titulo,
                descripcion: req.body.descripcion,
                precio: req.body.precio,
                imagen: req.body.imagen,
                fecha: req.body.fecha,
                asistencia: req.body.asistencia,
                pagoRealizado: req.body.pagoRealizado
            });
            await clase.save();
            res.json({ mensaje: 'Clase creada exitosamente' });
        } catch (error) {
            res.status(500).json({ mensaje: 'Error al crear la clase', error: error.message });
        }
    });

    // OBTENER DATOS CLASE
    app.get('/clase/:id', async (req, res) => {
        try {
            const clase = await Clase.findById(req.params.id);
            if (!clase) {
                return res.status(404).json({ mensaje: 'Clase no encontrada' });
            }
            res.json(clase);
        } catch (error) {
            res.status(500).json({ mensaje: 'Error al obtener la clase', error: error.message });
        }
    });

    // MODIFICAR CLASE
    app.put('/clase/:id', async (req, res) => {
        try {
            const clase = await Clase.findByIdAndUpdate(req.params.id, req.body, { new: true });
            if (!clase) {
                return res.status(404).json({ mensaje: 'Clase no encontrada' });
            }
            res.json(clase);
        } catch (error) {
            res.status(500).json({ mensaje: 'Error al actualizar la clase', error: error.message });
        }
    });

    // BORRAR CLASE
    app.delete('/clase/:id', async (req, res) => {
        try {
            await Clase.findByIdAndDelete(req.params.id);
            res.json({ mensaje: 'Clase eliminada exitosamente' });
        } catch (error) {
            res.status(500).json({ mensaje: 'Error al eliminar la clase', error: error.message });
        }
    });
    
    
    
    // CREAR LOS INSTRUMENTOS A PARTIR DEL ARRAY DE INSTRUMENTOS
    app.get('/instrumentos', async (req,res) => {
        try{
            const instrumentos = await Instrumento.find({});
            if (!instrumentos) {
                await Instrumento.insertMany(arrInstrumentos());
            }
            res.json(instrumentos);
        } catch(error){
            console.log("Error al obtener los instrumentos", error)
            res.status(500).json({error: "Ocurrió un error"});
        }
    })

    

    app.delete('/instrumentos', async (req, res) => {
        try {
            await Instrumento.deleteMany({});
            res.json("Completado")
        } catch(error) {
            res.status(500).json("Algo no ha salido bien borrando los instrumentos")
        }
    })
    
    


    // AGREGAR ALUMNO MAYOR DE EDAD
    app.post('/alumno', async (req, res) => {
        // const { nombre, apellido, email, telefono } = req.body;
        // const { id } = req.params;
        try {
            const alumno = new Usuario({
                nombre: req.body.nombre,
                email: req.body.email,
                telefono: req.body.telefono,
                password: req.body.password,
                imagen: req.body.imagen,
                tipo: 'ALUMNO'
            });
            await alumno.save();
            res.json({ mensaje: 'Alumno creado exitosamente' });
        } catch (error) {
            res.status(500).json({ mensaje: 'Error al crear el alumno', error: error.message });
        }
    });
        
    

    // app.get('/admin', async (req, res) => {
    //     try{
    //         const admins =  await Admin.find({});
    //         res.json(admins);
    //     } catch(error) {
    //             res.status(500).json({ error: 'Ocurrido un error' });
    //             }
    // })


    // USUARIO => ADMIN
    const admin = await Admin.findOne({ nombre: 'admin' });
    
    if (!admin) {
        const adminUser = new Admin ({
            email: 'admin',
            password: '645581'
        });
        try {
            await adminUser.save();
            console.log('Created admin user');
        } catch (err) {
            console.error('Error creating admin user:', err);
        }
    } else {
        console.log('Admin user already exists, no need to create one');
    }
    
    
    







// CONFIGURAR PUERTO
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

}

// Ejecutar la función principal
main();