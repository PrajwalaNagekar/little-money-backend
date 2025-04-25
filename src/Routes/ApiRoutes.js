import express from "express";
import registerUser from "../controller/web/register.controller.js";
import { getPersonalDetailsById, mobileVerify, saveAppliedCustomers, updateProfile } from "../controller/web/personalLoanController.js";
import { verifyOtp } from "../controller/web/personalLoanController.js";
import { leadApi } from "../controller/web/personalLoanController.js";
import { getOffersApi } from "../controller/web/personalLoanController.js";
import { getSummaryApi } from "../controller/web/personalLoanController.js";
import { verifyToken } from '../../middleware/authMiddleware.js'
// import { verifyToken } from "../../middleware/authMiddleware.js";
import { getBusinessDetailsByLead, leadApiBusinessLoan, updateBusinessDetailsByLead } from "../controller/web/businessLoan.controller.js";

const router = express.Router();

router.post("/mobile-verification", mobileVerify);
router.post("/otp-verify", verifyOtp)
router.post("/lead-api", verifyToken, leadApi) 
// router.get('/test-auth', verifyToken, (req, res) => {
//     res.json({ message: "Authorized route hit", user: req.user });
// });
router.get("/get-offers/:leadId", verifyToken, getOf+fersApi)
router.get('/get-summary/:leadId', verifyToken, getSummaryApi)
router.post('/applied-customers', verifyToken, saveAppliedCustomers)
router.get('/get-personal-details-by-id/:leadId',verifyToken,getPersonalDetailsById)
// router.put('/profile/:leadId', verifyToken, updateProfile)

router.post('/lead-api-business-loan', verifyToken, leadApiBusinessLoan)
router.get('/business-loan/:leadId', verifyToken, getBusinessDetailsByLead)
router.put('/update-business-details/:leadId',verifyToken,updateBusinessDetailsByLead)
export default router;