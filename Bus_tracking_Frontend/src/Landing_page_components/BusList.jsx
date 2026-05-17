/** @format */
import React from "react";
import { useNavigate } from "react-router-dom";
import "./BusList.css";

export default function BusList({ buses }) {
  const navigate = useNavigate();

  if (!buses || buses.length === 0) {
    return <p className="no-bus">No buses found for this route.</p>;
  }

  return (
    <div className="bus-list-container">
      <div className="bus-list">
        {buses.map((bus) => {
          // ✅ Get current stop = last stop reached (based on actualArrival timing)
          let currentStop = "Not Started";
          let currentTime = "--:--";

          if (bus.routeStops && bus.routeStops.length > 0) {
            const lastStop = bus.routeStops[bus.routeStops.length - 1];
            currentStop = lastStop.stopName;
            currentTime = lastStop.actualArrival;
          }

          return (
            <div
              key={bus._id}
              className="bus-card clickable"
              onClick={() => navigate(`/bus/${bus._id}`)} // ✅ navigate with bus ID
            >
              {/* Left side - Details */}
              <div className="bus-info">
                <h3 className="bus-title">{bus.busNumber}</h3>
                <p>
                  <strong>Reg No:</strong> {bus.registrationNo}
                </p>
                <p>
                  <strong>Route:</strong> {bus.route}
                </p>
                <p className="stops">
                  <strong>Stops:</strong>{" "}
                  {bus.routeStops.map((stop) => stop.stopName).join(" → ")}
                </p>
              </div>

              {/* Right side - Current Stop & Timing */}
              <div className="bus-meta">
                <p>
                  <strong>📍 Current Stop:</strong> {currentStop}
                </p>
                <p>
                  <strong>🕒 Timing:</strong> {currentTime}
                </p>
                <button className="track-btn">Track Bus</button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
