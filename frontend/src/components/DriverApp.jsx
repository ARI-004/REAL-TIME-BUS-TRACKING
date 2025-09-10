import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import DriverRegister from "./DriverRegister.jsx";
import DriverLogin from "./DriverLogin.jsx";
import DriverDashboard from "./DriverDashboard.jsx";

// ✅ Protected Route Wrapper
function ProtectedRoute({ children }) {
  const isLoggedIn = !!localStorage.getItem("driverId");
  return isLoggedIn ? children : <Navigate to="/driver/login" />;
}

function DriverApp() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-r from-blue-100 via-indigo-200 to-purple-200">
      {/* 📌 Main Content */}
      <main className="flex-grow flex items-center justify-center p-6">
        <div className="w-full max-w-3xl bg-white rounded-2xl shadow-xl p-6">
          <Routes>
            <Route path="/" element={<Navigate to="/driver/login" />} />
            <Route path="/register" element={<DriverRegister />} />
            <Route path="/login" element={<DriverLogin />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <DriverDashboard />
                </ProtectedRoute>
              }
            />
          </Routes>
        </div>
      </main>
    </div>
  );
}

export default DriverApp;
