import { useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface AnimatedShinyTextProps {
  children: React.ReactNode
  className?: string
}

export function AnimatedShinyText({ children, className }: AnimatedShinyTextProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const shineRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    const shine = shineRef.current
    if (!container || !shine) return

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top

      shine.style.setProperty("--x", `${x}px`)
      shine.style.setProperty("--y", `${y}px`)
    }

    container.addEventListener("mousemove", handleMouseMove)
    return () => container.removeEventListener("mousemove", handleMouseMove)
  }, [])

  return (
    <motion.div
      ref={containerRef}
      className={cn("relative overflow-hidden", className)}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {children}
      <div
        ref={shineRef}
        className="pointer-events-none absolute inset-0 overflow-hidden"
        style={{
          mask: "radial-gradient(circle at var(--x, 50%) var(--y, 50%), black 10%, transparent 50%)",
          WebkitMask:
            "radial-gradient(circle at var(--x, 50%) var(--y, 50%), black 10%, transparent 50%)",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-500/20 to-transparent" />
      </div>
    </motion.div>
  )
}
