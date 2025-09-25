import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="container mx-auto px-4">
        <div className="max-w-md mx-auto text-center">
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="text-2xl text-foreground">Post Not Found</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                The blog post you're looking for doesn't exist or has been removed.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link
                  href="/blog"
                  className="inline-flex items-center justify-center px-4 py-2 bg-brand text-brand-foreground rounded-md hover:bg-brand/90 transition-colors">
                  Browse All Posts
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
