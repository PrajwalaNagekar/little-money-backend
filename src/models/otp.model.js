import mongoose from 'mongoose';
const otpSchema = new mongoose.Schema({
    mobileNumber: {
        type: String,
        required: true
    },
    otp: {
        type: String,
        required: false
    },
    otpExpiry: {
        type: String,
        required: false
    }
},
    { timestamps: true })
export default mongoose.model('otp', otpSchema)