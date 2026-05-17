/** @format */
import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import http from "http";
import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import mbxGeocoding from "@mapbox/mapbox-sdk/services/geocoding.js";

import PassengerRoutes from "./routes/PassengerRoutes.js";
import DriverRoutes from "./routes/DriverRoutes.js";
import BusAuthRoutes from "./routes/BusAuthRoutes.js";
import Bus from "./models/bus.js";
import { Location } from "./models/user.js";

const app = express();

// ============================
// Middleware
// ============================
app.use(cors());
app.use(express.json()); // use built-in instead of body-parser

// ============================
// MongoDB connection
// ============================
mongoose
  .connect("mongodb://127.0.0.1:27017/grambus")
  .then(() => console.log("✅ MongoDB connected successfully!"))
  .catch((err) => console.error("❌ MongoDB connection failed:", err.message));

// ============================
// Mapbox
// ============================
if (!process.env.MAP_TOKEN) {
  console.error("❌ Missing MAP_TOKEN in .env");
  process.exit(1);
}
const geocodingClient = mbxGeocoding({ accessToken: process.env.MAP_TOKEN });

// ============================
// HTTP + Socket.IO setup
// ============================
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", // your frontend
    methods: ["GET", "POST"],
  },
});

// Make io available in routes if needed
app.use((req, res, next) => {
  req.io = io;
  next();
});

// ============================
// Socket.IO: live bus tracking
// ============================
io.on("connection", (socket) => {
  console.log("🔗 Client connected:", socket.id);

  // Passenger joins a bus room
  socket.on("joinBusRoom", (busId) => {
    socket.join(`bus_${busId}`);
    console.log(`👤 Passenger joined room: bus_${busId}`);
  });

  // Passenger leaves bus room
  socket.on("leaveBusRoom", (busId) => {
    socket.leave(`bus_${busId}`);
    console.log(`👤 Passenger left room: bus_${busId}`);
  });

  // Bus sends location updates
  socket.on("updateBusLocation", async ({ busId, lat, lng, token }) => {
    try {
      // Verify token safely
      let decoded;
      try {
        decoded = token ? jwt.verify(token, process.env.JWT_SECRET) : null;
      } catch (err) {
        return socket.emit("error", "Unauthorized: Invalid token");
      }
      if (!decoded) return socket.emit("error", "Unauthorized");

      // Update DB and return updated bus
      const updatedBus = await Bus.findByIdAndUpdate(
        busId,
        { currentLocation: { lat, lng, updatedAt: new Date() } },
        { new: true }
      );

      if (!updatedBus) return socket.emit("error", "Bus not found");

      // Broadcast only to passengers in that bus room
      io.to(`bus_${busId}`).emit(
        "busLocationUpdate",
        updatedBus.currentLocation
      );
    } catch (err) {
      console.error("❌ Error updating bus location:", err.message);
      socket.emit("error", "Server error while updating location");
    }
  });

  socket.on("disconnect", () => {
    console.log("❌ Client disconnected:", socket.id);
  });
});

// ============================
// Routes
// ============================
app.use("/api/passengers", PassengerRoutes);
app.use("/api/bus/auth", BusAuthRoutes);
app.use("/api", DriverRoutes);

// Save passenger search
app.post("/api/location", async (req, res) => {
  try {
    const { source, destination } = req.body;
    if (!source || !destination) {
      return res
        .status(400)
        .json({ success: false, message: "Source and Destination required" });
    }

    const newLocation = new Location({ source, destination });
    await newLocation.save();

    res.status(201).json({
      success: true,
      message: "Location saved successfully!",
      data: newLocation,
    });
  } catch (error) {
    console.error("❌ Error saving location:", error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// Fetch latest location + coords
app.get("/api/locations", async (req, res) => {
  try {
    const locations = await Location.find();
    if (!locations.length) {
      return res
        .status(404)
        .json({ success: false, message: "No locations found" });
    }

    const latest = locations[locations.length - 1];

    let response1, response2;
    try {
      [response1, response2] = await Promise.all([
        geocodingClient
          .forwardGeocode({ query: latest.source, limit: 1 })
          .send(),
        geocodingClient
          .forwardGeocode({ query: latest.destination, limit: 1 })
          .send(),
      ]);
    } catch (geoErr) {
      console.error("❌ Geocoding API failed:", geoErr.message);
      return res
        .status(500)
        .json({ success: false, message: "Geocoding service unavailable" });
    }

    if (!response1.body.features.length || !response2.body.features.length) {
      return res.status(404).json({
        success: false,
        message: "No route found! Please check locations.",
      });
    }

    res.json({
      success: true,
      latest,
      sourceCoords: response1.body.features[0].geometry,
      destCoords: response2.body.features[0].geometry,
    });
  } catch (err) {
    console.error("❌ Geocoding error:", err.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// ============================
// Start server
// ============================
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
