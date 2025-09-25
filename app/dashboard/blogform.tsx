"use client"

import { arktypeResolver } from "@hookform/resolvers/arktype"
import { useEffect, useState } from "react"
import { Controller, useForm } from "react-hook-form"
import { toast } from "sonner"
import { createBlogPost, getBlogStatus, updateBlogPost } from "@/app/actions"
import { Tiptap } from "@/components/dashboard/tiptap"
import { Button } from "@/components/ui/button"
import { DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { BlogPost, BlogStatus } from "@/util/validation/blog"
import { BlogPostSchema } from "@/util/validation/blog"

// Extended interface for database fields
interface BlogPostWithId extends BlogPost {
  id?: number
  slug?: string
  updatedAt?: Date
}

interface BlogFormPostProps {
  initialData?: BlogPostWithId | null
  onSuccess?: () => void
  onCancel?: () => void
}

export default function BlogFormPost({ initialData, onSuccess, onCancel }: BlogFormPostProps) {
  const [statuses, setStatuses] = useState<BlogStatus[]>([])

  const {
    register,
    handleSubmit,
    reset,
    control,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<BlogPost>({
    resolver: arktypeResolver(BlogPostSchema),
    defaultValues: {
      title: "",
      content: "",
      statusId: 0,
    },
  })

  useEffect(() => {
    async function fetchStatuses() {
      try {
        const result = await getBlogStatus()
        setStatuses(result)

        // Set default status if creating new post
        if (!initialData && result.length > 0) {
          const draftStatus = result.find((s) => s.name === "draft")
          if (draftStatus) {
            setValue("statusId", draftStatus.id)
          }
        }
      } catch (error) {
        console.error("Error fetching statuses:", error)
        toast.error("Failed to load statuses")
      }
    }
    fetchStatuses()
  }, [initialData, setValue])

  // Update form when initialData changes
  useEffect(() => {
    if (initialData) {
      setValue("title", initialData.title)
      setValue("content", initialData.content)
      setValue("statusId", initialData.statusId)
    } else {
      reset({
        title: "",
        content: "",
        statusId: 0,
      })
    }
  }, [initialData, setValue, reset])

  const onSubmit = async (data: BlogPost) => {
    try {
      // Validate that statusId is not 0
      if (data.statusId === 0) {
        toast.error("Please select a status")
        return
      }

      if (initialData?.id) {
        await updateBlogPost(initialData.id, data)
        toast.success("Blog post updated successfully")
      } else {
        await createBlogPost(data)
        toast.success("Blog post created successfully")
      }

      reset()
      onSuccess?.()
    } catch (error) {
      console.error("Error saving blog post:", error)
      toast.error(`Error ${initialData ? "updating" : "creating"} blog post`)
    }
  }

  const currentStatusId = watch("statusId")
  const currentContent = watch("content")

  return (
    <div className="max-w-4xl mx-auto">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-6">
        <div className="grid gap-6">
          {/* Title Field */}
          <div className="grid gap-3">
            <Label
              htmlFor="title"
              className="text-foreground font-medium">
              Title
            </Label>
            <Input
              id="title"
              placeholder="Enter your blog post title..."
              {...register("title")}
              className={`text-lg ${errors.title ? "border-red-500" : ""}`}
            />
            {errors.title && <p className="text-red-500 text-sm">{errors.title.message}</p>}
          </div>

          {/* Content Field */}
          <div className="grid gap-3">
            <Label
              htmlFor="content"
              className="text-foreground font-medium">
              Content
            </Label>
            <Controller
              name="content"
              control={control}
              render={({ field }) => (
                <div className={`${errors.content ? "border border-red-500 rounded-md" : ""}`}>
                  <Tiptap
                    content={field.value || ""}
                    onUpdate={field.onChange}
                    minHeight="300px"
                    className={errors.content ? "border-red-500" : ""}
                  />
                </div>
              )}
            />
            {errors.content && <p className="text-red-500 text-sm">{errors.content.message}</p>}
          </div>

          {/* Status Field */}
          <div className="grid gap-3">
            <Label
              htmlFor="status"
              className="text-foreground font-medium">
              Status
            </Label>
            <Controller
              name="statusId"
              control={control}
              render={({ field }) => (
                <Select
                  value={field.value > 0 ? field.value.toString() : ""}
                  onValueChange={(value) => field.onChange(parseInt(value, 10))}>
                  <SelectTrigger className={`w-full ${errors.statusId ? "border-red-500" : ""}`}>
                    <SelectValue placeholder="Select post status" />
                  </SelectTrigger>
                  <SelectContent>
                    {statuses.map((status) => (
                      <SelectItem
                        key={status.id}
                        value={status.id.toString()}>
                        <span className="capitalize font-medium">{status.name}</span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.statusId && <p className="text-red-500 text-sm">{errors.statusId.message}</p>}
          </div>
        </div>

        {/* Form Actions */}
        <DialogFooter className="gap-3 pt-6">
          {onCancel && (
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isSubmitting}
              className="px-6">
              Cancel
            </Button>
          )}
          <Button
            type="submit"
            disabled={isSubmitting || currentStatusId === 0}
            className="bg-primary text-primary-foreground hover:bg-primary/90 px-6">
            {isSubmitting ? "Saving..." : initialData ? "Update Post" : "Create Post"}
          </Button>
        </DialogFooter>

        {/* Optional: Word count display */}
        {currentContent && (
          <div className="text-sm text-muted-foreground text-right">
            Approximately {currentContent.split(/\s+/).length} words
          </div>
        )}
      </form>
    </div>
  )
}
