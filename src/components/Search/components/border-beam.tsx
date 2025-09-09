"use client"

import { useEffect, useRef } from "react"

interface BorderBeamProps {
  duration?: number
  size?: number
  colorFrom?: string
  colorTo?: string
}

export function BorderBeam({
  duration = 2,
  size = 1,
  colorFrom = "#9333ea",
  colorTo = "#4f46e5",
}: BorderBeamProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let animationFrameId: number
    let startTime: number

    const resize = () => {
      const rect = canvas.getBoundingClientRect()
      canvas.width = rect.width * window.devicePixelRatio
      canvas.height = rect.height * window.devicePixelRatio
    }

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp
      const progress = ((timestamp - startTime) % (duration * 1000)) / (duration * 1000)

      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Create gradient
      const gradient = ctx.createLinearGradient(
        canvas.width * progress,
        0,
        canvas.width * (progress + 0.2),
        canvas.height
      )
      gradient.addColorStop(0, colorFrom)
      gradient.addColorStop(1, colorTo)

      // Draw border
      ctx.strokeStyle = gradient
      ctx.lineWidth = size * window.devicePixelRatio
      ctx.strokeRect(0, 0, canvas.width, canvas.height)

      animationFrameId = requestAnimationFrame(animate)
    }

    resize()
    window.addEventListener("resize", resize)
    animationFrameId = requestAnimationFrame(animate)

    return () => {
      window.removeEventListener("resize", resize)
      cancelAnimationFrame(animationFrameId)
    }
  }, [duration, size, colorFrom, colorTo])

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute inset-0 h-full w-full"
      style={{
        maskImage: "radial-gradient(circle at center, transparent 70%, black 100%)",
        WebkitMaskImage:
          "radial-gradient(circle at center, transparent 70%, black 100%)",
      }}
    />
  )
}
