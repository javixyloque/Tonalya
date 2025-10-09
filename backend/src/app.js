// IMPORTAR LAS DEPENDENCIAS
// require("dotenv").config();
// EXPRESS => RUTEAR Y HTTP
// BODY-PARSER => PARSEAR LOS DATOS ENVIADOS EN FORMATO JSON
// MONGOOSE => CONECTAR CON MONGODB Y OPERAR
// MONGOOSE-BCRYPT => ENCRIPTAR CONTRASEÑAS
// CORS => SOLICITUDES DESDE EL CLIENTE
// MULTER => MIDDLEWARE FORMULARIOS MULTIPART/FORM-DATA (SUBIR ARCHIVOS)
// UUIDV4 => GENERAR IDENTIFICADORES UNICOS (EVITAR ERROR DUPLICADOS)

/*
--------------------------------------------------------------------------------------------------------------------------------------

FUNCIONAN TODAS LAS PETICIONES DE USUARIO MENOS LAS CLASES


--------------------------------------------------------------------------------------------------------------------------------------

*/

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


// FUNCION PARA INSERTAR INSTRUMENTOS
const instrumentos = async () => {
    try {
        const instrumentoDB = await Instrumento.find({})
        if (instrumentoDB.length === 0) {
            await Instrumento.insertMany(arrInstrumentos())
        }
    } catch (error) {
        res.json({mensaje: 'Error al obtener los instrumentos', error: error.message});
    }
    
}

