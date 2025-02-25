import mongoose from "mongoose";


// USUARIO CLIENTE DE LA PÁGINA
const UsuarioSchema = new mongoose.Schema({
    nombre: String,
    apellidos: String,
    edad: Number,
    especialidad: String,
    imagen: Buffer,
    usuario: {
        username: String,
        password: String,
        email: String,
        telefono: String
    }
});

const Usuario = mongoose.model('Usuario', UsuarioSchema);


export default Usuario;