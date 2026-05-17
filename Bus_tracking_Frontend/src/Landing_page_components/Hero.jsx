import React from "react"
import { Button } from "@/components/ui/button"

function Hero() {
  const handleLearnMore = () => {
    document.getElementById("about-section")?.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <section className="relative w-full h-[65vh] flex items-center justify-center">
      {/* Background Image */}
      <img
        src="/bus_hero_img.avif"
        alt="Public Transport Bus"
        className="absolute inset-0 w-full h-full object-cover"
      />
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50"></div>

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-3xl">
        <h1 className="text-3xl md:text-5xl font-extrabold text-white leading-tight mb-4">
          Reliable Public Transport for Small Cities
        </h1>
        <p className="text-base md:text-lg text-gray-200 mb-6">
          Say goodbye to unpredictable bus schedules. Get real-time tracking, route info, 
          and smoother journeys with our smart public transport platform.
        </p>
        <div className="flex justify-center gap-4">
          <Button size="lg" className="bg-orange-500 hover:bg-orange-600">
            Get Started
          </Button>
          <Button
            size="lg"
            variant="secondary"
            className="bg-white text-blue-900 hover:bg-gray-200"
            onClick={handleLearnMore}
          >
            Learn More
          </Button>
        </div>
      </div>
    </section>
  )
}

export default Hero






