import React, { useState } from "react";

function DepotAuth({ onLogin }) {
  const [isRegister, setIsRegister] = useState(false);
  const [form, setForm] = useState({
    name: "",
    location: "",
    password: "",
    phoneNumber: "",
    email: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    const url = isRegister
      ? "http://localhost:5000/api/depot/register"
      : "http://localhost:5000/api/depot/login";

    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (data.success) {
        const token = data.data.token;

        // Save token so it persists after refresh
        localStorage.setItem("token", token);

        // Notify parent (DepotApp) about login
        onLogin(token);
      } else {
        alert(data.message || "Login/Register failed");
      }
    } catch (err) {
      console.error("Auth error:", err);
      alert("Server error, please try again later.");
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded shadow">
      <h2 className="text-xl font-bold mb-4">
        {isRegister ? "Depot Register" : "Depot Login"}
      </h2>
      <input
        className="border p-2 w-full mb-2"
        name="name"
        placeholder="Depot Name"
        onChange={handleChange}
      />
      <input
        className="border p-2 w-full mb-2"
        name="location"
        placeholder="Depot Location"
        onChange={handleChange}
      />
      <input
        className="border p-2 w-full mb-2"
        name="password"
        type="password"
        placeholder="Password"
        onChange={handleChange}
      />
      {isRegister && (
        <>
          <input
            className="border p-2 w-full mb-2"
            name="phoneNumber"
            placeholder="Phone Number"
            onChange={handleChange}
          />
          <input
            className="border p-2 w-full mb-2"
            name="email"
            placeholder="Email"
            onChange={handleChange}
          />
        </>
      )}
      <button
        onClick={handleSubmit}
        className="bg-blue-600 text-white px-4 py-2 rounded w-full"
      >
        {isRegister ? "Register" : "Login"}
      </button>
      <p
        className="text-sm text-blue-500 mt-2 cursor-pointer"
        onClick={() => setIsRegister(!isRegister)}
      >
        {isRegister
          ? "Already have an account? Login"
          : "Don’t have an account? Register"}
      </p>
    </div>
  );
}

export default DepotAuth;
