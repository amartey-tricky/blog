"use client"

import { Eye, FileText, MoreHorizontal, Pencil, Plus, Trash2 } from "lucide-react"
import { useCallback, useEffect, useState } from "react"
import { toast } from "sonner"
import { deleteBlogPost, getBlogPosts, getBlogStatus, updateBlogPost } from "@/app/actions"
import { RichTextDisplay } from "@/components/dashboard/tiptap"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import BlogFormPost from "./blogform"

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

export function DraftsTab() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [statuses, setStatuses] = useState<BlogStatus[]>([])
  const [loading, setLoading] = useState(true)
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [viewingPost, setViewingPost] = useState<BlogPost | null>(null)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)

  const fetchData = useCallback(async () => {
    try {
      setLoading(true)
      const [postsData, statusesData] = await Promise.all([getBlogPosts(), getBlogStatus()])

      // Filter for draft posts only
      const draftPosts = postsData.filter((post) => {
        const status = statusesData.find((s) => s.id === post.statusId)
        return status?.name === "draft"
      })

      setPosts(draftPosts)
      setStatuses(statusesData)
    } catch (error) {
      console.error("Error fetching drafts:", error)
      toast.error("Failed to fetch drafts")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const handleFormSuccess = async () => {
    setIsDialogOpen(false)
    setEditingPost(null)
    await fetchData()
  }

  const handleFormCancel = () => {
    setIsDialogOpen(false)
    setEditingPost(null)
  }

  const handleEdit = (post: BlogPost) => {
    setEditingPost(post)
    setIsDialogOpen(true)
  }

  const handleView = (post: BlogPost) => {
    setViewingPost(post)
    setIsViewDialogOpen(true)
  }

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this draft?")) {
      try {
        await deleteBlogPost(id)
        toast.success("Draft deleted successfully")
        await fetchData()
      } catch (error) {
        console.error("Error deleting draft:", error)
        toast.error("Failed to delete draft")
      }
    }
  }

  const handlePublish = async (post: BlogPost) => {
    const publishedStatus = statuses.find((s) => s.name === "published")
    if (!publishedStatus) {
      toast.error("Published status not found")
      return
    }

    try {
      await updateBlogPost(post.id, {
        title: post.title,
        content: post.content,
        statusId: publishedStatus.id,
        createdAt: post.createdAt,
      })
      toast.success("Draft published successfully")
      await fetchData()
    } catch (error) {
      console.error("Error publishing draft:", error)
      toast.error("Failed to publish draft")
    }
  }

  const getStatusName = (statusId: number) => {
    return statuses.find((s) => s.id === statusId)?.name || "Unknown"
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
          <div className="text-center text-muted-foreground">Loading drafts...</div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Drafts</h2>
          <p className="text-muted-foreground">Manage your draft posts</p>
        </div>

        <Dialog
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg"
              onClick={() => {
                setEditingPost(null)
              }}>
              <Plus className="w-4 h-4 mr-2" />
              Create Draft
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-5xl w-[95vw] h-[90vh] flex flex-col p-0">
            <DialogHeader className="px-6 py-4 border-b shrink-0">
              <DialogTitle className="text-foreground">{editingPost ? "Edit Draft" : "Create New Draft"}</DialogTitle>
              <DialogDescription className="text-muted-foreground">
                {editingPost ? "Update your draft post" : "Create a new draft post"}
              </DialogDescription>
            </DialogHeader>

            <div className="flex-1 overflow-y-auto px-6 py-4">
              <BlogFormPost
                initialData={editingPost}
                onSuccess={handleFormSuccess}
                onCancel={handleFormCancel}
              />
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* View Dialog */}
      <Dialog
        open={isViewDialogOpen}
        onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-4xl w-[90vw] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-foreground">{viewingPost?.title}</DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Status: {viewingPost ? getStatusName(viewingPost.statusId) : ""} • Created:{" "}
              {viewingPost ? formatDate(viewingPost.createdAt) : ""}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="prose prose-lg max-w-none">
              <div
                className="text-foreground"
                dangerouslySetInnerHTML={{ __html: viewingPost?.content || "" }}
              />
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Drafts List */}
      <div className="grid gap-4">
        {posts.length === 0 ? (
          <Card>
            <CardContent className="p-6">
              <div className="text-center space-y-2">
                <FileText className="w-12 h-12 mx-auto text-muted-foreground opacity-50" />
                <div className="text-muted-foreground">No drafts found</div>
                <p className="text-sm text-muted-foreground">Create your first draft to get started</p>
              </div>
            </CardContent>
          </Card>
        ) : (
          posts.map((post) => (
            <Card
              key={post.id}
              className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <CardTitle className="text-foreground flex items-center gap-2">
                      <FileText className="w-4 h-4" />
                      {post.title}
                    </CardTitle>
                    <CardDescription className="text-muted-foreground">
                      Status: {getStatusName(post.statusId)} • Created: {formatDate(post.createdAt)}
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleView(post)}
                      className="hover:bg-blue-50 hover:border-blue-200">
                      <Eye className="w-4 h-4" />
                      <span className="sr-only">View draft</span>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(post)}
                      className="hover:bg-green-50 hover:border-green-200">
                      <Pencil className="w-4 h-4" />
                      <span className="sr-only">Edit draft</span>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePublish(post)}
                      className="hover:bg-purple-50 hover:border-purple-200 text-purple-600 hover:text-purple-700">
                      <FileText className="w-4 h-4" />
                      <span className="sr-only">Publish draft</span>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(post.id)}
                      className="hover:bg-red-50 hover:border-red-200 text-red-600 hover:text-red-700">
                      <Trash2 className="w-4 h-4" />
                      <span className="sr-only">Delete draft</span>
                    </Button>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm">
                          <MoreHorizontal className="w-4 h-4" />
                          <span className="sr-only">More actions</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleView(post)}>
                          <Eye className="w-4 h-4 mr-2" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleEdit(post)}>
                          <Pencil className="w-4 h-4 mr-2" />
                          Edit Draft
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handlePublish(post)}>
                          <FileText className="w-4 h-4 mr-2" />
                          Publish Draft
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDelete(post.id)}
                          className="text-red-600 focus:text-red-600">
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete Draft
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
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
