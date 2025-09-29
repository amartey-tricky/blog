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

  const fetchData = useCallback(async () => {
    try {
      setLoading(true)

      const imageData = await getImages()

      setImages(imageData)
    } catch (error) {
      console.error("Error fetching images:", error)
      toast.error("Failed to fetch images")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this image?")) {
      try {
        await deleteImage(id)
        toast.success("Image deleted successfully")
        await fetchData()
      } catch (error) {
        console.error("Error deleting image:", error)
        toast.error("Failed to delete image")
      }
    }
  }

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
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
          <p className="text-muted-foreground">Manage your images</p>
        </div>
      </div>

      {/* Gallery List */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {images.length === 0 ? (
          <Card>
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
                      className="text-red-600 hover:text-red-700 border-red-200 hover:border-red-300">
                      <Trash2 className="w-4 h-4" />
                      <span className="sr-only">Delete image</span>
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Image
                  src={image.url}
                  alt={image.name}
                  width={300}
                  height={300}
                  className="rounded-lg"
                />
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
