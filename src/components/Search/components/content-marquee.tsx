"use client"

import { motion } from "framer-motion"

const ContentMarquee = () => {
  const items = [
    "Books",
    "Digests",
    "Symposiums",
    "Podcasts",
    "Videos",
    "Articles",
    "Monographs",
    "Lectures",
    "Workshops",
    "Presentations",
  ]

  return (
    <div className="relative flex overflow-hidden py-8 before:absolute before:left-0 before:top-0 before:z-10 before:h-full before:w-20 before:bg-gradient-to-r before:from-black before:to-transparent after:absolute after:right-0 after:top-0 after:z-10 after:h-full after:w-20 after:bg-gradient-to-l after:from-black after:to-transparent">
      {[...Array(2)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ x: 0 }}
          animate={{ x: "-50%" }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
            delay: i * 10,
          }}
          className="flex shrink-0 items-center gap-8 px-4"
        >
          {items.map((item, index) => (
            <div
              key={index}
              className="flex items-center gap-2 text-lg font-medium text-purple-300/50"
            >
              <span>{item}</span>
              <span className="text-purple-500/30">•</span>
            </div>
          ))}
        </motion.div>
      ))}
    </div>
  )
}

export default ContentMarquee
