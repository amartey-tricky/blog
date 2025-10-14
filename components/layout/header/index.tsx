"use client"

import { Menu, X } from "lucide-react"
import { motion } from "motion/react"
import Link from "next/link"
import { useState } from "react"

interface NavItem {
  name: string
  href: string
}

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const navItems: NavItem[] = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "Books", href: "/books" },
    { name: "Blog", href: "/blog" },
    { name: "Gallery", href: "/gallery" },
    { name: "Contact", href: "/contact" },
  ]

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md border-b shadow-sm"
      style={{
        backgroundColor: "rgba(235, 231, 227, 0.95)",
        borderBottomColor: "rgba(20, 61, 41, 0.1)",
      }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo/Name */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex items-center gap-3">
            <Link
              href="/"
              className="flex items-center gap-3">
              <div>
                <h1
                  className="text-xl font-bold"
                  style={{ color: "#143d29" }}>
                  Margaret Kuofie
                </h1>
                <p
                  className="text-xs -mt-1"
                  style={{ color: "#60936c" }}>
                  Author & Minister
                </p>
              </div>
            </Link>
          </motion.div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navItems.map((item, index) => (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}>
                <Link
                  href={item.href}
                  className="font-medium transition-colors relative group hover:scale-105 inline-block"
                  style={{
                    color: "#143d29",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = "#1a5f3f"
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = "#143d29"
                  }}>
                  <motion.span whileHover={{ y: -2 }}>{item.name}</motion.span>
                  <span
                    className="absolute -bottom-1 left-0 w-0 h-0.5 transition-all duration-300 group-hover:w-full"
                    style={{ backgroundColor: "#d1c766" }}
                  />
                </Link>
              </motion.div>
            ))}
          </nav>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <Link href="/contact">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 shadow-sm hover:shadow-md"
                style={{
                  backgroundColor: "#1a5f3f",
                  color: "#ebe7e3",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "#143d29"
                  e.currentTarget.style.boxShadow = "0 0 20px rgba(209, 199, 102, 0.3)"
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "#1a5f3f"
                  e.currentTarget.style.boxShadow = "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)"
                }}>
                Get In Touch
              </motion.button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMobileMenu}
            className="md:hidden p-2 rounded-lg transition-colors"
            style={{
              color: "#143d29",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "rgba(20, 61, 41, 0.05)"
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "transparent"
            }}
            aria-label="Toggle mobile menu"
            type="button">
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        <motion.div
          initial={false}
          animate={{
            height: isMobileMenuOpen ? "auto" : 0,
            opacity: isMobileMenuOpen ? 1 : 0,
          }}
          transition={{ duration: 0.3 }}
          className="md:hidden overflow-hidden">
          <div className="py-4 space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="block px-4 py-2 rounded-lg transition-colors font-medium"
                style={{ color: "#143d29" }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = "#1a5f3f"
                  e.currentTarget.style.backgroundColor = "rgba(20, 61, 41, 0.05)"
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = "#143d29"
                  e.currentTarget.style.backgroundColor = "transparent"
                }}
                onClick={() => setIsMobileMenuOpen(false)}>
                {item.name}
              </Link>
            ))}
            <div className="px-4 pt-2 space-y-2">
              <Link href="/contact">
                <button
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 shadow-sm"
                  style={{
                    backgroundColor: "#1a5f3f",
                    color: "#ebe7e3",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "#143d29"
                    e.currentTarget.style.boxShadow = "0 0 20px rgba(209, 199, 102, 0.3)"
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "#1a5f3f"
                    e.currentTarget.style.boxShadow = "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)"
                  }}
                  type="button">
                  Get In Touch
                </button>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.header>
  )
}
