/** @format */
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./Landing_page_components/Navbar";
import Hero from "./Landing_page_components/Hero";
import RouteSearch from "./Landing_page_components/RouteSearch";
import About from "./Landing_page_components/About";
import Footer from "./Landing_page_components/Footer";
import PassengerDashboard from "./Landing_page_components/PassengerDashboard";
import BusList from "./Landing_page_components/BusList";
import BusDetails from "./Landing_page_components/BusDetails";

// 🔹 Passenger Auth
import PassengerLogin from "./Landing_page_components/PassengerLogin.jsx";
import PassengerRegister from "./Landing_page_components/PassengerRegister.jsx";

// 🔹 Bus Auth & Dashboard
import BusLogin from "./Landing_page_components/BusLogin.jsx";
import BusRegister from "./Landing_page_components/BusRegister.jsx";
import BusDashboard from "./Landing_page_components/BusDashboard.jsx";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        {/* Home Page */}
        <Route
          path="/"
          element={
            <>
              <Hero />
              <RouteSearch />
              <About />
              <Footer />
            </>
          }
        />

        {/* Passenger Auth */}
        <Route path="/passenger/login" element={<PassengerLogin />} />
        <Route path="/passenger/register" element={<PassengerRegister />} />

        {/* Passenger Dashboard */}
        <Route path="/dashboard" element={<PassengerDashboard />} />

        {/* Bus List for a selected route */}
        <Route path="/buses/:routeId" element={<BusList />} />

        {/* Live Bus Tracking for passengers */}
        <Route path="/bus/:id" element={<BusDetails />} />

        {/* 🔹 Bus Auth */}
        <Route path="/bus/login" element={<BusLogin />} />
        <Route path="/bus/register" element={<BusRegister />} />

        {/* 🔹 Bus Dashboard (Driver Panel) */}
        <Route path="/bus/dashboard" element={<BusDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
