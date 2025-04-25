import mongoose from 'mongoose';
const personalLoanSchema = new mongoose.Schema({
    typeOfLoan: {
        type: String,
        enum: ["personalloan", "businessloan"]
    },

    mobileNumber: {
        type: String,
        required: true,
        unique: true
    },
    leadId: {
        type: mongoose.Schema.Types.String,
        ref: 'register',
        required: false
    },
    firstName: {
        type: String,
        required: true,
    },  
    lastName: {
        type: String,
        required: true,
    },
    dob: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    pincode: {
        type: String,
        required: true,
    },
    monthlyIncome: {
        type: Number,
        required: true,
    },
    creditScoreClass: {
        type: Number,
        enum: [1, 2],
        required: false,
    },
    consumerConsentDate: {
        type: Date,
        required: true,
    },
    consumerConsentIp: {
        type: String,
        required: true
    },
    employmentStatus: {
        type: Number,
        enum: [1, 2]
    },
    utm_id: {
        type: String,
        required: false
    },
    referal: {
        type: String,
        required: false
    },
    employerName: {
        type: String,
        required: function () {
            return this.employmentStatus === 1
        }
    },
    officePincode: {
        type: String,
        required: function () {
            return this.employmentStatus === 1
        },

    },
    businessRegistrationType: {
        type: Number,
        enum: [1, 2, 3, 4, 5, 6, 7, 8],
        required: function () {
            return this.employmentStatus === 2
        }
    },
    residenceType: {
        type: Number,
        enum: [1, 2],
        required: function () {
            return (this.employmentStatus === 2 && this.businessRegistrationType !== 8)
        }
    },
    businessCurrentTurnover: {
        type: Number,
        enum: [1, 2, 3, 4],
        required: function () {
            return (this.employmentStatus === 2 && this.businessRegistrationType !== 8)
        }
    },
    businessYears: {
        type: Number,
        enum: [1, 2],
        required: function () {
            return (this.employmentStatus === 2 && this.businessRegistrationType !== 8)
        }
    },
    businessAccount: {
        type: Number,
        enum: [1, 2],
        required: function () {
            return (this.employmentStatus === 2 && this.businessRegistrationType !== 8)
        }
    }
},

    { timestamps: true })

export default mongoose.model('personalLoan', personalLoanSchema)
