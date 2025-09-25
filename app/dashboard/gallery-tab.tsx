"use client"

import { getImages } from "@/app/actions"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Image from "next/image"
import {
  Download,
  Eye,
  Calendar,
  FileImage,
  Grid3x3,
  RefreshCw,
  Search,
  Filter,
  SortAsc,
  SortDesc,
  ImageIcon,
  Clock,
} from "lucide-react"
import { Suspense, useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence, useMotionValue, useTransform } from "motion/react"
import type { ImageData } from "@/util/validation/blog"

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
}

const itemVariants = {
  hidden: {
    opacity: 0,
    y: 20,
    scale: 0.95,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 260,
      damping: 20,
    },
  },
  exit: {
    opacity: 0,
    y: -20,
    scale: 0.95,
    transition: {
      duration: 0.2,
    },
  },
}

const cardHoverVariants = {
  initial: { scale: 1, rotateY: 0 },
  hover: {
    scale: 1.03,
    rotateY: 5,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 20,
    },
  },
}

const overlayVariants = {
  hidden: { opacity: 0, backdropFilter: "blur(0px)" },
  visible: {
    opacity: 1,
    backdropFilter: "blur(8px)",
    transition: {
      duration: 0.3,
      ease: "easeOut",
    },
  },
}

const buttonVariants = {
  initial: { scale: 1, y: 0 },
  hover: {
    scale: 1.05,
    y: -2,
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 10,
    },
  },
  tap: {
    scale: 0.95,
    transition: {
      duration: 0.1,
    },
  },
}

// Loading skeleton component with animations
function GallerySkeleton() {
  return (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}>
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <motion.div
          className="h-8 bg-gray-200 rounded-md w-48"
          animate={{
            opacity: [0.5, 1, 0.5],
            scale: [1, 1.02, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <div className="flex gap-2">
          <motion.div
            className="h-10 bg-gray-200 rounded-md w-32"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity, delay: 0.2 }}
          />
          <motion.div
            className="h-10 bg-gray-200 rounded-md w-24"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity, delay: 0.4 }}
          />
        </div>
      </div>

      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible">
        {Array.from({ length: 8 }).map((_, i) => (
          <motion.div
            key={i}
            className="bg-white rounded-lg shadow-sm border"
            variants={itemVariants}
            whileHover={{ y: -5 }}
            transition={{ type: "spring", stiffness: 300 }}>
            <motion.div
              className="aspect-square bg-gray-200 rounded-t-lg"
              animate={{
                opacity: [0.3, 0.7, 0.3],
                scale: [1, 1.05, 1],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                delay: i * 0.2,
              }}
            />
            <div className="p-4 space-y-3">
              <motion.div
                className="h-4 bg-gray-200 rounded w-3/4"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity, delay: i * 0.1 }}
              />
              <motion.div
                className="h-3 bg-gray-200 rounded w-1/2"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity, delay: i * 0.1 + 0.3 }}
              />
              <div className="flex gap-2">
                <motion.div
                  className="h-8 bg-gray-200 rounded w-16"
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity, delay: i * 0.1 + 0.6 }}
                />
                <motion.div
                  className="h-8 bg-gray-200 rounded w-16"
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity, delay: i * 0.1 + 0.9 }}
                />
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  )
}

