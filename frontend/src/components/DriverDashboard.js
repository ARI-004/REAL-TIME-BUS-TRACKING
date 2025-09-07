import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function DriverDashboard() {
  const navigate = useNavigate();
  const driverId = localStorage.getItem("driverId");
  const registrationNo = localStorage.getItem("registrationNo");
  const [stops, setStops] = useState([]);

  // Helper: normalize actualArrival to "HH:MM" for <input type="time">
  const formatTimeForInput = (val) => {
    if (!val) return "";
    // if already "HH:MM"
    if (typeof val === "string" && /^\d{2}:\d{2}$/.test(val)) return val;
    // try parse ISO / Date-like values
    const d = new Date(val);
    if (!isNaN(d)) {
      const hh = String(d.getHours()).padStart(2, "0");
      const mm = String(d.getMinutes()).padStart(2, "0");
      return `${hh}:${mm}`;
    }
    return "";
  };

  useEffect(() => {
    if (!driverId) {
      navigate("/login");
      return;
    }
    // Load stops from backend
    const loadStops = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/driver/stops/${driverId}`);
        const data = await res.json();
        if (res.ok) {
          const normalized = (data.stops || []).map((s) => ({
            stopName: s.stopName || "",
            actualArrival: formatTimeForInput(s.actualArrival),
          }));
          setStops(normalized);
        } else {
          console.error("Failed to fetch stops:", data);
        }
      } catch (err) {
        console.error("Error fetching stops:", err);
      }
    };

    loadStops();

    // Live location watcher (optional; sends periodic updates)
    let watchId = null;
    if ("geolocation" in navigator) {
      watchId = navigator.geolocation.watchPosition(
        async (pos) => {
          const { latitude, longitude } = pos.coords;
          try {
            await fetch("http://localhost:5000/api/driver/updateLocation", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ driverId, lat: latitude, lng: longitude }),
            });
          } catch (err) {
            console.error("Location update failed", err);
          }
        },
        (err) => console.error("Geolocation error:", err),
        { enableHighAccuracy: true }
      );
    } else {
      console.warn("Geolocation not supported by this browser");
    }

    return () => {
      if (watchId !== null) navigator.geolocation.clearWatch(watchId);
    };
  }, [driverId, navigate]);

  // Edit a field (stopName or actualArrival)
  const handleStopChange = (index, field, value) => {
    const copy = [...stops];
    copy[index] = { ...copy[index], [field]: value };
    setStops(copy);
  };

  // Add an empty stop row (driver can fill name + time)
  const addStop = () => {
    setStops([...stops, { stopName: "", actualArrival: "" }]);
  };

  // Remove a stop row
  const removeStop = (index) => {
    setStops(stops.filter((_, i) => i !== index));
  };

  // Save stops to backend (PUT /updateStops/:driverId)
  const saveStops = async () => {
    if (!driverId) {
      alert("Driver not logged in");
      navigate("/login");
      return;
    }

    try {
      const res = await fetch(`http://localhost:5000/api/driver/updateStops/${driverId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stops }),
      });

      const data = await res.json();
      if (res.ok) {
        // normalize returned stops for input fields
        const normalized = (data.stops || []).map((s) => ({
          stopName: s.stopName || "",
          actualArrival: formatTimeForInput(s.actualArrival),
        }));
        setStops(normalized);
        alert("✅ Stops updated successfully");
      } else {
        console.error("Failed to update stops:", data);
        alert(data.error || "❌ Failed to update stops");
      }
    } catch (err) {
      console.error("Error saving stops:", err);
      alert("❌ Error saving stops");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("driverId");
    navigate("/login");
  };

  return (
    <div className="p-6 max-w-xl mx-auto bg-gradient-to-r from-green-100 to-teal-200 shadow-lg rounded-xl">
      <h2 className="text-2xl font-bold mb-4 text-center">Welcome {registrationNo}</h2>

      {/* Stops list (name + time) */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-lg font-semibold">Stops</h3>
          <button
            onClick={addStop}
            className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
          >
            ➕ Add Stop
          </button>
        </div>

        {stops.length === 0 && (
          <p className="text-sm text-gray-600 mb-2">No stops yet. Click “Add Stop” to create one.</p>
        )}

        {stops.map((stop, index) => (
          <div key={index} className="flex gap-2 mb-2 items-center">
            <input
              type="text"
              placeholder="Stop name"
              value={stop.stopName}
              onChange={(e) => handleStopChange(index, "stopName", e.target.value)}
              className="flex-1 p-2 border rounded"
            />
            <input
              type="time"
              placeholder="Arrival time"
              value={stop.actualArrival || ""}
              onChange={(e) => handleStopChange(index, "actualArrival", e.target.value)}
              className="w-36 p-2 border rounded"
            />
            <button
              onClick={() => removeStop(index)}
              className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
            >
              ❌
            </button>
          </div>
        ))}
      </div>

      <button
        onClick={saveStops}
        className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 mb-3"
      >
        💾 Save Stops
      </button>

      <button
        onClick={handleLogout}
        className="w-full bg-gray-600 text-white py-2 rounded-lg hover:bg-gray-700"
      >
        🚪 Logout
      </button>
    </div>
  );
}

export default DriverDashboard;
