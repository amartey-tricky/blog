"use server"

import { count, eq } from "drizzle-orm"
import { revalidatePath } from "next/cache"
import { db } from "@/db"
import { blogPost, blogStatus, images } from "@/db/schema"
import { Slugify } from "@/util/slugify"
import type { BlogPost, BlogStatus } from "@/util/validation/blog"

export async function getImages() {
  try {
    const image = await db.select().from(images)
    return image
  } catch (error) {
    console.error("Error getting images: ", error)
    return []
  }
}

export async function deleteImage(id: number) {
  try {
    await db.delete(images).where(eq(images.id, id))

    return { success: true }
  } catch (error) {
    console.error("Error deleting image: ", error)
    throw new Error("Error deleting image")
  }
}

export async function generateUniqueSlug(title: string, excludeId?: number): Promise<string> {
  const baseSlug = Slugify(title)
  let slug = baseSlug
  let counter = 1

  while (true) {
    const existingPost = excludeId
      ? await db
          .select({ id: blogPost.id })
          .from(blogPost)
          .where(eq(blogPost.slug, slug))
          .then((results) => results.filter((post) => post.id !== excludeId))
      : await db.select({ id: blogPost.id }).from(blogPost).where(eq(blogPost.slug, slug))

    if (existingPost.length === 0) {
      break
    }

    slug = `${baseSlug}-${counter}`
    counter++
  }

  return slug
}

export async function createStatus(data: BlogStatus) {
  try {
    await db.insert(blogStatus).values({
      name: data.name,
    })
    revalidatePath("/dashboard")
    return { success: true }
  } catch (error) {
    console.error("Error creating status: ", error)
    throw new Error("Error creating status")
  }
}

export async function getBlogStatus() {
  try {
    const result = await db.select().from(blogStatus)
    return result
  } catch (error) {
    console.error("Error getting blog status: ", error)
    return []
  }
}

export async function getBlogStatusById(id: number) {
  try {
    const [result] = await db.select().from(blogStatus).where(eq(blogStatus.id, id))
    return result || null
  } catch (error) {
    console.error("Error getting blog status by id: ", error)
    return null
  }
}

export async function createBlogPost(data: BlogPost) {
  try {
    const slug = await generateUniqueSlug(data.title)
    const now = new Date()

    await db.insert(blogPost).values({
      title: data.title,
      content: data.content,
      statusId: data.statusId,
      slug,
      createdAt: now,
      updatedAt: now,
    })

    revalidatePath("/dashboard")
    return { success: true }
  } catch (error) {
    console.error("Error creating blog post: ", error)
    throw new Error("Error creating blog post")
  }
}

export async function updateBlogPost(id: number, data: BlogPost) {
  try {
    const slug = await generateUniqueSlug(data.title, id)

    await db
      .update(blogPost)
      .set({
        title: data.title,
        content: data.content,
        statusId: data.statusId,
        slug,
        updatedAt: new Date(),
      })
      .where(eq(blogPost.id, id))

    revalidatePath("/dashboard")
    return { success: true }
  } catch (error) {
    console.error("Error updating blog post: ", error)
    throw new Error("Error updating blog post")
  }
}

export async function deleteBlogPost(id: number) {
  try {
    await db.delete(blogPost).where(eq(blogPost.id, id))
    revalidatePath("/dashboard")
    return { success: true }
  } catch (error) {
    console.error("Error deleting blog post: ", error)
    throw new Error("Error deleting blog post")
  }
}

export async function getBlogPosts() {
  try {
    return await db.select().from(blogPost)
  } catch (error) {
    console.error("Error getting blog posts: ", error)
    return []
  }
}

export async function getBlogPostById(id: number) {
  try {
    const [result] = await db.select().from(blogPost).where(eq(blogPost.id, id))
    return result || null
  } catch (error) {
    console.error("Error getting blog post by id: ", error)
    return null
  }
}

export async function getBlogPostBySlug(slug: string) {
  try {
    const [result] = await db.select().from(blogPost).where(eq(blogPost.slug, slug))
    return result || null
  } catch (error) {
    console.error("Error getting blog post by slug: ", error)
    return null
  }
}

// Analytics
export async function getAnalytics() {
  try {
    const [totalPosts] = await db.select({ count: count(blogPost.id) }).from(blogPost)

    return {
      totalPosts: totalPosts.count,
    }
  } catch (error) {
    console.error("Error getting analytics: ", error)
    return {
      totalPosts: 0,
    }
  }
}

export async function getPublishedPosts() {
  try {
    const publishedStatus = await db.select().from(blogStatus).where(eq(blogStatus.name, "published"))

    if (publishedStatus.length === 0) {
      return []
    }

    return await db
      .select({
        id: blogPost.id,
        title: blogPost.title,
        content: blogPost.content,
        slug: blogPost.slug,
        createdAt: blogPost.createdAt,
        updatedAt: blogPost.updatedAt,
      })
      .from(blogPost)
      .where(eq(blogPost.statusId, publishedStatus[0].id))
      .orderBy(blogPost.createdAt)
  } catch (error) {
    console.error("Error getting published posts: ", error)
    return []
  }
}
