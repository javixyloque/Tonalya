import mongoose from "mongoose";

const instrumentoSchema = new mongoose.Schema({
    nombre: String,
    familia: String,
    imagen: String
});

const Instrumento = mongoose.model('Instrumento', instrumentoSchema);
export default Instrumento;