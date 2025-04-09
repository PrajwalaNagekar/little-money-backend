import mongoose from 'mongoose';
const registerSchema=new mongoose.Schema({
    phoneNumber:{
        type:String,
        required:true,
        unique:true
    }
}, { timestamps: true })
export default mongoose.model('register',registerSchema)