import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import io from "socket.io-client";

const socket = io("http://localhost:5000");

function DriverDashboard() {
  const navigate = useNavigate();
  const driverId = localStorage.getItem("driverId");
  const registrationNo = localStorage.getItem("registrationNo");
  const [stops, setStops] = useState([]);

  const formatTimeForInput = (val) => {
    if (!val) return "";
    if (typeof val === "string" && /^\d{2}:\d{2}$/.test(val)) return val;
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
      navigate("/driver/login");
      return;
    }

    socket.emit("joinBusRoom", driverId);

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
        }
      } catch (err) {
        console.error("Error fetching stops:", err);
      }
    };
    loadStops();

    let watchId = null;
    if ("geolocation" in navigator) {
      watchId = navigator.geolocation.watchPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          socket.emit("driverLocation", {
            driverId,
            lat: latitude,
            lng: longitude,
          });
        },
        (err) => console.error("Geolocation error:", err),
        { enableHighAccuracy: true }
      );
    }

    return () => {
      if (watchId !== null) navigator.geolocation.clearWatch(watchId);
      socket.emit("leaveBusRoom", driverId);
    };
  }, [driverId, navigate]);

  const handleStopChange = (index, field, value) => {
    const copy = [...stops];
    copy[index] = { ...copy[index], [field]: value };
    setStops(copy);
  };

  const addStop = () =>
    setStops([...stops, { stopName: "", actualArrival: "" }]);

  const removeStop = (index) => setStops(stops.filter((_, i) => i !== index));

  const saveStops = async () => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/driver/updateStops/${driverId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ stops }),
        }
      );

      const data = await res.json();
      if (res.ok) {
        const normalized = (data.stops || []).map((s) => ({
          stopName: s.stopName || "",
          actualArrival: formatTimeForInput(s.actualArrival),
        }));
        setStops(normalized);
        alert("✅ Stops updated successfully");

        socket.emit("stopsUpdated", { driverId, stops: normalized });
      } else {
        alert(data.error || "❌ Failed to update stops");
      }
    } catch (err) {
      console.error("Error saving stops:", err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("driverId");
    localStorage.removeItem("registrationNo");
    socket.emit("leaveBusRoom", driverId);
    navigate("/driver/login");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-green-100 to-teal-200 p-6">
      <div className="w-full  bg-white  p-8">
        <h2 className="text-2xl font-bold text-center mb-6">
          🚌 Welcome <span className="text-indigo-600">{registrationNo}</span>
        </h2>

        {/* Stops list */}
        <div className="space-y-3 mb-6">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-lg font-semibold">Stops</h3>
            <button
              onClick={addStop}
              className="bg-blue-500 text-white px-3 py-1 rounded-lg hover:bg-blue-600"
            >
              ➕ Add Stop
            </button>
          </div>

          {stops.length === 0 && (
            <p className="text-sm text-gray-600">
              No stops yet. Click “Add Stop” to create one.
            </p>
          )}

          {stops.map((stop, index) => (
            <div key={index} className="flex gap-2 items-center">
              <input
                type="text"
                placeholder="Stop name"
                value={stop.stopName}
                onChange={(e) =>
                  handleStopChange(index, "stopName", e.target.value)
                }
                className="flex-1 p-2 border rounded-lg focus:ring-2 focus:ring-blue-400"
              />
              <input
                type="time"
                value={stop.actualArrival || ""}
                onChange={(e) =>
                  handleStopChange(index, "actualArrival", e.target.value)
                }
                className="w-32 p-2 border rounded-lg focus:ring-2 focus:ring-blue-400"
              />
              <button
                onClick={() => removeStop(index)}
                className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600"
              >
                ❌
              </button>
            </div>
          ))}
        </div>

        <button
          onClick={saveStops}
          className="w-full bg-green-500 text-white py-3 rounded-lg hover:bg-green-600 mb-3"
        >
          💾 Save Stops
        </button>

        <button
          onClick={handleLogout}
          className="w-full bg-gray-600 text-white py-3 rounded-lg hover:bg-gray-700"
        >
          🚪 Logout
        </button>
      </div>
    </div>
  );
}

export default DriverDashboard;
