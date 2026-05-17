/** @format */
import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import mapboxgl from "mapbox-gl";
import { io } from "socket.io-client";
import axios from "axios";
import "./BusDetails.css";

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;

export default function BusDetails() {
  const { id } = useParams();
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);

  const passengerMarkerRef = useRef(null);
  const busMarkerRef = useRef(null);

  const [passengerCoords, setPassengerCoords] = useState(null);
  const [distance, setDistance] = useState(null);
  const [duration, setDuration] = useState(null);
  const [busInfo, setBusInfo] = useState(null);

  const [mapLoaded, setMapLoaded] = useState(false);
  const socket = useRef(null);

  // ==========================
  // Helper: calculate delay
  // ==========================
  function calculateDelay(plannedArrival, actualArrival) {
    console.log("Planned:", plannedArrival, "Actual:", actualArrival);

    if (!plannedArrival || !actualArrival) return null;

    const [ph, pm] = plannedArrival.split(":").map(Number);
    const planned = ph * 60 + pm;

    const [ah, am] = actualArrival.split(":").map(Number);
    const actual = ah * 60 + am;

    return actual - planned;
  }

  // ==========================
  // Setup map
  // ==========================
  useEffect(() => {
    if (!mapContainerRef.current) return;

    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [87.30175, 22.344173],
      zoom: 13,
    });

    mapRef.current.on("load", () => {
      console.log("✅ Map style is fully loaded");
      setMapLoaded(true);
    });
  }, []);

  // ==========================
  // Fetch bus details
  // ==========================
  useEffect(() => {
    if (!id) return;
    const fetchBusDetails = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/buses/${id}`);
        setBusInfo(res.data);
      } catch (err) {
        console.error("Error fetching bus details:", err);
      }
    };
    fetchBusDetails();
  }, [id]);

  // ==========================
  // Watch passenger location
  // ==========================
  useEffect(() => {
    if (!mapRef.current) return;
    let watchId = null;

    if ("geolocation" in navigator) {
      watchId = navigator.geolocation.watchPosition(
        (pos) => {
          const coords = [pos.coords.longitude, pos.coords.latitude];
          setPassengerCoords(coords);

          if (!passengerMarkerRef.current) {
            passengerMarkerRef.current = new mapboxgl.Marker({ color: "blue" })
              .setLngLat(coords)
              .addTo(mapRef.current);
          } else {
            passengerMarkerRef.current.setLngLat(coords);
          }
        },
        (err) => console.error("Passenger geolocation error:", err),
        { enableHighAccuracy: true }
      );
    }

    return () => {
      if (watchId) navigator.geolocation.clearWatch(watchId);
    };
  }, []);

  // ==========================
  // Listen for bus updates
  // ==========================
  useEffect(() => {
    if (!id) return;

    socket.current = io("http://localhost:5000");
    socket.current.emit("joinBusRoom", id);

    // 🔴 Live bus location
    socket.current.on("busLocationUpdate", ({ lat, lng, stops }) => {
      const busCoords = [lng, lat];

      if (!busMarkerRef.current) {
        busMarkerRef.current = new mapboxgl.Marker({ color: "red" })
          .setLngLat(busCoords)
          .addTo(mapRef.current);
      } else {
        busMarkerRef.current.setLngLat(busCoords);
      }

      if (passengerCoords && mapLoaded) {
        drawRoute(busCoords, passengerCoords);
      }

      if (stops) {
        setBusInfo((prev) => ({
          ...prev,
          routeStops: stops,
        }));
      }
    });

    // 🔴 Stops update
    socket.current.on("busStopsUpdate", (data) => {
      setBusInfo((prev) => ({
        ...prev,
        routeStops: data.routeStops,
        currentLocation: data.currentLocation || prev?.currentLocation,
      }));
    });

    return () => {
      if (socket.current) {
        socket.current.emit("leaveBusRoom", id);
        socket.current.disconnect();
      }
    };
  }, [id, passengerCoords, mapLoaded]);

  // ==========================
  // Draw route
  // ==========================
  const drawRoute = async (busCoords, passengerCoords) => {
    if (!mapRef.current || !mapLoaded) return;

    const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${busCoords[0]},${busCoords[1]};${passengerCoords[0]},${passengerCoords[1]}?geometries=geojson&overview=full&access_token=${mapboxgl.accessToken}`;

    try {
      const res = await fetch(url);
      const data = await res.json();

      if (!data.routes || !data.routes[0]) return;

      const route = data.routes[0].geometry.coordinates;
      setDistance((data.routes[0].distance / 1000).toFixed(2));
      setDuration(Math.ceil(data.routes[0].duration / 60));

      if (mapRef.current.getSource("route")) {
        if (mapRef.current.getLayer("route")) {
          mapRef.current.removeLayer("route");
        }
        mapRef.current.removeSource("route");
      }

      mapRef.current.addSource("route", {
        type: "geojson",
        data: {
          type: "Feature",
          geometry: { type: "LineString", coordinates: route },
        },
      });

      mapRef.current.addLayer({
        id: "route",
        type: "line",
        source: "route",
        layout: { "line-join": "round", "line-cap": "round" },
        paint: { "line-color": "#2563eb", "line-width": 5 },
      });

      const bounds = new mapboxgl.LngLatBounds();
      route.forEach((c) => bounds.extend(c));
      mapRef.current.fitBounds(bounds, { padding: 50 });
    } catch (err) {
      console.error("❌ Error fetching route:", err);
    }
  };

  // ==========================
  // Render
  // ==========================
  return (
    <div className="bus-details">
      <div ref={mapContainerRef} className="map-container" />

      <div className="info-panel">
        {busInfo ? (
          <>
            <h2 className="bus-heading">🚌 {busInfo.busNumber}</h2>

            <div className="bus-info">
              <p>
                <b>Registration No:</b> {busInfo.registrationNo}
              </p>
              <p>
                <b>Route:</b> {busInfo.route}
              </p>
            </div>

            <h3 className="timeline-title">📍 Stops Timeline</h3>
            <div className="timeline">
              {busInfo.routeStops?.map((stop, idx) => {
                const planned = stop.plannedArrival || "--:--";
                const actual = stop.actualArrival || "—";

                let status = "Pending";
                let isCurrent = false;
                let delay = null;

                if (busInfo?.currentLocation === stop.stopName) {
                  status = "Current";
                  isCurrent = true;
                } else if (stop.actualArrival) {
                  status = "Arrived";
                  delay = calculateDelay(
                    stop.plannedArrival,
                    stop.actualArrival
                  );
                }

                return (
                  <div
                    key={idx}
                    className={`timeline-step ${isCurrent ? "current" : ""}`}
                  >
                    <div className="timeline-dot" />
                    <div className="timeline-card">
                      <div className="step-header">
                        <span className="stop-name">{stop.stopName}</span>
                        <span
                          className={`status-tag ${
                            status === "Arrived"
                              ? delay > 0
                                ? "late"
                                : delay < 0
                                ? "early"
                                : "ontime"
                              : status === "Current"
                              ? "ongoing"
                              : "pending"
                          }`}
                        >
                          {status === "Arrived"
                            ? delay === 0
                              ? "On Time"
                              : delay > 0
                              ? `+${delay} min Late`
                              : `${Math.abs(delay)} min Early`
                            : status === "Current"
                            ? "Ongoing"
                            : "Pending"}
                        </span>
                      </div>
                      <div className="step-times">
                        <p>
                          Planned: <b>{planned}</b>
                        </p>
                        <p>
                          Actual: <b>{actual}</b>
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        ) : (
          <p>Loading bus details...</p>
        )}

        {distance && duration ? (
          <p className="mt-2">
            Distance: <b>{distance} km</b> | ETA: <b>{duration} mins</b>
          </p>
        ) : (
          <p>Waiting for live updates...</p>
        )}
      </div>
    </div>
  );
}
