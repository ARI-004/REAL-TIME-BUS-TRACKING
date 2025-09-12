/** @format */
import express from "express";
import Bus from "../models/bus.js";

const router = express.Router();

// ============================
// Utility: Haversine distance in km
// ============================
function haversine(lat1, lon1, lat2, lon2) {
  const R = 6371; // km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // km
}

// Convert "HH:mm" to Date today
function parsePlannedTime(timeStr) {
  const [h, m] = timeStr.split(":").map(Number);
  const d = new Date();
  d.setHours(h, m, 0, 0);
  return d;
}

// ============================
// 🔹 Find buses between source & destination
// ============================
router.post("/available-buses", async (req, res) => {
  let { source, destination } = req.body;
  if (!source || !destination)
    return res.status(400).json({ error: "Source and destination required" });

  source = source.trim().toLowerCase();
  destination = destination.trim().toLowerCase();

  try {
    const buses = await Bus.find({});

    const validBuses = buses.filter((bus) => {
      const stops = bus.routeStops.map((s) => s.stopName.trim().toLowerCase());
      const srcIndex = stops.indexOf(source);
      const destIndex = stops.indexOf(destination);
      return srcIndex !== -1 && destIndex !== -1 && srcIndex < destIndex;
    });

    res.json(
      validBuses.map((bus) => ({
        _id: bus._id,
        busNumber: bus.busNumber,
        registrationNo: bus.registrationNo,
        route: bus.route,
        routeStops: bus.routeStops,
        currentLocation: bus.currentLocation || null,
      }))
    );
  } catch (err) {
    console.error("Error fetching buses:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// ============================
// 🔹 Get single bus details
// ============================
router.get("/buses/:id", async (req, res) => {
  try {
    const bus = await Bus.findById(req.params.id);
    if (!bus) return res.status(404).json({ error: "Bus not found" });
    res.json(bus);
  } catch (err) {
    console.error("Error fetching bus:", err.message);
    res.status(500).json({ error: "Server error" });
  }
});

// ============================
// 🔹 Save planned bus route stops
// ============================
router.post("/bus/:id/route", async (req, res) => {
  try {
    const { id } = req.params;
    let { routeStops } = req.body;

    if (!routeStops || !Array.isArray(routeStops)) {
      return res.status(400).json({ error: "Invalid routeStops data" });
    }

    const bus = await Bus.findById(id);
    if (!bus) return res.status(404).json({ error: "Bus not found" });

    // normalize stops (driver gives only stopName + plannedArrival + lat/lng)
    bus.routeStops = routeStops.map((s) => ({
      stopName: s.stopName?.trim(),
      plannedArrival: s.plannedArrival || null,
      actualArrival: null,
      status: "pending",
      delay: 0,
      lat: s.lat ? Number(s.lat) : null,
      lng: s.lng ? Number(s.lng) : null,
    }));

    await bus.save();

    res.json({ message: "✅ Route stops saved", bus });
  } catch (err) {
    console.error("Error saving route:", err.message);
    res.status(500).json({ error: "Server error" });
  }
});

// ============================
// 🔹 Update bus location + auto mark arrivals
// ============================
router.post("/buses/:id/location", async (req, res) => {
  try {
    const { lat, lng } = req.body;
    if (!lat || !lng)
      return res.status(400).json({ error: "lat & lng required" });

    const bus = await Bus.findById(req.params.id);
    if (!bus) return res.status(404).json({ error: "Bus not found" });

    const latNum = Number(lat);
    const lngNum = Number(lng);
    const now = new Date();

    // update live location
    bus.currentLocation = { lat: latNum, lng: lngNum, updatedAt: now };

    const THRESHOLD_KM = 0.3; // 300m → bus considered arrived

    let nearestStop = null;
    let nearestDist = Infinity;

    bus.routeStops.forEach((stop) => {
      if (stop.lat && stop.lng) {
        const dist = haversine(latNum, lngNum, stop.lat, stop.lng);
        console.log(
          `🚌 Bus(${latNum},${lngNum}) vs Stop ${stop.stopName}(${stop.lat},${
            stop.lng
          }) = ${dist.toFixed(3)} km`
        );

        // ✅ Mark as arrived
        if (dist <= THRESHOLD_KM && stop.status === "pending") {
          stop.actualArrival = now.toLocaleTimeString("en-GB", {
            hour: "2-digit",
            minute: "2-digit",
          });
          if (stop.plannedArrival) {
            const planned = parsePlannedTime(stop.plannedArrival);
            const diff = Math.round((now - planned) / 60000);
            stop.delay = diff;
            if (diff > 0) stop.status = `Late by ${diff} min`;
            else if (diff < 0) stop.status = `${Math.abs(diff)} min Early`;
            else stop.status = "On Time";
          } else {
            stop.status = "Arrived";
          }
        }

        // find nearest upcoming stop
        if (stop.status === "pending" && dist < nearestDist) {
          nearestStop = stop;
          nearestDist = dist;
        }
      }
    });

    // reset old "current" and set new nearest as "current"
    bus.routeStops.forEach((s) => {
      if (s.status === "current") s.status = "pending";
    });
    if (nearestStop && nearestStop.status === "pending")
      nearestStop.status = "current";

    await bus.save();

    if (req.io) {
      req.io.to(`bus_${bus._id}`).emit("busLocationUpdate", {
        lat: latNum,
        lng: lngNum,
        stops: bus.routeStops,
      });
    }

    res.json({ success: true, bus });
  } catch (err) {
    console.error("Error updating bus location:", err.message);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
