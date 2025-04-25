import express, { json } from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import apiRoutes from "./src/routes/ApiRoutes.js"
const app = express();
const router = express.Router();
import cors from 'cors';
dotenv.config();
const PORT = process.env.PORT;
const MONGODB_URI = process.env.MONGODB_URI;

app.use(cors());
app.use(express.json())
app.use("/api", apiRoutes);

app.use(router);


app.listen(PORT, console.log(`Backend is running on port:${PORT}`));
try {
  mongoose.connect(MONGODB_URI);
  console.log("MongoDB Connected");
  import('./cronJobs/updateRegisterStatus.js');

} catch (error) {
  console.log(error.message);
}