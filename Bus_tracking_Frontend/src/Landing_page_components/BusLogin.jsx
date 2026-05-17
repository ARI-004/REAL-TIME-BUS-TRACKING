/** @format */
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./BusLogin.css";

function BusLogin() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "http://localhost:5000/api/bus/auth/login",
        form
      );
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("busId", res.data.bus._id);
      alert("Login successful");
      navigate("/bus/dashboard");
    } catch (err) {
      setError(err.response?.data?.error || "Server error");
    }
  };

  return (
    <div className="flex justify-center mt-10">
      <form
        className="w-96 flex flex-col gap-4 bus-login-form"
        onSubmit={handleSubmit}
      >
        <h2 className="text-2xl font-bold">Bus Login</h2>
        {error && <p className="text-red-600">{error}</p>}
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
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Login
        </button>
      </form>
    </div>
  );
}

export default BusLogin;