const main  = async () => { 
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

    try {
        instrumentos();
        // Resto del código...
    } catch (error) {
        console.error('Error al insertar instrumentos', error);
    }




    // ROOT => EJEMPLO DE RUTA
    app.get('/', (req, res) => {
        res.send('API de Tonalya');
    })


    // PETICIONES

    // CRUD USUARIO

    app.get('/usuario', async (req,res) => {
        try {
            const usuarios = await Usuario.find({activo: true})
            res.json(usuarios);
        } catch (error) {
            res.json({mensaje: 'Error al obtener los usuarios', error: error.message});
        }
    })

    // CREAR USUARIO
    
    app.post('/usuario', async (req, res) => {
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
    app.get('/usuario/:id', async (req, res) => {
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
    app.put('/usuario/:id', async (req, res) => {
        try {
            
            const usuario = await Usuario.findAndUpdate(req.params.id, req.body, { new: true });
            if (!usuario || !usuario.activo) {
                return res.json({ mensaje: 'Usuario no encontrado' });
            }
            res.json(usuario);
        } catch (error) {
            res.json({ mensaje: 'Error al actualizar el usuario', error: error.message });
        }
    });

    // BORRAR USUARIO (NO NECESARIO POR BORRADO LÓGICO PERO SE PUEDE (ADMIN))
    app.delete('/usuario/:id', async (req, res) => {
        try {
            await Usuario.findAndDelete(req.params.id);
            res.json({ mensaje: 'Usuario eliminado exitosamente' });
        } catch (error) {
            res.json({ mensaje: 'Error al eliminar el usuario', error: error.message });
        }
    });

    // AÑADIR CLASE A UN ALUMNO
    app.put('/usuario/:id/clase', async (req, res) => {
        try {
            const alumno = await Usuario.find({_id: req.params.id, activo: true});
            if (!alumno) {
                return res.json({ mensaje: 'Alumno no encontrado o no es un alumno' });
            }
            
            
            const clase = await Clase.findById(req.body.claseId);
            if (!clase) {
                return res.json({ mensaje: 'Clase no encontrada' });
            }
            
            
            alumno.clases.push(clase._id);
            await alumno.save();
            
            res.json({ mensaje: 'Clase agregada exitosamente' });
        } catch (error) {
            res.json({ mensaje: 'Error al agregar la clase', error: error.message });
        }
    });

    // ELIMINAR CLASE USUARIO

    app.put('/usuario/:id/clase/:claseId', async (req, res) => {
        try {
            const alumno = await Usuario.find({_id: req.params.id, activo: true});
            if (!alumno) {
                return res.json({ mensaje: 'Alumno no encontrado o no es un alumno' });
            }
            
            const clase = await Clase.findById(req.params.claseId);
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

    app.put('/usuario/:id/instrumento', async (req, res) => {
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
    app.delete('/usuario/:id/instrumento/:idInstrumento', async (req, res) => {
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

    app.post('/usuario/login', async (req, res) => {
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

    
    // CRUD PROFESOR

    
    // AÑADIR PROFESOR
    app.post('/profesor', async (req, res) => {
        try {
            const profesor = new Profesor({
                nombre: req.body.nombre,
                email: req.body.email,
                telefono: req.body.telefono,
                password: req.body.password,
                imagen: req.body.imagen,
                provincia: req.body.provincia,
                activo: true
            });
            await profesor.save();
            res.json({ mensaje: 'Profesor creado exitosamente' });
        } catch (error) {
            res.json({ mensaje: 'Error al crear el profesor', error: error.message });
        }
    });

    // OBTENER DATOS PROFESOR
    app.get('/profesor/:id', async (req, res) => {
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

    app.get(('/profesor'), async (req, res) => {
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
    app.put('/profesor/:id', async (req, res) => {
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
    app.delete('/profesor/:id', async (req, res) => {
        try {
            await Profesor.findByIdAndDelete(req.params.id);
            res.json({ mensaje: 'Profesor eliminado exitosamente' });
        } catch (error) {
            res.json({ mensaje: 'Error al eliminar el profesor', error: error.message });
        }
    });

    // ANADIR INSTRUMENTO/S PROFESOR
    app.put('/profesor/:id/instrumento', async (req, res) => {
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
    app.delete('/profesor/:id/instrumento/:idInstrumento', async (req, res) => {
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


    // AÑADIR CLASE PROFESOR
    app.put('/profesor/:id/clase', async (req, res) => {
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
    app.post('/profesor/login', async (req, res) => {
        try {
            const email = req.body.email;
            const password = req.body.password;
            
            // Buscar el profesor con el correo electrónico y contraseña
            const profesor = await Profesor.findOne({ "email": email });
            if (!profesor || !bcrypt.compareSync(password, profesor.password)) {
                return res.json({ mensaje: 'Correo electrónico o contraseña incorrectos' });
            }
            
            // Almacenar el ID del usuario en sesión
            res.json({ mensaje: 'Iniciaste sesión exitosamente', usuario: profesor.nombre, id: profesor.id });
            sessionStorage.setItem('usuarioId', profesor._id);
            
        } catch (error) {
            res.json({ mensaje: 'Error al iniciar sesión como profesor', error: error.message });
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
            res.json({ mensaje: 'Error al crear la clase', error: error.message });
        }
    });

    // OBTENER DATOS CLASE
    app.get('/clase/:id', async (req, res) => {
        try {
            const clase = await Clase.findById(req.params.id);
            if (!clase) {
                return res.json({ mensaje: 'Clase no encontrada' });
            }
            res.json(clase);
        } catch (error) {
            res.json({ mensaje: 'Error al obtener la clase', error: error.message });
        }
    });

    // MODIFICAR CLASE
    app.put('/clase/:id', async (req, res) => {
        try {
            const clase = await Clase.findByIdAndUpdate(req.params.id, req.body, { new: true });
            if (!clase) {
                return res.json({ mensaje: 'Clase no encontrada' });
            }
            res.json(clase);
        } catch (error) {
            res.json({ mensaje: 'Error al actualizar la clase', error: error.message });
        }
    });

    // BORRAR CLASE (NO NECESARIO POR BORRADO LÓGICO PERO SE PUEDE)
    app.delete('/clase/:id', async (req, res) => {
        try {
            await Clase.findByIdAndDelete(req.params.id);
            res.json({ mensaje: 'Clase eliminada exitosamente' });
        } catch (error) {
            res.json({ mensaje: 'Error al eliminar la clase', error: error.message });
        }
    });
    
    
    
    // CREAR LOS INSTRUMENTOS A PARTIR DEL ARRAY DE INSTRUMENTOS
    app.get('/instrumentos', async (req,res) => {
        try{
            const instrumentos = await Instrumento.find({});

            res.json(instrumentos);
        } catch(error){
            console.log("Error al obtener los instrumentos", error)
            res.json({error: "Ocurrió un error"});
        }
    })

    // OBTENER UN INSTRUMENTO
    app.get('/instrumentos/:id' , async (req, res) => {
        try {
            const instrumento = await Instrumento.findById(req.params.id);
            if (!instrumento) {
                return res.json({ mensaje: 'Instrumento no encontrado' });
            }
            res.json(instrumento);
        } catch (error) {
            res.json({ mensaje: 'Error al obtener el instrumento', error: error.message });
        }
    })

    

    app.delete('/instrumentos', async (req, res) => {
        try {
            await Instrumento.deleteMany({});
            res.json("Completado")
        } catch(error) {
            res.json("Algo no ha salido bien borrando los instrumentos")
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
            res.json({ mensaje: 'Error al crear el alumno', error: error.message });
        }
    });
        
    

    // app.get('/admin', async (req, res) => {
    //     try{
    //         const admins =  await Admin.find({});
    //         res.json(admins);
    //     } catch(error) {
    //             res.json({ error: 'Ocurrido un error' });
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