"use client"

import { useCallback } from "react"
import Particles from "react-tsparticles"
import { loadFull } from "tsparticles"
import type { Engine } from "tsparticles-engine"

export function ParticleBackground() {
  const particlesInit = useCallback(async (engine: Engine) => {
    await loadFull(engine)
  }, [])

  return (
    <Particles
      id="tsparticles"
      init={particlesInit}
      options={{
        background: {
          color: {
            value: "transparent",
          },
        },
        particles: {
          color: {
            value: "#a855f7",
          },
          links: {
            color: "#a855f7",
            distance: 150,
            enable: true,
            opacity: 0.2,
            width: 1,
          },
          move: {
            enable: true,
            speed: 1,
          },
          number: {
            value: 80,
          },
          opacity: {
            value: 0.3,
          },
          size: {
            value: { min: 1, max: 3 },
          },
        },
      }}
      className="absolute inset-0"
    />
  )
}
