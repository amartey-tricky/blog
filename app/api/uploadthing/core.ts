import { createUploadthing, type FileRouter } from "uploadthing/next"
import { db } from "@/db"
import { images } from "@/db/schema"

const uploadThing = createUploadthing()

export const ourFileRouter = {
  imageUploader: uploadThing({
    image: {
      maxFileSize: "4MB",
      maxFileCount: 15,
    },
  }).onUploadComplete(async ({ metadata, file }) => {
    await db.insert(images).values({
      name: file.name,
      url: file.ufsUrl,
      key: file.key,
      size: file.size,
      type: file.type,
      createdAt: new Date(),
      updatedAt: file.lastModified ? new Date(file.lastModified) : new Date(),
    })
    console.log("File URL: ", file.ufsUrl)
    return { UploadComplete: file.name }
  }),
} satisfies FileRouter

export type OurFileRouter = typeof ourFileRouter
