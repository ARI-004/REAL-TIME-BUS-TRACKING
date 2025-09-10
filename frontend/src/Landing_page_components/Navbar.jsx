import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

function Navbar() {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const driverId = localStorage.getItem("driverId");
  const registrationNo = localStorage.getItem("registrationNo");

  const closeModal = () => {
    setIsLoginOpen(false);
    setIsRegisterOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("driverId");
    localStorage.removeItem("registrationNo");
    navigate("/driver/login");
  };

  const isDriverSection = location.pathname.startsWith("/driver");

  return (
    <nav className="sticky top-0 w-full bg-white shadow-md px-6 py-3 flex items-center justify-between z-50">
      {/* Logo */}
      <div className="flex items-center gap-2">
        <Link to="/">
          <img
            src="/bus_logo.png"
            alt="MeraSafar Logo"
            className="h-10 w-auto object-contain"
          />
        </Link>
        <span className="font-bold text-lg">MeraSafar</span>
      </div>

      {/* Navigation */}
      {isDriverSection ? (
        driverId ? (
          <div className="flex items-center gap-4 text-indigo-600 font-medium">
            <span>👋 Welcome, {registrationNo}</span>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
            >
              Logout
            </button>
          </div>
        ) : (
          <div className="flex gap-6 text-indigo-600 font-medium">
            <Link to="/driver/register" className="hover:underline">Register</Link>
            <Link to="/driver/login" className="hover:underline">Login</Link>
          </div>
        )
      ) : (
        <div className="flex gap-4">
          <button
            onClick={() => setIsLoginOpen(true)}
            className="px-4 py-2 border rounded-lg hover:bg-gray-100"
          >
            Login
          </button>
          <button
            onClick={() => setIsRegisterOpen(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Register
          </button>
        </div>
      )}

      {/* Modal Background */}
      {(isLoginOpen || isRegisterOpen) && !isDriverSection && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          onClick={closeModal}
        >
          <div
            className="bg-white rounded-xl shadow-lg p-6 w-80 text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-semibold mb-4">
              {isLoginOpen ? "Login As" : "Register As"}
            </h2>
            <div className="flex flex-col gap-3">
              <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
                Passenger
              </button>
              <button
                onClick={() => {
                  closeModal();
                  navigate("/driver/login");
                }}
                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
              >
                Driver
              </button>
              <button
              onClick={() => {
                  closeModal();
                  navigate("/depot/login");
                }}
               className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600">
                Depot
              </button>
            </div>
            <button
              onClick={closeModal}
              className="mt-5 px-4 py-2 border rounded-lg hover:bg-gray-100"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
