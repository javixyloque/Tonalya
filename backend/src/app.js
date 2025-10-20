// IMPORTAR LAS DEPENDENCIAS
// require("dotenv").config();
// EXPRESS => RUTEAR Y HTTP
// MONGOOSE => CONECTAR CON MONGODB Y OPERAR CON LA BASE DE DATOS
// MONGOOSE-BCRYPT => ENCRIPTAR CONTRASEÑAS
// CORS => SOLICITUDES DESDE EL CLIENTE
// MULTER => MIDDLEWARE FORMULARIOS MULTIPART/FORM-DATA (SUBIR ARCHIVOS)
// UUIDV4 => GENERAR IDENTIFICADORES UNICOS (EVITAR ERROR DUPLICADOS)
// NODEMAILER => ENVIAR CORREOS ELECTRONICOS

/*
--------------------------------------------------------------------------------------------------------------------------------------

FUNCIONAN TODAS LAS PETICIONES DE USUARIO MENOS LAS CLASES (POR LA FECHA, TODAVÍA NO HE PODIDO MANEJARLO DESDE EL FRONTEND)


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
import bcrypt from "bcrypt";
import usuarioRouter  from "./controllers/usuarioController.js";
import profesorRouter from "./controllers/profesorController.js";
import claseRouter from "./controllers/claseController.js";
import adminRouter from "./controllers/adminController.js";




// DEFINIMOS EL PUERTO DEL BACKEND
const PORT = process.env.PORT || 5000;

// CONFIGURACION DE MULTER
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     // DIRECTORIO ARCHIVOS GUARDADOS
//     cb(null, './uploads')
//   },
//   filename: function (req, file, cb) {
//     // NOMBRE ARCHIVO GUARDADO
//     const nombreArchivo = Date.now() + '_'+file.originalname;
//     cb(null, nombreArchivo)
//   }
// })

// INSTAR MULTER
// const upload = multer({storage});




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

    

    
        
    

    // app.get('/admin', async (req, res) => {
    //     try{
    //         const admins =  await Admin.find({});
    //         res.json(admins);
    //     } catch(error) {
    //             res.json({ error: 'Ocurrido un error' });
    //             }
    // })


    // CREAR ADMIN
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