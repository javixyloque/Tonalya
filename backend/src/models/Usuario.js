import mongoose from "mongoose";
import mongooseBcrypt from "mongoose-bcrypt";


const usuarioSchema = new mongoose.Schema({
    nombre: { 
        type: String, 
        required: true 
    },
    email: { 
        type: String, 
        required: true, 
        unique: true 
    },
    telefono: {
        type: String,
        required: true
    },
    password: { 
        type: String, 
        required: true,
        bcrypt: true
    },
    provincia: {
        type: String,
        required: false,  
    },
    activo: {
        type: Boolean,
        default: true
    },
    instrumentos: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref:'Instrumento'
        }
    ],
    clases : [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Clase'
        }
    ],

    // DE MOMENTO IGNORAR
    imagen: {
        type:Buffer,
        required: false
    }

});

// ENCRIPTAR CONTRASEÑAS
usuarioSchema.plugin(mongooseBcrypt);

// EXPORTAR ALUMNO
const Usuario = mongoose.model('Alumno', usuarioSchema);
export default Usuario;