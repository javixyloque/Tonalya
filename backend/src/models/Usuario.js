import mongoose from "mongoose";


// USUARIO CLIENTE DE LA PÁGINA
const UsuarioSchema = new mongoose.Schema({
    nombre: String,
    apellidos: String,
    edad: Number,
    especialidad: String,
    imagen: Buffer,
    user: {
        username: String,
        password: String,
        email: String,
        telefono: String
    }
});

// VARIABLE => CREAR MODELO DE USUARIO
const Usuario = mongoose.model('Usuario', UsuarioSchema);


export default Usuario;