import React, { useState } from "react"

function PassengerDashboard() {
  const [from, setFrom] = useState("")
  const [to, setTo] = useState("")
  const [buses, setBuses] = useState([])

  const handleSearch = () => {
    // Demo data (replace with API later)
    const availableBuses = [
      { id: 1, name: "City Express", time: "10:30 AM", seats: 12 },
      { id: 2, name: "Metro Line", time: "11:00 AM", seats: 8 },
      { id: 3, name: "Green Bus", time: "11:15 AM", seats: 20 },
    ]
    setBuses(availableBuses)
  }

  const handleSwap = () => {
    setFrom(to)
    setTo(from)
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-50 to-blue-100 py-12 px-6">
      <div className="max-w-3xl mx-auto bg-white shadow-xl rounded-2xl p-8">
        <h1 className="text-3xl font-bold text-blue-700 text-center mb-6">
          Passenger Dashboard
        </h1>

        {/* Route Search */}
        <div className="bg-gradient-to-r from-orange-50 to-orange-100 p-6 rounded-xl shadow-md mb-8">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Search Route</h2>

          <div className="flex flex-col md:flex-row md:items-center gap-4">
            {/* From */}
            <input
              type="text"
              placeholder="From"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />

            {/* Swap Button (center between inputs) */}
            <div className="flex justify-center md:items-center">
              <button
                onClick={handleSwap}
                className="w-12 h-12 rounded-full bg-blue-600 text-white shadow-md hover:bg-blue-700 transition"
                title="Swap From and To"
              >
                <span className="block md:hidden">⇅</span>
                <span className="hidden md:block">⇄</span>
              </button>
            </div>

            {/* To */}
            <input
              type="text"
              placeholder="To"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <button
            onClick={handleSearch}
            className="mt-6 w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition"
          >
            Search Buses
          </button>
        </div>

        {/* Available Buses */}
        {buses.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Available Buses</h2>
            <div className="space-y-4">
              {buses.map((bus) => (
                <div
                  key={bus.id}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg shadow-sm bg-white"
                >
                  <div>
                    <h3 className="text-lg font-bold text-gray-800">{bus.name}</h3>
                    <p className="text-gray-600">Departure: {bus.time}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-gray-700">Seats: {bus.seats}</p>
                    <button className="mt-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600">
                      Book Now
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default PassengerDashboard












