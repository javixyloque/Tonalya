import mongoose from "mongoose";

const ProfesorSchema = new mongoose.Schema({
    nombre: String,
    apellido: String,
    edad: Number,
    especialidad: String,
    Imagen: Buffer,
    usuario: {
        username: String,
        password: String,
        email: String,
        telefono: String
    }

})

export default mongoose.model("Profesor", ProfesorSchema);