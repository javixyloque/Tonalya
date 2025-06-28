// IMPORTAR LAS DEPENDENCIAS
// require("dotenv").config();
// EXPRESS => RUTEAR Y HTTP
// BODY-PARSER => PARSEAR LOS DATOS ENVIADOS EN FORMATO JSON
// MONGOOSE => CONECTAR CON MONGODB Y OPERAR
// MONGOOSE-BCRYPT => ENCRIPTAR CONTRASEÑAS
// CORS => SOLICITUDES DESDE EL CLIENTE
// MULTER => MIDDLEWARE FORMULARIOS MULTIPART/FORM-DATA
// UUIDV4 => GENERAR IDENTIFICADORES UNICOS (EVITAR ERROR DUPLICADOS)

import express from "express";
import 'dotenv/config';
import mongoose from "mongoose";
import cors from "cors";
import Clase from "./models/Clase.js";
import Profesor from "./models/Profesor.js";
import Alumno from "./models/Alumno.js";
import Admin from "./models/Admin.js";
import Instrumento from "./models/Instrumento.js";
import  "./biblioteca.js";


// PUERTO => EXPRESS
const PORT = process.env.PORT || 5000;
// ALMACENAMIENTO DE MULTER => PASARSELO COMO PARAMETRO A MULTER





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


    

    // PROFESOR => GET
    // Obtener los profesores
    app.get('/profesor', async (req, res) => {
    try{
        const profesores =  await Profesor.find({});
        res.json(profesores);
    } catch(error) {
            res.status(500).json({ error: 'Ocurrió un error' });
            
        }
    });

    app.get('/instrumentos', async(req,res) => {
        try{
            const instrumentos =  await Instrumento.find({});
            res.json(instrumentos);
        } catch(error) {
                res.status(500).json({ error: 'Ocurrio un error', tipo: error.message });
                
            }
        });
    

    
    
    
    
    // PROFESOR => POST 
        // Crear un nuevo profesor
        // POST /profesor
    app.post('/profesor',  async (req, res) => {
        // Validar los datos
        if (!req.body.nombre ||!req.body.email || !req.body.password || !req.body.telefono) {
            return res.status(400).json({ mensaje: 'Todos los campos son obligatorios' });
        }
        // COGER IMAGEN => null SI NO ESTABLECIDA
        

        
        const nuevoProfesor = new Profesor({
            nombre: req.body.nombre,
            email: req.body.email,
            password: req.body.password,
            telefono: req.body.telefono,
            imagen: req.body.imagen,
            clases: []
            
        });
        try {
            const guardado = await nuevoProfesor.save();
            res.json({ mensaje: 'Usuario creado exitosamente', usuario: guardado });

        } catch(error) {
            res.status(500).json({ mensaje: 'Error al crear el profesor' });
        }
        
    })

    app.delete('/profesor/:id', async (req, res) => {
        try {
            const profesor = await Profesor.findByIdAndDelete(req.params.id);
            if (!profesor) {
                return res.status(404).json({ mensaje: 'Profesor no encontrado' });
            }
            res.json({ mensaje: 'Profesor eliminado exitosamente' });
        } catch (error) {
            res.status(500).json({ mensaje: 'Error al eliminar el profesor' });
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