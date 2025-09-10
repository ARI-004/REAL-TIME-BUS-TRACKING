import React, { useState, useEffect } from "react";
import DepotAuth from "./DepotAuth";
import BusDashboard from "./BusDashboard";
import Statistics from "./Statistics";

function DepotApp() {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [view, setView] = useState("dashboard");

  useEffect(() => {
    if (token) setView("dashboard");
  }, [token]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(null);
  };

  if (!token) {
    return <DepotAuth onLogin={setToken} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Content only (Navbar is from App.jsx) */}
      <div className="p-4 flex justify-end space-x-3">
        <button
          onClick={() => setView("dashboard")}
          className={`px-3 py-1 rounded-lg ${
            view === "dashboard" ? "bg-blue-500 text-white" : "bg-gray-200"
          }`}
        >
          Dashboard
        </button>
        <button
          onClick={() => setView("stats")}
          className={`px-3 py-1 rounded-lg ${
            view === "stats" ? "bg-blue-500 text-white" : "bg-gray-200"
          }`}
        >
          Statistics
        </button>
        <button
          onClick={handleLogout}
          className="px-3 py-1 rounded-lg bg-red-500 text-white"
        >
          Logout
        </button>
      </div>

      <main className="p-6">
        {view === "dashboard" ? (
          <BusDashboard token={token} onLogout={handleLogout} />
        ) : (
          <Statistics token={token} />
        )}
      </main>
    </div>
  );
}

export default DepotApp;
