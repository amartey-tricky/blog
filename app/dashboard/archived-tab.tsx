"use client"

import { RotateCcw, Trash2 } from "lucide-react"
import { useCallback, useEffect, useState } from "react"
import { toast } from "sonner"
import { deleteBlogPost, getBlogPosts, getBlogStatus, updateBlogPost } from "@/app/actions"
import { RichTextDisplay } from "@/components/dashboard/tiptap"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface BlogPost {
  id: number
  title: string
  content: string
  statusId: number
  slug: string
  createdAt: Date
  updatedAt: Date
}

interface BlogStatus {
  id: number
  name: string
}

export function ArchivedTab() {
  const [archivedPosts, setArchivedPosts] = useState<BlogPost[]>([])
  const [statuses, setStatuses] = useState<BlogStatus[]>([])
  const [loading, setLoading] = useState(true)

  const fetchData = useCallback(async () => {
    try {
      setLoading(true)
      const [postsData, statusesData] = await Promise.all([getBlogPosts(), getBlogStatus()])

      // Filter only archived posts
      const archived = postsData.filter((post) => {
        const status = statusesData.find((s) => s.id === post.statusId)
        return status?.name === "archived"
      })

      setArchivedPosts(archived)
      setStatuses(statusesData)
    } catch (error) {
      console.error("Error fetching archived posts:", error)
      toast.error("Failed to fetch archived posts")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const handleRestore = async (post: BlogPost) => {
    try {
      const draftStatus = statuses.find((s) => s.name === "draft")
      if (!draftStatus) {
        toast.error("Draft status not found")
        return
      }

      await updateBlogPost(post.id, {
        title: post.title,
        content: post.content,
        statusId: draftStatus.id,
        createdAt: post.createdAt,
      })

      toast.success("Post restored to drafts")
      await fetchData() // Refresh the data
    } catch (error) {
      console.error("Error restoring post:", error)
      toast.error("Failed to restore post")
    }
  }

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to permanently delete this post?")) {
      try {
        await deleteBlogPost(id)
        toast.success("Post permanently deleted")
        await fetchData() // Refresh the data
      } catch (error) {
        console.error("Error deleting post:", error)
        toast.error("Failed to delete post")
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
          <div className="text-center text-muted-foreground">Loading archived posts...</div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Archived Posts</h2>
        <p className="text-muted-foreground">Posts that have been archived</p>
      </div>

      <div className="grid gap-4">
        {archivedPosts.length === 0 ? (
          <Card>
            <CardContent className="p-6">
              <div className="text-center text-muted-foreground">No archived posts found</div>
            </CardContent>
          </Card>
        ) : (
          archivedPosts.map((post) => (
            <Card
              key={post.id}
              className="opacity-75 hover:opacity-100 transition-opacity">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <CardTitle className="text-foreground">{post.title}</CardTitle>
                    <CardDescription className="text-muted-foreground">
                      Archived • Created: {formatDate(post.createdAt)}
                    </CardDescription>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleRestore(post)}
                      className="text-muted-foreground hover:text-foreground">
                      <RotateCcw className="w-4 h-4 mr-1" />
                      Restore
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(post.id)}
                      className="text-red-600 hover:text-red-700 border-red-200 hover:border-red-300">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <RichTextDisplay
                  className="text-foreground line-clamp-3"
                  content={post.content}
                />
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
