import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import apiRoutes from "./src/Routes/ApiRoutes.js"
const app = express();

try {
  mongoose.connect(MONGODB_URI);
  console.log("MongoDB Connected");
} catch (error) {
  console.log(error.message);
}
app.use("/api", apiRoutes);

// app.get("/", (req, res) => {
//   res.send("Hello Little Money!");
// });
app.use(router);

dbConnect();

app.listen(PORT, console.log(`Backend is running on port:${PORT}`));
