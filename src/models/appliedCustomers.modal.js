import mongoose from 'mongoose'
const appliedCustomersSchema = new mongoose.Schema({
    leadId: { type: String, required: true },
    lenderName: { type: String, required: true },
    appliedAt: { type: Date, default: Date.now }
})

export default mongoose.model("appliedCustomer", appliedCustomersSchema)