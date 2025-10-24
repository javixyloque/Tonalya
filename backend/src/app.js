// IMPORTAR VARIABLES DE ENTORNO (.ENV)
// require("dotenv").config();
// EXPRESS => RUTEAR Y HTTP
// MONGOOSE => CONECTAR CON MONGODB Y OPERAR CON LA BASE DE DATOS
// MONGOOSE-BCRYPT => ENCRIPTAR CONTRASEÑAS
// CORS => SOLICITUDES DESDE EL CLIENTE
// MULTER => MIDDLEWARE FORMULARIOS MULTIPART/FORM-DATA (INACTIVO)
// UUIDV4 => GENERAR IDENTIFICADORES UNICOS (EVITAR ERROR DUPLICADOS)
// NODEMAILER => ENVIAR CORREOS ELECTRONICOS

/*
--------------------------------------------------------------------------------------------------------------------------------------

--------------------------------------------------------------------------------------------------------------------------------------

*/

import express from "express";
import 'dotenv/config';
import mongoose from "mongoose";
import cors from "cors";
import Admin from "./models/Admin.js";
import Instrumento from "./models/Instrumento.js";
import arrInstrumentos from "./bdInstrumentos.js";
// NO USADO AL FINAL POR PROBLEMA EN EL TIPADO, USO UNA FUNCION DE ENCODING EN EL FRONTEND Y GUARDO LAS IMAGENES COMO STRINGS
// import multer from "multer";
import usuarioRouter  from "./controllers/usuarioController.js";
import profesorRouter from "./controllers/profesorController.js";
import claseRouter from "./controllers/claseController.js";
import adminRouter from "./controllers/adminController.js";




// DEFINIMOS EL PUERTO DEL BACKEND
// ES VARIABLE DE ENTORNO => dotenv/config
const PORT = process.env.PORT || 5000;




const app = express();
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
    } catch (error) {
        console.error('Error al insertar instrumentos', error);
    }




    // ROOT => EJEMPLO DE RUTA
    app.get('/', (req, res) => {
        res.send('API de Tonalya');
    })


    // EXPRESS ROUTER PARA PETICIONES A LOS MODELOS (SINO TENIA 600 LINEAS)

    app.use('/usuario', usuarioRouter);

    app.use('/profesor', profesorRouter);
    
    app.use('/clase', claseRouter)
    
    app.use('/admin', adminRouter);

    
    
    
    
    //  OBTENER INSTRUMENTOS
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

    

    // USUARIO ADMIN
    try {
        const admin = await Admin.findOne({});
        if (!admin) {
            console.log('Admin no encontrado, creandolo');
            const adminUser = new Admin ({
                email: 'admin@admin.com',
                password: '645581'
            });
            try {
                await adminUser.save();
                console.log({ mensaje: 'Admin creado exitosamente' });
            } catch (err) {
                console.error('Error al crear el admin');
            }
        } else {
            console.log('Admin ya existe');
        }
    } catch (error) {
        console.error('Error al obtener el admin');

    }

    
// CONFIGURAR PUERTO
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

}

main();