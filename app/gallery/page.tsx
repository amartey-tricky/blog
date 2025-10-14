import { ImageGallery } from "./gallery"

export default function GalleryPage() {
  return (
    <>
      <section className="relative bg-gradient-to-r from-[var(--color-brand-accent)] to-[var(--color-brand-text)] text-white py-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold mb-6">MY Gallery</h1>
          <p className="text-xl mb-8">Pictures of events, and people met.</p>
        </div>
      </section>
      <div className="container mx-auto px-4 py-12">
        <ImageGallery />
      </div>
    </>
  )
}
