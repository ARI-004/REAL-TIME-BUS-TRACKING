import React, { useState } from "react";
import { Link } from "react-router-dom";

function DriverLogin() {
  const [form, setForm] = useState({ registrationNo: "", password: "" });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/driver/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (res.ok) {
        localStorage.setItem("driverId", data.driverId);
        localStorage.setItem("registrationNo", data.registrationNo);
        window.location.href = "/driver/dashboard";
      } else {
        alert(data.error || "❌ Login failed");
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-200 via-indigo-300 to-purple-300 p-4">
      <div className="w-full max-w-md bg-white shadow-2xl rounded-2xl p-8">
        {/* Header */}
        <div className="flex flex-col items-center mb-6">
          <span className="text-4xl">🔑</span>
          <h2 className="text-2xl font-bold text-gray-800 mt-2">Driver Login</h2>
          <p className="text-gray-500 text-sm mt-1">Access your dashboard securely</p>
        </div>

        {/* Form */}
        <div className="space-y-4">
          <input
            name="registrationNo"
            placeholder="Enter Registration No"
            value={form.registrationNo}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none transition"
          />
          <input
            type="password"
            name="password"
            placeholder="Enter Password"
            value={form.password}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none transition"
          />
          <button
            onClick={handleLogin}
            className="w-full bg-green-500 text-white py-3 rounded-lg font-semibold hover:bg-green-600 transition shadow-md"
          >
            🚍 Login
          </button>
        </div>

        {/* Footer */}
        <p className="text-center text-sm text-gray-600 mt-6">
          Don’t have an account?{" "}
          <Link to="/driver/register" className="text-indigo-600 font-medium hover:underline">
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
}

export default DriverLogin;
