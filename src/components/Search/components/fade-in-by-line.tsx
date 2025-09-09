"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"

interface FadeInByLineProps {
  text: string
  className?: string
  delay?: number
  duration?: number
}

export function FadeInByLine({ text, className, delay = 0, duration = 0.5 }: FadeInByLineProps) {
  const [lines, setLines] = useState<string[]>([])

  useEffect(() => {
    // Split text into lines
    const splitLines = text
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean)
    setLines(splitLines)
  }, [text])

  return (
    <div className={className}>
      {lines.map((line, index) => (
        <motion.p
          key={index}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration,
            delay: delay + index * 0.15,
            ease: "easeOut",
          }}
          className="mb-2"
        >
          {line}
        </motion.p>
      ))}
    </div>
  )
}
