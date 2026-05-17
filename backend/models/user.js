/** @format */

const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
  },
  phone_number: {
    type: Number,
    required: true,
  },
});

const passengerSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
  },
  { timestamps: true }
);

const locationSchema = new Schema({
  source: {
    type: String,
  },
  destination: {
    type: String,
  },
});

const Passenger = mongoose.model("Passenger", passengerSchema);
const User = mongoose.model("User", userSchema);
const Location = mongoose.model("Location", locationSchema);

module.exports = { User, Location, Passenger };
