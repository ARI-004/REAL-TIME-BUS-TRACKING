import express from "express";
import Driver from "../models/Driver.js";
//import TrainingData from "../models/TrainingData.js";
//import { getPrediction } from "../services/mlService.js";
const router = express.Router();

// 📌 Register a driver
router.post("/register", async (req, res) => {
  try {
    const { busNumber, registrationNo, phone, password, stops } = req.body;

    const exists = await Driver.findOne({ registrationNo });
    if (exists) return res.status(400).json({ error: "Driver already exists" });

    const driver = new Driver({ busNumber, registrationNo, phone, password, stops });
    await driver.save();

    res.json({ message: "✅ Driver registered", driver });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "❌ Failed to register driver" });
  }
});
// 📌 Predict ETA for passenger at Stop B
// router.post("/eta/:driverId", async (req, res) => {
//   try {
//     const { driverId } = req.params;
//     const { stopB } = req.body; // passenger asks for Stop B

//     const driver = await Driver.findById(driverId);
//     if (!driver) return res.status(404).json({ error: "Driver not found" });

//     // find bus last location + determine nearest previous stop (stopA)
//     const stops = driver.stops;
//     const stopIndex = stops.findIndex(s => s.stopName === stopB);
//     if (stopIndex <= 0) return res.status(400).json({ error: "Invalid stopB or no previous stop" });

//     const stopA = stops[stopIndex - 1].stopName;

//     // calculate distance (for now mock, later use Maps API)
//     const distance = Math.floor(Math.random() * 10) + 1;

//     const traffic = Math.floor(Math.random() * 10); // or from API
//     const hour = new Date().getHours();
//     const dayOfWeek = new Date().getDay();

//     // ML prediction
//     const prediction = await getPrediction({ stopA, stopB, distance, traffic, hour, dayOfWeek });

//     res.json({
//       stopA,
//       stopB,
//       predicted_delay: prediction.predicted_delay_minutes,
//     });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: "❌ ETA prediction failed" });
//   }
// });
// 📌 Login driver
router.post("/login", async (req, res) => {
  const { registrationNo, password } = req.body;
  try {
    const driver = await Driver.findOne({ registrationNo, password });
    if (!driver) return res.status(401).json({ error: "Invalid credentials" });

    res.json({ message: "✅ Login successful", driverId: driver._id,registrationNo:driver.registrationNo });
  } catch (err) {
    res.status(500).json({ error: "❌ Login failed" });
  }
});

// 📌 Update live location
router.post("/updateLocation", async (req, res) => {
  const { driverId, lat, lng } = req.body;
  try {
    const driver = await Driver.findById(driverId);
    if (!driver) return res.status(404).json({ error: "Driver not found" });

    driver.lastLocation = { lat, lng, timestamp: new Date() };
    await driver.save();

    res.json({ message: "📡 Location updated", location: driver.lastLocation });
  } catch (err) {
    res.status(500).json({ error: "❌ Failed to update location" });
  }
});

// 📌 Update stops (driver can modify/add/remove stops anytime)
router.put("/updateStops/:driverId", async (req, res) => {
  try {
    const { driverId } = req.params;
    const { stops } = req.body; // expect an array of { stopName, actualArrival }

    const driver = await Driver.findById(driverId);
    if (!driver) return res.status(404).json({ error: "Driver not found" });

    driver.stops = stops; // overwrite with new stops list
    await driver.save();

    res.json({ message: "📝 Stops updated successfully", stops: driver.stops });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "❌ Failed to update stops" });
  }
});

// 📌 Get stops for a driver
router.get("/stops/:driverId", async (req, res) => {
  try {
    const { driverId } = req.params;

    const driver = await Driver.findById(driverId);
    if (!driver) return res.status(404).json({ error: "Driver not found" });

    res.json({ stops: driver.stops || [] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "❌ Failed to fetch stops" });
  }
});

export default router;
