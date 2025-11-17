import mongoose from 'mongoose';

const ClaseSchema = new mongoose.Schema({
    descripcion: String,
    precio: Number, 
    fechaInicio: Date,
    fechaFin: Date,
    estado: {
        type: String,
        enum: ['pendiente', 'aceptada', 'pagada', 'rechazada', "completada"]
    },
    asistencia: Boolean,
    instrumento: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Instrumento'
    },

    profesor: [
        { 
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Profesor' 
        }
    ],
    alumno: [
        { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'Usuario' 
        }
    ]
});

const Clase = mongoose.model('Clase', ClaseSchema);


export default Clase ;