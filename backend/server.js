import express from "express";
import mongoose from "mongoose";
//import busRoutes from "./routes/busRoutes.js";
import driverRoutes from "./routes/driverRoutes.js"
import cors from "cors";
//import "./cron/retrain.js";   // Start cron job on boot

const app = express();

app.use(express.json());
app.use(cors());
// Connect MongoDB
mongoose.connect("mongodb://localhost:27017/transport")

app.use("/api/driver",driverRoutes);
app.listen(5000, () => {
  console.log("🚍 Backend running on http://localhost:5000");
});
