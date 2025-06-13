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
        required: true,
    },
    clases: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Clase'
        }
    ]

});
profesorSchema.plugin(mongooseBcrypt)

const Profesor = mongoose.model('Profesor', profesorSchema);

export default Profesor;
