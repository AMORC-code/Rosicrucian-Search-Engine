"use client"


import * as React from "react"
import { motion } from "framer-motion"
import { Search as SearchIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/Search/components/ui/button"
import { Input } from "@/components/Search/components/ui/input"
import { SearchResults } from "@/components/Search/components/search-results"
import { useToast } from "@/hooks/use-toast"
import { ParticleBackground } from "@/components/Search/components/particle-background"
import GlobeAnimation from "@/components/Search/components/globe-animation"
import { TypewriterEffect } from "@/components/Search/components/typewriter-effect"

interface SearchExperienceProps {
  className?: string
}

export default function SearchExperience({
  className,
}: SearchExperienceProps) {
  const [query, setQuery] = React.useState("")
  const [results, setResults] = React.useState<any[]>([])
  const [response, setResponse] = React.useState<string | undefined>()
  const [isLoading, setIsLoading] = React.useState(false)
  const [error, setError] = React.useState<string | undefined>()
  const { toast } = useToast()
  const [hasSearched, setHasSearched] = React.useState(false)

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!query.trim()) {
      toast({
        title: "Please enter a search query",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    setError(undefined)
    setHasSearched(true)

    try {
      const response = await fetch("/api/search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: query.trim(),
          mode: "semantic",
          top_k: 10,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => null)
        throw new Error(
          errorData?.error || 
          errorData?.details || 
          `Failed to fetch search results (${response.status})`
        )
      }

      const data = await response.json()
      
      // Handle both old format (results) and new format (sources)
      const results = data.sources || data.results || []
      if (!Array.isArray(results)) {
        throw new Error("Invalid response format from API")
      }

      setResults(results)
      setResponse(data.response)
      setError(undefined)
    } catch (err) {
      console.error("Search error:", err)
      const errorMessage = err instanceof Error ? err.message : "An unexpected error occurred"
      setError(errorMessage)
      toast({
        title: "Search Error",
        description: errorMessage,
        variant: "destructive",
      })
      setResults([])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className={cn(
      "relative min-h-screen w-full bg-gradient-to-b from-slate-950 via-indigo-950 to-purple-950 text-white",
      className
    )}>
      {/* Animated background */}
      <div className="absolute inset-0 z-0">
        <ParticleBackground />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-12 flex flex-col items-center min-h-screen">
        {/* Header with animated title */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: "easeOut" }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-indigo-400">
            Rosicrucian Knowledge Explorer
          </h1>
          
          <div className="p-4">
            <p className="text-6xl md:text-7xl text-purple-200 max-w-2xl mx-auto my-1">
              🌹
            </p>
          </div>
          
          <div className="relative z-20">
            <TypewriterEffect 
              text="Discover insights across books, digests, symposiums, podcasts, videos, and more"
              className="text-lg md:text-xl max-w-2xl mx-auto text-purple-200 font-medium"
            />
          </div>
        </motion.div>

        {/* Search section */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.9 }}
          className="w-full max-w-3xl mx-auto mb-16"
        >
          <div className="relative">
            <form onSubmit={handleSearch} className="relative">
              <div className="relative rounded-xl overflow-hidden shadow-[0_0_30px_rgba(168,85,247,0.2)] bg-black/30 backdrop-blur-xl">
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 animate-gradient-x"></div>
                <div className="relative flex items-center">
                  <SearchIcon className="absolute left-5 h-5 w-5 text-purple-300" />
                  <Input
                    type="search"
                    placeholder="What knowledge are you seeking?"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="h-16 pl-14 pr-32 bg-transparent border-0 text-lg text-white placeholder:text-purple-300/70 focus-visible:ring-0 focus-visible:ring-offset-0"
                  />
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="absolute right-2 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white border-0 h-12 px-6"
                  >
                    {isLoading ? (
                      <motion.div
                        className="h-5 w-5 border-2 border-t-transparent border-white rounded-full"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      />
                    ) : (
                      <>
                        <SearchIcon className="h-5 w-5 mr-2" />
                        Search
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </motion.div>

        {/* Globe animation when not searched */}
        {!hasSearched && !isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 1 }}
            className="mt-16 flex justify-center items-center relative w-full"
          >
            <div className="relative z-10 w-[350px] h-[350px] md:w-[500px] md:h-[500px] flex items-center justify-center">
              <GlobeAnimation />
            </div>
          </motion.div>
        )}

        {/* Search results */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full"
        >
          {hasSearched && (
            <SearchResults
              results={results}
              response={response}
              isLoading={isLoading}
              error={error}
            />
          )}
        </motion.div>
      </div>
    </div>
  )
}