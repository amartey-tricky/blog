"use client"

import { useEffect, useState } from "react"
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { getAnalytics, getBlogPosts, getBlogStatus } from "@/app/actions"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer } from "@/components/ui/chart"

interface Analytics {
  totalPosts: number
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

interface BlogStatus {
  id: number
  name: string
}

export function AnalyticsTab() {
  const [analytics, setAnalytics] = useState<Analytics>({ totalPosts: 0 })
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [statuses, setStatuses] = useState<BlogStatus[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        const [analyticsData, blogPostsData, blogStatusData] = await Promise.all([
          getAnalytics(),
          getBlogPosts(),
          getBlogStatus(),
        ])

        setAnalytics(analyticsData)
        setPosts(blogPostsData)
        setStatuses(blogStatusData)
      } catch (error) {
        console.error("Error fetching data: ", error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const getStatusCounts = () => {
    const counts = statuses.map((status) => {
      const count = posts.filter((post) => post.statusId === status.id).length
      return {
        name: status.name,
        count,
      }
    })
    return counts
  }

  const getPostCountByStatus = (statusName: string): number => {
    return posts.filter((post) => {
      const status = statuses.find((s) => s.id === post.statusId)
      return status?.name === statusName
    }).length
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center font-semibold text-muted-foreground">Loading...</div>
        </CardContent>
      </Card>
    )
  }

  return (
    <section className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-primary">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-primary-foreground font-medium text-sm">Total Posts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary-foreground">{analytics.totalPosts}</div>
          </CardContent>
        </Card>

        <Card className="bg-green-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-white font-medium text-sm">Published</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{getPostCountByStatus("published")}</div>
          </CardContent>
        </Card>

        <Card className="bg-yellow-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-white font-medium text-sm">Drafts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{getPostCountByStatus("draft")}</div>
          </CardContent>
        </Card>

        <Card className="bg-gray-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-white font-medium text-sm">Archived</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{getPostCountByStatus("archived")}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-foreground">Posts by Status</CardTitle>
          <CardDescription className="text-muted-foreground">
            Distribution of posts across different statuses
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              count: {
                label: "Posts",
                color: "hsl(var(--primary))",
              },
            }}
            className="h-[300px]">
            <ResponsiveContainer
              width="100%"
              height="100%">
              <BarChart data={getStatusCounts()}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar
                  dataKey="count"
                  fill="hsl(var(--primary))"
                />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>
    </section>
  )
}
