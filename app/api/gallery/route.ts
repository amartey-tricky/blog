import { NextResponse } from "next/server"
import { getImages } from "@/app/actions"

export async function GET() {
  try {
    const images = await getImages()
    return NextResponse.json(images)
  } catch (error) {
    console.error("Error getting images:", error)
    return NextResponse.json({ error: "Failed to fetch images" }, { status: 500 })
  }
}
