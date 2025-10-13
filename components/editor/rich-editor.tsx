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
    // Prevent immediate DOM rendering on initial (server) render to avoid hydration mismatch
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class:
          // Keep styles semantic and token-based
          cn(
            "min-h-[600px] rounded-lg bg-card p-8 text-foreground focus:outline-none",
            "prose prose-lg max-w-none dark:prose-invert prose-headings:font-bold",
            "prose-p:leading-relaxed prose-headings:leading-tight",
            // If the project doesn't include Typography plugin, this still renders fine
          ),
      },
    },
    content: `<h1>Welcome</h1><p>Start typing…</p>`,
  })

  return (
    <div className="flex flex-col">
      <div className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
        <EditorToolbar editor={editor} />
      </div>
      <div className="p-8">
        <div className="min-h-[600px] max-w-5xl mx-auto">
          <EditorContent editor={editor} />
        </div>
      </div>
      {/* Help text */}
      <div className="border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 px-8 py-4">
        <p className="text-sm text-muted-foreground text-center">
          💡 <strong>Pro Tips:</strong> Use Ctrl/Cmd + B/I/U for quick formatting • 
          Ctrl/Cmd + S to save • Right-click for context menu • 
          Use Tab/Shift+Tab for indentation
        </p>
      </div>
    </div>
  )
}
