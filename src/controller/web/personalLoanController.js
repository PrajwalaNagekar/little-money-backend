import Joi from "joi";
import sendSMS from "../../services/sendSMS.js";
import otpModel from "../../models/otp.model.js";
import registerModel from "../../models/register.model.js";
import personalLoanModal from "../../models/personalLoan.modal.js";
import axios from 'axios';
import dotenv from 'dotenv'
import offerSchema from '../../models/offers.model.js'
import offersSummarySchema from "../../models/offerSummary.modal.js";
import jwt from 'jsonwebtoken';
import LoginCount from "../../models/loginCount.modal.js";
import appliedCustomersModal from "../../models/appliedCustomers.modal.js";
import { validate } from "node-cron";

dotenv.config();
// const apiKey = process.env.API_KEY;
// const apiUrl = process.env.API_BASE_URL;
const apiKey = process.env.API_KEY;


export const mobileVerify = async (req, res) => {
  const mobileVerifySchema = Joi.object({
    mobileNumber: Joi.string().required(),
  })
  const { error } = mobileVerifySchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.message })
  }
  // console.log("Incoming req.body:", req.body);

  const { mobileNumber } = req.body;

  try {
    if (mobileNumber) {
      const otp = Math.floor(100000 + Math.random() * 900000);
      const message = `${otp} is your OTP to complete your loan application with Little Money`
      // return res.json({ "message":message })
      // console.log(mobileNumber);
      await sendSMS(mobileNumber, message);
      const otpExpiry = Date.now() + 5 * 60 * 1000;
      await otpModel.findOneAndUpdate(
        { mobileNumber },
        { mobileNumber, otp, otpExpiry },
        { upsert: true, new: true }
      );
      console.log("OTP saved for:", mobileNumber);
      console.log(otp);
      return res.status(200).json({
        success: true,
        message: mobileNumber,
        // otp: otp,
      });
    }
  } catch (error) {
    return res.status(500).json({ "message": "error" })
  }
};


export const verifyOtp = async (req, res) => {
  const schema = Joi.object({
    mobileNumber: Joi.string().required(),
    otp: Joi.string().required(),
  });

  const { error } = schema.validate(req.body);
  if (error) return res.status(400).json({ message: error.message });

  const { mobileNumber, otp } = req.body;

  try {
    const record = await otpModel.findOne({ mobileNumber });
    if (!record) {
      return res.status(400).json({ message: 'No OTP sent to this number' });
    }

    if (Date.now() > Number(record.otpExpiry)) {
      return res.status(400).json({ message: 'OTP expired' });
    }

    if (record.otp == otp) {
      const apiInstance = axios.create({
        baseURL: process.env.API_BASE_URL,
        headers: {
          'apikey': process.env.API_KEY,
          'Content-Type': 'application/json',
        },
      });
      const dedupeResponse = await apiInstance.post(`/partner/dedupe`, { mobileNumber });

      if (dedupeResponse.data.success === "true") {
        let user = await registerModel.findOne({ mobileNumber });

        if (user && user.leadId) {
          user.existingLead = 'Y';
          await user.save();
        }

        if (!user) {
          user = new registerModel({ mobileNumber });
          await user.save();
        }

        let loginCountRecord = await LoginCount.findOne({ userId: user._id });

        if (!loginCountRecord) {
          loginCountRecord = new LoginCount({ userId: user._id, count: 1 });
        } else {
          loginCountRecord.count += 1;
        }
        await loginCountRecord.save();
        const token = jwt.sign(
          { userId: user._id, mobileNumber: user.mobileNumber },
          process.env.JWT_SECRET,
          { expiresIn: "10m" }
        );

        // ✅ Moved INSIDE the `if (dedupeResponse...)` block
        console.log(user.leadId);

        return res.status(200).json({
          success: true,
          message: "OTP verified successfully and dedupe called",
          token,
          userId: user._id,
          leadId: user.leadId,
          status: user.status,
          createdAt: user.createdAt
        });
      } else {
        return res.status(400).json({ success: false, message: "Dedupe API failed" });
      }
    }
    else {
      res.status(400).json({ message: "OTP verification failed" })
    }

  } catch (err) {
    console.error("Server error:", err);
    return res.status(500).json({ message: 'Server error during OTP verification' });
  }
};

