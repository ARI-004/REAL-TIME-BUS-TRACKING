/** @format */
import mongoose from "mongoose";
import bcrypt from "bcrypt";

const routeStopSchema = new mongoose.Schema({
  stopName: { type: String, required: true },

  // Driver enters this when setting up the bus schedule
  plannedArrival: { type: String, required: true }, // "HH:mm"

  // Gets updated when the bus actually reaches the stop
  actualArrival: { type: String }, // "HH:mm" or ISO time

  // Status of the stop
  status: {
    type: String,
    enum: [
      "pending",
      "current",
      "arrived",
      "skipped",
      "On Time",
      "Late",
      "Early",
    ],
    default: "pending",
  },

  // Calculated delay in minutes (positive = late, negative = early, 0 = on time)
  delay: { type: Number, default: 0 },

  // Optional: store location for better accuracy
  lat: { type: Number, required: true },
  lng: { type: Number, required: true },
});

const busSchema = new mongoose.Schema(
  {
    busNumber: { type: String, required: true, unique: true },
    registrationNo: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    route: { type: String },

    // Each bus will have its stops with timings + status
    routeStops: [routeStopSchema],

    // Live tracking fields
    currentLocation: { lat: Number, lng: Number },

    // Meta info (optional, can be recalculated dynamically)
    actual_arrival: { type: Number },
    distance: { type: Number },
    hour: { type: Number },
    traffic: { type: Number },
  },
  { timestamps: true }
);

// Hash password before saving
busSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password
busSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

export default mongoose.model("Bus", busSchema);
