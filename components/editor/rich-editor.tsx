"use client"
import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Underline from "@tiptap/extension-underline"
import Color from "@tiptap/extension-color"
import { TextStyle } from "@tiptap/extension-text-style"
import Highlight from "@tiptap/extension-highlight"
import Superscript from "@tiptap/extension-superscript"
import Subscript from "@tiptap/extension-subscript"
import { cn } from "@/lib/utils"
import { EditorToolbar } from "./toolbar"
import { IndentExtension, LineHeightExtension } from "./tiptap-extensions"

export function RichEditor() {
  const editor = useEditor({
    extensions: [
      // Base kit: paragraphs, headings, bold, italic, lists, etc.
      StarterKit.configure({
        heading: { levels: [1, 2, 3, 4] },
        bulletList: { keepMarks: true, keepAttributes: true },
        orderedList: { keepMarks: true, keepAttributes: true },
      }),
      // Marks and styles
      Underline,
      TextStyle,
      Color, // text color via TextStyle
      Highlight.configure({ multicolor: true }), // background color
      Superscript,
      Subscript,
      // Custom attributes
      IndentExtension,
      LineHeightExtension,
    ],
    editorProps: {
      attributes: {
        class:
          // Keep styles semantic and token-based
          cn(
            "min-h-[320px] rounded-md border bg-card p-4 text-foreground",
            "prose prose-sm max-w-none dark:prose-invert",
            // If the project doesn't include Typography plugin, this still renders fine
          ),
      },
    },
    content: `<h1>Welcome</h1><p>Start typing…</p>`,
  })

  return (
    <div className="flex flex-col gap-2">
      <EditorToolbar editor={editor} />
      <div className="rounded-md border">
        <EditorContent editor={editor} />
      </div>
      {/* Small help text */}
      <p className="text-xs text-muted-foreground">Tip: Use Ctrl/Cmd + B/I/U for quick bold/italic/underline.</p>
    </div>
  )
}