// Enhanced image card component with 3D effects
function ImageCard({ image, index }: { image: ImageData; index: number }) {
  const [isHovered, setIsHovered] = useState(false)
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  const rotateX = useTransform(mouseY, [-100, 100], [10, -10])
  const rotateY = useTransform(mouseX, [-100, 100], [-10, 10])

  const formatFileSize = (bytes: number): string => {
    const sizes = ["B", "KB", "MB", "GB"]
    if (bytes === 0) return "0 B"
    const i = Math.floor(Math.log(bytes) / Math.log(1024))
    return `${Math.round((bytes / Math.pow(1024, i)) * 100) / 100} ${sizes[i]}`
  }

  const formatDate = (dateString: string): string => {
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(dateString))
  }

  const getImageTypeColor = (type: string): string => {
    const typeColorMap: Record<string, string> = {
      "image/jpeg": "bg-blue-100 text-blue-800",
      "image/jpg": "bg-blue-100 text-blue-800",
      "image/png": "bg-green-100 text-green-800",
      "image/webp": "bg-purple-100 text-purple-800",
      "image/gif": "bg-yellow-100 text-yellow-800",
      "image/svg+xml": "bg-red-100 text-red-800",
    }
    return typeColorMap[type] || "bg-gray-100 text-gray-800"
  }

  const handleDownload = async () => {
    try {
      const response = await fetch(image.url)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.download = image.name
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error("Download failed:", error)
    }
  }

  const handlePreview = () => {
    window.open(image.url, "_blank", "noopener,noreferrer")
  }

  const handleMouseMove = (event: React.MouseEvent) => {
    const rect = event.currentTarget.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    mouseX.set(event.clientX - centerX)
    mouseY.set(event.clientY - centerY)
  }

  return (
    <motion.div
      variants={itemVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      layout
      layoutId={`card-${image.key}`}
      style={{
        perspective: 1000,
        rotateX: isHovered ? rotateX : 0,
        rotateY: isHovered ? rotateY : 0,
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false)
        mouseX.set(0)
        mouseY.set(0)
      }}
      whileHover="hover"
      className="group cursor-pointer">
      <motion.div
        variants={cardHoverVariants}
        initial="initial"
        whileHover="hover"
        className="h-full">
        <Card className="overflow-hidden transition-all duration-500 hover:shadow-2xl border-0 shadow-lg">
          <motion.div
            className="relative aspect-square overflow-hidden"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.4, ease: "easeOut" }}>
            <motion.div
              initial={{ scale: 1.1, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{
                duration: 0.6,
                delay: index * 0.1,
                ease: "easeOut",
              }}>
              <Image
                src={image.url}
                alt={image.name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                loading="lazy"
              />
            </motion.div>

            <motion.div
              className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"
              variants={overlayVariants}
              initial="hidden"
              whileHover="visible">
              <motion.div
                className="absolute inset-0 flex items-center justify-center gap-3"
                initial={{ y: 20, opacity: 0 }}
                whileHover={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1, duration: 0.3 }}>
                <motion.div
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap">
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={handlePreview}
                    className="bg-white/90 hover:bg-white text-black backdrop-blur-sm">
                    <Eye className="h-4 w-4" />
                  </Button>
                </motion.div>
                <motion.div
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap">
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={handleDownload}
                    className="bg-white/90 hover:bg-white text-black backdrop-blur-sm">
                    <Download className="h-4 w-4" />
                  </Button>
                </motion.div>
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ x: 100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: index * 0.1 + 0.2 }}>
              <Badge className={`absolute top-3 right-3 text-xs backdrop-blur-sm ${getImageTypeColor(image.type)}`}>
                {image.type.split("/")[1].toUpperCase()}
              </Badge>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: index * 0.1 + 0.3 }}>
            <CardHeader className="pb-2">
              <motion.div
                whileHover={{ x: 5 }}
                transition={{ type: "spring", stiffness: 300 }}>
                <CardTitle
                  className="text-sm font-medium truncate"
                  title={image.name}>
                  {image.name}
                </CardTitle>
              </motion.div>
              <CardDescription className="flex items-center gap-1 text-xs">
                <motion.div
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}>
                  <FileImage className="h-3 w-3" />
                </motion.div>
                {formatFileSize(image.size)}
              </CardDescription>
            </CardHeader>

            <CardContent className="pt-0">
              <motion.div
                className="flex items-center gap-1 text-xs text-muted-foreground mb-3"
                whileHover={{ scale: 1.02 }}>
                <Clock className="h-3 w-3" />
                {formatDate(image.createdAt)}
              </motion.div>

              <motion.div
                className="flex gap-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.1 + 0.5 }}>
                <motion.div
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                  className="flex-1">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handlePreview}
                    className="w-full text-xs">
                    <Eye className="h-3 w-3 mr-1" />
                    View
                  </Button>
                </motion.div>
                <motion.div
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                  className="flex-1">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleDownload}
                    className="w-full text-xs">
                    <Download className="h-3 w-3 mr-1" />
                    Save
                  </Button>
                </motion.div>
              </motion.div>
            </CardContent>
          </motion.div>
        </Card>
      </motion.div>
    </motion.div>
  )
}

