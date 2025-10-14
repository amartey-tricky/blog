import { BlogPage } from "./blog"

export default function Blog() {
  return (
    <section>
      <section className="relative bg-gradient-to-r from-[var(--color-brand-accent)] to-[var(--color-brand-text)] text-white py-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold mb-6">MY Blog</h1>
          <p className="text-xl mb-8">Discover my stories, insights, and ideas.</p>
        </div>
      </section>
      <BlogPage />
    </section>
  )
}
