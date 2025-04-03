import dotenv from "dotenv";
dotenv.config();

const { PORT, MONGODB_URI, SMS_AUTH_KEY, SMS_SENDERID } = process.env;

export { PORT, MONGODB_URI, SMS_AUTH_KEY, SMS_SENDERID };
