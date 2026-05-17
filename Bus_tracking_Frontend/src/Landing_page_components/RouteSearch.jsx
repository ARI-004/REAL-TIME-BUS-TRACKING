/** @format */
import React, { useState } from "react";
import {
  ArrowsUpDownIcon,
  ArrowsRightLeftIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";
import MapView from "./MapView";
import BusList from "./BusList";

function RouteSearch() {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [routeData, setRouteData] = useState(null);
  const [buses, setBuses] = useState([]);
  const [loading, setLoading] = useState(false);

  // Swap From ↔ To
  const handleSwap = () => {
    setFrom(to);
    setTo(from);
  };

  // Search Route + Buses
  const handleSearch = async () => {
    if (!from || !to) {
      alert("⚠️ Please enter both From and To locations");
      return;
    }

    try {
      setLoading(true);
      setRouteData(null);
      setBuses([]);

      // Step 1: Save passenger search
      await fetch("http://localhost:5000/api/location", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ source: from, destination: to }),
      });

      // Step 2: Fetch latest coords for Map
      const res = await fetch("http://localhost:5000/api/locations");
      const data = await res.json();

      if (data?.sourceCoords && data?.destCoords) {
        setRouteData(data);
      } else {
        alert("⚠️ No route found! Please check locations.");
      }

      // Step 3: Fetch available buses
      const busRes = await fetch("http://localhost:5000/api/available-buses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ source: from, destination: to }),
      });

      const busData = await busRes.json();
      setBuses(busData || []);
    } catch (err) {
      console.error("❌ Error fetching route:", err);
      alert("Error fetching route");
    } finally {
      setLoading(false);
    }
  };

  // Allow Enter key press
  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSearch();
  };

  return (
    <section className="w-full bg-gradient-to-r from-blue-100 via-indigo-100 to-purple-100 py-12">
      <div className="w-full max-w-3xl mx-auto bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6">
        <h2 className="text-2xl font-bold text-center text-blue-900 mb-6">
          Search Your Route
        </h2>

        <div className="flex flex-col md:flex-row items-center gap-4">
          {/* From */}
          <input
            type="text"
            placeholder="From"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          {/* Swap Button */}
          <button
            onClick={handleSwap}
            className="p-3 rounded-full bg-gray-100 shadow hover:bg-gray-200 transition"
            aria-label="Swap From and To"
          >
            <span className="block md:hidden">
              <ArrowsUpDownIcon className="h-6 w-6 text-blue-600" />
            </span>
            <span className="hidden md:block">
              <ArrowsRightLeftIcon className="h-6 w-6 text-blue-600" />
            </span>
          </button>

          {/* To */}
          <input
            type="text"
            placeholder="To"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          {/* Search Button */}
          <button
            onClick={handleSearch}
            disabled={!from || !to || loading}
            className={`flex items-center gap-2 px-6 py-3 font-semibold rounded-lg transition 
              ${
                !from || !to || loading
                  ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                  : "bg-orange-500 text-white hover:bg-orange-600"
              }`}
          >
            <MagnifyingGlassIcon className="h-5 w-5" />
            {loading ? "Searching..." : "Search"}
          </button>
        </div>
      </div>

      {/* Show available buses */}
      {buses.length > 0 && (
        <div className="w-full max-w-4xl mx-auto mt-6">
          <h3 className="text-xl font-semibold text-blue-900 mb-4">
            Available Buses
          </h3>
          <BusList buses={buses} />
        </div>
      )}

      {/* Map appears below */}
      {/* Map appears below */}
      {routeData && (
        <div className="w-full max-w-5xl mx-auto mt-8">
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <h3 className="text-lg font-semibold text-blue-900 p-4 border-b">
              Route Map
            </h3>
            <div className="w-full h-[490px]">
              <MapView routeData={routeData} />
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default RouteSearch;
