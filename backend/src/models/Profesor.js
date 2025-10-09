import mongoose from "mongoose";
import mongooseBcrypt from "mongoose-bcrypt";

const profesorSchema = new mongoose.Schema({
    nombre:{
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        bcrypt: true
    },
    telefono: {
        type: String,
        required: true
    },
    imagen: {
        type: String,
        required: false,
    },
    provincia: {
        type: String,
        required: true
    },
    activo: {
        type: Boolean,
        default: true
    },
    instrumentos: [
        {
           type: mongoose.Schema.Types.ObjectId,
           ref: 'Instrumento'
        }
    ],
    clases: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Clase'
        }
    ]

});

profesorSchema.plugin(mongooseBcrypt);


const Profesor = mongoose.model('Profesor', profesorSchema);

export default Profesor;
