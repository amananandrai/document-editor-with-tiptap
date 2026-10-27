"use client";

import { cn } from "@/lib/utils";
import { generateHTML, generateJSON } from "@tiptap/core";
import Color from "@tiptap/extension-color";
import Highlight from "@tiptap/extension-highlight";
import Subscript from "@tiptap/extension-subscript";
import Superscript from "@tiptap/extension-superscript";
import { TextAlign } from "@tiptap/extension-text-align";
import { FontSize } from "@tiptap/extension-text-style";
import { Editor, EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import React, { forwardRef, useEffect, useMemo, useRef, useState } from "react";
import { isEmptyHtml } from "./page-layout";
import {
  FontFamilyExtension,
  IndentExtension,
  LineHeightExtension,
} from "./tiptap-extensions";

// Formatting supported inside headers/footers. Block-level features (headings,
// lists, tables, images, page breaks…) are disabled in the toolbar while a
// header/footer is being edited.
const HEADER_FOOTER_EXTENSIONS = [
  StarterKit.configure({
    heading: false,
    bulletList: false,
    orderedList: false,
    listItem: false,
    listKeymap: false,
    blockquote: false,
    codeBlock: false,
    horizontalRule: false,
    trailingNode: false,
    link: {
      openOnClick: false,
      HTMLAttributes: { class: "text-blue-600 underline" },
    },
  }),
  Color,
  Highlight.configure({ multicolor: true }),
  Superscript,
  Subscript,
  FontFamilyExtension,
  FontSize.configure({ types: ["textStyle"] }),
  TextAlign.configure({ types: ["paragraph"] }),
  IndentExtension,
  LineHeightExtension,
];

const CONTENT_CLASS =
  "header-footer-content w-full text-sm text-gray-900 prose prose-sm max-w-none prose-p:my-0 focus:outline-none";

// Round-trip stored HTML through the schema so only supported markup is
// rendered in the read-only views.
function sanitize(html: string): string {
  if (isEmptyHtml(html)) return "";
  try {
    return generateHTML(
      generateJSON(html, HEADER_FOOTER_EXTENSIONS),
      HEADER_FOOTER_EXTENSIONS
    );
  } catch {
    return "";
  }
}

interface LiveEditorProps {
  content: string;
  /** Viewport point the user clicked, to place the caret there */
  focusAt: { x: number; y: number } | null;
  placeholder: string;
  onChange: (content: string) => void;
  onEditorChange: (editor: Editor | null) => void;
  onExit: () => void;
}

function LiveHeaderFooterEditor({
  content,
  focusAt,
  placeholder,
  onChange,
  onEditorChange,
  onExit,
}: LiveEditorProps) {
  const [isEmpty, setIsEmpty] = useState(() => isEmptyHtml(content));
  const callbacks = useRef({ onChange, onEditorChange, onExit });
  callbacks.current = { onChange, onEditorChange, onExit };

  const editor = useEditor({
    extensions: HEADER_FOOTER_EXTENSIONS,
    content,
    // Client-only component: create the editor during the activating render
    // so it can take focus before the user's next keystroke.
    immediatelyRender: true,
    editorProps: {
      attributes: { class: CONTENT_CLASS },
      handleKeyDown: (_view, event) => {
        if (event.key === "Escape") {
          callbacks.current.onExit();
          return true;
        }
        return false;
      },
    },
    onUpdate: ({ editor }) => {
      setIsEmpty(editor.isEmpty);
      callbacks.current.onChange(editor.isEmpty ? "" : editor.getHTML());
    },
  });

  const initialFocus = useRef(focusAt);
  useEffect(() => {
    if (!editor) return;
    const point = initialFocus.current;
    const pos = point
      ? editor.view.posAtCoords({ left: point.x, top: point.y })?.pos
      : undefined;
    editor.commands.focus(pos ?? "end");
    callbacks.current.onEditorChange(editor);
    return () => callbacks.current.onEditorChange(null);
  }, [editor]);

  return (
    <div className="relative">
      <EditorContent editor={editor} />
      {isEmpty && (
        <div className="hf-placeholder absolute top-0 left-0 pointer-events-none text-gray-400 text-sm italic">
          {placeholder}
        </div>
      )}
    </div>
  );
}

interface HeaderFooterProps {
  type: "header" | "footer";
  content: string;
  /** Show the editable text area (false when the zone only holds a page number) */
  showText: boolean;
  pageNumber: number;
  pageNumberAlign: "left" | "center" | "right" | null;
  /** This page's header/footer is the one being edited */
  isActive: boolean;
  onActivate: () => void;
  onChange: (content: string) => void;
  onEditorChange: (editor: Editor | null) => void;
  onExit: () => void;
  style?: React.CSSProperties;
}

export const HeaderFooter = forwardRef<HTMLDivElement, HeaderFooterProps>(
  function HeaderFooter(
    {
      type,
      content,
      showText,
      pageNumber,
      pageNumberAlign,
      isActive,
      onActivate,
      onChange,
      onEditorChange,
      onExit,
      style,
    },
    ref
  ) {
    const label = type === "header" ? "Header" : "Footer";
    const placeholder = `Click to add ${type}`;
    const html = useMemo(() => sanitize(content), [content]);
    const clickPoint = useRef<{ x: number; y: number } | null>(null);

    const pageNumberRow = pageNumberAlign && (
      <div
        className={cn(
          "hf-page-number flex text-xs text-gray-500 select-none leading-5",
          pageNumberAlign === "left" && "justify-start",
          pageNumberAlign === "center" && "justify-center",
          pageNumberAlign === "right" && "justify-end"
        )}
      >
        {pageNumber}
      </div>
    );

    const text = showText && (
      isActive ? (
        <LiveHeaderFooterEditor
          content={content}
          focusAt={clickPoint.current}
          placeholder={placeholder}
          onChange={onChange}
          onEditorChange={onEditorChange}
          onExit={onExit}
        />
      ) : (
        <div
          role="button"
          tabIndex={0}
          aria-label={`Edit ${type}`}
          className="cursor-text"
          onMouseDown={(e) => {
            clickPoint.current = { x: e.clientX, y: e.clientY };
            onActivate();
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              clickPoint.current = null;
              onActivate();
            }
          }}
        >
          {html ? (
            <div className={CONTENT_CLASS} dangerouslySetInnerHTML={{ __html: html }} />
          ) : (
            <div className="hf-placeholder text-sm italic text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity">
              {placeholder}
            </div>
          )}
        </div>
      )
    );

    return (
      <div
        ref={ref}
        data-header-footer={type}
        style={style}
        className={cn(
          "header-footer group absolute rounded-sm transition-colors",
          isActive
            ? type === "header"
              ? "border-b border-dashed border-blue-400"
              : "border-t border-dashed border-blue-400"
            : showText && "hover:bg-blue-50/40"
        )}
      >
        {isActive && (
          <div
            className={cn(
              "hf-label absolute left-0 text-[10px] uppercase tracking-wide text-blue-500 select-none",
              type === "header" ? "-bottom-4" : "-top-4"
            )}
          >
            {label} · Esc to return to document
          </div>
        )}
        {type === "header" ? (
          <>
            {pageNumberRow}
            {text}
          </>
        ) : (
          <>
            {text}
            {pageNumberRow}
          </>
        )}
      </div>
    );
  }
);
