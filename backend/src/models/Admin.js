import mongoose from "mongoose";
import mongooseBcrypt from "mongoose-bcrypt";

const adminSchema = new mongoose.Schema({
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
    
});

const Admin = mongoose.model('Admin', adminSchema);
export default Admin;