export const leadApi = async (req, res) => {
  const personalLoanSchema = Joi.object({
    typeOfLoan: Joi.string().valid("personalloan", "businessloan").optional(),
    pan: Joi.string().required(),
    mobileNumber: Joi.string().required(),
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    email: Joi.string().email().required(),
    pincode: Joi.string().required(),
    dob: Joi.string().required(),
    monthlyIncome: Joi.number().required(),
    creditScoreClass: Joi.number().valid(1, 2).optional(),
    consumerConsentDate: Joi.date().required(),
    consumerConsentIp: Joi.string().required(),
    employmentStatus: Joi.number().valid(1, 2).required(),
    utm_id: Joi.string().optional(),
    referal: Joi.optional().allow(''),

    employerName: Joi.when('employmentStatus', {
      is: 1,
      then: Joi.string().required(),
      otherwise: Joi.forbidden()
    }),
    officePincode: Joi.when('employmentStatus', {
      is: 1,
      then: Joi.string().required(),
      otherwise: Joi.forbidden()
    }),

    businessRegistrationType: Joi.when('employmentStatus', {
      is: 2,
      then: Joi.number().valid(1, 2, 3, 4, 5, 6, 7, 8).required(),
      otherwise: Joi.forbidden()
    }),

    residenceType: Joi.when('employmentStatus', {
      is: 2,
      then: Joi.when('businessRegistrationType', {
        is: Joi.valid(1, 2, 3, 4, 5, 6, 7),
        then: Joi.number().valid(1, 2).required(),
        otherwise: Joi.forbidden()
      }),
      otherwise: Joi.forbidden()
    }),

    businessCurrentTurnover: Joi.when('employmentStatus', {
      is: 2,
      then: Joi.when('businessRegistrationType', {
        is: Joi.valid(1, 2, 3, 4, 5, 6, 7),
        then: Joi.number().valid(1, 2, 3, 4).required(),
        otherwise: Joi.forbidden()
      }),
      otherwise: Joi.forbidden()
    }),

    businessYears: Joi.when('employmentStatus', {
      is: 2,
      then: Joi.when('businessRegistrationType', {
        is: Joi.valid(1, 2, 3, 4, 5, 6, 7),
        then: Joi.number().valid(1, 2).required(),
        otherwise: Joi.forbidden()
      }),
      otherwise: Joi.forbidden()
    }),

    businessAccount: Joi.when('employmentStatus', {
      is: 2,
      then: Joi.when('businessRegistrationType', {
        is: Joi.valid(1, 2, 3, 4, 5, 6, 7),
        then: Joi.number().valid(1, 2).required(),
        otherwise: Joi.forbidden()
      }),
      otherwise: Joi.forbidden()
    }),
  });

  const { error, value } = personalLoanSchema.validate(req.body, { abortEarly: false });
  console.log("value", value);

  if (error) {
    console.log("Validation error:", error.details);
    return res.status(400).json({
      message: "Validation Failed",
      errors: error.details.map(err => err.message)

    });
  }

  try {
    const apiInstance = axios.create({
      baseURL: process.env.API_BASE_URL,
      headers: {
        'apikey': process.env.API_KEY,
        'Content-Type': 'application/json',
      }
    });
    const eligibilityResponse = await apiInstance.post('v2/partner/create-lead', value);
    console.log("Eligibility API response:", eligibilityResponse.data);
    if (eligibilityResponse.data.success === "true") {
      const externalLeadId = eligibilityResponse.data.leadId;
      if (!externalLeadId) {
        return res.status(500).json({ success: false, message: 'leadId missing in API response' });
      }
      const { pan, ...dataToStore } = value;
      const newLead = new personalLoanModal({
        ...dataToStore,
        leadId: externalLeadId
      });
      // Check if the lead already exists for this mobileNumber
      let existingLead = await personalLoanModal.findOne({ mobileNumber: dataToStore.mobileNumber });

      let leadDoc;
      if (existingLead) {
        // Update the existing lead
        existingLead = await personalLoanModal.findOneAndUpdate(
          { mobileNumber: dataToStore.mobileNumber },
          { ...dataToStore, leadId: externalLeadId },
          { new: true }
        );
        leadDoc = existingLead;
      } else {
        // Create a new lead
        const newLead = new personalLoanModal({
          ...dataToStore,
          leadId: externalLeadId
        });
        leadDoc = await newLead.save();
      }
      await registerModel.findOneAndUpdate(
        { mobileNumber: dataToStore.mobileNumber },
        { $set: { leadId: externalLeadId } }
      );
      return res.status(200).json({
        success: true,
        message: 'Lead created successfully. ',
        leadId: externalLeadId,
        userId: newLead._id
      });
    } else {
      return res.status(400).json({
        success: false,
        message: 'Not eligible ',
      });
    }
  } catch (err) {
    console.error("Error calling API:", err.response?.data || err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getOffersApi = async (req, res) => {
  const { leadId } = req.params;
  try {
    const axiosInstance = axios.create({
      baseURL: process.env.API_BASE_URL,
      headers: {
        'apikey': process.env.API_KEY,
        'Content-Type': 'application/json',
      },
    });
    const response = await axiosInstance.get(`/partner/get-offers/${leadId}`);
    // console.log("reasponse",response.data);
    // res.status(200).json(response.data);
    const data = response.data;
    if (data.success === "true" && Array.isArray(data.offers) && data.offers.length > 0) {
      // Replace existing document for that leadId
      await offerSchema.findOneAndUpdate(
        { leadId },
        { leadId, offers: data.offers },
        { upsert: true, new: true }
      );
      // await appliedCustomersModal.findByIdAndUpdate(
      //   {leadId},
      //   {lenderName}
      // )
    }

    res.status(200).json(data);

  } catch (error) {
    console.error('Error fetching offers:', error.message);
    res.status(error.response?.status || 500).json({
      success: false,
      message: error.response?.data?.message || 'Failed to fetch offers',
    });
  }
};

export const getSummaryApi = async (req, res) => {
  const { leadId } = req.params;
  // console.log("req params",req.params);

  try {
    const axiosInstance = axios.create({
      baseURL: process.env.API_BASE_URL,
      headers: {
        'apikey': process.env.API_KEY,
        'Content-Type': 'application/json',
      },
    });

    const response = await axiosInstance.get(`/partner/get-summary/${leadId}`);
    const summaryData = response.data;
    // console.log(summaryData);


    if (summaryData.success) {
      const {
        offersTotal,
        maxLoanAmount,
        minMPR,
        maxMPR,
      } = summaryData.summary;
      const redirectionUrl = summaryData.redirectionUrl;

      // Save to DB (create or update if already exists)
      const saved = await offersSummarySchema.findOneAndUpdate(
        { leadId }, // find by leadId
        { leadId, offersTotal, maxLoanAmount, minMPR, maxMPR, redirectionUrl }, // update fields
        { upsert: true, new: true } // create if not exists
      );

      res.status(200).json(summaryData);
    } else {
      res.status(400).json({ success: false, message: 'API did not return success' });
    }

  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({ success: false, message: 'Failed to fetch and save summary' });
  }
}
export const saveAppliedCustomers = async (req, res) => {
  const appliedCustomersSchema = Joi.object({
    leadId: Joi.string().required(),
    lenderName: Joi.string().required(),
  });

  const { error, value } = appliedCustomersSchema.validate(req.body, { abortEarly: false });

  if (error) {
    console.log("Validation error:", error.details);
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: error.details.map(err => err.message)
    });
  }

  const { leadId, lenderName } = value; // safe to destructure now

  try {
    const newApplied = new appliedCustomersModal({
      leadId: value.leadId,
      lenderName: value.lenderName
    });
    await newApplied.save();

    res.status(200).json({
      success: true,
      message: "Application saved successfully"
    });
  } catch (err) {
    console.error("Error saving application:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { leadId } = req.params;

    const updatedProfile = await personalLoanModal.findOneAndUpdate(
      { leadId }, // Match based on leadId
      { $set: req.body }, // Update with incoming data
      { new: true } // Return the updated document
    );

    if (!updatedProfile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    res.status(200).json({ message: "Profile updated", profile: updatedProfile });
  } catch (error) {
    console.error("Update error:", error);
    res.status(500).json({ message: "Something went wrong", error });
  }
}


export const getPersonalDetailsById = async (req, res) => {
  const { leadId } = req.params;
  try {
    const lead = await personalLoanModal.findOne({ leadId }); //  Here

    if (!lead) {
      return res.status(404).json({ success: false, message: 'Lead not found' });
    }

    res.status(200).json({ success: true, data: lead });
  } catch (error) {
    console.error('Error fetching lead:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};