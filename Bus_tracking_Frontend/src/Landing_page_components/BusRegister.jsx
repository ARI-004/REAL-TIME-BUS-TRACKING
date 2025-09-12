/** @format */
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./BusRegister.css";

function BusRegister() {
  const [form, setForm] = useState({
    busNumber: "",
    registrationNo: "",
    email: "",
    password: "",
    route: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "http://localhost:5000/api/bus/auth/register",
        form
      );
      alert("Bus registered successfully!");
      navigate("/bus/login");
    } catch (err) {
      setError(err.response?.data?.error || "Server error");
    }
  };

  return (
    <div className="flex justify-center mt-10">
      <form
        className="w-96 flex flex-col gap-4 bus-register-form"
        onSubmit={handleSubmit}
      >
        <h2 className="text-2xl font-bold">Bus Register</h2>
        {error && <p className="text-red-600">{error}</p>}
        <input
          type="text"
          name="busNumber"
          placeholder="Bus Number"
          value={form.busNumber}
          onChange={handleChange}
          required
          className="border px-3 py-2 rounded"
        />
        <input
          type="text"
          name="registrationNo"
          placeholder="Registration No"
          value={form.registrationNo}
          onChange={handleChange}
          required
          className="border px-3 py-2 rounded"
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
          className="border px-3 py-2 rounded"
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
          className="border px-3 py-2 rounded"
        />
        <input
          type="text"
          name="route"
          placeholder="Route Name"
          value={form.route}
          onChange={handleChange}
          className="border px-3 py-2 rounded"
        />
        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Register
        </button>
      </form>
    </div>
  );
}

export default BusRegister;
