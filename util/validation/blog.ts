import { type } from "arktype"

export const BlogPostSchema = type({
  title: "string",
  content: "string",
  statusId: "number",
  createdAt: "Date",
})

export type BlogPost = typeof BlogPostSchema.t

export const BlogStatusSchema = type({
  id: "number",
  name: "string",
})

export type BlogStatus = typeof BlogStatusSchema.t

export const ImageSchema = type({
  id: "number",
  name: "string",
  url: "string",
  key: "string",
  size: "number",
  type: "string",
  createdAt: "Date",
  updatedAt: "string",
})

export type ImageData = typeof ImageSchema.t
