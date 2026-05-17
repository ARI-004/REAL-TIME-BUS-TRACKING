/** @format */

const mongoose = require("mongoose");

const DriverSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  busNumber: { type: String, required: true },
  lastLocation: {
    lat: Number,
    lng: Number,
    timestamp: Date,
  },
  stops: [
    {
      stopName: String,
      actualArrival: Date,
    },
  ],
});

export default mongoose.model("Driver", DriverSchema);
