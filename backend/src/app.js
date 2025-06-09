// IMPORTAR LAS DEPENDENCIAS
// require("dotenv").config();
// EXPRESS => RUTEAR Y HTTP
// BODY-PARSER => PARSEAR LOS DATOS ENVIADOS EN FORMATO JSON
// MONGOOSE => CONECTAR CON MONGODB Y OPERAR
// CORS => SOLICITUDES DESDE EL CLIENTE

import express from "express";
import 'dotenv/config';
import mongoose from "mongoose";
import cors from "cors";
import Clase from "./models/Clase.js";
import Profesor from "./models/Profesor.js";
import Alumno from "./models/Alumno.js";
import Admin from "./models/Admin.js";
import Instrumento from "./models/Instrumento.js";

// PUERTO => EXPRESS
const PORT = process.env.PORT || 5000;




const app = express();
// Middleware
app.use(express.json());
app.use(cors());

async function main() { 

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
                res.status(500).json({ error: 'Ocurrio un error' });
                
            }
        });
    

    
    
    
    
    // PROFESOR => POST 
        // Crear un nuevo profesor
        // POST /profesor
    app.post('/profesor', async (req, res) => {
        // Validar los datos
        if (!req.body.nombre ||!req.body.apellido ||!req.body.edad) {
            return res.status(400).json({ mensaje: 'Todos los campos son obligatorios' });
        }
        // COGER IMAGEN => UNDEFINED SI NO ESTABLECIDA
        const imagenBuffer = req.body.imagen ? Buffer.from(req.body.imagen, 'base64') : undefined;

        
        const nuevoUsuario = new Usuario({
            nombre: req.body.nombre,
            apellido: req.body.apellido,
            edad: req.body.edad,
            especialidad: req.body.especialidad,
            imagen: imagenBuffer,
            user: {
                username: req.body.user.username,
                password: req.body.user.password,
                email: req.body.user.email,
                telefono: req.body.user.telefono
            }
        });
        try {
            const guardado = await nuevoUsuario.save();
            res.json({ mensaje: 'Usuario creado exitosamente', usuario: guardado });

        } catch(error) {
            res.status(500).json({ mensaje: 'Error al crear el profesor' });
        }
        
        

    
    })
    

    app.get('/admin', async (req, res) => {
        try{
            const admins =  await Admin.find({});
            res.json(admins);
        } catch(error) {
                res.status(500).json({ error: 'Ocurrido un error' });
                }
    })


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