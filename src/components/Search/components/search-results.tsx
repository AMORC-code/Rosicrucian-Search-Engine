"use client"

import * as React from "react"
import { motion } from "framer-motion"

import { cn } from "@/lib/utils"

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
  }
}

interface SearchResultsProps {
  className?: string
  results?: SearchResult[]
  isLoading?: boolean
  error?: string
  response?: string
}

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
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-medium text-accent-foreground">
                    {result.metadata.source}
                    {result.metadata.page && ` - Page ${result.metadata.page}`}
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
                <div className="flex gap-2">
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
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  )
}
