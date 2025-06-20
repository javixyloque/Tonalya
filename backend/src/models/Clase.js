import mongoose from 'mongoose';
import Usuario from './Usuario.js';

const ClaseSchema = new mongoose.Schema({
  titulo: String,
  descripcion: String,
  precio: Number,
  imagen: Buffer, 
  fecha: Date,
  finalizada: Boolean,
  pagoRealizado: Boolean,
  profesor: [
    { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario' }
  ],
  alumno: [
    { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario' }
  ]
});

const Clase = mongoose.model('Clase', ClaseSchema);


export default Clase ;