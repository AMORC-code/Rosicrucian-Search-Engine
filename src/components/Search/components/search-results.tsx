"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { FileText, ExternalLink, Play, File, Music, Video, Book } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "./ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip"
import { ResourcePreview } from "./resource-preview"

interface SearchResult {
  text?: string
  content?: string
  score: number
  metadata: {
    source: string
    page?: number
    title?: string
    type?: string
    year?: number
    file_path?: string
    url?: string
    timestamp?: number | string
    duration?: number | string
    thumbnail?: string
    // 🔗 New deeplink fields from backend
    thumbnail_url?: string
    pdf_url?: string
    epub_url?: string
    deeplink?: string
    audio_url?: string
    video_id?: string
    video_url?: string
    timestamp_seconds?: number
    volume?: number
    issue?: number
  }
}

interface SearchResultsProps {
  className?: string
  results?: SearchResult[]
  isLoading?: boolean
  error?: string
  response?: string
}

/**
 * 🎭 The Time Alchemist - Transmutes Seconds into Mystical Durations
 *
 * "Transforms raw temporal measurements into elegant expressions,
 * Making the flow of time comprehensible to mortal understanding."
 */
const formatDuration = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const remainingSeconds = Math.floor(seconds % 60)
  
  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`
  }
  
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
}

/**
 * 🎭 The Resource Handler - Mystical Gateway to Knowledge
 *
 * "Opens the portals to wisdom's domains,
 * Each file type a key to different realms of understanding."
 */
const getFileTypeIcon = (type?: string) => {
  if (!type) return <File size={16} className="text-muted-foreground" />;
  
  const fileType = type.toLowerCase();
  
  if (fileType.includes('pdf')) return <FileText size={16} className="text-red-400" />;
  if (fileType.includes('video') || fileType.includes('mp4') || fileType.includes('youtube')) 
    return <Video size={16} className="text-blue-400" />;
  if (fileType.includes('audio') || fileType.includes('mp3') || fileType.includes('podcast')) 
    return <Music size={16} className="text-green-400" />;
  if (fileType.includes('book') || fileType.includes('text')) 
    return <Book size={16} className="text-amber-400" />;
  
  return <File size={16} className="text-muted-foreground" />;
};

/**
 * 🎭 The Resource Gatekeeper - Determines Access to Knowledge
 *
 * "Discerns which portals can be opened,
 * Guiding seekers to accessible treasures of wisdom."
 */
const canOpenResource = (result: SearchResult): boolean => {
  const { metadata } = result;

  // Check for new deeplink fields first
  if (metadata.deeplink || metadata.pdf_url || metadata.epub_url ||
      metadata.audio_url || metadata.video_url) {
    return true;
  }

  // PDF files with source or file_path
  if (metadata.type?.toLowerCase().includes('pdf') && (metadata.source || metadata.file_path))
    return true;

  // YouTube videos with URL
  if ((metadata.type?.toLowerCase().includes('video') || metadata.type?.toLowerCase().includes('youtube')) && metadata.url)
    return true;

  // Audio files with URL
  if ((metadata.type?.toLowerCase().includes('audio') || metadata.type?.toLowerCase().includes('podcast')) && metadata.url)
    return true;

  // External links
  if (metadata.url) return true;

  return false;
};

/**
 * 🎭 The Resource Labeler - Names the Mystical Portals
 *
 * "Bestows meaningful titles upon knowledge gateways,
 * So seekers may know what treasures await beyond."
 */
const getResourceLabel = (result: SearchResult): string => {
  const { metadata } = result;
  const type = metadata.type?.toLowerCase() || '';
  
  if (type.includes('pdf')) return 'PDF';
  if (type.includes('youtube')) return 'Video';
  if (type.includes('video')) return 'Video';
  if (type.includes('audio')) return 'Audio';
  if (type.includes('podcast')) return 'Podcast';
  
  return 'Resource';
};

/**
 * 🎭 The Portal Opener - Unlocks Mystical Knowledge
 *
 * "Activates the gateways to different realms of wisdom,
 * Each opening revealing unique insights to the seeker."
 */
const handleOpenResource = (result: SearchResult) => {
  const { metadata } = result;
  const type = metadata.type?.toLowerCase() || '';

  // 🎯 Priority 1: Use deeplink if available (includes timestamps)
  if (metadata.deeplink) {
    window.open(metadata.deeplink, '_blank');
    return;
  }

  // 🎬 Priority 2: Handle YouTube videos with video_id
  if (metadata.video_id || metadata.video_url) {
    const videoUrl = metadata.video_url || `https://www.youtube.com/watch?v=${metadata.video_id}`;
    const timestamp = metadata.timestamp_seconds || metadata.timestamp;

    if (timestamp && typeof timestamp === 'number') {
      window.open(`${videoUrl}${videoUrl.includes('?') ? '&' : '?'}t=${Math.floor(timestamp)}`, '_blank');
    } else {
      window.open(videoUrl, '_blank');
    }
    return;
  }

  // 🎙️ Priority 3: Handle audio/podcasts
  if (metadata.audio_url) {
    window.open(metadata.audio_url, '_blank');
    return;
  }

  // 📚 Priority 4: Handle books (prefer EPUB over PDF)
  if (type.includes('book')) {
    if (metadata.epub_url) {
      window.open(metadata.epub_url, '_blank');
      return;
    }
    if (metadata.pdf_url) {
      window.open(metadata.pdf_url, '_blank');
      return;
    }
  }

  // 📄 Priority 5: Handle PDF files (digests, documents)
  if (metadata.pdf_url) {
    const page = metadata.page || 1;
    window.open(`${metadata.pdf_url}#page=${page}`, '_blank');
    return;
  }

  // Legacy handling for backward compatibility
  if (type.includes('pdf')) {
    const pdfPath = metadata.file_path || metadata.source;
    const page = metadata.page || 1;
    window.open(`${pdfPath}#page=${page}`, '_blank');
    return;
  }

  if ((type.includes('video') || type.includes('youtube')) && metadata.url) {
    let videoUrl = metadata.url;
    if (metadata.timestamp) {
      let seconds = metadata.timestamp;
      if (typeof seconds === 'string') {
        const parts = seconds.split(':').map(Number);
        if (parts.length === 2) {
          seconds = parts[0] * 60 + parts[1];
        } else if (parts.length === 3) {
          seconds = parts[0] * 3600 + parts[1] * 60 + parts[2];
        }
      }
      if (videoUrl.includes('?')) {
        videoUrl += `&t=${seconds}s`;
      } else {
        videoUrl += `?t=${seconds}s`;
      }
    }
    window.open(videoUrl, '_blank');
    return;
  }

  if ((type.includes('audio') || type.includes('podcast')) && metadata.url) {
    window.open(metadata.url, '_blank');
    return;
  }

  if (metadata.url) {
    window.open(metadata.url, '_blank');
    return;
  }
};

