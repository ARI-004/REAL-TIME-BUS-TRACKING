import React, { useEffect, useState } from "react";

function Statistics({ token }) {
  const [stats, setStats] = useState({
    totalBuses: 0,
    activeBuses: 0,
    inactiveBuses: 0,
    routesCount: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/bus/stats/overview", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (data.success) {
          setStats(data.data);
        }
      } catch (err) {
        console.error("Error fetching stats:", err);
      }
    };

    fetchStats();
  }, [token]);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 p-6">
      <div className="bg-white rounded-xl shadow-md p-6 text-center">
        <h3 className="text-lg font-semibold">Total Buses</h3>
        <p className="text-2xl font-bold text-blue-600">{stats.totalBuses}</p>
      </div>

      <div className="bg-white rounded-xl shadow-md p-6 text-center">
        <h3 className="text-lg font-semibold">Active Buses</h3>
        <p className="text-2xl font-bold text-green-600">{stats.activeBuses}</p>
      </div>

      <div className="bg-white rounded-xl shadow-md p-6 text-center">
        <h3 className="text-lg font-semibold">Inactive Buses</h3>
        <p className="text-2xl font-bold text-red-600">{stats.inactiveBuses}</p>
      </div>

      <div className="bg-white rounded-xl shadow-md p-6 text-center">
        <h3 className="text-lg font-semibold">Routes</h3>
        <p className="text-2xl font-bold text-purple-600">{stats.routesCount}</p>
      </div>
    </div>
  );
}

export default Statistics;
