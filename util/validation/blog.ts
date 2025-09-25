import { type } from "arktype"

export const BlogPostSchema = type({
  title: "string",
  content: "string",
  statusId: "number",
  createdAt: "string.date",
})

export type BlogPost = typeof BlogPostSchema.t

export const BlogStatusSchema = type({
  id: "number",
  name: "'draft' | 'published' | 'archived'",
})

export type BlogStatus = typeof BlogStatusSchema.t

export const ImageSchema = type({
  name: "string",
  url: "string",
  key: "string",
  size: "number",
  type: "string",
  createdAt: "string",
  updatedAt: "string",
})

export type ImageData = typeof ImageSchema.t