export function SearchResults({
  className,
  results = [],
  isLoading = false,
  error,
  response,
}: SearchResultsProps) {
  if (isLoading) {
    return (
      <div className={cn("space-y-4 p-4", className)}>
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="animate-pulse space-y-2 rounded-lg border border-border/50 bg-muted/50 p-4"
          >
            <div className="h-4 w-3/4 rounded bg-muted" />
            <div className="h-3 w-1/2 rounded bg-muted" />
          </div>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className={cn("p-4 text-center text-destructive", className)}>
        <p>Error: {error}</p>
        <p className="mt-2 text-sm text-muted-foreground">
          Please try again later or contact support if the problem persists.
        </p>
      </div>
    )
  }

  if (!results.length && !response) {
    return (
      <div className={cn("p-4 text-center text-muted-foreground", className)}>
        No results found. Try adjusting your search terms.
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={cn("space-y-6 p-4", className)}
    >
      {/* AI Summary */}
      {response && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-lg border border-primary/20 bg-primary/5 p-6 shadow-sm"
        >
          <h2 className="text-lg font-semibold text-primary mb-3">Synopsis</h2>
          <p className="text-foreground leading-relaxed whitespace-pre-wrap">{response}</p>
        </motion.div>
      )}

      {/* Search Results */}
      {results.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-foreground">Source Documents</h3>
          {results.map((result, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="rounded-lg border border-border/50 bg-card p-4 shadow-sm transition-colors hover:bg-accent/5"
            >
              <div className="flex gap-4">
                {/* Resource Preview */}
                <div className="flex-shrink-0">
                  <ResourcePreview
                    type={result.metadata.type || ""}
                    url={result.metadata.url || result.metadata.deeplink || result.metadata.pdf_url}
                    title={result.metadata.title}
                    thumbnail={(result.metadata.thumbnail_url || result.metadata.thumbnail) as string}
                    onClick={() => canOpenResource(result) && handleOpenResource(result)}
                  />
                </div>
                
                {/* Resource Content */}
                <div className="flex-1 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-medium text-accent-foreground flex items-center gap-2">
                      {getFileTypeIcon(result.metadata.type)}
                      <span>
                        {result.metadata.source}
                        {result.metadata.page && ` - Page ${result.metadata.page}`}
                      </span>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Score: {(result.score * 100).toFixed(1)}%
                    </div>
                  </div>
                  {result.metadata.title && (
                    <h3 className="font-semibold text-foreground">
                      {result.metadata.title}
                    </h3>
                  )}
                  <p className="text-sm text-muted-foreground">{result.text || result.content}</p>
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex flex-wrap gap-2">
                      {result.metadata.type && (
                        <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                          {result.metadata.type}
                        </span>
                      )}
                      {result.metadata.year && (
                        <span className="rounded-full bg-secondary/10 px-2 py-0.5 text-xs font-medium text-secondary-foreground">
                          {result.metadata.year}
                        </span>
                      )}
                      {result.metadata.volume && result.metadata.issue && (
                        <span className="rounded-full bg-amber-500/10 px-2 py-0.5 text-xs font-medium text-amber-500">
                          Vol. {result.metadata.volume}, Issue {result.metadata.issue}
                        </span>
                      )}
                      {result.metadata.duration && (
                        <span className="rounded-full bg-blue-500/10 px-2 py-0.5 text-xs font-medium text-blue-500">
                          {typeof result.metadata.duration === 'number'
                            ? formatDuration(result.metadata.duration)
                            : result.metadata.duration}
                        </span>
                      )}
                      {result.metadata.timestamp_seconds && (
                        <span className="rounded-full bg-purple-500/10 px-2 py-0.5 text-xs font-medium text-purple-500">
                          @ {formatDuration(result.metadata.timestamp_seconds)}
                        </span>
                      )}
                    </div>
                    {canOpenResource(result) && (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleOpenResource(result)}
                              className="gap-1 hover:bg-primary/10 transition-colors"
                            >
                              <ExternalLink size={14} />
                              Open {getResourceLabel(result)}
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Open this {getResourceLabel(result).toLowerCase()}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  )
}
