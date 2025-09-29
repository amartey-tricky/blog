"use client"

import { motion } from "motion/react"
import Image from "next/image"
import { notFound } from "next/navigation"
import { useEffect, useState } from "react"
import { FaBookOpen } from "react-icons/fa6"

const books = {
  "to-vow-or-not-to-vow": {
    title: "To Vow or Not to Vow",
    cover: "/books/vow-cover.jpg",
    description: "An insight into how we must keep our dreams private so we don't 'cast our fruit before it's time'.",
    details:
      "This book blends research, personal anecdotes, and Biblical insights into whether it is necessary to make vows",
    buyLink: "https://www.amazon.com/Vow-Not-Knowing-Implications-Vows/dp/1460007786/",
  },
  "behind-closed-doors": {
    title: "Behind Closed Doors: Guarding Your Dreams",
    cover: "/books/guarding-dreams.jpg",
    description: "A guide to nurturing unspoken aspirations and overcoming self-doubt.",
    details:
      "Margaret's latest work explores the fact that we must guard our dreams and aspirations private and watch them manifest and 'announce themselves'.",
    buyLink: "https://www.amazon.com/Behind-Closed-Doors-Guarding-Dreams-ebook/dp/B0CKWH6RCC/",
  },
}

interface PageProps {
  params: Promise<{ slug: string }>
}

export default function Page({ params }: PageProps) {
  const [slug, setSlug] = useState<string | null>(null)
  const [book, setBook] = useState<(typeof books)[keyof typeof books] | null>(null)

  // Resolve params asynchronously
  useEffect(() => {
    const resolveParams = async () => {
      const resolvedParams = await params
      setSlug(resolvedParams.slug)

      // Convert books object to an array with slug
      const booksArr = Object.entries(books).map(([slug, data]) => ({
        slug,
        ...data,
      }))

      const foundBook = booksArr.find((b) => b.slug === resolvedParams.slug)
      if (!foundBook) {
        notFound()
      }
      setBook(foundBook)
    }

    resolveParams()
  }, [params])

  // Show loading state while resolving params
  if (!slug || !book) {
    return (
      <div className="min-h-screen bg-[var(--color-brand-bg)] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--color-brand-accent)] mx-auto mb-4"></div>
          <p className="text-[var(--color-brand-muted)]">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[var(--color-brand-bg)]">
      {/* Hero Section */}
      <motion.section
        className="bg-gradient-to-r from-[var(--color-brand-accent)] to-[var(--color-brand-text)] text-white py-16 px-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}>
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl md:text-4xl font-bold">{book.title}</h1>
        </div>
      </motion.section>

      {/* Book Details */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col md:flex-row gap-10">
            <Image
              src={book.cover}
              alt={book.title}
              width={192}
              height={256}
              className="w-48 h-64 object-cover rounded-md shadow-md"
              priority
            />
            <div>
              <h2 className="text-2xl font-bold text-[var(--color-brand-text)] mb-4">{book.title}</h2>
              <p className="text-[var(--color-brand-muted)] mb-6">{book.details}</p>
              <a
                href={book.buyLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-[var(--color-brand-accent)] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[color-mix(in_srgb,var(--color-brand-accent),black,10%)] transition-colors">
                <FaBookOpen size={20} />
                <span>Buy Now</span>
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
