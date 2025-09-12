/** @format */
import React, { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import "./MapView.css";

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;

export default function MapView({ routeData }) {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [tripInfo, setTripInfo] = useState(null);

  useEffect(() => {
    if (map.current) return;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [87.5, 22.8],
      zoom: 6,
    });

    map.current.addControl(new mapboxgl.NavigationControl(), "top-right");
  }, []);

  // Remove old route safely
  const removeOldRoute = () => {
    try {
      if (map.current.getLayer("route")) map.current.removeLayer("route");
      if (map.current.getSource("route")) map.current.removeSource("route");
    } catch (err) {
      console.warn("⚠️ Error removing old route:", err);
    }
  };

  useEffect(() => {
    if (!routeData || !map.current) return;

    const sourceCoords = routeData?.sourceCoords?.coordinates;
    const destCoords = routeData?.destCoords?.coordinates;

    if (!sourceCoords || !destCoords) return;

    // Remove old markers
    document.querySelectorAll(".mapboxgl-marker").forEach((m) => m.remove());

    // Add source & destination markers
    new mapboxgl.Marker({ color: "green" })
      .setLngLat(sourceCoords)
      .setPopup(
        new mapboxgl.Popup().setHTML(
          `<b>Source: ${routeData.latest.source}</b>`
        )
      )
      .addTo(map.current);

    new mapboxgl.Marker({ color: "red" })
      .setLngLat(destCoords)
      .setPopup(
        new mapboxgl.Popup().setHTML(
          `<b>Destination: ${routeData.latest.destination}</b>`
        )
      )
      .addTo(map.current);

    const fetchRoute = async () => {
      try {
        const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${sourceCoords[0]},${sourceCoords[1]};${destCoords[0]},${destCoords[1]}?geometries=geojson&overview=full&access_token=${mapboxgl.accessToken}`;
        const res = await fetch(url);
        const data = await res.json();

        if (!data.routes || data.routes.length === 0) {
          console.warn("⚠️ No route found. Showing only markers.");
          setTripInfo(null);
          return;
        }

        const route = data.routes[0].geometry;
        const distanceKm = (data.routes[0].distance / 1000).toFixed(2);
        const durationMin = Math.round(data.routes[0].duration / 60);

        // Remove old route first
        removeOldRoute();

        // Add new route
        map.current.addSource("route", {
          type: "geojson",
          data: { type: "Feature", geometry: route },
        });

        map.current.addLayer({
          id: "route",
          type: "line",
          source: "route",
          layout: { "line-join": "round", "line-cap": "round" },
          paint: { "line-color": "#007bff", "line-width": 4 },
        });

        // Fit map to route
        const bounds = new mapboxgl.LngLatBounds();
        route.coordinates.forEach((coord) => bounds.extend(coord));
        map.current.fitBounds(bounds, { padding: 40 });

        // Update trip info after route is added
        setTripInfo({ distance: distanceKm, duration: durationMin });
      } catch (err) {
        console.error("❌ Error fetching route:", err);
        setTripInfo(null);
      }
    };

    fetchRoute();
  }, [routeData]);

  return (
    <div className="map-wrapper">
      <div
        className="map-container"
        ref={mapContainer}
        style={{ height: "450px", borderRadius: "8px" }} // 👈 Fix map height inside card
      ></div>

      {tripInfo && (
        <div className="trip-info">
          <p>
            🚗 <b>Distance:</b> {tripInfo.distance} km
          </p>
          <p>
            ⏱️ <b>ETA:</b> {tripInfo.duration} min
          </p>
        </div>
      )}
    </div>
  );
}
