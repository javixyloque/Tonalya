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
        required: true,  
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
        type:String,
        required: false
    }

});

// ENCRIPTAR CONTRASEÑAS
usuarioSchema.plugin(mongooseBcrypt);

// EXPORTAR USUARIO
const Usuario = mongoose.model('Usuario', usuarioSchema);
export default Usuario;

// SI UN USUARIO TIENE CLASES ACEPTADAS, NO PUEDE BORRAR SU CUENTA
