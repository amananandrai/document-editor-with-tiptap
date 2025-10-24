"use client";

import { cn } from "@/lib/utils";
import Color from "@tiptap/extension-color";
import Subscript from "@tiptap/extension-subscript";
import Superscript from "@tiptap/extension-superscript";
import { TextAlign } from "@tiptap/extension-text-align";
import { FontSize, TextStyle } from "@tiptap/extension-text-style";
import Underline from "@tiptap/extension-underline";
import { Editor, EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useEffect } from "react";
import { FontFamilyExtension } from "./tiptap-extensions";

interface HeaderFooterProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
  type: "header" | "footer";
  className?: string;
  showPageNumber?: boolean;
  pageNumber?: number;
  onEditorReady?: (editor: Editor) => void;
  onFocus?: (editor: Editor) => void;
  onBlur?: (editor: Editor) => void;
}

export function HeaderFooter({
  content,
  onChange,
  placeholder = "",
  type,
  className,
  showPageNumber = false,
  pageNumber,
  onEditorReady,
  onFocus,
  onBlur,
}: HeaderFooterProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: false, // No headings in header/footer
        bulletList: false,
        orderedList: false,
        blockquote: false,
        codeBlock: false,
      }),
      TextStyle,
      Color,
      Underline,
      Superscript,
      Subscript,
      FontFamilyExtension,
      FontSize.configure({
        types: ["textStyle"],
      }),
      TextAlign.configure({
        types: ["paragraph"],
      }),
    ],
    content,
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: cn(
          "w-full focus:outline-none text-sm px-2 py-1.5",
          "prose prose-sm max-w-none",
          type === "header" ? "min-h-[50px]" : "min-h-[50px]"
        ),
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    onFocus: ({ editor }) => {
      onFocus?.(editor);
    },
    onBlur: ({ editor }) => {
      onBlur?.(editor);
    },
  });

  // Notify parent when editor is ready
  useEffect(() => {
    if (editor && onEditorReady) {
      onEditorReady(editor);
    }
  }, [editor, onEditorReady]);

  // Update editor content when external content changes (from other pages)
  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  return (
    <div
      className={cn(
        "w-full relative group",
        type === "header"
          ? "border-b-2 border-gray-300 dark:border-gray-600"
          : "border-t-2 border-gray-300 dark:border-gray-600",
        "hover:bg-blue-50/30 dark:hover:bg-blue-900/10 transition-colors",
        "cursor-text",
        className
      )}
    >
      {/* Google Docs-style label */}
      <div className="absolute -top-5 left-2 text-[10px] text-gray-400 dark:text-gray-500 uppercase tracking-wide opacity-0 group-hover:opacity-100 transition-opacity">
        {type === "header" ? "Header" : "Footer"} - Use main toolbar to format
      </div>

      <div className="flex items-center justify-between gap-2 min-h-[50px]">
        <div className="flex-1 min-w-0 relative">
          <EditorContent editor={editor} />
          {!content && editor && editor.isEmpty && (
            <div className="absolute top-2 left-2 pointer-events-none text-gray-400 text-sm italic">
              {placeholder}
            </div>
          )}
        </div>
        {showPageNumber && pageNumber !== undefined && (
          <div className="flex-none text-xs text-gray-500 dark:text-gray-400 px-3 py-1 font-medium">
            {pageNumber}
          </div>
        )}
      </div>
    </div>
  );
}

interface HeaderFooterEditorProps {
  headerContent: string;
  footerContent: string;
  onHeaderChange: (content: string) => void;
  onFooterChange: (content: string) => void;
  showHeader?: boolean;
  showFooter?: boolean;
  showPageNumbers?: boolean;
  pageNumber?: number;
  onHeaderEditorReady?: (editor: Editor) => void;
  onFooterEditorReady?: (editor: Editor) => void;
  onHeaderFocus?: (editor: Editor) => void;
  onFooterFocus?: (editor: Editor) => void;
  onHeaderBlur?: (editor: Editor) => void;
  onFooterBlur?: (editor: Editor) => void;
}

export function HeaderFooterEditor({
  headerContent,
  footerContent,
  onHeaderChange,
  onFooterChange,
  showHeader = true,
  showFooter = true,
  showPageNumbers = false,
  pageNumber,
  onHeaderEditorReady,
  onFooterEditorReady,
  onHeaderFocus,
  onFooterFocus,
  onHeaderBlur,
  onFooterBlur,
}: HeaderFooterEditorProps) {
  return (
    <>
      {showHeader && (
        <HeaderFooter
          content={headerContent}
          onChange={onHeaderChange}
          placeholder="Header (click to edit, use toolbar above)"
          type="header"
          showPageNumber={showPageNumbers}
          pageNumber={pageNumber}
          onEditorReady={onHeaderEditorReady}
          onFocus={onHeaderFocus}
          onBlur={onHeaderBlur}
        />
      )}
      {showFooter && (
        <HeaderFooter
          content={footerContent}
          onChange={onFooterChange}
          placeholder="Footer (click to edit, use toolbar above)"
          type="footer"
          showPageNumber={showPageNumbers && !showHeader}
          pageNumber={pageNumber}
          onEditorReady={onFooterEditorReady}
          onFocus={onFooterFocus}
          onBlur={onFooterBlur}
        />
      )}
    </>
  );
}
