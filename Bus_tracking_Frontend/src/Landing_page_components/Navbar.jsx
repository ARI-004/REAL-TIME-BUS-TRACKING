/** @format */
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Navbar() {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token);
  }, []);

  const closeModal = () => {
    setIsLoginOpen(false);
    setIsRegisterOpen(false);
  };

  const handlePassengerClick = () => {
    if (isLoginOpen) navigate("/passenger/login");
    else if (isRegisterOpen) navigate("/passenger/register");
    closeModal();
  };

  const handleBusClick = () => {
    if (isLoginOpen) navigate("/bus/login");
    else if (isRegisterOpen) navigate("/bus/register");
    closeModal();
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    navigate("/");
  };

  return (
    <nav className="sticky top-0 w-full bg-white shadow-md px-6 py-2 flex items-center justify-between z-50">
      {/* Logo */}
      <div className="flex items-center">
        <a href="/">
          <img
            src="/bus_logo.png"
            alt="MeraSafar Logo"
            className="h-12 w-auto max-h-12 object-contain"
          />
        </a>
      </div>

      {/* Right side buttons */}
      <div className="flex gap-4">
        {!isAuthenticated ? (
          <>
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
          </>
        ) : (
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Logout
          </button>
        )}
      </div>

      {/* Modal */}
      {(isLoginOpen || isRegisterOpen) && !isAuthenticated && (
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
              <button
                onClick={handlePassengerClick}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                Passenger
              </button>
              <button
                onClick={handleBusClick}
                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
              >
                Driver / Bus
              </button>
              <button className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600">
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
