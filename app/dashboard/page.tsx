"use client"
import { Toaster } from "sonner"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AnalyticsTab } from "./analytics-tab"
import { ArchivedTab } from "./archived-tab"
import { DraftsTab } from "./drafts-tab"
import { PostsTab } from "./posts-tab"
import { UploadTab } from "./upload-tab"
import { GalleryTab } from "./gallery-tab"

export default function Dashboard() {
  return (
    <div className="min-h-screen brand-bg">
      <div className="container mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold brand-text mb-2">Blog Dashboard</h1>
          <p className="brand-muted">Manage your blog posts and view analytics</p>
        </div>

        <Tabs
          defaultValue="analytics"
          className="w-full">
          <TabsList className="grid w-full grid-cols-6 mb-6">
            <TabsTrigger
              value="analytics"
              className="brand-text">
              Analytics
            </TabsTrigger>
            <TabsTrigger
              value="posts"
              className="brand-text">
              Posts
            </TabsTrigger>
            <TabsTrigger
              value="drafts"
              className="brand-text">
              Drafts
            </TabsTrigger>
            <TabsTrigger
              value="archived"
              className="brand-text">
              Archived
            </TabsTrigger>
            <TabsTrigger
              value="upload"
              className="brand-text">
              Upload
            </TabsTrigger>
            <TabsTrigger
              value="gallery"
              className="brand-text">
              Gallery
            </TabsTrigger>
          </TabsList>

          <TabsContent value="analytics">
            <AnalyticsTab />
          </TabsContent>

          <TabsContent value="posts">
            <PostsTab />
          </TabsContent>

          <TabsContent value="drafts">
            <DraftsTab />
          </TabsContent>

          <TabsContent value="archived">
            <ArchivedTab />
          </TabsContent>

          <TabsContent value="upload">
            <UploadTab />
          </TabsContent>

          <TabsContent value="gallery">
            <GalleryTab />
          </TabsContent>
        </Tabs>
      </div>
      <Toaster />
    </div>
  )
}
