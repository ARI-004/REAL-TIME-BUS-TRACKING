import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Navbar from "./Landing_page_components/Navbar";
import Hero from "./Landing_page_components/Hero";
import RouteSearch from "./Landing_page_components/RouteSearch";
import About from "./Landing_page_components/About";
import Footer from "./Landing_page_components/Footer";
import DriverApp from "./components/DriverApp";
import DepotApp from "./components/DepotApp";

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        {/* Navbar always visible (same branding across all pages) */}
        <Navbar />

        {/* Page content */}
        <main className="flex-grow">
          <Routes>
            {/* Landing page */}
            <Route
              path="/"
              element={
                <>
                  <Hero />
                  <RouteSearch />
                  <About />
                </>
              }
            />

            {/* Driver Section */}
            <Route path="/driver/*" element={<DriverApp />} />

            {/* Depot Section */}
            <Route path="/depot/*" element={<DepotApp />} />
          </Routes>
        </main>

        {/* Footer always visible */}
        <Footer />
      </div>
    </Router>
  );
}

export default App;
