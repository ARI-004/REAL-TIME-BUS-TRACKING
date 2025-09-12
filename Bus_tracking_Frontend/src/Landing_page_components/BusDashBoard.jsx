/** @format */
import React, { useState, useEffect, useRef } from "react";
import io from "socket.io-client";
import axios from "axios";
import mapboxgl from "mapbox-gl";
import "./BusDashboard.css";

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;
const socket = io("http://localhost:5000", {
  transports: ["websocket"], // force WebSocket
  reconnection: true,
});

socket.on("connect_error", (err) => {
  console.error("❌ Socket connection error:", err.message);
});

function BusDashboard() {
  const [location, setLocation] = useState({ lat: 0, lng: 0 });
  const [sharing, setSharing] = useState(false);
  const [stops, setStops] = useState([{ stopName: "", actualArrival: "" }]);

  const mapContainer = useRef(null);
  const map = useRef(null);
  const marker = useRef(null);

  const busId = localStorage.getItem("busId");
  const token = localStorage.getItem("token");

  // Initialize Map
  useEffect(() => {
    if (map.current) return;
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: [88.3639, 22.5726], // default (Kolkata)
      zoom: 12,
    });

    marker.current = new mapboxgl.Marker({ color: "#e63946" })
      .setLngLat([88.3639, 22.5726])
      .addTo(map.current);
  }, []);

  // Watch GPS location
  useEffect(() => {
    let watchId = null;

    if (sharing) {
      // ✅ join socket room for this bus
      socket.emit("joinBusRoom", busId);

      watchId = navigator.geolocation.watchPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocation({ lat: latitude, lng: longitude });

          if (map.current) {
            map.current.setCenter([longitude, latitude]);
            marker.current.setLngLat([longitude, latitude]);
          }

          socket.emit("updateBusLocation", {
            busId,
            lat: latitude,
            lng: longitude,
            token,
          });
        },
        (err) => console.error("Geolocation error:", err),
        { enableHighAccuracy: true }
      );
    } else {
      socket.emit("leaveBusRoom", busId);
    }

    return () => {
      if (watchId) navigator.geolocation.clearWatch(watchId);
    };
  }, [sharing, busId, token]);

  // Add new stop input
  const addStop = () =>
    setStops([...stops, { stopName: "", actualArrival: "" }]);

  // Remove stop
  const removeStop = (index) => {
    const updated = [...stops];
    updated.splice(index, 1);
    setStops(updated);
  };

  // Handle input change
  const handleChange = (index, field, value) => {
    const updated = [...stops];
    updated[index][field] = value;
    setStops(updated);
  };

  // Submit stops to backend
  const handleSubmitStops = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`http://localhost:5000/api/bus/${busId}/route`, {
        routeStops: stops,
      });
      alert("✅ Route stops saved successfully!");
    } catch (err) {
      console.error(err);
      alert("❌ Error saving stops");
    }
  };

  return (
    <div className="bus-dashboard">
      <h2 className="title">🚌 Bus Dashboard</h2>

      {/* Status */}
      <div className="status">
        <div className={`status-dot ${sharing ? "active" : "inactive"}`}></div>
        <span>{sharing ? "Live Sharing On" : "Offline"}</span>
      </div>

      {/* Location */}
      <div className="location-info">
        <p>📍 Latitude: {location.lat.toFixed(6)}</p>
        <p>📍 Longitude: {location.lng.toFixed(6)}</p>
      </div>

      {/* Map */}
      <div ref={mapContainer} className="map-container"></div>

      {/* Route Stops Form */}
      <form onSubmit={handleSubmitStops} className="stops-form">
        <h3>🛑 Enter Route Stops & Timings</h3>
        {stops.map((stop, index) => (
          <div key={index} className="stop-row">
            <input
              type="text"
              placeholder="Stop Name"
              value={stop.stopName}
              onChange={(e) => handleChange(index, "stopName", e.target.value)}
              required
            />
            <input
              type="time"
              value={stop.actualArrival}
              onChange={(e) =>
                handleChange(index, "actualArrival", e.target.value)
              }
              required
            />
            {index > 0 && (
              <button
                type="button"
                className="remove-btn"
                onClick={() => removeStop(index)}
              >
                ❌
              </button>
            )}
          </div>
        ))}
        <div className="form-actions">
          <button type="button" onClick={addStop}>
            ➕ Add Stop
          </button>
          <button type="submit">💾 Save Route</button>
        </div>
      </form>

      {/* Share Live Location */}
      <button
        onClick={() => setSharing(!sharing)}
        className={`share-btn ${sharing ? "stop" : "start"}`}
      >
        {sharing ? "⏹ Stop Sharing Location" : "📡 Start Sharing Location"}
      </button>
    </div>
  );
}

export default BusDashboard;
