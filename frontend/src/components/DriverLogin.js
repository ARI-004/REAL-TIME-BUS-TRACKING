import React, { useState } from "react";

function DriverLogin({ onLogin }) {
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
        //alert("✅ Login successful!");
        localStorage.setItem("driverId", data.driverId);
        localStorage.setItem("registrationNo", data.registrationNo);
        
        window.location.href = "/dashboard"; 
      } else {
        alert(data.error || "❌ Login failed");
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto bg-gradient-to-r from-yellow-100 to-orange-200 shadow-lg rounded-xl">
      <h2 className="text-2xl font-bold mb-4">🔑 Driver Login</h2>
      <input
        name="registrationNo"
        placeholder="Registration No"
        value={form.registrationNo}
        onChange={handleChange}
        className="w-full p-2 border rounded mb-2"
      />
      <input
        type="password"
        name="password"
        placeholder="Password"
        value={form.password}
        onChange={handleChange}
        className="w-full p-2 border rounded mb-2"
      />
      <button
        onClick={handleLogin}
        className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600"
      >
        🚍 Login
      </button>
    </div>
  );
}

export default DriverLogin;
