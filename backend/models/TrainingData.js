// models/TrainingData.js
import mongoose from "mongoose";

const TrainingDataSchema = new mongoose.Schema({
  stopA: { type: String, required: true },     // starting stop name/id
  stopB: { type: String, required: true },     // next stop name/id
  distance: { type: Number, required: true },  // distance between stops (km)
  traffic: { type: Number, required: true },   // traffic level (0–10)
  hour: { type: Number, required: true },      // hour of day (0–23)
  dayOfWeek: { type: Number, required: true }, // day of week (0–6)
  delay: { type: Number, required: true } // delay in minutes
}, { timestamps: true });

export default mongoose.model("TrainingData", TrainingDataSchema);
