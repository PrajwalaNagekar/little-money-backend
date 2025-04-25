import mongoose from 'mongoose';

const offersSummarySchema = new mongoose.Schema({
  leadId: {
    type: String,
    required: true,
    index: true,
    unique: true,
  },
  offersTotal: {
    type: Number,
    required: true,
  },
  maxLoanAmount: {
    type: Number,
    required: true,
  },
  minMPR: {
    type: Number,
    required: true,
  },
  maxMPR: {
    type: Number,
    required: true,
  },
  redirectionUrl: {
    type: String,
    required: true,
  },
}, {
  timestamps: true // Adds createdAt and updatedAt fields
});

export default mongoose.model('OffersSummary', offersSummarySchema);