import React from "react";
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from "react-router-dom";
import DriverRegister from "./components/DriverRegister.js";
import DriverLogin from "./components/DriverLogin.js";
import DriverDashboard from "./components/DriverDashboard.js";

// ✅ Protected Route Wrapper
function ProtectedRoute({ children }) {
  const isLoggedIn = !!localStorage.getItem("driverId");
  return isLoggedIn ? children : <Navigate to="/login" />;
}

function App() {
  return (
    <Router>
      <div className="App p-6 max-w-3xl mx-auto bg-gradient-to-r from-blue-100 to-indigo-200 shadow-2xl rounded-2xl min-h-screen">
        <h1 className="text-3xl font-bold text-center mb-6">🚌 Bus Management System</h1>

        {/* 🔗 Navigation */}
        <nav className="flex justify-center gap-4 mb-6">
          <Link to="/register" className="text-blue-700 font-semibold hover:underline">
            Register
          </Link>
          <Link to="/login" className="text-blue-700 font-semibold hover:underline">
            Login
          </Link>
          <Link to="/dashboard" className="text-blue-700 font-semibold hover:underline">
            Dashboard
          </Link>
        </nav>

        {/* 📌 Routes */}
        <Routes>
          {/* Default → login */}
          <Route path="/" element={<Navigate to="/login" />} />

          {/* Register → Login */}
          <Route path="/register" element={<DriverRegister />} />

          {/* Login → Dashboard */}
          <Route path="/login" element={<DriverLogin />} />

          {/* Dashboard → Protected */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DriverDashboard />
              </ProtectedRoute>
            }
          />

          {/* Catch-all → Login */}
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