// Enhanced gallery controls with smooth transitions
function GalleryControls({
  searchTerm,
  setSearchTerm,
  sortBy,
  setSortBy,
  sortOrder,
  setSortOrder,
  filterType,
  setFilterType,
  totalImages,
  onRefresh,
  isLoading,
}: {
  searchTerm: string
  setSearchTerm: (term: string) => void
  sortBy: string
  setSortBy: (sort: string) => void
  sortOrder: "asc" | "desc"
  setSortOrder: (order: "asc" | "desc") => void
  filterType: string
  setFilterType: (type: string) => void
  totalImages: number
  onRefresh: () => void
  isLoading: boolean
}) {
  return (
    <motion.div
      className="flex flex-col lg:flex-row gap-4 justify-between items-start lg:items-center"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}>
      <motion.div
        className="flex items-center gap-3"
        whileHover={{ scale: 1.02 }}
        transition={{ type: "spring", stiffness: 300 }}>
        <motion.div
          animate={{
            rotate: [0, 360],
            scale: [1, 1.1, 1],
          }}
          transition={{
            rotate: { duration: 10, repeat: Infinity, ease: "linear" },
            scale: { duration: 2, repeat: Infinity },
          }}>
          <ImageIcon className="h-6 w-6 text-primary" />
        </motion.div>
        <h2 className="text-lg font-semibold">
          Gallery
          <motion.span
            key={totalImages}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 500 }}
            className="text-muted-foreground">
            ({totalImages} images)
          </motion.span>
        </h2>
      </motion.div>

      <motion.div
        className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}>
        <motion.div
          className="relative"
          whileFocus={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 300 }}>
          <motion.div
            animate={{ x: [-2, 2, -2] }}
            transition={{ duration: 2, repeat: Infinity }}>
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          </motion.div>
          <Input
            placeholder="Search images..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 w-full sm:w-64 transition-all duration-300 focus:shadow-lg"
            disabled={isLoading}
          />
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}>
          <Select
            value={filterType}
            onValueChange={setFilterType}
            disabled={isLoading}>
            <SelectTrigger className="w-full sm:w-36 transition-all duration-300 hover:shadow-md">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="image/jpeg">JPEG</SelectItem>
              <SelectItem value="image/png">PNG</SelectItem>
              <SelectItem value="image/webp">WebP</SelectItem>
              <SelectItem value="image/gif">GIF</SelectItem>
              <SelectItem value="image/svg+xml">SVG</SelectItem>
            </SelectContent>
          </Select>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}>
          <Select
            value={sortBy}
            onValueChange={setSortBy}
            disabled={isLoading}>
            <SelectTrigger className="w-full sm:w-32 transition-all duration-300 hover:shadow-md">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="createdAt">Date</SelectItem>
              <SelectItem value="name">Name</SelectItem>
              <SelectItem value="size">Size</SelectItem>
              <SelectItem value="type">Type</SelectItem>
            </SelectContent>
          </Select>
        </motion.div>

        <motion.div
          variants={buttonVariants}
          whileHover="hover"
          whileTap="tap">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
            disabled={isLoading}
            className="w-full sm:w-auto transition-all duration-300">
            <motion.div
              animate={{ rotate: sortOrder === "asc" ? 0 : 180 }}
              transition={{ duration: 0.3 }}>
              {sortOrder === "asc" ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />}
            </motion.div>
          </Button>
        </motion.div>

        <motion.div
          variants={buttonVariants}
          whileHover="hover"
          whileTap="tap">
          <Button
            variant="outline"
            size="sm"
            onClick={onRefresh}
            disabled={isLoading}
            className="w-full sm:w-auto transition-all duration-300">
            <motion.div
              animate={{ rotate: isLoading ? 360 : 0 }}
              transition={{
                duration: 1,
                repeat: isLoading ? Infinity : 0,
                ease: "linear",
              }}>
              <RefreshCw className="h-4 w-4" />
            </motion.div>
          </Button>
        </motion.div>
      </motion.div>
    </motion.div>
  )
}

