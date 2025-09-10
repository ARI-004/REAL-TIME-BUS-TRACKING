import React, { useEffect, useState, useCallback } from "react";

function BusDashboard({ token, onLogout }) {
  const [buses, setBuses] = useState([]);
  const [form, setForm] = useState({
    busNumber: "",
    route: "",
    driver: { name: "", phoneNumber: "" },
    stoppages: [{ name: "", arrivalTime: "", departureTime: "" }]
  });

  // ✅ useCallback prevents function recreation on each render
  const fetchBuses = useCallback(async () => {
    try {
      const res = await fetch("http://localhost:5000/api/bus/all", {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) setBuses(data.data.buses);
    } catch (err) {
      console.error("Error fetching buses:", err);
    }
  }, [token]); // depends only on token

  // ✅ useEffect now safe, no warning
  useEffect(() => {
    fetchBuses();
  }, [fetchBuses]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleDriverChange = (e) => {
    setForm({
      ...form,
      driver: { ...form.driver, [e.target.name]: e.target.value }
    });
  };

  const handleStoppageChange = (i, e) => {
    const updated = [...form.stoppages];
    updated[i][e.target.name] = e.target.value;
    setForm({ ...form, stoppages: updated });
  };

  const addBus = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/bus/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      if (data.success) {
        fetchBuses();
        setForm({
          busNumber: "",
          route: "",
          driver: { name: "", phoneNumber: "" },
          stoppages: [{ name: "", arrivalTime: "", departureTime: "" }]
        });
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.error("Error adding bus:", err);
    }
  };

  const deleteBus = async (id) => {
    await fetch(`http://localhost:5000/api/bus/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` }
    });
    fetchBuses();
  };

  const toggleBus = async (id) => {
    await fetch(`http://localhost:5000/api/bus/${id}/toggle-status`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${token}` }
    });
    fetchBuses();
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Bus Management</h2>
        <button
          onClick={onLogout}
          className="bg-red-600 text-white px-3 py-1 rounded"
        >
          Logout
        </button>
      </div>

      {/* Add Bus Form */}
      <div className="bg-white p-4 rounded shadow mb-6">
        <h3 className="font-semibold mb-2">Add New Bus</h3>
        <input
          className="border p-2 w-full mb-2"
          name="busNumber"
          placeholder="Bus Number"
          value={form.busNumber}
          onChange={handleChange}
        />
        <input
          className="border p-2 w-full mb-2"
          name="route"
          placeholder="Route"
          value={form.route}
          onChange={handleChange}
        />
        <input
          className="border p-2 w-full mb-2"
          name="name"
          placeholder="Driver Name"
          value={form.driver.name}
          onChange={handleDriverChange}
        />
        <input
          className="border p-2 w-full mb-2"
          name="phoneNumber"
          placeholder="Driver Phone"
          value={form.driver.phoneNumber}
          onChange={handleDriverChange}
        />

        <h4 className="font-medium">Stoppages</h4>
        {form.stoppages.map((s, i) => (
          <div key={i} className="flex gap-2 mb-2">
            <input
              className="border p-2 flex-1"
              name="name"
              placeholder="Stoppage Name"
              value={s.name}
              onChange={(e) => handleStoppageChange(i, e)}
            />
            <input
              className="border p-2 w-28"
              name="arrivalTime"
              placeholder="HH:MM"
              value={s.arrivalTime}
              onChange={(e) => handleStoppageChange(i, e)}
            />
            <input
              className="border p-2 w-28"
              name="departureTime"
              placeholder="HH:MM"
              value={s.departureTime}
              onChange={(e) => handleStoppageChange(i, e)}
            />
          </div>
        ))}

        <button
          onClick={addBus}
          className="bg-green-600 text-white px-4 py-2 rounded mt-2"
        >
          Add Bus
        </button>
      </div>

      {/* Bus List */}
      <div className="bg-white p-4 rounded shadow">
        <h3 className="font-semibold mb-2">All Buses</h3>
        <table className="w-full border">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-2 border">Bus No</th>
              <th className="p-2 border">Route</th>
              <th className="p-2 border">Driver</th>
              <th className="p-2 border">Status</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {buses.map((bus) => (
              <tr key={bus._id} className="border">
                <td className="p-2 border">{bus.busNumber}</td>
                <td className="p-2 border">{bus.route}</td>
                <td className="p-2 border">{bus.driver.name}</td>
                <td className="p-2 border">
                  {bus.isActive ? "Active" : "Inactive"}
                </td>
                <td className="p-2 border flex gap-2">
                  <button
                    onClick={() => toggleBus(bus._id)}
                    className="bg-yellow-500 text-white px-2 py-1 rounded"
                  >
                    Toggle
                  </button>
                  <button
                    onClick={() => deleteBus(bus._id)}
                    className="bg-red-600 text-white px-2 py-1 rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default BusDashboard;
