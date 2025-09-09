"use client"

import { cn } from "@/lib/utils"
import { motion } from "framer-motion"

interface ShinyHeadingProps {
  text: string
  as?: keyof JSX.IntrinsicElements
  className?: string
}

export function ShinyHeading({
  text,
  as: Component = "h1",
  className,
}: ShinyHeadingProps) {
  return (
    <Component className={cn("relative inline-block", className)}>
      <motion.span
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="relative z-10"
      >
        {text}
      </motion.span>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 1, 0] }}
        transition={{
          duration: 3,
          repeat: Infinity,
          repeatType: "reverse",
        }}
        className="absolute inset-0 -z-10 bg-gradient-to-r from-transparent via-purple-500/20 to-transparent blur-xl"
      />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 1, 0] }}
        transition={{
          duration: 2,
          repeat: Infinity,
          repeatType: "reverse",
          delay: 1,
        }}
        className="absolute inset-0 -z-10 bg-gradient-to-r from-transparent via-indigo-500/20 to-transparent blur-xl"
      />
    </Component>
  )
}
