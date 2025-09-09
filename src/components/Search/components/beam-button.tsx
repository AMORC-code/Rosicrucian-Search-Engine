"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/Search/components/ui/button"
import { cn } from "@/lib/utils"

interface BeamButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode
  className?: string
  variant?: "default" | "outline" | "ghost"
}

export function BeamButton({ children, className, variant = "default", ...props }: BeamButtonProps) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div className="relative">
      <motion.div
        className="absolute inset-0 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: isHovered ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="absolute inset-x-0 -bottom-0.5 h-[2px] bg-gradient-to-r from-purple-500/0 via-purple-500 to-purple-500/0"></div>
        <div className="absolute inset-x-0 -bottom-1 h-[2px] bg-gradient-to-r from-purple-400/0 via-purple-400/50 to-purple-400/0 blur-sm"></div>
        <div className="absolute inset-x-0 -bottom-1.5 h-[2px] bg-gradient-to-r from-purple-300/0 via-purple-300/30 to-purple-300/0 blur-md"></div>
      </motion.div>
      <Button
        variant={variant}
        className={cn(
          "relative bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white border-0",
          className,
        )}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        {...props}
      >
        {children}
      </Button>
    </div>
  )
}
