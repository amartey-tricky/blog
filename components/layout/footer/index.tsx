"use client"

import { ArrowUp, Facebook, Instagram, Linkedin, Twitter } from "lucide-react"
import { motion } from "motion/react"
import Link from "next/link"
import type React from "react"
import { useEffect, useState } from "react"

interface SocialLink {
  name: string
  icon: React.ComponentType<{ size?: number }>
  href: string
  color: string
}

interface FooterLink {
  name: string
  href: string
}

interface FooterSection {
  [key: string]: FooterLink[]
}

export function Footer() {
  const [showScrollTop, setShowScrollTop] = useState(false)

  useEffect(() => {
    const handleScroll = () => setShowScrollTop(window.scrollY > 300)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" })

  const socialLinks: SocialLink[] = [
    { name: "Twitter", icon: Twitter, href: "https://twitter.com/margaretkuofie", color: "hover:text-blue-400" },
    { name: "Instagram", icon: Instagram, href: "https://instagram.com/margaretkuofie", color: "hover:text-pink-500" },
    { name: "LinkedIn", icon: Linkedin, href: "https://linkedin.com/in/margaretkuofie", color: "hover:text-blue-600" },
    { name: "Facebook", icon: Facebook, href: "https://facebook.com/margaretkuofie", color: "hover:text-blue-500" },
  ]

  const footerLinks: FooterSection = {
    Explore: [
      { name: "About Me", href: "/about" },
      { name: "My Books", href: "/books" },
      { name: "Blog Posts", href: "/blog" },
    ],
    Connect: [
      { name: "Contact", href: "/contact" },
      { name: "Newsletter", href: "/newsletter" },
    ],
    Resources: [
      { name: "Writing Tips", href: "/writing-tips" },
      { name: "Reading List", href: "/reading-list" },
      { name: "FAQs", href: "/faq" },
      { name: "Privacy Policy", href: "/privacy" },
    ],
  }

  return (
    <>
      {/* Scroll to Top Button */}
      <motion.button
        initial={{ opacity: 0, scale: 0 }}
        animate={{
          opacity: showScrollTop ? 1 : 0,
          scale: showScrollTop ? 1 : 0,
        }}
        onClick={scrollToTop}
        className="fixed bottom-8 right-8 z-40 bg-[var(--color-brand-accent)] hover:bg-[var(--color-brand-text)] text-white p-3 rounded-full shadow-lg transition-colors"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        aria-label="Scroll to top">
        <ArrowUp size={20} />
      </motion.button>

      <footer className="bg-[var(--color-brand-bg)] text-[var(--color-brand-text)]">
        {/* Main Footer Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
            {/* Author Info */}
            <div className="lg:col-span-2">
              <Link
                href="/"
                className="flex items-center gap-3 mb-4">
                <div>
                  <h2 className="text-2xl font-bold">Margaret Kuofie</h2>
                  <p className="text-[var(--color-brand-muted)]">Author & Minister</p>
                </div>
              </Link>
              <p className="mb-6 leading-relaxed text-[var(--color-brand-accent)]">
                A minister of the Gospel who brings Scripture to life by connecting biblical truths with real-world
                experiences and everyday situations.
              </p>

              {/* Social Links */}
              <div className="flex items-center gap-4">
                {socialLinks.map((social) => (
                  <motion.a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`text-[var(--color-brand-muted)] ${social.color} transition-colors`}
                    whileHover={{ scale: 1.2, y: -2 }}
                    whileTap={{ scale: 0.9 }}
                    aria-label={`Follow on ${social.name}`}>
                    <social.icon size={20} />
                  </motion.a>
                ))}
              </div>
            </div>

            {/* Footer Links */}
            {Object.entries(footerLinks).map(([category, links]) => (
              <div key={category}>
                <h3 className="font-semibold mb-4 text-[var(--color-brand-text)]">{category}</h3>
                <ul className="space-y-2">
                  {links.map((link) => (
                    <li key={link.name}>
                      <Link
                        href={link.href}
                        className="text-[var(--color-brand-muted)] hover:text-[var(--color-brand-accent)] transition-colors">
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-[var(--color-brand-muted)]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-[var(--color-brand-muted)] text-sm">
              <span>© {new Date().getFullYear()} Margaret Kuofie. All rights reserved.</span>
              {/* <div className="flex items-center gap-2"> */}
              {/*   <span>Made with</span> */}
              {/*   <Heart */}
              {/*     className="text-red-500 fill-current" */}
              {/*     size={16} */}
              {/*   /> */}
              {/*   <span>in Ghana</span> */}
              {/* </div> */}
            </div>
          </div>
        </div>
      </footer>
    </>
  )
}
