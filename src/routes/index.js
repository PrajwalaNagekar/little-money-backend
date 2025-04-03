import express from "express";
import { mobileVerify } from "../controller/web/personalLoanController.js";
const router = express.Router();

router.get("/", mobileVerify);

export default router;
