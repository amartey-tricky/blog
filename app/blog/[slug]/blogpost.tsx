"use client"

import { motion } from "motion/react"
import { RichTextDisplay } from "@/components/dashboard/tiptap"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

// import type { BlogPost } from "@/util/validation/blog"

const parentTransition = {
  hidden: { opacity: 0, y: 100 },
  visible: { opacity: 1, y: 0, transition: { duration: 2.0 } },
}

interface BlogPost {
  id: number
  title: string
  content: string
  statusId: number
  slug: string
  createdAt: Date
  updatedAt: Date
}

interface DisplayPostProps {
  post: BlogPost
  className?: string
}

export function DisplayPost({ post, className = "" }: DisplayPostProps) {
  return (
    <motion.article
      variants={parentTransition}
      initial="hidden"
      animate="visible"
      className={`max-w-4xl mx-auto ${className}`}>
      <Card className="border-border">
        <CardHeader className="pb-6 space-y-4">
          <CardTitle className="text-3xl md:text-4xl font-bold text-foreground text-balance">{post.title}</CardTitle>
          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
            <time dateTime={post.createdAt.toISOString()}>
              Published on{" "}
              {new Date(post.createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </time>
          </div>
        </CardHeader>
        <CardContent className="prose prose-lg max-w-none">
          <RichTextDisplay
            content={post.content}
            className="text-foreground leading-relaxed text-pretty whitespace-pre-wrap"
          />
        </CardContent>
      </Card>
    </motion.article>
  )
}
