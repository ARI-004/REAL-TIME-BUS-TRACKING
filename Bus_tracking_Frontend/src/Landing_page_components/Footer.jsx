import React from "react"
import { Button } from "@/components/ui/button"

function Footer() {
  return (
    <footer className="bg-blue-900 text-white py-10 mt-16">
      <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-3 gap-8">
        {/* Logo / About */}
        <div>
          <h2 className="text-2xl font-bold mb-3">Smart Transit</h2>
          <p className="text-gray-300">
            A smarter way to travel. Real-time bus tracking, route info, and 
            commuter-friendly solutions for small cities and tier-2 towns.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Quick Links</h3>
          <ul className="space-y-2 text-gray-300">
            <li><a href="#about" className="hover:text-white">About</a></li>
            <li><a href="#routes" className="hover:text-white">Search Routes</a></li>
            <li><a href="#contact" className="hover:text-white">Contact</a></li>
          </ul>
        </div>

        {/* Contact / CTA */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Stay Updated</h3>
          <p className="text-gray-300 mb-4">
            Get notified about new features and updates.
          </p>
          <Button className="bg-orange-500 hover:bg-orange-600">
            Subscribe
          </Button>
        </div>
      </div>

      <div className="border-t border-gray-700 mt-8 pt-4 text-center text-gray-400 text-sm">
        © {new Date().getFullYear()} Smart Transit. All rights reserved.
      </div>
    </footer>
  )
}

export default Footer
