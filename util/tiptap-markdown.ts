import type { Editor } from "@tiptap/core"
import { defaultMarkdownParser, defaultMarkdownSerializer } from "prosemirror-markdown"

export function editorToMarkdown(editor: Editor): string {
  return defaultMarkdownSerializer.serialize(editor.state.doc)
}

export function markdownToEditor(markdown: string) {
  const doc = defaultMarkdownParser.parse(markdown)
  return doc.toJSON()
}
