import { NextSSRPlugin } from "@uploadthing/react/next-ssr-plugin"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { connection } from "next/server"
import { Suspense } from "react"
import { Toaster } from "sonner"
import { extractRouterConfig } from "uploadthing/server"
import { Footer } from "@/components/layout/footer"
import { Header } from "@/components/layout/header"
import { ourFileRouter } from "./api/uploadthing/core"
import "./globals.css"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

const description =
  "Author and speaker Margaret E. Kuofie explores themes of identity, resilience, and cultural duality. Discover her books, including 'To Vow or Not to Vow', and read her latest stories."

export const metadata: Metadata = {
  title: {
    default: "Margaret E. Kuofie | Author & Speaker",
    template: "%s | Margaret E. Kuofie",
  },
  description: description,
  keywords: [
    "Margaret E. Kuofie",
    "author",
    "speaker",
    "clinical research professional",
    "To Vow or Not to Vow",
    "Behind Closed Doors",
    "cultural duality",
    "resilience",
    "identity",
    "marriage vows",
    "modern relationships",
    "storytelling",
    "personal growth",
  ],
  authors: [{ name: "Margaret E. Kuofie" }],
  creator: "Patrick Annang",
  publisher: "Patrick Annang",
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    title: "Margaret E. Kuofie | Author & Speaker",
    description: description,
    siteName: "Margaret E. Kuofie | Author & Speaker",
    images: [
      {
        url: "",
      },
    ],
  },
}

async function UTSSR() {
  await connection()

  return <NextSSRPlugin routerConfig={extractRouterConfig(ourFileRouter)} />
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <main className="min-h-[calc(100vh-601px)] bg-brand-bg my-auto pt-16">
          <Header />
          <Suspense>
            <UTSSR />
          </Suspense>
          {children}
          <Footer />
          <Toaster richColors />
        </main>
      </body>
    </html>
  )
}
