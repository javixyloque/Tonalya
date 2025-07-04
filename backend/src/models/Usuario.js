import mongoose from "mongoose";

// Usuario CLIENTE DE LA PÁGINA
const UsuarioSchema = new mongoose.Schema({
    nombre: String,
    apellidos: String,
    edad: Number,
    especialidad: String,
    imagen: Buffer,
    tipoUsuario: String,
    user: {
        username: String,
        password: String,
        email: String,
        telefono: String
    }
});

// VARIABLE => CREAR MODELO DE Usuario
const Usuario = mongoose.model('Usuario', UsuarioSchema);


export default Usuario;