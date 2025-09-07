import React, { useState } from "react";

function DriverRegister() {
  const [form, setForm] = useState({
    busNumber: "",
    registrationNo: "",
    phone: "",
    password: "",
    //stops: [{ stopName: "", actualArrival: "" }],
  });

  // handle simple field change
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  // register or update
  const handleSubmit = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/driver/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        alert("✅ Registered successfully! Please log in.");
  window.location.href = "/login";  // redirect to login page
      } else {
        alert("❌ Registration failed");
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-6 max-w-lg mx-auto shadow-lg rounded-xl bg-gradient-to-r from-indigo-100 to-purple-200">
      <h2 className="text-2xl font-bold mb-4">📝 Driver Registration</h2>

      <input
        name="busNumber"
        placeholder="Bus Number"
        value={form.busNumber}
        onChange={handleChange}
        className="w-full p-2 border rounded mb-2"
      />
      <input
        name="registrationNo"
        placeholder="Registration No"
        value={form.registrationNo}
        onChange={handleChange}
        className="w-full p-2 border rounded mb-2"
      />
      <input
        name="phone"
        placeholder="Phone"
        value={form.phone}
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
      
      {/* Register */}
      <button
        onClick={handleSubmit}
        className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600"
      >
        🚍 Register
      </button>
    </div>
  );
}

export default DriverRegister;
