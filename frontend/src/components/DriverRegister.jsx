import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function DriverRegister() {
  const [form, setForm] = useState({
    busNumber: "",
    registrationNo: "",
    phone: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/driver/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        alert("✅ Registered successfully! Please log in.");
        navigate("/driver/login");
      } else {
        alert("❌ Registration failed");
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-100 via-indigo-200 to-purple-200 p-6">
      <div className="w-full max-w-md bg-white shadow-2xl rounded-2xl p-8">
        {/* Title */}
        <h2 className="text-2xl font-bold text-center mb-6 flex items-center justify-center gap-2">
          📝 Driver Registration
        </h2>

        {/* Bus Number */}
        <input
          name="busNumber"
          placeholder="Enter Bus Number"
          value={form.busNumber}
          onChange={handleChange}
          className="w-full p-3 border rounded-lg mb-3 focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />

        {/* Registration No */}
        <input
          name="registrationNo"
          placeholder="Enter Registration No"
          value={form.registrationNo}
          onChange={handleChange}
          className="w-full p-3 border rounded-lg mb-3 focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />

        {/* Phone */}
        <input
          name="phone"
          placeholder="Enter Phone Number"
          value={form.phone}
          onChange={handleChange}
          className="w-full p-3 border rounded-lg mb-3 focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />

        {/* Password */}
        <input
          type="password"
          name="password"
          placeholder="Enter Password"
          value={form.password}
          onChange={handleChange}
          className="w-full p-3 border rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />

        {/* Register Button */}
        <button
          onClick={handleSubmit}
          className="w-full bg-green-500 text-white py-3 rounded-lg hover:bg-green-600 transition duration-200"
        >
          🚍 Register
        </button>

        {/* Login Redirect */}
        <p className="text-center text-sm mt-4">
          Already have an account?{" "}
          <Link to="/driver/login" className="text-indigo-600 font-semibold hover:underline">
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
}

export default DriverRegister;
