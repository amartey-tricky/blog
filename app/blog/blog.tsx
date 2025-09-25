import Link from "next/link"
import { FaCalendarDays, FaClock } from "react-icons/fa6"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getPublishedPosts } from "../actions"

function htmlToText(html: string): string {
  const text = html.replace(/<[^>]*>/g, " ")

  return text.replace(/\s+/g, " ").trim()
}

function calculateReadingTime(content: string): string {
  const text = htmlToText(content)
  const wordCount = text.split(/\s+/).filter((word) => word.length > 0).length
  const readingTime = Math.ceil(wordCount / 150)

  return `${readingTime} min read`
}

function createExcerpt(content: string, maxLength: number = 150): string {
  const text = htmlToText(content)
  if (text.length <= maxLength) return text

  const truncated = text.substring(0, maxLength)
  const lastSpace = truncated.lastIndexOf(" ")

  if (lastSpace > maxLength * 0.8) {
    return `${text.substring(0, lastSpace)}...`
  }

  return `${truncated}...`
}

export async function BlogPage() {
  const posts = await getPublishedPosts()

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <section className="text-center mb-12">
          <h1 className="text-4xl font-bold text-balance text-brand-accent mb-4">My Blog</h1>
          <p className="text-xl text-brand-muted text-pretty">Discover my stories, insights, and ideas.</p>
        </section>

        {posts.length === 0 ? (
          <section className="text-center py-12">
            <div className="max-w-md mx-auto">
              <div className="w-16 h-16 mx-auto mb-4 bg-brand-highlight rounded-full flex items-center justify-center animate-pulse">
                <FaCalendarDays className="w-8 h-8 text-brand-accent" />
              </div>
              <h3 className="text-xl font-semibold text-brand-text mb-2">No posts found</h3>
              <p className="text-brand-muted text-sm">Check back soon for new posts.</p>
            </div>
          </section>
        ) : (
          <section className="space-y-8">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold text-brand-text">Latest Articles</h2>
              <p className="text-brand-muted">
                {posts.length} article{posts.length !== 1 ? "s" : ""}
              </p>
            </div>

            <div className="grid gap-6">
              {posts.map((post) => (
                <Link
                  key={post.id}
                  href={`/blog/${post.slug}`}
                  className="block group">
                  <Card className="h-full hover:shadow-lg transition-all duration-200 border-brand-muted/20 hover:border-brand-accent/30 group-hover:scale-[1.02]">
                    <CardHeader className="pb-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <CardTitle className="text-xl text-brand-text group-hover:text-brand-accent transition-colors line-clamp-2 mb-2">
                            {post.title}
                          </CardTitle>
                          <CardDescription className="flex items-center gap-4 text-sm text-brand-muted">
                            <div className="flex items-center gap-1">
                              <FaCalendarDays className="w-4 h-4" />
                              <span>
                                {new Date(post.createdAt).toLocaleDateString("en-US", {
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                })}
                              </span>
                            </div>
                            <div className="flex items-center gap-1">
                              <FaClock className="w-4 h-4" />
                              <span>{calculateReadingTime(post.content)}</span>
                            </div>
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent className="pt-0">
                      <p className="text-brand-muted line-clamp-3 text-pretty mb-4 leading-relaxed">
                        {createExcerpt(post.content, 200)}
                      </p>

                      <div className="flex items-center justify-between">
                        <Badge
                          variant="secondary"
                          className="bg-brand-highlight text-brand-text group-hover:bg-brand-accent group-hover:text-brand-bg transition-colors">
                          Read More
                        </Badge>

                        {post.updatedAt !== post.createdAt && (
                          <span className="text-xs text-brand-muted">
                            Updated {new Date(post.updatedAt).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}
