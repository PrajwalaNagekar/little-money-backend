import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
const app = express();
dotenv.config();
const PORT = process.env.PORT || 5001;
const MONGODB_URI = process.env.MONGODB_URI;

try {
  mongoose.connect(MONGODB_URI);
  console.log("MongoDB Connected");
} catch (error) {
  console.log(error.message);
}

app.get("/", (req, res) => {
  res.send("Hello Little Money!");
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
