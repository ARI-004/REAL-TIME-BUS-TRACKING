/** @format */
import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Passenger } from "../models/user.js";

const router = express.Router();

// 🔹 Register Passenger
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "All fields required" });
    }

    // check if already exists
    const existing = await Passenger.findOne({ email });
    if (existing) {
      return res
        .status(400)
        .json({ success: false, message: "Email already registered" });
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const newPassenger = new Passenger({
      name,
      email,
      password: hashedPassword,
    });

    await newPassenger.save();

    res.status(201).json({
      success: true,
      message: "Passenger registered successfully",
    });
  } catch (err) {
    console.error("❌ Register error:", err.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// 🔹 Passenger Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Email & password required" });
    }

    // 1. Check if passenger exists
    const passenger = await Passenger.findOne({ email });
    if (!passenger) {
      return res
        .status(400)
        .json({ success: false, message: "Passenger not found" });
    }

    // 2. Compare password
    const isMatch = await bcrypt.compare(password, passenger.password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid credentials" });
    }

    // 3. Generate JWT
    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET not defined in environment");
    }

    const token = jwt.sign({ id: passenger._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.json({
      success: true,
      message: "Login successful",
      token,
      passenger: {
        id: passenger._id,
        name: passenger.name,
        email: passenger.email,
      },
    });
  } catch (err) {
    console.error("❌ Login error:", err.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

export default router;
