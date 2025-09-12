/** @format */
import express from "express";
import Bus from "../models/bus.js";
import jwt from "jsonwebtoken";

const router = express.Router();

// Register bus
router.post("/register", async (req, res) => {
  const { busNumber, registrationNo, email, password, route } = req.body;

  if (!busNumber || !registrationNo || !email || !password)
    return res.status(400).json({ error: "All fields are required" });

  try {
    const busExists = await Bus.findOne({ email });
    if (busExists)
      return res.status(400).json({ error: "Bus already registered" });

    const newBus = await Bus.create({
      busNumber,
      registrationNo,
      email,
      password,
      route,
    });

    res
      .status(201)
      .json({ message: "Bus registered successfully", bus: newBus });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// Login bus
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ error: "Email and password required" });

  try {
    const bus = await Bus.findOne({ email });
    if (!bus) return res.status(400).json({ error: "Invalid credentials" });

    const isMatch = await bus.matchPassword(password);
    if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });

    // Generate JWT token
    const token = jwt.sign({ id: bus._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.json({ message: "Login successful", bus, token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
