import mongoose from 'mongoose';

const businessLoanSchema = new mongoose.Schema({
  mobileNumber: {
    type: String,
    required: true,
    unique: true,
  },
  leadId: {
    type: mongoose.Schema.Types.String,
    ref: 'register',
    required: false,
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  businessRegistrationType: {
    type: Number,
    enum: [1, 2, 3, 4, 5, 6, 7, 8],
  },
  email: {
    type: String,
    required: true,
  },
  pincode: {
    type: String,
    required: true,
  },
  consumerConsentDate: {
    type: Date,
    required: true,
  },
  consumerConsentIp: {
    type: String,
    required: true
  },
  // city: {
  //   type: String,
  //   required: function () {
  //     return this.businessRegistrationType !== 8;
  //   },
  // },
  dob: {
    type: String,
    required: true
  },
  employmentStatus: {
    type: Number,
    enum: [1, 2],
    required: true,
    // function () {
    //   return this.businessRegistrationType === 8;
    // },
  },
  // businessProof: {
  //   type: Number,
  //   enum: [1, 2, 3, 4, 5, 6, 7, 8]
  // },
  businessCurrentTurnover: {
    type: Number,
    enum: [1, 2, 3, 4],
    // required: function () {
    //   return (
    //     [1, 2, 3, 4, 5, 6, 7].includes(this.businessRegistrationType) 
    //     ||
    //     (this.businessRegistrationType === 8 && this.employmentStatus === 2)
    //   );
    // },
  },
  businessYears: {
    type: Number,
    enum: [1, 2],
    // required: function () {
    //   return (
    //     [1, 2, 3, 4, 5, 6, 7].includes(this.businessRegistrationType) 
    //     ||
    //     (this.businessRegistrationType === 8 && this.employmentStatus === 2)
    //   );
    // },
  },
  businessAccount: {
    type: Number,
    enum: [1, 2],
    // required: function () {
    //   return (
    //     [1, 2, 3, 4, 5, 6, 7].includes(this.businessRegistrationType) 
    //     ||
    //     (this.businessRegistrationType === 8 && this.employmentStatus === 2)
    //   );
    // },
  },
  residenceType: {
    type: Number,
    enum: [1, 2],
    // required: function () {
    //   return (
    //     [1, 2, 3, 4, 5, 6, 7].includes(this.businessRegistrationType) ||
    //     (this.businessRegistrationType === 8 && this.employmentStatus === 2)
    //   );
    // },
  },
  employerName: {
    type: String,
    required: function () {
      return this.businessRegistrationType === 8 && this.employmentStatus === 1;
    },
  },
  officePincode: {
    type: String,
    required: function () {
      return this.businessRegistrationType === 8 && this.employmentStatus === 1;
    },
  },
  monthlyIncome: {
    type: Number,
    required: function () {
      return this.businessRegistrationType !== 8;
    },
  },
}, { timestamps: true });

export default mongoose.model('businessLoan', businessLoanSchema);