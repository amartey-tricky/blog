"use client"

import { AlertCircle, CheckCircle2, FileImage, Upload } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { UploadButton, UploadDropzone } from "@/util/uploadthing"

interface UploadedFile {
  key: string
  url: string
  name: string
  size: number
}

export function UploadTab() {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([])
  const [isUploading, setIsUploading] = useState(false)

  const handleUploadComplete = (res: UploadedFile[] | undefined) => {
    if (res && res.length > 0) {
      setUploadedFiles((prev) => [...res, ...prev])
      toast.success(`Successfully uploaded ${res.length} file${res.length > 1 ? "s" : ""}`, {
        icon: <CheckCircle2 className="h-4 w-4" />,
        duration: 4000,
      })
      setIsUploading(false)
    }
  }

  const handleUploadError = (error: Error) => {
    console.error("Upload error:", error.message)
    toast.error("Failed to upload file", {
      description: error.message,
      icon: <AlertCircle className="h-4 w-4" />,
      duration: 5000,
    })
    setIsUploading(false)
  }

  const handleUploadBegin = () => {
    setIsUploading(true)
    // toast.loading("Uploading files...", {
    //   id: "upload-progress",
    // })
  }

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return `${parseFloat((bytes / k ** i).toFixed(2))} ${sizes[i]}`
  }

  return (
    <section className="space-y-6">
      {/* Upload Methods */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Upload Button Card */}
        <Card className="group hover:shadow-md transition-all duration-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5" />
              Quick Upload
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center py-8">
            <div className="mb-4">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-3">
                <FileImage className="h-8 w-8 text-primary" />
              </div>
              <p className="text-sm text-muted-foreground text-center">Click to select files</p>
            </div>

            <UploadButton
              endpoint="imageUploader"
              onClientUploadComplete={handleUploadComplete}
              onUploadError={handleUploadError}
              onUploadBegin={handleUploadBegin}
              appearance={{
                button:
                  "ut-ready:bg-primary ut-ready:bg-primary/90 ut-uploading:cursor-not-allowed bg-primary hover:bg-primary/90 after:bg-primary/10",
                allowedContent: "text-xs text-muted-foreground",
              }}
              content={{
                button({ ready }) {
                  if (ready) return "Choose Files"
                  return "Loading..."
                },
                allowedContent({ ready, fileTypes, isUploading }) {
                  if (!ready) return "Getting ready..."
                  if (isUploading) return "Uploading..."
                  return `Images up to 4MB`
                },
              }}
            />
          </CardContent>
        </Card>

        {/* Upload Dropzone Card */}
        <Card className="group hover:shadow-md transition-all duration-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5" />
              Drag & Drop
            </CardTitle>
          </CardHeader>
          <CardContent className="p-2">
            <UploadDropzone
              endpoint="imageUploader"
              onClientUploadComplete={handleUploadComplete}
              onUploadError={handleUploadError}
              onUploadBegin={handleUploadBegin}
              appearance={{
                container: "w-full border-2 border-dashed border-border hover:border-primary/50 transition-colors",
                uploadIcon: "text-primary",
                label: "text-primary hover:text-primary/80",
                allowedContent: "text-muted-foreground text-xs",
                button:
                  "ut-ready:bg-primary ut-ready:bg-primary/90 ut-uploading:cursor-not-allowed bg-primary hover:bg-primary/90",
              }}
              content={{
                uploadIcon({ ready }) {
                  if (!ready) return <Upload className="h-8 w-8 animate-pulse" />
                  return <Upload className="h-8 w-8" />
                },
                label({ ready }) {
                  if (ready) return "Drop files here or click to browse"
                  return "Getting ready..."
                },
                allowedContent({ ready, fileTypes, isUploading }) {
                  if (!ready) return "Preparing upload..."
                  if (isUploading) return "Uploading files..."
                  return "PNG, JPG, GIF up to 4MB"
                },
              }}
            />
          </CardContent>
        </Card>
      </div>

      {/* Upload Instructions */}
      <Card className="bg-muted/50">
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div className="space-y-2">
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                <span className="text-primary font-semibold">1</span>
              </div>
              <h4 className="font-medium">Select Files</h4>
              <p className="text-sm text-muted-foreground">
                Choose images from your device or drag them into the upload area
              </p>
            </div>
            <div className="space-y-2">
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                <span className="text-primary font-semibold">2</span>
              </div>
              <h4 className="font-medium">Upload</h4>
              <p className="text-sm text-muted-foreground">
                Files are automatically uploaded to UploadThing's secure servers
              </p>
            </div>
            <div className="space-y-2">
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                <span className="text-primary font-semibold">3</span>
              </div>
              <h4 className="font-medium">Done</h4>
              <p className="text-sm text-muted-foreground">Access your uploaded files in the Gallery tab</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Uploads */}
      {uploadedFiles.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Recent Uploads
              <span className="text-sm font-normal text-muted-foreground">
                {uploadedFiles.length} file{uploadedFiles.length !== 1 ? "s" : ""}
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {uploadedFiles.slice(0, 6).map((file) => (
                <div
                  key={file.key}
                  className="group relative aspect-video bg-muted rounded-lg overflow-hidden border hover:shadow-md transition-all duration-200">
                  <img
                    src={file.url}
                    alt={file.name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <div className="text-white text-center p-2">
                      <p className="text-sm font-medium truncate max-w-[150px]">{file.name}</p>
                      <p className="text-xs opacity-80">{formatFileSize(file.size)}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {uploadedFiles.length > 6 && (
              <div className="mt-4 text-center">
                <p className="text-sm text-muted-foreground">And {uploadedFiles.length - 6} more files...</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Upload Status */}
      {isUploading && (
        <Card className="border-primary/50 bg-primary/5">
          <CardContent className="pt-6">
            <div className="flex items-center justify-center space-x-2">
              <div className="animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full" />
              <span className="text-sm font-medium text-primary">Uploading files...</span>
            </div>
          </CardContent>
        </Card>
      )}
    </section>
  )
}
