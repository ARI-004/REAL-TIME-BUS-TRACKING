// server.js
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import morgan from "morgan";
import { createServer } from "http";
import { Server as IOServer } from "socket.io";

// Models
import Driver from "./models/Driver.js";

// Routes
import driverRoutes from "./routes/driverRoutes.js";
import depotRoutes from "./routes/depotRoutes.js";
import busRoutes from "./routes/busRoutes.js";

// --- Load env vars ---
dotenv.config();

const app = express();

// --- Middleware ---
app.use(express.json());
app.use(cors({ origin: "*" })); // ⚠️ restrict in production
app.use(morgan("combined"));

// --- MongoDB ---
const MONGO_URI =
  process.env.MONGO_URI ||
  "mongodb://localhost:27017/transport";

mongoose
  .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("🗄 MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connect error:", err));

// --- HTTP + Socket.IO ---
const httpServer = createServer(app);
const io = new IOServer(httpServer, {
  cors: { origin: "*" },
});

// --- Socket.IO logic ---
io.on("connection", (socket) => {
  console.log("⚡ Passenger/Driver connected:", socket.id);

  // Passenger subscribes to a bus room
  socket.on("joinBusRoom", (busId) => {
    if (!busId) return;
    const roomName = `bus_${busId}`;
    socket.join(roomName);
    console.log(`✅ Passenger joined ${roomName}`);
  });

  // Passenger leaves a bus room
  socket.on("leaveBusRoom", (busId) => {
    if (!busId) return;
    const roomName = `bus_${busId}`;
    socket.leave(roomName);
    console.log(`👋 Passenger left ${roomName}`);
  });

  // Driver sends live location
  socket.on("driverLocation", async (payload) => {
    try {
      const { driverId, lat, lng } = payload || {};
      if (!driverId || lat == null || lng == null) {
        console.warn("⚠️ driverLocation missing fields", payload);
        return;
      }

      // Update DB
      const driver = await Driver.findByIdAndUpdate(
        driverId,
        { lastLocation: { lat, lng, timestamp: new Date() } },
        { new: true }
      );

      if (!driver) {
        console.warn("❌ driverLocation: driver not found", driverId);
        return;
      }

      // Emit only to passengers subscribed to this bus room
      const roomName = `bus_${driverId}`;
      console.log(`📡 [socket] emitting busLocation -> ${roomName}`, { lat, lng });
      io.to(roomName).emit("busLocation", {
        busId: driverId,
        busNumber: driver.busNumber,
        lat,
        lng,
        timestamp: driver.lastLocation.timestamp,
      });
    } catch (e) {
      console.error("❌ Error in driverLocation handler:", e);
    }
  });

  socket.on("disconnect", () => {
    console.log("🔴 Client disconnected:", socket.id);
  });
});

// --- API Routes ---
app.use("/api/driver", driverRoutes);
app.use("/api/depot", depotRoutes);
app.use("/api/bus", busRoutes);

// --- Error handling middleware ---
app.use((err, req, res, next) => {
  console.error("🔥 Server Error:", err.stack);
  res.status(500).json({
    success: false,
    message: "Something went wrong!",
    error: process.env.NODE_ENV === "development" ? err.message : {},
  });
});

// --- 404 handler ---
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// --- Start Server ---
const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => {
  console.log(`🚍 Backend + Socket running at http://localhost:${PORT}`);
});
