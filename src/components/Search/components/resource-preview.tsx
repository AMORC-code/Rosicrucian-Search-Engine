"use client"

/**
 * 🎭 The Resource Preview - Visual Gateway to Knowledge
 *
 * "A mystical window into the essence of wisdom,
 * Revealing glimpses of knowledge before the full journey begins."
 * 
 * - The Spellbinding Museum Director of Media
 */

import * as React from "react"
import { motion } from "framer-motion"
import { FileText, ExternalLink, Play, File, Music, Video, Book, Image as ImageIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "./ui/button"

interface ResourcePreviewProps {
  type?: string
  url?: string
  title?: string
  thumbnail?: string
  onClick?: () => void
  className?: string
}

export function ResourcePreview({
  type = "",
  url = "",
  title = "",
  thumbnail = "",
  onClick,
  className,
}: ResourcePreviewProps) {
  const fileType = type.toLowerCase()
  
  // 🌟 The Mystical Type Detector - Discerns the nature of the resource
  const isPdf = fileType.includes('pdf')
  const isVideo = fileType.includes('video') || fileType.includes('youtube')
  const isAudio = fileType.includes('audio') || fileType.includes('podcast')
  const isImage = fileType.includes('image') || fileType.includes('photo')
  const isBook = fileType.includes('book')
  
  // 🎭 The Preview Generator - Creates visual representations of knowledge
  const renderPreview = () => {
    // ✨ For video content, show thumbnail with play button
    if (isVideo) {
      return (
        <div className="relative w-full h-full bg-black/20 overflow-hidden rounded-md flex items-center justify-center">
          {thumbnail ? (
            <img 
              src={thumbnail} 
              alt={title || "Video thumbnail"} 
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-blue-900/40 to-purple-900/40" />
          )}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="rounded-full bg-primary/90 p-3 shadow-lg backdrop-blur-sm">
              <Play size={24} className="text-white" />
            </div>
          </div>
        </div>
      )
    }
    
    // 🎨 For audio content, show waveform visualization
    if (isAudio) {
      return (
        <div className="relative w-full h-full bg-gradient-to-r from-green-900/20 to-emerald-900/20 overflow-hidden rounded-md flex items-center justify-center">
          <div className="flex items-center justify-center w-full h-full">
            {/* Stylized audio waveform */}
            <div className="flex items-end space-x-1 h-16">
              {Array.from({ length: 12 }).map((_, i) => {
                const height = Math.sin(i * 0.5) * 50 + 30
                return (
                  <motion.div
                    key={i}
                    className="w-1 bg-green-400/70 rounded-full"
                    style={{ height: `${height}%` }}
                    animate={{
                      height: [`${height}%`, `${height + Math.random() * 20}%`, `${height}%`]
                    }}
                    transition={{
                      duration: 1.2,
                      repeat: Infinity,
                      repeatType: "reverse",
                      delay: i * 0.1
                    }}
                  />
                )
              })}
            </div>
            <div className="absolute bottom-2 right-2 rounded-full bg-primary/90 p-2 shadow-sm">
              <Music size={14} className="text-white" />
            </div>
          </div>
        </div>
      )
    }
    
    // 📄 For PDF content, show document preview
    if (isPdf) {
      return (
        <div className="relative w-full h-full bg-gradient-to-r from-red-900/20 to-orange-900/20 overflow-hidden rounded-md flex items-center justify-center">
          <div className="w-16 h-20 bg-white/90 shadow-md rounded-sm flex flex-col">
            <div className="h-3 w-full bg-red-500" />
            <div className="flex-1 p-1">
              <div className="w-full h-2 bg-gray-300 mb-1 rounded-sm" />
              <div className="w-3/4 h-2 bg-gray-300 mb-1 rounded-sm" />
              <div className="w-full h-2 bg-gray-300 mb-1 rounded-sm" />
              <div className="w-2/3 h-2 bg-gray-300 rounded-sm" />
            </div>
          </div>
          <div className="absolute bottom-2 right-2 rounded-full bg-primary/90 p-2 shadow-sm">
            <FileText size={14} className="text-white" />
          </div>
        </div>
      )
    }
    
    // 📚 For book content, show book cover
    if (isBook) {
      return (
        <div className="relative w-full h-full bg-gradient-to-r from-amber-900/20 to-yellow-900/20 overflow-hidden rounded-md flex items-center justify-center">
          <div className="w-16 h-24 bg-gradient-to-r from-amber-700 to-amber-600 shadow-lg rounded-sm relative">
            <div className="absolute left-0 top-0 bottom-0 w-3 bg-amber-800 rounded-l-sm" />
            <div className="absolute left-4 right-2 top-2 bottom-2">
              <div className="w-full h-2 bg-white/30 mb-1 rounded-sm" />
              <div className="w-3/4 h-2 bg-white/30 mb-3 rounded-sm" />
              <div className="w-full h-1 bg-white/30 mb-1 rounded-sm" />
              <div className="w-full h-1 bg-white/30 mb-1 rounded-sm" />
              <div className="w-3/4 h-1 bg-white/30 rounded-sm" />
            </div>
          </div>
          <div className="absolute bottom-2 right-2 rounded-full bg-primary/90 p-2 shadow-sm">
            <Book size={14} className="text-white" />
          </div>
        </div>
      )
    }
    
    // 🖼️ For image content, show the image
    if (isImage && thumbnail) {
      return (
        <div className="relative w-full h-full overflow-hidden rounded-md">
          <img 
            src={thumbnail} 
            alt={title || "Image"} 
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-2 right-2 rounded-full bg-primary/90 p-2 shadow-sm">
            <ImageIcon size={14} className="text-white" />
          </div>
        </div>
      )
    }
    
    // Default preview for other types
    return (
      <div className="relative w-full h-full bg-gradient-to-r from-slate-900/20 to-slate-800/20 overflow-hidden rounded-md flex items-center justify-center">
        <File size={32} className="text-slate-400/70" />
      </div>
    )
  }
  
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.98 }}
      className={cn(
        "w-24 h-24 rounded-md overflow-hidden shadow-md cursor-pointer",
        className
      )}
      onClick={onClick}
    >
      {renderPreview()}
    </motion.div>
  )
}