// Client-side gallery content component
function GalleryContent({
  images,
  searchTerm,
  sortBy,
  sortOrder,
  filterType,
  isLoading,
  error,
}: {
  images: ImageData[]
  searchTerm: string
  sortBy: string
  sortOrder: "asc" | "desc"
  filterType: string
  isLoading: boolean
  error: string | null
}) {
  if (isLoading) {
    return <GallerySkeleton />
  }

  if (error) {
    return (
      <motion.div
        className="flex flex-col items-center justify-center py-16 text-center"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}>
        <motion.div
          animate={{
            rotate: [0, -10, 10, -10, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
          }}>
          <FileImage className="h-20 w-20 text-red-500 mb-6" />
        </motion.div>
        <motion.h3
          className="text-xl font-medium text-red-600 mb-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}>
          Failed to load gallery
        </motion.h3>
        <motion.p
          className="text-sm text-muted-foreground"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}>
          {error}
        </motion.p>
      </motion.div>
    )
  }

  // Filter images based on search term and type
  let filteredImages = images.filter((image: ImageData) => {
    const matchesSearch = image.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = filterType === "all" || image.type === filterType
    return matchesSearch && matchesType
  })

  // Sort images
  filteredImages.sort((a: ImageData, b: ImageData) => {
    let comparison = 0

    switch (sortBy) {
      case "name":
        comparison = a.name.localeCompare(b.name)
        break
      case "size":
        comparison = a.size - b.size
        break
      case "type":
        comparison = a.type.localeCompare(b.type)
        break
      case "createdAt":
      default:
        comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        break
    }

    return sortOrder === "desc" ? -comparison : comparison
  })

  if (filteredImages.length === 0) {
    return (
      <motion.div
        className="flex flex-col items-center justify-center py-16 text-center"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}>
        <motion.div
          animate={{
            y: [0, -10, 0],
            rotate: [0, 5, -5, 0],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}>
          <Grid3x3 className="h-20 w-20 text-muted-foreground mb-6" />
        </motion.div>
        <motion.h3
          className="text-xl font-medium text-muted-foreground mb-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}>
          No images found
        </motion.h3>
        <motion.p
          className="text-sm text-muted-foreground max-w-md"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}>
          {searchTerm || filterType !== "all"
            ? "Try adjusting your search or filter criteria"
            : "Upload some images to get started with your gallery"}
        </motion.p>
      </motion.div>
    )
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        exit="hidden"
        key={`${searchTerm}-${sortBy}-${sortOrder}-${filterType}`}>
        {filteredImages.map((image: ImageData, index: number) => (
          <ImageCard
            key={image.key}
            image={image}
            index={index}
          />
        ))}
      </motion.div>
    </AnimatePresence>
  )
}

// Main gallery component with client-side state management
export function GalleryTab() {
  const [images, setImages] = useState<ImageData[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState("createdAt")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")
  const [filterType, setFilterType] = useState("all")
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const router = useRouter()

  // Load images function
  const loadImages = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const fetchedImages = await getImages()
      setImages(fetchedImages)
    } catch (err) {
      console.error("Failed to load images:", err)
      setError(err instanceof Error ? err.message : "Failed to load images")
    } finally {
      setIsLoading(false)
    }
  }

  // Load images on mount
  useEffect(() => {
    loadImages()
  }, [])

  const handleRefresh = () => {
    loadImages()
    router.refresh()
  }

  return (
    <motion.div
      className="space-y-8 p-6 min-h-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}>
      <GalleryControls
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        sortBy={sortBy}
        setSortBy={setSortBy}
        sortOrder={sortOrder}
        setSortOrder={setSortOrder}
        filterType={filterType}
        setFilterType={setFilterType}
        totalImages={images.length}
        onRefresh={handleRefresh}
        isLoading={isLoading}
      />

      <GalleryContent
        images={images}
        searchTerm={searchTerm}
        sortBy={sortBy}
        sortOrder={sortOrder}
        filterType={filterType}
        isLoading={isLoading}
        error={error}
      />
    </motion.div>
  )
}
