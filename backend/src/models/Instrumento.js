import mongoose from "mongoose";

const instrumentoSchema = new mongoose.Schema({
    nombre: String,
    tipo: String,
    familia: String
});

const Instrumento = mongoose.model('Instrumento', instrumentoSchema);
export default Instrumento;