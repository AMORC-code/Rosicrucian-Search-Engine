"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"

interface TypewriterEffectProps {
  text: string
  className?: string
  speed?: number
  delay?: number
}

export function TypewriterEffect({
  text,
  className = "",
  speed = 50,
  delay = 0,
}: TypewriterEffectProps) {
  const [displayText, setDisplayText] = useState("")
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    if (currentIndex >= text.length) return

    const timeout = setTimeout(() => {
      setDisplayText((prev) => prev + text[currentIndex])
      setCurrentIndex((prev) => prev + 1)
    }, speed)

    return () => clearTimeout(timeout)
  }, [currentIndex, text, speed])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: delay / 1000 }}
      className={className}
    >
      {displayText}
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 1, 0] }}
        transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
        className="inline-block ml-1 -translate-y-[2px]"
      >
        |
      </motion.span>
    </motion.div>
  )
} 