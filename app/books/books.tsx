"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { FaUpRightFromSquare } from "react-icons/fa6"

const books = [
  {
    slug: "to-vow-or-not-to-vow",
    title: "To Vow or Not to Vow",
    cover: "/vow.jpg",
    description:
      "Exploring the topic of whether making vows in the current day is Biblical. The importance is rather in fulfilling the vows that are made.",
  },
  {
    slug: "behind-closed-doors",
    title: "Behind Closed Doors: Guarding Your Dreams",
    cover: "/behind.jpg",
    description: "An insight into how we must keep our dreams private so we don't 'cast our fruit before it's time'.",
  },
]

export function BooksPage() {
  return (
    <div className="min-h-screen bg-[var(--color-brand-bg)]">
      {/* Hero Section */}
      <motion.section
        className="bg-gradient-to-r from-[var(--color-brand-accent)] to-[var(--color-brand-text)] text-white py-20 px-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}>
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Books by Margaret Kuofie</h1>
          <p className="text-lg md:text-xl mb-8">
            Explore books that delve into how scripture can be applied for personal growth in this current day.
          </p>
        </div>
      </motion.section>

      {/* Books Grid */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-[var(--color-brand-text)] mb-10">Featured Books</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {books.map((book, index) => (
              <motion.div
                key={book.slug}
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 * index }}
                className="bg-white p-6 rounded-lg shadow-md flex flex-col md:flex-row items-start gap-6">
                <Image
                  src={book.cover}
                  alt={book.title}
                  width={32}
                  height={48}
                  className="w-32 h-48 object-cover rounded-md"
                />
                <div>
                  <h3 className="text-xl font-semibold mb-2 text-[var(--color-brand-text)]">{book.title}</h3>
                  <p className="text-[var(--color-brand-muted)] mb-4">{book.description}</p>
                  <Link
                    href={`/books/${book.slug}`}
                    className="text-[var(--color-brand-accent)] hover:underline inline-flex items-center gap-1">
                    Learn More <FaUpRightFromSquare size={16} />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
