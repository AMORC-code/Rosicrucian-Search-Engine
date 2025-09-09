"use client"

import { useEffect, useRef, useState } from "react"
import { motion } from "framer-motion"

export default function GlobeAnimation() {
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })

  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        const { width, height } = containerRef.current.getBoundingClientRect()
        setDimensions({ width, height })
      }
    }

    // Initialize size
    handleResize()

    // Set up resize listener
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || dimensions.width === 0) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions
    canvas.width = dimensions.width
    canvas.height = dimensions.height

    // Globe parameters
    const centerX = canvas.width / 2
    const centerY = canvas.height / 2
    const radius = Math.min(canvas.width, canvas.height) * 0.35
    const dotCount = Math.floor(radius * 1.5)
    const dots: { x: number; y: number; z: number; r: number; alpha: number }[] = []

    // Create dots on the globe surface
    for (let i = 0; i < dotCount; i++) {
      // Generate random spherical coordinates
      const theta = Math.random() * Math.PI * 2 // longitude
      const phi = Math.acos(2 * Math.random() - 1) // latitude

      // Convert to Cartesian coordinates
      const x = radius * Math.sin(phi) * Math.cos(theta)
      const y = radius * Math.sin(phi) * Math.sin(theta)
      const z = radius * Math.cos(phi)

      dots.push({
        x,
        y,
        z,
        r: Math.random() * (radius * 0.01) + (radius * 0.005), // scale dot radius with globe size
        alpha: Math.random() * 0.5 + 0.5, // dot opacity
      })
    }

    let rotation = 0
    const rotationSpeed = 0.002

    // Animation loop
    const animate = () => {
      if (!ctx) return
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Rotate the globe
      rotation += rotationSpeed

      // Draw the globe outline
      ctx.beginPath()
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2)
      ctx.strokeStyle = "rgba(147, 51, 234, 0.2)"
      ctx.stroke()

      // Sort dots by z-coordinate for proper depth rendering
      const sortedDots = [...dots].sort((a, b) => a.z - b.z)

      // Draw dots
      sortedDots.forEach((dot) => {
        // Apply rotation around y-axis
        const cosR = Math.cos(rotation)
        const sinR = Math.sin(rotation)
        const x2 = dot.x * cosR + dot.z * sinR
        const z2 = -dot.x * sinR + dot.z * cosR

        // Project 3D to 2D
        const scale = 400 / (400 + z2)
        const x2d = centerX + x2 * scale
        const y2d = centerY + dot.y * scale

        // Only draw dots on the visible hemisphere
        if (z2 < 0) {
          const alpha = Math.min(1, Math.max(0.1, (dot.alpha * -z2) / radius))
          ctx.beginPath()
          ctx.arc(x2d, y2d, dot.r * scale, 0, Math.PI * 2)
          ctx.fillStyle = `rgba(168, 85, 247, ${alpha})`
          ctx.fill()
        }
      })

      // Draw connections between nearby dots
      for (let i = 0; i < sortedDots.length; i++) {
        for (let j = i + 1; j < sortedDots.length; j++) {
          const dot1 = sortedDots[i]
          const dot2 = sortedDots[j]

          // Apply rotation to both dots
          const cosR = Math.cos(rotation)
          const sinR = Math.sin(rotation)

          const x1 = dot1.x * cosR + dot1.z * sinR
          const z1 = -dot1.x * sinR + dot1.z * cosR

          const x2 = dot2.x * cosR + dot2.z * sinR
          const z2 = -dot2.x * sinR + dot2.z * cosR

          // Calculate 3D distance
          const dx = dot1.x - dot2.x
          const dy = dot1.y - dot2.y
          const dz = dot1.z - dot2.z
          const distance = Math.sqrt(dx * dx + dy * dy + dz * dz)

          // Only connect dots that are close enough
          if (distance < radius * 0.5) {
            // Project to 2D
            const scale1 = 400 / (400 + z1)
            const scale2 = 400 / (400 + z2)

            const x1_2d = centerX + x1 * scale1
            const y1_2d = centerY + dot1.y * scale1

            const x2_2d = centerX + x2 * scale2
            const y2_2d = centerY + dot2.y * scale2

            // Only draw connections if both dots are on the visible hemisphere
            if (z1 < 0 && z2 < 0) {
              const alpha = Math.min(0.5, Math.max(0.05, 0.5 - distance / (radius * 0.5)))
              ctx.beginPath()
              ctx.moveTo(x1_2d, y1_2d)
              ctx.lineTo(x2_2d, y2_2d)
              ctx.strokeStyle = `rgba(139, 92, 246, ${alpha})`
              ctx.lineWidth = Math.max(0.5, radius * 0.004) // Scale line width with globe size
              ctx.stroke()
            }
          }
        }
      }

      requestAnimationFrame(animate)
    }

    animate()

    // Cleanup animation on dimension change
    return () => {
      // No explicit cleanup needed for requestAnimationFrame since the component will re-render
    }
  }, [dimensions])

  return (
    <motion.div
      ref={containerRef}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1 }}
      className="relative w-full aspect-square md:w-[40vw] md:h-[40vw] mx-auto"
    >
      <div className="absolute inset-0 rounded-full bg-purple-900/10 blur-3xl"></div>
      <canvas ref={canvasRef} className="relative z-10 w-full h-full" />
    </motion.div>
  )
}
