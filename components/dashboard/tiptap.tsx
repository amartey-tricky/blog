"use client"

import Blockquote from "@tiptap/extension-blockquote"
import { Color } from "@tiptap/extension-color"
import Heading from "@tiptap/extension-heading"
import Highlight from "@tiptap/extension-highlight"
import Image from "@tiptap/extension-image"
import Link from "@tiptap/extension-link"
import TextAlign from "@tiptap/extension-text-align"
import { TextStyle } from "@tiptap/extension-text-style"
import Underline from "@tiptap/extension-underline"
import { EditorContent, useEditor } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import {
  Bold,
  Heading1,
  Heading2,
  Heading3,
  ImageIcon,
  Italic,
  LinkIcon,
  List,
  ListOrdered,
  Quote,
  Redo,
  Strikethrough,
  UnderlineIcon,
  Undo,
} from "lucide-react"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"

interface TiptapProps {
  content: string
  onUpdate: (html: string) => void
  className?: string
  minHeight?: string
}

export function Tiptap({ content, onUpdate, className = "", minHeight = "200px" }: TiptapProps) {
  const [linkUrl, setLinkUrl] = useState("")
  const [imageUrl, setImageUrl] = useState("")
  const [showLinkInput, setShowLinkInput] = useState(false)
  const [showImageInput, setShowImageInput] = useState(false)
  const [_showColorPicker, _setShowColorPicker] = useState(false)

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: false,
        blockquote: false,
        underline: false,
        link: false,
      }),
      Underline,
      Link.configure({
        HTMLAttributes: {
          target: "_blank",
          class: "text-blue-500 underline cursor-pointer",
        },
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Image.configure({
        HTMLAttributes: {
          class: "rounded-lg h-auto max-w-full",
        },
      }),
      Highlight.configure({
        multicolor: true,
      }),
      Color,
      TextStyle,
      Heading.configure({ levels: [1, 2, 3, 4, 5, 6] }),
      Blockquote,
    ],
    content: content,
    onUpdate: ({ editor }) => onUpdate(editor.getHTML()),
    editorProps: {
      attributes: {
        spellcheck: "true",
        class: `prose prose-sm max-w-none focus:outline-none p-4 ${minHeight ? `min-h-[${minHeight}]` : "min-h-[200px]"}`,
      },
    },
    immediatelyRender: false,
  })

  // Update editor content when prop changes
  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content)
    }
  }, [content, editor])

  if (!editor) {
    return (
      <div className={`border rounded-md ${className}`}>
        <div className="p-4 text-center text-muted-foreground">Loading editor...</div>
      </div>
    )
  }

  const addLink = () => {
    if (linkUrl) {
      editor.chain().focus().setLink({ href: linkUrl }).run()
      setLinkUrl("")
      setShowLinkInput(false)
    }
  }

  const addImage = () => {
    if (imageUrl) {
      editor.chain().focus().setImage({ src: imageUrl }).run()
      setImageUrl("")
      setShowImageInput(false)
    }
  }

  const _colors = [
    "#000000",
    "#374151",
    "#DC2626",
    "#EA580C",
    "#D97706",
    "#65A30D",
    "#059669",
    "#0891B2",
    "#2563EB",
    "#7C3AED",
    "#C026D3",
    "#EC4899",
  ]

  return (
    <Card className={`w-full ${className}`}>
      {/* Compact Toolbar */}
      <div className="border-b p-2">
        <div className="flex flex-wrap gap-1">
          {/* Text Formatting */}
          <div className="flex gap-1">
            <Button
              type="button"
              variant={editor.isActive("bold") ? "default" : "outline"}
              size="sm"
              onClick={() => editor.chain().focus().toggleBold().run()}>
              <Bold className="h-3 w-3" />
            </Button>
            <Button
              type="button"
              variant={editor.isActive("italic") ? "default" : "outline"}
              size="sm"
              onClick={() => editor.chain().focus().toggleItalic().run()}>
              <Italic className="h-3 w-3" />
            </Button>
            <Button
              type="button"
              variant={editor.isActive("underline") ? "default" : "outline"}
              size="sm"
              onClick={() => editor.chain().focus().toggleUnderline().run()}>
              <UnderlineIcon className="h-3 w-3" />
            </Button>
            <Button
              type="button"
              variant={editor.isActive("strike") ? "default" : "outline"}
              size="sm"
              onClick={() => editor.chain().focus().toggleStrike().run()}>
              <Strikethrough className="h-3 w-3" />
            </Button>
          </div>

          <Separator
            orientation="vertical"
            className="h-6"
          />

          {/* Headings */}
          <div className="flex gap-1">
            <Button
              type="button"
              variant={editor.isActive("heading", { level: 1 }) ? "default" : "outline"}
              size="sm"
              onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}>
              <Heading1 className="h-3 w-3" />
            </Button>
            <Button
              type="button"
              variant={editor.isActive("heading", { level: 2 }) ? "default" : "outline"}
              size="sm"
              onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>
              <Heading2 className="h-3 w-3" />
            </Button>
            <Button
              type="button"
              variant={editor.isActive("heading", { level: 3 }) ? "default" : "outline"}
              size="sm"
              onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}>
              <Heading3 className="h-3 w-3" />
            </Button>
          </div>

          <Separator
            orientation="vertical"
            className="h-6"
          />

          {/* Lists */}
          <div className="flex gap-1">
            <Button
              type="button"
              variant={editor.isActive("bulletList") ? "default" : "outline"}
              size="sm"
              onClick={() => editor.chain().focus().toggleBulletList().run()}>
              <List className="h-3 w-3" />
            </Button>
            <Button
              type="button"
              variant={editor.isActive("orderedList") ? "default" : "outline"}
              size="sm"
              onClick={() => editor.chain().focus().toggleOrderedList().run()}>
              <ListOrdered className="h-3 w-3" />
            </Button>
            <Button
              type="button"
              variant={editor.isActive("blockquote") ? "default" : "outline"}
              size="sm"
              onClick={() => editor.chain().focus().toggleBlockquote().run()}>
              <Quote className="h-3 w-3" />
            </Button>
          </div>

          <Separator
            orientation="vertical"
            className="h-6"
          />

          {/* Media */}
          <div className="flex gap-1">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setShowLinkInput(!showLinkInput)}>
              <LinkIcon className="h-3 w-3" />
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setShowImageInput(!showImageInput)}>
              <ImageIcon className="h-3 w-3" />
            </Button>
          </div>

          <Separator
            orientation="vertical"
            className="h-6"
          />

          {/* Undo/Redo */}
          <div className="flex gap-1">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => editor.chain().focus().undo().run()}
              disabled={!editor.can().undo()}>
              <Undo className="h-3 w-3" />
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => editor.chain().focus().redo().run()}
              disabled={!editor.can().redo()}>
              <Redo className="h-3 w-3" />
            </Button>
          </div>
        </div>

        {/* Link Input */}
        {showLinkInput && (
          <div className="flex gap-2 mt-2">
            <Input
              placeholder="Enter URL..."
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addLink()}
              className="flex-1"
            />
            <Button
              type="button"
              size="sm"
              onClick={addLink}>
              Add
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setShowLinkInput(false)}>
              Cancel
            </Button>
          </div>
        )}

        {/* Image Input */}
        {showImageInput && (
          <div className="flex gap-2 mt-2">
            <Input
              placeholder="Enter image URL..."
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addImage()}
              className="flex-1"
            />
            <Button
              type="button"
              size="sm"
              onClick={addImage}>
              Add
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setShowImageInput(false)}>
              Cancel
            </Button>
          </div>
        )}
      </div>

      {/* Editor Content */}
      <div className="relative">
        <EditorContent
          editor={editor}
          className="focus-within:outline-none"
          style={{ minHeight: minHeight }}
        />
      </div>
    </Card>
  )
}

