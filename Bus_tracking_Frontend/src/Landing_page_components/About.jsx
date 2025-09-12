import React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Bus, Clock, Leaf } from "lucide-react"

function About() {
  return (
    <section id="about-section" className="py-20 bg-gradient-to-r from-blue-50 to-white">
      <div className="max-w-6xl mx-auto px-6">
        {/* Heading */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-extrabold text-blue-900 font-serif">
            About Us
          </h2>
          <p className="text-lg text-gray-700 mt-4 max-w-2xl mx-auto font-light">
            Making public transport reliable, simple, and sustainable for growing cities.
          </p>
        </div>

        {/* Highlights in horizontal layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="p-6 shadow-lg border border-blue-100 hover:shadow-xl transition">
            <CardContent className="flex flex-col items-center text-center">
              <Bus className="h-10 w-10 text-blue-600 mb-4" />
              <h3 className="text-xl font-semibold text-blue-800 font-serif">Reliable</h3>
              <p className="text-gray-600 text-sm mt-2">
                Live GPS tracking helps you reach on time without the guesswork.
              </p>
            </CardContent>
          </Card>

          <Card className="p-6 shadow-lg border border-blue-100 hover:shadow-xl transition">
            <CardContent className="flex flex-col items-center text-center">
              <Clock className="h-10 w-10 text-blue-600 mb-4" />
              <h3 className="text-xl font-semibold text-blue-800 font-serif">Simple</h3>
              <p className="text-gray-600 text-sm mt-2">
                Search routes, check schedules, and travel with confidence.
              </p>
            </CardContent>
          </Card>

          <Card className="p-6 shadow-lg border border-blue-100 hover:shadow-xl transition">
            <CardContent className="flex flex-col items-center text-center">
              <Leaf className="h-10 w-10 text-blue-600 mb-4" />
              <h3 className="text-xl font-semibold text-blue-800 font-serif">Sustainable</h3>
              <p className="text-gray-600 text-sm mt-2">
                Encouraging greener transport for healthier, cleaner cities.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}

export default About


