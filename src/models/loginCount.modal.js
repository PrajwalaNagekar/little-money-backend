import mongoose from "mongoose";

const loginCountSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "register", // Name of the model you're referencing
    required: true,
  },
  count: {
    type: Number,
    default: 0,
  },
}, { timestamps: true });

const LoginCount = mongoose.model("LoginCount", loginCountSchema);
export default LoginCount;
