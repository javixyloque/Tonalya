import mongoose from "mongoose";
import mongooseBcrypt from "mongoose-bcrypt";


const alumnoSchema = new mongoose.Schema({
    username: { 
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
alumnoSchema.plugin(mongooseBcrypt);

// EXPORTAR ALUMNO
const Alumno = mongoose.model('Alumno', alumnoSchema);
export default Alumno;