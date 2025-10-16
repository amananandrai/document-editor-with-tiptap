"use client"
import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Underline from "@tiptap/extension-underline"
import Color from "@tiptap/extension-color"
import { TextStyle } from "@tiptap/extension-text-style"
import Highlight from "@tiptap/extension-highlight"
import Superscript from "@tiptap/extension-superscript"
import Subscript from "@tiptap/extension-subscript"
import Blockquote from "@tiptap/extension-blockquote"
import CodeBlock from "@tiptap/extension-code-block"
import Code from "@tiptap/extension-code"
import Link from "@tiptap/extension-link"
import { Table } from "@tiptap/extension-table"
import { TableRow } from "@tiptap/extension-table-row"
import { TableHeader } from "@tiptap/extension-table-header"
import { TableCell } from "@tiptap/extension-table-cell"
import { ImageResize } from "./image-extension"
import { cn } from "@/lib/utils"
import { EditorToolbar } from "./toolbar"
import { StatusBar } from "./status-bar"
import { useImageUpload } from "./use-image-upload"
import { IndentExtension, LineHeightExtension, FontFamilyExtension, EmojiExtension, MentionExtension } from "./tiptap-extensions"

export function RichEditor() {
  const editor = useEditor({
    extensions: [
      // Base kit: paragraphs, headings, bold, italic, lists, etc.
      StarterKit.configure({
        heading: { levels: [1, 2, 3, 4] },
        bulletList: { 
          keepMarks: true, 
          keepAttributes: true,
          HTMLAttributes: {
            class: 'list-disc list-inside',
          },
        },
        orderedList: { 
          keepMarks: true, 
          keepAttributes: true,
          HTMLAttributes: {
            class: 'list-decimal list-inside',
          },
        },
        listItem: {
          HTMLAttributes: {
            class: 'ml-4',
          },
        },
        codeBlock: false, // We'll use the standalone CodeBlock extension
      }) as any,
      // Marks and styles
      Underline as any,
      TextStyle as any,
      Color as any, // text color via TextStyle
      Highlight.configure({ multicolor: true }) as any, // background color
      Superscript as any,
      Subscript as any,
  // Custom attributes
  IndentExtension as any,
  LineHeightExtension as any,
  FontFamilyExtension as any,
      // Content blocks
      Blockquote as any,
      CodeBlock as any,
      Code as any,
      // Links
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-blue-600 underline cursor-pointer hover:text-blue-800',
        },
      }) as any,
      // Tables
      Table.configure({
        resizable: true,
      }) as any,
      TableRow as any,
      TableHeader as any,
      TableCell as any,
      // Images
      ImageResize.configure({
        inline: true,
        allowBase64: true,
        HTMLAttributes: {
          class: 'max-w-full h-auto rounded-lg shadow-sm',
        },
      }) as any,
      // Custom attributes
      IndentExtension as any,
      LineHeightExtension as any,
      // Emoji and mentions
      EmojiExtension as any,
      MentionExtension as any,
    ],
    // Prevent immediate DOM rendering on initial (server) render to avoid hydration mismatch
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class:
          // Keep styles semantic and token-based
          cn(
            "min-h-[400px] sm:min-h-[500px] lg:min-h-[600px] rounded-lg bg-card p-4 sm:p-6 lg:p-8 text-foreground focus:outline-none",
            "prose prose-sm sm:prose-base lg:prose-lg max-w-none dark:prose-invert prose-headings:font-bold",
            "prose-p:leading-relaxed prose-headings:leading-tight",
            // Mobile-friendly prose sizing
            "prose-sm sm:prose-base lg:prose-lg",
            // If the project doesn't include Typography plugin, this still renders fine
          ),
      },
    },
    content: `<h1>Welcome</h1><p>Start typing…</p>`,
  })

  // Image upload functionality
  const { handleDrop, handleDragOver, handleDragLeave, handlePaste } = useImageUpload(editor)

  return (
    <div className="flex flex-col">
      <div className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
        <EditorToolbar editor={editor} />
      </div>
      <div className="p-2 sm:p-4 lg:p-8">
        <div 
          className="min-h-[400px] sm:min-h-[500px] lg:min-h-[600px] max-w-5xl mx-auto"
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onPaste={handlePaste}
        >
          <EditorContent editor={editor} />
        </div>
      </div>
      {/* Status bar */}
      <StatusBar editor={editor} />
      
      {/* Help text */}
      <div className="border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 px-2 sm:px-4 lg:px-8 py-2 sm:py-4">
        <p className="text-xs sm:text-sm text-muted-foreground text-center leading-relaxed">
          💡 <strong>Pro Tips:</strong> Use Ctrl/Cmd + B/I/U for quick formatting • 
          Ctrl/Cmd + S to save • Right-click for context menu • 
          Use Tab/Shift+Tab for indentation • Insert tables, blockquotes, code blocks, and links • 
          Create multilevel nested lists with proper indentation • 
          Drag & drop images or use the image button to upload • 
          Click images to resize with corner handles or remove them • 
          Use the emoji picker 😀 or type @ to mention users 👥
        </p>
      </div>
    </div>
  )
}
