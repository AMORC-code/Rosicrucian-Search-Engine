"use client"

import { useCallback, useEffect, useRef } from "react"
import { useMotionValue, useSpring, motion } from "framer-motion"

export const Particles = ({
  className = "",
  quantity = 30,
  staticity = 50,
  ease = 50,
  refresh = false,
  color = "#ffffff",
  size = 2,
}: {
  className?: string
  quantity?: number
  staticity?: number
  ease?: number
  refresh?: boolean
  color?: string
  size?: number
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const context = useRef<CanvasRenderingContext2D | null>(null)
  const circles = useRef<any[]>([])
  const mousePosition = {
    x: useMotionValue(0),
    y: useMotionValue(0),
  }
  const mouse = {
    x: useSpring(mousePosition.x, { stiffness: ease }),
    y: useSpring(mousePosition.y, { stiffness: ease }),
  }

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      const rect = canvasRef.current?.getBoundingClientRect()
      if (rect) {
        const { clientX, clientY } = e
        const x = clientX - rect.left
        const y = clientY - rect.top
        mousePosition.x.set(x)
        mousePosition.y.set(y)
      }
    },
    [mousePosition]
  )

  const createCircles = useCallback(() => {
    if (!context.current) return

    circles.current = []
    for (let i = 0; i < quantity; i++) {
      const canvas = canvasRef.current
      if (!canvas) continue

      const x = Math.random() * canvas.width
      const y = Math.random() * canvas.height
      const circle = {
        x,
        y,
        translateX: 0,
        translateY: 0,
        size: size,
        alpha: 0,
        targetAlpha: parseFloat((Math.random() * 0.6 + 0.1).toFixed(1)),
      }
      circles.current.push(circle)
    }
  }, [quantity, size])

  const drawCircles = useCallback(() => {
    if (!context.current || !canvasRef.current) return

    context.current.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height)
    circles.current.forEach((circle) => {
      const canvas = canvasRef.current
      if (!canvas) return

      const { x, y, translateX, translateY, size: circleSize, alpha } = circle
      context.current!.beginPath()
      context.current!.arc(x + translateX, y + translateY, circleSize, 0, 2 * Math.PI)
      context.current!.fillStyle = `rgba(${color}, ${alpha})`
      context.current!.fill()
      context.current!.closePath()
    })
  }, [color])

  const animate = useCallback(() => {
    circles.current.forEach((circle) => {
      const canvas = canvasRef.current
      if (!canvas) return

      const mouseX = mouse.x.get()
      const mouseY = mouse.y.get()
      const distanceX = mouseX - circle.x
      const distanceY = mouseY - circle.y
      const distance = Math.sqrt(distanceX ** 2 + distanceY ** 2)
      const radius = window.innerWidth / staticity

      const targetAlpha = circle.targetAlpha
      circle.alpha += (targetAlpha - circle.alpha) * 0.1

      if (distance < radius) {
        const angle = Math.atan2(distanceY, distanceX)
        const force = (radius - distance) / radius
        const translateX = Math.cos(angle) * force * staticity
        const translateY = Math.sin(angle) * force * staticity

        circle.translateX += (translateX - circle.translateX) * 0.1
        circle.translateY += (translateY - circle.translateY) * 0.1
      } else {
        circle.translateX *= 0.9
        circle.translateY *= 0.9
      }
    })
    drawCircles()
    requestAnimationFrame(animate)
  }, [mouse.x, mouse.y, staticity, drawCircles])

  useEffect(() => {
    if (!canvasRef.current) return

    context.current = canvasRef.current.getContext("2d")
    const handleResize = () => {
      if (!canvasRef.current) return
      canvasRef.current.width = window.innerWidth
      canvasRef.current.height = window.innerHeight
      createCircles()
    }

    window.addEventListener("resize", handleResize)
    window.addEventListener("mousemove", handleMouseMove)
    handleResize()
    requestAnimationFrame(animate)

    return () => {
      window.removeEventListener("resize", handleResize)
      window.removeEventListener("mousemove", handleMouseMove)
    }
  }, [animate, createCircles, handleMouseMove, refresh])

  return (
    <motion.canvas
      ref={canvasRef}
      className={className}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
      }}
    />
  )
} 