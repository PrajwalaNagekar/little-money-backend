import mongoose from 'mongoose';

const registerSchema = new mongoose.Schema({
  mobileNumber: {
    type: String,
    required: true,
    unique: true,
    sparse: true,
  },
  leadId: {
    type: String,
    required: false,
  },
  existingLead: {
    type: String,
    default: 'N',
  },
  status:{
    type:Number,
    default:0
  }
}, { timestamps: true });

export default mongoose.model('register', registerSchema);