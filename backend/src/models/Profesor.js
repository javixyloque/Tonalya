import mongoose from "mongoose";

const ProfesorSchema = new mongoose.Schema({
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

const Profesor = mongoose.model('Profesor', ProfesorSchema);

export default Profesor;
