// IMPORTAR LAS DEPENDENCIAS
// require("dotenv").config();
// EXPRESS => RUTEAR Y HTTP
// BODY-PARSER => PARSEAR LOS DATOS ENVIADOS EN FORMATO JSON
// MONGOOSE => CONECTAR CON MONGODB Y OPERAR
// CORS => SOLICITUDES DESDE EL CLIENTE

import express from "express";
import bodyParser from "body-parser";
import 'dotenv/config';
import mongoose from "mongoose";
import cors from "cors";
import Profesor from "./models/Profesor.js";
import Usuario from "./models/Usuario.js";


// PUERTO => EXPRESS
const PORT = process.env.PORT || 5000;
const MONGO_URI =  `http://localhost:5000`;


// const profeBD = mongoose.model("Profesor", ProfesorSchema);
// const usuarioBD = mongoose.model('Usuario', UsuarioSchema);


const app = express();
// Middleware
app.use(express.json());
app.use(cors());

async function main() { 

// Conectar a MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/Tonalya', {})
.then(() => {
    console.log('Conectado a MongoDB');
}).catch(err => {
    console.error('Error de conexión', err);
});





app.get('/', (req, res) => {
    res.send('API de Tonalya');
})

// PROFESOR => POST 
    // Crear un nuevo profesor
    // POST /profesor
    app.get('/profesor', async (req, res) => {
        try{
            const profesores =  await Profesor.find({});
            res.json(profesores);
        } catch(error) {
            res.status(500).json({ error: 'Ocurrió un error' });

        }
    });


    // Crear un nuevo profesor
    app.post('/profesor', async (req, res) => {
        // Validar los datos
        if (!req.body.nombre ||!req.body.apellido ||!req.body.edad) {
            return res.status(400).json({ mensaje: 'Todos los campos son obligatorios' });
        }
        // COGER IMAGEN => UNDEFINED SI NO ESTABLECIDA
        const imagenBuffer = req.body.imagen ? Buffer.from(req.body.imagen, 'base64') : undefined;

        
        const nuevoProfesor = new Profesor({
            nombre: req.body.nombre,
            apellido: req.body.apellido,
            edad: req.body.edad,
            especialidad: req.body.especialidad,
            imagen: imagenBuffer,
            usuario: {
                username: req.body.usuario.username,
                password: req.body.usuario.password,
                email: req.body.usuario.email,
                telefono: req.body.usuario.telefono
            }
        });
        try {
            const guardado = await nuevoProfesor.save();
            res.json({ mensaje: 'Profesor creado exitosamente', profesor: guardado });

        } catch(error) {
            res.status(500).json({ mensaje: 'Error al crear el profesor' });
        }
        
        

    
    })
    


    const admin = await Usuario.findOne({ name: 'admin' });
    
    if (!admin) {
        const adminUser = new Usuario({
            nombre: 'admin',
            apellidos:'del sistema',
            edad: 0,
            especialidad: 'Administrador',
            usuario: {
                username: 'admin',
                password: '645581Alv.',
                email: 'admin@example.com',
                telefono: '3463364099',
            },
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