// Rich Text Display Component
interface RichTextDisplayProps {
  content: string
  className?: string
}

export function RichTextDisplay({ content, className = "" }: RichTextDisplayProps) {
  return (
    <div
      className={`prose prose-sm max-w-none ${className}`}
      dangerouslySetInnerHTML={{ __html: content }}
    />
  )
}

// Alternative component with better security (sanitized HTML)
export function SafeRichTextDisplay({ content, className = "" }: RichTextDisplayProps) {
  const sanitizeHtml = (html: string): string => {
    // Basic HTML sanitization - in production, use a library like DOMPurify
    const _allowedTags = [
      "p",
      "br",
      "strong",
      "b",
      "em",
      "i",
      "u",
      "s",
      "del",
      "strike",
      "h1",
      "h2",
      "h3",
      "h4",
      "h5",
      "h6",
      "ul",
      "ol",
      "li",
      "blockquote",
      "a",
      "img",
    ]

    const _allowedAttributes = {
      a: ["href", "target", "class"],
      img: ["src", "alt", "class"],
      blockquote: ["class"],
      p: ["class"],
      h1: ["class"],
      h2: ["class"],
      h3: ["class"],
      h4: ["class"],
      h5: ["class"],
      h6: ["class"],
      ul: ["class"],
      ol: ["class"],
      li: ["class"],
      strong: ["class"],
      em: ["class"],
      u: ["class"],
      s: ["class"],
    }

    // This is a basic implementation - use DOMPurify in production
    let sanitized = html

    // Remove script tags and their content
    sanitized = sanitized.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")

    // Remove on* event attributes
    sanitized = sanitized.replace(/\son\w+="[^"]*"/g, "")
    sanitized = sanitized.replace(/\son\w+='[^']*'/g, "")

    // Remove javascript: urls
    sanitized = sanitized.replace(/href\s*=\s*["']javascript:[^"']*["']/gi, 'href="#"')

    return sanitized
  }

  const sanitizedContent = sanitizeHtml(content)

  return (
    <div
      className={`prose prose-sm max-w-none ${className}`}
      dangerouslySetInnerHTML={{ __html: sanitizedContent }}
    />
  )
}
