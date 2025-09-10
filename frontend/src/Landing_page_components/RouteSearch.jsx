import React, { useState } from "react"
import { ArrowsUpDownIcon, ArrowsRightLeftIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline"

function RouteSearch() {
  const [from, setFrom] = useState("")
  const [to, setTo] = useState("")

  // Swap From ↔ To
  const handleSwap = () => {
    setFrom(to)
    setTo(from)
  }

  const handleSearch = () => {
    if (from && to) {
      alert(`Searching route from ${from} to ${to}`)
    } else {
      alert("Please enter both From and To locations")
    }
  }

  return (
    <section className="w-full bg-gradient-to-r from-blue-100 via-indigo-100 to-purple-100 py-12">
      <div className="w-full max-w-3xl mx-auto bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6">
        <h2 className="text-2xl font-bold text-center text-blue-900 mb-6">
          Search Your Route
        </h2>

        <div className="flex flex-col md:flex-row items-center gap-4">
          {/* From */}
          <input
            type="text"
            placeholder="From"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            className="flex-1 px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          {/* Swap Button (Vertical on mobile, Horizontal on desktop) */}
          <button
            onClick={handleSwap}
            className="p-3 rounded-full bg-gray-100 shadow hover:bg-gray-200 transition"
            aria-label="Swap From and To"
          >
            <span className="block md:hidden">
              <ArrowsUpDownIcon className="h-6 w-6 text-blue-600" />
            </span>
            <span className="hidden md:block">
              <ArrowsRightLeftIcon className="h-6 w-6 text-blue-600" />
            </span>
          </button>

          {/* To */}
          <input
            type="text"
            placeholder="To"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            className="flex-1 px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          {/* Search Button */}
          <button
            onClick={handleSearch}
            className="flex items-center gap-2 px-6 py-3 bg-orange-500 text-white font-semibold rounded-lg hover:bg-orange-600 transition"
          >
            <MagnifyingGlassIcon className="h-5 w-5" />
            Search
          </button>
        </div>
      </div>
    </section>
  )
}

export default RouteSearch





