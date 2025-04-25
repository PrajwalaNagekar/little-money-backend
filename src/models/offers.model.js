import mongoose from "mongoose";

const singleOfferSchema = new mongoose.Schema({
  lenderId: Number,
  lenderName: String,
  lenderLogo: String,
  offerAmountUpTo: String,
  offerTenure: String,
  offerInterestRate: String,
  offerProcessingFees: String,
  status: {
    type: String,
    enum: [
      "Application Started",
      "Application Not Started",
      "Approved",
      "Pending",
      "Disbursed"
    ]
  },
  offerLink: String
}, { _id: false });

const offerSchema = new mongoose.Schema({
  leadId: {
    type: String,
    required: true,
    unique: true, //  Ensure one per leadId
  },
  offers: [singleOfferSchema], //  Offers stored as array
}, { timestamps: true });

export default mongoose.model("Offer", offerSchema);
