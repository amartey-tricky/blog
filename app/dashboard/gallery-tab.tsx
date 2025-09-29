"use client"

import { Trash2 } from "lucide-react"
import Image from "next/image"
import { useCallback, useEffect, useState } from "react"
import { toast } from "sonner"
import { deleteImage, getImages } from "@/app/actions"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader } from "@/components/ui/card"
import type { ImageData } from "@/util/validation/blog"

export function GalleryTab() {
  const [images, setImages] = useState<ImageData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchData = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const imageData = await getImages()

      // Handle null/undefined response
      if (!imageData) {
        console.warn("getImages() returned null or undefined")
        setImages([])
        return
      }

      // Ensure it's an array
      if (!Array.isArray(imageData)) {
        console.error("getImages() did not return an array:", imageData)
        setImages([])
        toast.error("Invalid data format received")
        return
      }

      // Validate each image object
      const validImages = imageData.filter((image): image is ImageData => {
        if (!image || typeof image !== "object") {
          console.warn("Invalid image object:", image)
          return false
        }

        // Check required properties
        const hasRequiredProps =
          typeof image.id === "number" &&
          typeof image.name === "string" &&
          typeof image.url === "string" &&
          image.createdAt

        if (!hasRequiredProps) {
          console.warn("Image missing required properties:", image)
          return false
        }

        return true
      })

      if (validImages.length !== imageData.length) {
        toast.error("Some images had invalid data and were filtered out")
      }

      setImages(validImages)
    } catch (error) {
      console.error("Error fetching images:", error)
      setError("Failed to fetch images")
      setImages([])
      toast.error("Failed to fetch images")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this image?")) {
      return
    }

    try {
      const result = await deleteImage(id)

      if (!result || result.success === false) {
        throw new Error("Delete operation failed")
      }

      toast.success("Image deleted successfully")

      // Optimistically update the UI
      setImages((prev) => prev.filter((img) => img.id !== id))

      // Refetch to ensure consistency
      await fetchData()
    } catch (error) {
      console.error("Error deleting image:", error)
      toast.error("Failed to delete image")
    }
  }

  const formatDate = (date: Date | string | null | undefined): string => {
    if (!date) {
      return "Unknown date"
    }

    try {
      const dateObj = typeof date === "string" ? new Date(date) : date

      if (isNaN(dateObj.getTime())) {
        return "Invalid date"
      }

      return dateObj.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    } catch (error) {
      console.warn("Error formatting date:", date, error)
      return "Invalid date"
    }
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-muted-foreground">Loading images...</div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Gallery</h2>
          <p className="text-muted-foreground">Manage your images ({images.length} images)</p>
        </div>
        <Button
          onClick={fetchData}
          variant="outline"
          size="sm">
          Refresh
        </Button>
      </div>

      {/* Gallery List */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {images.length === 0 ? (
          <Card className="md:col-span-2 lg:col-span-3">
            <CardContent className="p-6">
              <div className="text-center text-muted-foreground">No images found</div>
            </CardContent>
          </Card>
        ) : (
          images.map((image) => (
            <Card key={image.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <CardDescription className="text-muted-foreground">
                      Posted: {formatDate(image.createdAt)}
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(image.id)}
                      className="text-red-600 hover:text-red-700 border-red-200 hover:border-red-300"
                      aria-label={`Delete image ${image.name}`}>
                      <Trash2 className="w-4 h-4" />
                      <span className="sr-only">Delete image</span>
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="relative aspect-square overflow-hidden rounded-lg bg-gray-100">
                  <Image
                    src={image.url || "/placeholder-image.jpg"}
                    alt={image.name || "Untitled image"}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    onError={(e) => {
                      console.error("Image failed to load:", image.url)
                      // You could set a placeholder here
                    }}
                  />
                </div>
                <div className="mt-3">
                  <p className="text-sm font-medium truncate">{image.name || "Untitled"}</p>
                  {image.size && image.type && (
                    <p className="text-xs text-muted-foreground">
                      {(image.size / 1024).toFixed(1)} KB • {image.type}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
