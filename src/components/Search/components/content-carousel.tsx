"use client"

import { useRef } from "react"
import { ChevronLeft, ChevronRight, BookOpen, Headphones, Film, FileText, Star } from "lucide-react"
import { Button } from "@/components/Search/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/Search/components/ui/card"
import { Badge } from "@/components/Search/components/ui/badge"
import { cn } from "@/lib/utils"
import { useMobile } from "@/hooks/use-mobile"

interface ContentCarouselProps {
  contentType: string
  extended?: boolean
}

export default function ContentCarousel({ contentType, extended = false }: ContentCarouselProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const isMobile = useMobile()

  // Mock data generator based on content type
  const getMockData = () => {
    const count = extended ? 12 : 8
    const baseItems = Array.from({ length: count }, (_, i) => {
      const popularity = Math.floor(Math.random() * 5) + 1

      const commonProps = {
        id: `${contentType}-${i}`,
        title: getTitle(contentType, i),
        creator: getCreator(),
        popularity,
        tags: getTags(),
        date: getRandomDate(),
      }

      switch (contentType) {
        case "books":
          return {
            ...commonProps,
            type: "book",
            coverColor: getRandomColor(),
            pages: Math.floor(Math.random() * 400) + 100,
            imageUrl: getRosicrucianBookImage(i),
            description: getBookDescription(i),
          }
        case "podcasts":
          return {
            ...commonProps,
            type: "podcast",
            duration: `${Math.floor(Math.random() * 20) + 5}:${Math.floor(Math.random() * 60)
              .toString()
              .padStart(2, "0")}`,
            episodes: Math.floor(Math.random() * 30) + 1,
            imageUrl: "https://rosicrucian-podcasts.org/wp-content/uploads/2023/07/ROSC-LOGO-drop-shadow-300x300.png",
            description: getPodcastDescription(i),
          }
        case "videos":
          return {
            ...commonProps,
            type: "video",
            duration: `${Math.floor(Math.random() * 30) + 2}:${Math.floor(Math.random() * 60)
              .toString()
              .padStart(2, "0")}`,
            views: `${Math.floor(Math.random() * 900) + 100}K`,
            imageUrl: getRosicrucianVideoImage(i),
            description: getVideoDescription(i),
          }
        case "articles":
          return {
            ...commonProps,
            type: "article",
            source: getRandomSource(),
            readTime: `${Math.floor(Math.random() * 20) + 3} min read`,
            imageUrl: getRosicrucianArticleImage(i),
            description: getArticleDescription(i),
          }
        default:
          return commonProps
      }
    })

    return baseItems
  }

  const items = getMockData()

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const { current } = scrollContainerRef
      const scrollAmount = current.clientWidth * 0.8

      if (direction === "left") {
        current.scrollBy({ left: -scrollAmount, behavior: "smooth" })
      } else {
        current.scrollBy({ left: scrollAmount, behavior: "smooth" })
      }
    }
  }

  const getIcon = (type: string) => {
    switch (type) {
      case "book":
        return <BookOpen className="h-5 w-5" />
      case "podcast":
        return <Headphones className="h-5 w-5" />
      case "video":
        return <Film className="h-5 w-5" />
      case "article":
        return <FileText className="h-5 w-5" />
      default:
        return null
    }
  }

  return (
    <div className="relative group">
      {!isMobile && (
        <>
          <Button
            variant="ghost"
            size="icon"
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-background/80 backdrop-blur-sm border shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 -translate-x-1/2"
            onClick={() => scroll("left")}
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-background/80 backdrop-blur-sm border shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 translate-x-1/2"
            onClick={() => scroll("right")}
          >
            <ChevronRight className="h-6 w-6" />
          </Button>
        </>
      )}

      <div
        ref={scrollContainerRef}
        className="flex overflow-x-auto pb-6 pt-2 scrollbar-hide snap-x snap-mandatory"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {items.map((item: any, index: number) => {
          // Calculate size based on popularity for variable card sizes
          const sizeClass =
            item.popularity >= 4
              ? "min-w-[300px] md:min-w-[350px]"
              : item.popularity >= 3
                ? "min-w-[250px] md:min-w-[300px]"
                : "min-w-[200px] md:min-w-[250px]"

          return (
            <div key={item.id} className={cn("px-2 snap-start", sizeClass)}>
              <Card
                className={cn(
                  "overflow-hidden h-full transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/10 dark:hover:shadow-purple-400/10 group/card border-2 border-transparent hover:border-purple-200 dark:hover:border-purple-900/50",
                  "hover:translate-y-[-5px] hover:scale-[1.02]",
                )}
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  {item.type === "book" && (
                    <div
                      className="w-full h-full flex items-center justify-center p-0"
                      style={{ backgroundColor: "#f1f1f1" }}
                    >
                      <img 
                        src={item.imageUrl} 
                        alt={item.title}
                        className="w-full h-full object-contain"
                      />
                    </div>
                  )}

                  {item.type === "podcast" && (
                    <div className="w-full h-full bg-gradient-to-br from-indigo-500 to-purple-700 flex items-center justify-center p-4">
                      <img 
                        src={item.imageUrl}
                        alt={item.title}
                        className="w-2/3 h-2/3 object-contain rounded-lg"
                      />
                    </div>
                  )}

                  {item.type === "video" && (
                    <div className="relative w-full h-full">
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/card:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <div className="bg-white/20 backdrop-blur-sm rounded-full p-3 transform scale-90 group-hover/card:scale-100 transition-transform duration-300">
                          <Film className="h-8 w-8 text-white" />
                        </div>
                      </div>
                      <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                        {item.duration}
                      </div>
                    </div>
                  )}

                  {item.type === "article" && (
                    <div className="relative w-full h-full">
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-3">
                        <div className="text-white text-xs">
                          {item.source} • {item.readTime}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-medium line-clamp-1">{item.title}</h3>
                      <p className="text-sm text-muted-foreground line-clamp-1">{item.creator}</p>
                    </div>
                    <div className="flex items-center text-amber-500 ml-2">
                      <Star className="h-4 w-4 fill-amber-500" />
                      <span className="text-xs ml-1">{item.popularity.toFixed(1)}</span>
                    </div>
                  </div>
                  
                  <p className="text-xs text-muted-foreground mt-2 line-clamp-2">
                    {item.description}
                  </p>

                  <div className="flex flex-wrap gap-1 mt-3">
                    {item.tags.slice(0, 2).map((tag: string) => (
                      <Badge key={tag} variant= "secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>

                <CardFooter className="p-4 pt-0 flex items-center justify-between">
                  <div className="text-xs text-muted-foreground">{formatDate(item.date)}</div>
                  <div className="flex items-center text-xs">
                    {getIcon(item.type)}
                    <span className="ml-1">
                      {item.type === "book" && `${item.pages} pages`}
                      {item.type === "podcast" && `${item.episodes} episodes`}
                      {item.type === "video" && `${item.views} views`}
                      {item.type === "article" && item.readTime}
                    </span>
                  </div>
                </CardFooter>
              </Card>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// Helper functions for mock data
function getRandomColor() {
  const colors = [
    "#f87171",
    "#fb923c",
    "#fbbf24",
    "#a3e635",
    "#4ade80",
    "#2dd4bf",
    "#38bdf8",
    "#818cf8",
    "#c084fc",
    "#f472b6",
    "#fb7185",
  ]
  return colors[Math.floor(Math.random() * colors.length)]
}

function getTitle(type: string, index: number) {
  const bookTitles = [
    "Rosicrucian Principles for Home and Business",
    "Mental Poisoning",
    "The Mystical Life of Jesus",
    "The Secret Doctrines of Jesus",
    "Mansions of the Soul",
    "A Thousand Years of Yesterdays",
    "Self Mastery and Fate with the Cycles of Life",
    "The Symbolic Prophecy of the Great Pyramid",
    "Mental Alchemy",
    "Behold the Sign - Ancient Symbolism",
    "The Sanctuary of Self",
    "Rosicrucian Reflections",
  ]

  const podcastTitles = [
    "True Imagination in Alchemy",
    "Meditations on Expanding Our Awareness",
    "Commitment to the Soul",
    "Vestals",
    "Silence: Inner Learning through the Power of Silence",
    "Mysticism in the Evolution of Cultures",
    "The Mystical Path",
    "Detachment and Awareness",
    "The Rendezvous with Eternity",
    "Psychospiritual Alchemy",
    "Rosicrucian Meditations",
    "Mystic Symbolism Explored",
  ]

  const videoTitles = [
    "Introduction to Rosicrucianism",
    "The Ancient Mystical Order Rosae Crucis",
    "Rosicrucian Egyptian Museum Tour",
    "The Rosicrucian Approach to",
    "Mysticism and",
    "The Esoteric Principles of",
    "Understanding the Cosmic Laws of",
    "Rosicrucian Insight on",
    "Practical Applications of Mysticism in",
    "The Wisdom of the Ages:",
  ]

  const articleTitles = [
    "The Mystical Traditions of",
    "Esoteric Perspectives on",
    "Cosmic Consciousness and",
    "Rosicrucian Symposium: ",
    "The Hidden Wisdom in",
    "Unveiling the Mysteries of",
    "Rosicrucian Digest: ",
    "Mystical Practices for",
    "The Inner Journey to",
    "Metaphysical Principles of",
  ]

  switch (type) {
    case "books":
      return bookTitles[index % bookTitles.length]
    case "podcasts":
      return podcastTitles[index % podcastTitles.length]
    case "videos":
      return videoTitles[index % videoTitles.length] + " " + getRandomTopic()
    case "articles":
      return articleTitles[index % articleTitles.length] + " " + getRandomTopic()
    default:
      return "Untitled Content"
  }
}

function getRandomTopic() {
  const topics = [
    "Mysticism",
    "Alchemy",
    "Sacred Geometry",
    "Kabbalah",
    "Hermeticism",
    "Cosmic Consciousness",
    "Metaphysical Healing",
    "Ancient Egypt",
    "Sacred Traditions",
    "Esoteric Symbolism",
    "Meditation Techniques",
    "Visualization",
    "Attunement",
    "Reincarnation",
    "Spiritual Transformation",
  ]
  return topics[Math.floor(Math.random() * topics.length)]
}

function getCreator() {
  const creators = [
    "H. Spencer Lewis",
    "Ralph M. Lewis",
    "Julie Scott",
    "Christian Bernard",
    "Claudio Mazzucco",
    "Dennis William Hauck",
    "Julian Johnson",
    "Lonnie C. Edwards",
    "Christina d'Arcy",
    "Jeanne Guesdon",
    "Peter Bindon",
    "Deborah Nelson",
    "Hugh McCague",
    "Rosicrucian Order, AMORC",
    "Grand Lodge of the English Language Jurisdiction",
  ]
  return creators[Math.floor(Math.random() * creators.length)]
}

function getTags() {
  const allTags = [
    "Mysticism",
    "Alchemy",
    "Hermeticism",
    "Kabbalah",
    "Meditation",
    "Visualization",
    "Sacred Geometry",
    "Ancient Egypt",
    "Cosmic Laws",
    "Attunement",
    "Metaphysics",
    "Self-Development",
    "Esoteric",
    "Symbolism",
    "Initiation",
    "Consciousness",
    "Spiritual",
  ]

  const count = Math.floor(Math.random() * 3) + 1
  const shuffled = [...allTags].sort(() => 0.5 - Math.random())
  return shuffled.slice(0, count)
}

function getRandomDate() {
  const now = new Date()
  const pastDate = new Date(now)
  pastDate.setDate(now.getDate() - Math.floor(Math.random() * 365))
  return pastDate
}

function getRandomSource() {
  const sources = [
    "Rosicrucian Digest",
    "The Mystic Triangle",
    "AMORC Symposium",
    "Rosicrucian Cultural Center",
    "Rosicrucian Egyptian Museum",
    "Rosicrucian Research Library",
    "World Convention Proceedings",
    "Rosicrucian World Journal",
    "Appellatio Fraternitatis",
    "Positio Fraternitatis",
    "Grand Lodge Publications",
    "Rose+Croix Journal",
  ]
  return sources[Math.floor(Math.random() * sources.length)]
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date)
}

function getRosicrucianBookImage(index: number) {
  const bookImages = [
    "https://m.media-amazon.com/images/I/51lYslgcl6L._SY291_BO1,204,203,200_QL40_FMwebp_.jpg", // Rosicrucian Principles
    "https://m.media-amazon.com/images/I/41HWX6BSPAL._SY291_BO1,204,203,200_QL40_FMwebp_.jpg", // Mental Poisoning
    "https://m.media-amazon.com/images/I/51wfOZGQJTL._SY291_BO1,204,203,200_QL40_FMwebp_.jpg", // Mystical Life of Jesus
    "https://m.media-amazon.com/images/I/41-MYT9ASVL._SY291_BO1,204,203,200_QL40_FMwebp_.jpg", // Secret Doctrines of Jesus
    "https://m.media-amazon.com/images/I/51O3R4I3XJL._SY291_BO1,204,203,200_QL40_FMwebp_.jpg", // Mansions of the Soul
    "https://m.media-amazon.com/images/I/41SoQiQsjSL._SY291_BO1,204,203,200_QL40_FMwebp_.jpg", // A Thousand Years of Yesterdays
    "https://m.media-amazon.com/images/I/91+MRr1kkbL._AC_UY218_.jpg", // Self Mastery and Fate
    "https://m.media-amazon.com/images/I/31LokB3vt1L._SY291_BO1,204,203,200_QL40_FMwebp_.jpg", // Symbolic Prophecy
    "https://www.rosicrucian.org/sites/default/files/Mental%20Alchemy_0.jpg", // Mental Alchemy
    "https://www.rosicrucian.org/sites/default/files/Behold_the_Sign_5_0.jpg", // Behold the Sign
    "https://www.rosicrucian.org/sites/default/files/The%20Sanctuary%20of%20Self_0.jpg", // Sanctuary of Self
    "https://www.rosicrucian.org/sites/default/files/Rosicrucian%20Reflections_0.jpg", // Rosicrucian Reflections
  ]
  return bookImages[index % bookImages.length]
}

function getRosicrucianVideoImage(index: number) {
  const videoImages = [
    "https://i.ytimg.com/vi/T3MEvODjkUw/maxresdefault.jpg", // Introduction to Rosicrucianism
    "https://i.ytimg.com/vi/YaE9oSfWDiU/maxresdefault.jpg", // AMORC video
    "https://i.ytimg.com/vi/nNIo7O6i6Bo/maxresdefault.jpg", // Egyptian Museum
    "https://i.ytimg.com/vi/KxRBQ2KLxqM/maxresdefault.jpg", // Rosicrucian Park
    "https://i.ytimg.com/vi/qcT5oth-peQ/maxresdefault.jpg", // Rosicrucian Symbols
    "https://i.ytimg.com/vi/8JTGu3vAsyU/maxresdefault.jpg", // Principles
    "https://i.ytimg.com/vi/kSJJr9dJ8JI/maxresdefault.jpg", // Meditation
    "https://i.ytimg.com/vi/B1ZFZHZBqag/maxresdefault.jpg", // Mystery schools
  ]
  return videoImages[index % videoImages.length]
}

function getRosicrucianArticleImage(index: number) {
  const articleImages = [
    "https://d3a22923970efd2bf9f7-20527521190a575c8785ca9c934d30c1.ssl.cf5.rackcdn.com/V101_n2_2023_Rosicrucian_Writers_Small_1.jpg", // Rosicrucian Writers
    "https://d3a22923970efd2bf9f7-20527521190a575c8785ca9c934d30c1.ssl.cf5.rackcdn.com/V102-1-2024-Symposium-Presentations-Cover-Digest-Website-Small.jpg", // Symposium presentations
    "https://d3a22923970efd2bf9f7-20527521190a575c8785ca9c934d30c1.ssl.cf5.rackcdn.com/V101_n1_2023_Rosicrucian_Reflections_Small.jpg", // Reflections
    "https://d3a22923970efd2bf9f7-20527521190a575c8785ca9c934d30c1.ssl.cf5.rackcdn.com/V100_n2_2022_Expanding_Our_Awareness_Small.jpg", // Expanding awareness
    "https://d3a22923970efd2bf9f7-20527521190a575c8785ca9c934d30c1.ssl.cf5.rackcdn.com/V100_n1_2022_Sacred_Feminine_Small.jpg", // Sacred Feminine
    "https://d3a22923970efd2bf9f7-20527521190a575c8785ca9c934d30c1.ssl.cf5.rackcdn.com/V99_n2_2021_Living_in_Harmony_with_the_Natural_World-small.jpg", // Natural World
    "https://d3a22923970efd2bf9f7-20527521190a575c8785ca9c934d30c1.ssl.cf5.rackcdn.com/V_99_n1-2021-Being_of_Service_Digest_Cover-small.jpg", // Being of Service
    "https://d3a22923970efd2bf9f7-20527521190a575c8785ca9c934d30c1.ssl.cf5.rackcdn.com/V98_n2_2020_Radiant_Health_Digest_Cover-small.jpg", // Radiant Health
  ]
  return articleImages[index % articleImages.length]
}

function getBookDescription(index: number) {
  const descriptions = [
    "A practical guide to applying mystical principles in business, home, and daily life.",
    "How negative thinking affects us and practical methods to protect our psychic health.",
    "An examination of the mystical life of Jesus from esoteric and traditional perspectives.",
    "The hidden teachings attributed to Jesus that were only shared among initiated disciples.",
    "An exploration of the soul's journey through materiality and spiritual evolution.",
    "A fascinating tale of reincarnation and cosmic memory across many lifetimes.",
    "How to master cycles in life to better direct your destiny and personal evolution.",
    "Correlations between the Great Pyramid's measurements and prophecies of human history.",
    "Transform your mind and life through alchemical principles applied to consciousness.",
    "Understanding the ancient symbols and their practical applications in modern times.",
    "A comprehensive guide to self-mastery and spiritual development through Rosicrucian principles.",
    "Contemplative writings on the mystical path and Rosicrucian philosophy.",
  ]
  return descriptions[index % descriptions.length]
}

function getPodcastDescription(index: number) {
  const descriptions = [
    "Dennis William Hauck discusses the concept of 'True Imagination' as a divine and practical tool in Alchemy.",
    "Julian Johnson explores practices aimed at deepening self-awareness and mindfulness.",
    "Lonnie C. Edwards discusses the importance of dedicating oneself to the soul's expression.",
    "Christina d'Arcy examines the role of vestals in ancient and modern spiritual traditions.",
    "Jeanne Guesdon explores the power of silence in spiritual development and inner learning.",
    "Peter Bindon discusses how mysticism has influenced cultures throughout human history.",
    "Imperator Claudio Mazzucco shares insights on the mystical journey and spiritual unfoldment.",
    "Deborah Nelson explores the importance of detachment in spiritual awareness.",
    "Hugh McCague contemplates the soul's eternal journey through cosmic consciousness.",
    "A practical guide to spiritual alchemy and the transformation of consciousness.",
    "Guided meditations for attuning with cosmic consciousness and higher principles.",
    "An exploration of the hidden meanings behind mystical symbols and their practical use.",
  ]
  return descriptions[index % descriptions.length]
}

function getVideoDescription(index: number) {
  const descriptions = [
    "An overview of Rosicrucianism, its history, principles, and practices for seekers.",
    "The history and purpose of AMORC, the worldwide Rosicrucian organization.",
    "A virtual tour of the renowned Rosicrucian Egyptian Museum in San Jose, California.",
    "How Rosicrucian principles can be applied to enhance daily living and spiritual growth.",
    "The relationship between mysticism and various aspects of human experience.",
    "Understanding the fundamental esoteric principles that govern the universe.",
    "Practical explanations of cosmic laws and how they affect our lives.",
    "Rosicrucian perspectives on spiritual and metaphysical topics for practical application.",
    "How to apply mystical practices in everyday life for transformation and growth.",
    "Ancient wisdom traditions preserved and taught through the Rosicrucian Order.",
  ]
  return descriptions[index % descriptions.length]
}

function getArticleDescription(index: number) {
  const descriptions = [
    "An exploration of mystical traditions throughout history and their relevance today.",
    "Esoteric perspectives on various aspects of human experience and cosmic consciousness.",
    "Understanding cosmic consciousness and its relationship to human spiritual evolution.",
    "Proceedings from the latest Rosicrucian symposium on mystical and esoteric topics.",
    "Discovering the hidden wisdom within ancient teachings and modern applications.",
    "Revealing the deeper mysteries of existence through Rosicrucian philosophy.",
    "From the latest issue of the Rosicrucian Digest, exploring mystical topics in depth.",
    "Practical mystical exercises for spiritual development and cosmic attunement.",
    "Guidance for the soul's journey toward illumination and cosmic consciousness.",
    "The metaphysical principles that govern our universe and how to work with them.",
  ]
  return descriptions[index % descriptions.length]
}
