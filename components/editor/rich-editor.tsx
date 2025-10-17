"use client";
import { useEditor, EditorContent } from "@tiptap/react";
import { useState } from "react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Color from "@tiptap/extension-color";
import { FontSize, TextStyle } from "@tiptap/extension-text-style";
import Highlight from "@tiptap/extension-highlight";
import Superscript from "@tiptap/extension-superscript";
import Subscript from "@tiptap/extension-subscript";
import Blockquote from "@tiptap/extension-blockquote";
import CodeBlock from "@tiptap/extension-code-block";
import Code from "@tiptap/extension-code";
import Link from "@tiptap/extension-link";
import { Table } from "@tiptap/extension-table";
import { TableRow } from "@tiptap/extension-table-row";
import { TableHeader } from "@tiptap/extension-table-header";
import { TableCell } from "@tiptap/extension-table-cell";
import { ImageResize } from "./image-extension";
import { cn } from "@/lib/utils";
import { EditorToolbar } from "./toolbar";
import { StatusBar } from "./status-bar";
import { A4PageLayout } from "./a4-page-layout";
import { PageManagerProvider } from "./page-manager";
import { MultiPageEditor } from "./multi-page-editor";
import { PageBreak } from "./page-break-extension";
import { useImageUpload } from "./use-image-upload";
import {
  IndentExtension,
  LineHeightExtension,
  FontFamilyExtension,
} from "./tiptap-extensions";
import { TextAlign } from "@tiptap/extension-text-align";
import Placeholder from "@tiptap/extension-placeholder";
export function RichEditor() {
  const [isPageLayout, setIsPageLayout] = useState(false);
  const [isMultiPageMode, setIsMultiPageMode] = useState(false);

  const togglePageLayout = () => {
    setIsPageLayout(!isPageLayout);
  };

  const toggleMultiPageMode = () => {
    setIsMultiPageMode(!isMultiPageMode);
  };

  const editor = useEditor({
    extensions: [
      // Base kit: paragraphs, headings, bold, italic, lists, etc.
      StarterKit.configure({
        heading: { levels: [1, 2, 3, 4] },
        bulletList: {
          keepMarks: true,
          keepAttributes: true,
          HTMLAttributes: {
            class: "list-disc list-inside",
          },
        },
        orderedList: {
          keepMarks: true,
          keepAttributes: true,
          HTMLAttributes: {
            class: "list-decimal list-inside",
          },
        },
        listItem: {
          HTMLAttributes: {
            class: "ml-4",
          },
        },
        codeBlock: false, // We'll use the standalone CodeBlock extension
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
      FontFamilyExtension,
      FontSize.configure({
      types: ['textStyle'],
      }),
      // Text alignment
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      // Content blocks
      Blockquote,
      CodeBlock,
      Code,
      // Links
      Link.extend({
        inclusive: false, // This ensures cursor moves outside link after insertion
      }).configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-blue-600 underline cursor-pointer hover:text-blue-800",
        },
      }),
      // Tables
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableHeader,
      TableCell,
      // Images
      ImageResize.configure({
        inline: true,
        allowBase64: true,
        HTMLAttributes: {
          class: "max-w-full h-auto rounded-lg shadow-sm",
        },
      }),
      // Custom attributes
      IndentExtension,
      LineHeightExtension,
      
      // Page break
      PageBreak,
      // Placeholder
      Placeholder.configure({
        placeholder: "Welcome! Start typing…",
        emptyEditorClass: "is-editor-empty",
      }),
    ],
    // Prevent immediate DOM rendering on initial (server) render to avoid hydration mismatch
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class:
          // Keep styles semantic and token-based
          cn(
            "min-h-[600px] rounded-lg bg-white p-8 text-gray-900 focus:outline-none",
            "prose prose-lg max-w-none prose-headings:font-bold",
            "prose-p:leading-relaxed prose-headings:leading-tight"
            // If the project doesn't include Typography plugin, this still renders fine
          ),
      },
    },
    content: "",
  });

  // Image upload functionality
  const { handleDrop, handleDragOver, handleDragLeave, handlePaste } =
    useImageUpload(editor);

  return (
    <div className="flex flex-col">
      <div className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
        <EditorToolbar 
          editor={editor} 
          isPageLayout={isPageLayout}
          onTogglePageLayout={togglePageLayout}
          isMultiPageMode={isMultiPageMode}
          onToggleMultiPageMode={toggleMultiPageMode}
        />
      </div>
      {isMultiPageMode ? (
        <PageManagerProvider editor={editor}>
          <MultiPageEditor
            editor={editor}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onPaste={handlePaste}
          />
        </PageManagerProvider>
      ) : isPageLayout ? (
        <A4PageLayout>
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onPaste={handlePaste}
          >
            <EditorContent editor={editor} />
          </div>
        </A4PageLayout>
      ) : (
        <div className="p-8">
          <div
            className="min-h-[600px] max-w-5xl mx-auto bg-white"
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onPaste={handlePaste}
          >
            <EditorContent editor={editor} />
          </div>
        </div>
      )}
      {/* Status bar */}
      <StatusBar editor={editor} />

      {/* Help text */}
      <div className="border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 px-8 py-4">
        <p className="text-sm text-gray-600 dark:text-gray-300 text-center">
          💡 <strong>Pro Tips:</strong> Use Ctrl/Cmd + B/I/U for quick
          formatting • Ctrl/Cmd + S to save • Right-click for context menu • Use
          Tab/Shift+Tab for indentation • Insert tables, blockquotes, code
          blocks, and links • Create multilevel nested lists with proper
          indentation • Drag & drop images or use the image button to upload •
          Click images to resize with corner handles or remove them
        </p>
      </div>
    </div>
  );
}
