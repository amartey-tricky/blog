import Link from "next/link"
import { notFound } from "next/navigation"
import { getBlogPostBySlug } from "@/app/actions"
import { DisplayPost } from "./blogpost"

interface BlogPostPageProps {
  params: {
    slug: string
  }
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const post = await getBlogPostBySlug(params.slug)

  if (!post) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <nav className="mb-8">
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <Link
                href="/blog"
                className="hover:text-brand transition-colors">
                Blog
              </Link>
              <span>→</span>
              <span className="text-foreground">{post.title}</span>
            </div>
          </nav>

          {/*
          <article>
            <Card className="border-border">
              <CardHeader className="pb-6">
                <div className="space-y-4">
                  <Badge
                    variant="secondary"
                    className="w-fit">
                    Published
                  </Badge>
                  <CardTitle className="text-3xl md:text-4xl font-bold text-foreground text-balance">
                    {post.title}
                  </CardTitle>
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                    <time dateTime={post.createdAt.toISOString()}>
                      Published on{" "}
                      {new Date(post.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </time>
                    {post.updatedAt !== post.createdAt && (
                      <span>
                        • Updated{" "}
                        {new Date(post.updatedAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </span>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="prose prose-lg max-w-none">
                <div className="text-foreground leading-relaxed text-pretty whitespace-pre-wrap">{post.content}</div>
              </CardContent>
            </Card>
          </article>
          */}
          <DisplayPost post={post} />

          <div className="flex justify-between items-center mt-12 pt-8 border-t border-border">
            <Link
              href="/blog"
              className="inline-flex items-center text-brand hover:text-brand/80 transition-colors">
              ← Back to Blog
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
