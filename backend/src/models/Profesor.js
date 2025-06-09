import mongoose from "mongoose";

const ProfesorSchema = new mongoose.Schema({
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
        required: true
    },
    telefono: {
        type: String,
        required: true
    },
    clases: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Clase'
        }
    ]

});

const Profesor = mongoose.model('Profesor', ProfesorSchema);

export default Profesor;
