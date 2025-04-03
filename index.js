import express from "express";
import cors from "cors";
import dbConnect from "./src/database/index.js";
import { PORT } from "./src/config/index.js";
import sendSMS from "./src/services/sendSMS.js";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello Little Money!");
});

dbConnect();

app.listen(PORT, console.log(`Backend is running on port:${PORT}`));
