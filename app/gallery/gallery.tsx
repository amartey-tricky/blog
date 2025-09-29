"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { motion } from "motion/react"
import { Loader2 } from "lucide-react"

// Define the image type
type GalleryImage = {
  id: string
  url: string
  name: string
}

// Bento grid sizes configuration
const bentoSizes = [
  "col-span-2 row-span-2", // Large square
  "col-span-1 row-span-1", // Small square
  "col-span-2 row-span-1", // Wide rectangle
  "col-span-1 row-span-2", // Tall rectangle
  "col-span-1 row-span-1", // Small square
  "col-span-2 row-span-1", // Wide rectangle
  "col-span-1 row-span-1", // Small square
  "col-span-1 row-span-1", // Small square
]

export function ImageGallery() {
  const [images, setImages] = useState<GalleryImage[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchImages = async () => {
      try {
        setLoading(true)
        const response = await fetch("/api/gallery")

        if (!response.ok) {
          throw new Error("Failed to fetch images")
        }

        const data = await response.json()
        setImages(data)
      } catch (err) {
        console.error("Error fetching images:", err)
        setError("Failed to load images. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    fetchImages()
  }, [])

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-lg text-muted-foreground">{error}</p>
      </div>
    )
  }

  if (images.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-lg text-muted-foreground">No images found</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="grid grid-cols-4 auto-rows-[200px] gap-4 max-w-6xl mx-auto">
        {images.map((image, index) => {
          const sizeClass = bentoSizes[index % bentoSizes.length]

          return (
            <motion.div
              key={image.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`${sizeClass} relative overflow-hidden rounded-xl group cursor-pointer`}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}>
              <Image
                src={image.url}
                alt={image.name}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </motion.div>
          )
        })}
      </motion.div>
    </div>
  )
}
