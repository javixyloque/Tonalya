import mongoose from "mongoose";


// USUARIO CLIENTE DE LA PÁGINA
const UsuarioSchema = new mongoose.Schema({
    nombre: String,
    apellidos: String,
    edad: Number,
    especialidad: String,
    usuario: {
        username: String,
        password: String,
        email: String,
        telefono: String
    }
});



export default mongoose.model("Usuario", UsuarioSchema);