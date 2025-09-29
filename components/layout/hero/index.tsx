"use client"

import { motion } from "motion/react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { BookOpen, Mic, ArrowRight, Star, Users, Award } from "lucide-react"
import Link from "next/link"

// Brand colors as JavaScript constants
const brandColors = {
  bg: "#ebe7e3",
  text: "#143d29",
  muted: "#60936c",
  accent: "#1a5f3f",
  highlight: "#d1c766",
}

const containerVariants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.3,
      delayChildren: 0.2,
      duration: 0.8,
      ease: "easeOut",
    },
  },
}

const itemVariants = {
  hidden: {
    opacity: 0,
    y: 50,
    scale: 0.95,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.8,
      ease: [0.25, 0.25, 0, 1], // Custom easing
    },
  },
}

const floatingVariants = {
  animate: {
    y: [-8, 8, -8],
    rotate: [0, 2, 0, -2, 0],
    transition: {
      y: {
        duration: 6,
        repeat: Infinity,
        ease: "easeInOut",
      },
      rotate: {
        duration: 8,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  },
}

const backgroundFloatVariants = {
  animate: {
    scale: [1, 1.1, 1],
    opacity: [0.1, 0.2, 0.1],
    transition: {
      duration: 12,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
}

export default function Hero() {
  return (
    <main
      className="min-h-screen"
      style={{ backgroundColor: brandColors.bg }}>
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 -z-10">
          <motion.div
            variants={backgroundFloatVariants}
            animate="animate"
            className="absolute top-20 left-10 w-72 h-72 rounded-full blur-3xl"
            style={{ backgroundColor: brandColors.muted, opacity: 0.2 }}
          />
          <motion.div
            variants={backgroundFloatVariants}
            animate="animate"
            style={{ animationDelay: "2s" }}
            className="absolute bottom-20 right-10 w-96 h-96 rounded-full blur-3xl"
            style={{ backgroundColor: brandColors.accent, opacity: 0.15 }}
          />
          <motion.div
            variants={backgroundFloatVariants}
            animate="animate"
            style={{ animationDelay: "4s" }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-3xl"
            style={{ backgroundColor: brandColors.highlight, opacity: 0.1 }}
          />
        </div>

        <div className="container mx-auto px-6 py-20 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Content */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-8">
              <motion.div
                variants={itemVariants}
                className="space-y-4">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}>
                  <Badge
                    variant="secondary"
                    className="text-sm font-medium border shadow-sm"
                    style={{
                      backgroundColor: brandColors.highlight,
                      color: brandColors.text,
                      borderColor: brandColors.accent,
                    }}>
                    <Star className="w-4 h-4 mr-2" />
                    Award-Winning Author
                  </Badge>
                </motion.div>

                <motion.h1
                  variants={itemVariants}
                  className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-balance"
                  style={{ color: brandColors.text }}>
                  Margaret E.{" "}
                  <motion.span
                    animate={{
                      color: [brandColors.accent, brandColors.muted, brandColors.accent],
                    }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    style={{ color: brandColors.accent }}>
                    Kuofie
                  </motion.span>
                </motion.h1>

                <motion.p
                  variants={itemVariants}
                  className="text-xl md:text-2xl font-medium"
                  style={{ color: brandColors.muted }}>
                  Bridging Science & Storytelling
                </motion.p>
              </motion.div>

              <motion.p
                variants={itemVariants}
                className="text-lg leading-relaxed max-w-2xl text-pretty"
                style={{ color: brandColors.text }}>
                Clinical research professional turned storyteller, crafting compelling narratives that explore identity,
                resilience, and cultural duality. Where scientific precision meets human emotion.
              </motion.p>

              <motion.div
                variants={itemVariants}
                className="flex flex-wrap gap-6">
                {[
                  { icon: Users, text: "10K+ Readers" },
                  { icon: Award, text: "2 Published Works" },
                  { icon: Mic, text: "50+ Speaking Events" },
                ].map((stat, index) => (
                  <motion.div
                    key={stat.text}
                    whileHover={{ scale: 1.05, y: -2 }}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1 + index * 0.1 }}
                    className="flex items-center gap-2 text-sm"
                    style={{ color: brandColors.muted }}>
                    <stat.icon className="w-4 h-4" />
                    <span>{stat.text}</span>
                  </motion.div>
                ))}
              </motion.div>

              <motion.div
                variants={itemVariants}
                className="flex flex-col sm:flex-row gap-4">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}>
                  <Button
                    size="lg"
                    className="group shadow-lg hover:shadow-xl transition-shadow duration-300"
                    asChild
                    style={{
                      backgroundColor: brandColors.accent,
                      color: "white",
                      borderColor: brandColors.accent,
                    }}>
                    <Link href="/books">
                      <BookOpen className="w-5 h-5 mr-2" />
                      Explore My Books
                      <ArrowRight className="w-4 h-4 ml-2 transition-transform duration-300 group-hover:translate-x-1" />
                    </Link>
                  </Button>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}>
                  <Button
                    size="lg"
                    variant="outline"
                    className="hover:shadow-md transition-shadow duration-300"
                    asChild
                    style={{
                      borderColor: brandColors.accent,
                      color: brandColors.accent,
                      backgroundColor: "transparent",
                    }}>
                    <Link href="/speaking">
                      <Mic className="w-5 h-5 mr-2" />
                      Book Speaking
                    </Link>
                  </Button>
                </motion.div>
              </motion.div>
            </motion.div>

            {/* Visual Element */}
            <motion.div
              variants={floatingVariants}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1, ...floatingVariants.animate }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="relative hidden lg:block">
              <div className="relative w-full max-w-md mx-auto">
                <motion.div
                  whileHover={{ scale: 1.05, rotate: 2 }}
                  className="border rounded-2xl p-8 shadow-2xl backdrop-blur-sm transition-all duration-300"
                  style={{
                    backgroundColor: "rgba(255, 255, 255, 0.9)",
                    borderColor: brandColors.muted,
                  }}>
                  <div className="space-y-6">
                    <motion.div
                      whileHover={{ rotate: 10 }}
                      className="w-16 h-16 rounded-xl flex items-center justify-center shadow-md"
                      style={{ backgroundColor: brandColors.bg }}>
                      <BookOpen
                        className="w-8 h-8"
                        style={{ color: brandColors.accent }}
                      />
                    </motion.div>

                    <div className="space-y-2">
                      <h3
                        className="font-semibold text-lg"
                        style={{ color: brandColors.text }}>
                        Latest Release
                      </h3>
                      <p
                        className="text-sm"
                        style={{ color: brandColors.muted }}>
                        "Stories of resilience that bridge cultures and generations"
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      {[...Array(5)].map((_, i) => (
                        <motion.div
                          key={i}
                          initial={{ scale: 0, rotate: -180 }}
                          animate={{ scale: 1, rotate: 0 }}
                          transition={{ delay: 1.5 + i * 0.1, type: "spring", stiffness: 300 }}>
                          <Star
                            className="w-4 h-4"
                            style={{ fill: brandColors.highlight, color: brandColors.highlight }}
                          />
                        </motion.div>
                      ))}
                      <span
                        className="text-sm ml-2 font-medium"
                        style={{ color: brandColors.muted }}>
                        4.9/5
                      </span>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  whileHover={{ scale: 1.1 }}
                  className="absolute -top-4 -right-4 w-12 h-12 rounded-full flex items-center justify-center shadow-lg cursor-pointer"
                  style={{ backgroundColor: brandColors.highlight }}>
                  <Award
                    className="w-6 h-6"
                    style={{ color: brandColors.text }}
                  />
                </motion.div>

                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  whileHover={{ scale: 1.1, rotate: 10 }}
                  className="absolute -bottom-4 -left-4 w-16 h-16 rounded-full flex items-center justify-center shadow-lg cursor-pointer"
                  style={{ backgroundColor: brandColors.muted }}>
                  <Mic className="w-8 h-8 text-white" />
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </main>
  )
}
