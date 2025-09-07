import mongoose from "mongoose";

const StopSchema = new mongoose.Schema({
  stopName: { type: String, required: true },
  actualArrival:{type: String,required: true}
});

const DriverSchema = new mongoose.Schema({
  busNumber: { type: String, required: true },
  registrationNo: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  password: { type: String, required: true }, // 🔑 should hash later
  stops:[StopSchema],
  lastLocation: {
    lat: Number,
    lng: Number,
    timestamp: { type: Date, default: Date.now },
  },
});

export default mongoose.model("Driver", DriverSchema);
