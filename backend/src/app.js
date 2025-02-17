// IMPORTAR LAS DEPENDENCIAS
// require("dotenv").config();
// EXPRESS => RUTEAR Y HTTP
// BODY-PARSER => PARSEAR LOS DATOS ENVIADOS EN FORMATO JSON
// MONGOOSE => CONECTAR CON MONGODB Y OPERAR
// CORS => SOLICITUDES DESDE EL CLIENTE

import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import Usuario from "./models/Usuario.js";


// PUERTO => EXPRESS
const PORT = process.env.PORT || 5000;
const MONGO_URI =  `http://localhost:27017/tonalya`;


const app = express();
// Middleware
app.use(express.json());
app.use(cors());

// Conectar a MongoDB
mongoose
    .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("MongoDB conectado"))
    .catch(err => console.error(err));

// PROFESOR => OPERACIONES BASE DE DATOS 
app.route('/profesor')
    // Crear un nuevo profesor
    // POST /profesor
    .post((req, res) => {
        // Validar los datos
        if (!req.body.nombre ||!req.body.apellido ||!req.body.edad) {
            return res.status(400).json({ mensaje: 'Todos los campos son obligatorios' });
        }
    
    })
    .patch((req, res) => {
        
    })


    const admin = await Usuario.findOne({ name: 'admin' });
        if (!admin) {
            const adminUser = new Usuario({
                name: 'admin',
                email: 'admin@example.com',
                password: 'adminpassword',
                admin: true,
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
