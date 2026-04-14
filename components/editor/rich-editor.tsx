"use client";
import {
  debounce,
  loadEditorState,
  saveEditorState,
} from "@/lib/local-storage";
import { cn } from "@/lib/utils";
import Blockquote from "@tiptap/extension-blockquote";
import Code from "@tiptap/extension-code";
import CodeBlock from "@tiptap/extension-code-block";
import Color from "@tiptap/extension-color";
import Highlight from "@tiptap/extension-highlight";
import Link from "@tiptap/extension-link";
import Subscript from "@tiptap/extension-subscript";
import Superscript from "@tiptap/extension-superscript";
import { Table } from "@tiptap/extension-table";
import { TableCell } from "@tiptap/extension-table-cell";
import { TableHeader } from "@tiptap/extension-table-header";
import {
  getHierarchicalIndexes,
  TableOfContents,
  type TableOfContentDataItem,
} from "@tiptap/extension-table-of-contents";
import { TableRow } from "@tiptap/extension-table-row";
import { TextAlign } from "@tiptap/extension-text-align";
import { FontSize } from "@tiptap/extension-text-style";
import Underline from "@tiptap/extension-underline";
import { EditorContent, useEditor, type Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { HeaderFooter } from "./header-footer";
import { ImageResize } from "./image-extension";
import { PageBreak } from "./page-break-extension";
import { MarginRuler } from "./margin-ruler";
import { StatusBar } from "./status-bar";
import {
  FontFamilyExtension,
  IndentExtension,
  LineHeightExtension,
} from "./tiptap-extensions";
import { EditorToolbar } from "./toolbar";
import { useImageUpload } from "./use-image-upload";
import React, { useCallback, useEffect, useState, useRef } from "react";

export function RichEditor() {
  const [items, setItems] = useState<TableOfContentDataItem[]>([]);
  const [editorHeight, setEditorHeight] = useState(1124);
  const viewRef = useRef<HTMLDivElement>(null);

  const [focusedEditor, setFocusedEditor] = useState<Editor | null>(null);

  // Header/Footer State
  const [showHeader, setShowHeader] = useState(() => loadEditorState()?.showHeader ?? false);
  const [showFooter, setShowFooter] = useState(() => loadEditorState()?.showFooter ?? false);
  const [showPageNumbers, setShowPageNumbers] = useState(() => loadEditorState()?.showPageNumbers ?? false);
  const [headerContent, setHeaderContent] = useState(() => loadEditorState()?.headerContent ?? "");
  const [footerContent, setFooterContent] = useState(() => loadEditorState()?.footerContent ?? "");

  const toggleHeader = () => {
    setShowHeader((prev) => {
      saveEditorState({ showHeader: !prev });
      return !prev;
    });
  };
  const toggleFooter = () => {
    setShowFooter((prev) => {
      saveEditorState({ showFooter: !prev });
      return !prev;
    });
  };
  const togglePageNumbers = () => {
    setShowPageNumbers((prev) => {
      saveEditorState({ showPageNumbers: !prev });
      return !prev;
    });
  };
  const updateHeaderContent = useCallback(
    debounce((content: string) => {
      setHeaderContent(content);
      saveEditorState({ headerContent: content });
    }, 1000),
    []
  );

  const updateFooterContent = useCallback(
    debounce((content: string) => {
      setFooterContent(content);
      saveEditorState({ footerContent: content });
    }, 1000),
    []
  );

  const editor = useEditor({
    extensions: [
      // Base kit: paragraphs, headings, bold, italic, lists, etc.
      // Tiptap v3 StarterKit now includes link, underline, blockquote, and code
      // by default — disable those here to avoid duplicate extension warnings,
      // since we register them below with custom configuration.
      StarterKit.configure({
        heading: { levels: [1, 2, 3, 4] },
        bulletList: {
          keepMarks: true,
          keepAttributes: true,
          HTMLAttributes: {
            class: "list-disc list-outside",
          },
        },
        orderedList: {
          keepMarks: true,
          keepAttributes: true,
          HTMLAttributes: {
            class: "list-decimal list-outside",
          },
        },
        listItem: {
          HTMLAttributes: {
            class: "ml-4",
          },
        },
        codeBlock: false, // replaced by standalone CodeBlock extension below
        blockquote: false, // registered below (no custom config needed here)
        code: false,       // registered below (no custom config needed here)
        link: false,       // registered below with custom HTMLAttributes
        underline: false,  // registered below (standalone import)
      }),
      // Marks and styles
      // Note: TextStyle is NOT listed separately — FontFamilyExtension already
      // extends TextStyle (same extension name). Listing both would cause duplicates.
      Underline,
      Color, // text color via TextStyle
      Highlight.configure({ multicolor: true }), // background color
      Superscript,
      Subscript,
      // Custom attributes (FontFamilyExtension IS TextStyle with fontFamily added)
      IndentExtension,
      LineHeightExtension,
      FontFamilyExtension,
      FontSize.configure({
        types: ["textStyle"],
      }),
      // Text alignment
      TextAlign.configure({
        types: ["heading", "paragraph", "blockquote"],
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

      // Page break
      PageBreak,

      // Table of Contents
      TableOfContents.configure({
        getIndex: getHierarchicalIndexes,
        onUpdate(content) {
          setItems(content);
        },
      }),
    ],
    // Prevent immediate DOM rendering on initial (server) render to avoid hydration mismatch
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class:
          cn(
            "w-full min-h-[1124px] bg-transparent text-gray-900 focus:outline-none",
            "prose prose-lg max-w-none prose-headings:font-bold",
            "prose-p:leading-relaxed prose-headings:leading-tight"
          ),
        style: "padding: 96px;", // 1 inch A4 margins internally
      },
      // Preserve inline formatting styles (bold, italic, colors, font sizes, etc.)
      // when pasting from external sources like Google Docs, Word, or web pages.
      transformPastedHTML(html) {
        // Parse the pasted HTML and allow key inline style properties through
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, "text/html");

        // Walk all elements and keep allowed inline style properties
        const allowedStyleProps = [
          "font-family",
          "font-size",
          "font-weight",
          "font-style",
          "color",
          "background-color",
          "text-decoration",
          "text-align",
          "line-height",
          "letter-spacing",
        ];

        doc.querySelectorAll("[style]").forEach((el) => {
          const htmlEl = el as HTMLElement;
          const existing = htmlEl.getAttribute("style") || "";
          // Re-build style keeping only allowed props
          const filtered = existing
            .split(";")
            .map((s) => s.trim())
            .filter((s) => {
              if (!s) return false;
              const prop = s.split(":")[0]?.trim().toLowerCase();
              return allowedStyleProps.some((allowed) => prop === allowed);
            })
            .join("; ");
          if (filtered) {
            htmlEl.setAttribute("style", filtered);
          } else {
            htmlEl.removeAttribute("style");
          }
        });

        return doc.body.innerHTML;
      },
    },
    onFocus: () => {
      setFocusedEditor(null);
    },

    content: `<h1>Welcome</h1><p>Start typing…</p>`,
    onCreate: ({ editor }) => {
      // Load saved content on editor creation
      const saved = loadEditorState();
      if (saved?.content) {
        editor.commands.setContent(saved.content);
      }
    },
  });

  // Auto-save editor content to localStorage with debouncing
  useEffect(() => {
    if (!editor) return;

    const debouncedSave = debounce(() => {
      const content = editor.getHTML();
      saveEditorState({ content });
    }, 1000); // Save 1 second after user stops typing

    editor.on("update", debouncedSave);

    return () => {
      editor.off("update", debouncedSave);
    };
  }, [editor]);

  // Image upload functionality
  const { handleDrop, handleDragOver, handleDragLeave, handlePaste } =
    useImageUpload(editor);

  // --- Dynamic Block Push Pagination Engine ---
  useEffect(() => {
    if (!editor || !viewRef.current) return;
    const pmDom = viewRef.current.querySelector(".ProseMirror");
    if (!pmDom) return;

    let rafId: number;

    const computePagination = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        const children = Array.from(pmDom.children) as HTMLElement[];
        
        const pushes: { child: HTMLElement, amount: number | '' }[] = [];
        let diffAccumulator = 0;
        
        const pageHeight = 1124;
        const topMargin = 96;
        const bottomMargin = 96;
        const usableHeight = pageHeight - topMargin - bottomMargin;

        // Ensure natural geometry is evaluated with precision.
        for (let i = 0; i < children.length; i++) {
          const child = children[i];
          const existingMargin = parseFloat(child.style.marginTop || '0');
          
          // Current accumulated top tracking
          const newTop = child.offsetTop + diffAccumulator;
          const contentTop = newTop - existingMargin; // the raw visual top
          
          const height = child.offsetHeight;
          const contentBottom = contentTop + height;

          const pageIndex = Math.floor(contentTop / pageHeight);
          const pageBoundary = (pageIndex + 1) * pageHeight - bottomMargin;

          if (contentBottom > pageBoundary && height < usableHeight) {
            // Target the very beginning of the next page block
            const targetTop = (pageIndex + 1) * pageHeight + topMargin;
            const requiredMargin = targetTop - contentTop;
            
            const delta = requiredMargin - existingMargin;
            
            // Allow sub-pixel variations (1px threshold)
            if (Math.abs(delta) > 1) {
              pushes.push({ child, amount: requiredMargin });
            }
            diffAccumulator += delta;
          } else {
            // Remove margin if conditions are met
            if (existingMargin > 0) {
              pushes.push({ child, amount: '' });
              diffAccumulator -= existingMargin;
            }
          }
        }

        // Apply visual updates in single batch
        pushes.forEach(p => {
          if (p.amount === '') p.child.style.marginTop = '';
          else p.child.style.marginTop = `${p.amount}px`;
        });
        
        // Also update standard height for calculating the number of backgrounds
        setEditorHeight(pmDom.clientHeight || 1124);
      });
    };

    const observer = new ResizeObserver(() => computePagination());
    observer.observe(pmDom);
    editor.on('update', computePagination);

    return () => {
      observer.disconnect();
      editor.off('update', computePagination);
      cancelAnimationFrame(rafId);
    };
  }, [editor]);

  // Derive how many visual pages we need (padding height included)
  const numberOfPages = Math.max(1, Math.ceil(editorHeight / 1124));

  const handleItemClick = (
    e: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
    id: string
  ) => {
    e.preventDefault();
    if (editor) {
      const element = editor.view.dom.querySelector(`[data-id="${id}"]`);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-100 dark:bg-gray-800">
      <div className="sticky top-0 z-40 bg-white dark:bg-gray-900 shadow-sm flex flex-col">
        <EditorToolbar 
          editor={focusedEditor || editor} 
          showHeader={showHeader}
          showFooter={showFooter}
          showPageNumbers={showPageNumbers}
          onToggleHeader={toggleHeader}
          onToggleFooter={toggleFooter}
          onTogglePageNumbers={togglePageNumbers}
        />
        <MarginRuler />
      </div>

      <div className="flex flex-1 overflow-hidden relative">
        <aside className="w-64 border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-slate-900 overflow-y-auto p-4 z-10 hidden md:block">
          <h2 className="text-lg font-semibold mb-4 dark:text-gray-100">
            Table of Contents
          </h2>
          <div>
            <ul className="space-y-1">
              {items.length > 0 ? (
                items.map((item) => (
                  <li key={item.id}>
                    <a
                      href={`#${item.id}`} // functional link
                      onClick={(e) => handleItemClick(e, item.id)}
                      style={{ paddingLeft: `${item.level * 1}rem` }}
                      // highlight the current section
                      className={`
                        block w-full rounded-md px-2 py-2 text-sm
                        hover:bg-gray-100 dark:hover:bg-gray-800
                        dark:text-gray-300 dark:hover:text-white
                      `}
                    >
                      {item.textContent}
                    </a>
                  </li>
                ))
              ) : (
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  No headings found.
                </p>
              )}
            </ul>
          </div>
        </aside>

        <main className="flex-1 overflow-y-auto relative" ref={viewRef}>
          {/* Scroll container logic centering the A4 page stack */}
          <div className="min-h-full py-8 flex justify-center">
            {/* The A4 Canvas System */}
            <div 
              className="relative w-[794px]"
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onPaste={handlePaste}
            >
              {/* 1. Stack of Visual Whitespace Pages (Backgrounds) */}
              <div className="absolute inset-0 z-0 pointer-events-none flex flex-col shadow-md border border-gray-200/60">
                {Array.from({ length: numberOfPages }).map((_, i) => (
                  <div 
                    key={i} 
                    className="w-full h-[1124px] shrink-0 bg-white border-b-2 border-dashed border-gray-200" 
                  />
                ))}
              </div>

              {/* 2. The Transparent Interactive Editor Canvas over the pages */}
              <div 
                className="relative z-10 w-full"
                style={{
                  // The container height stretches exactly as far as the contiguous backgrounds
                  minHeight: `${numberOfPages * 1124}px`
                }}
              >
                <EditorContent editor={editor} />
              </div>

              {/* 3. Headers and Footers Stack Overlay (z-20) */}
              <div className="absolute inset-0 z-20 pointer-events-none flex flex-col">
                {Array.from({ length: numberOfPages }).map((_, i) => (
                  <div 
                    key={i} 
                    className="relative w-full h-[1124px] shrink-0 pointer-events-none" 
                  >
                    {/* Embedded Header Editor */}
                    {(showHeader || showPageNumbers) && (
                      <div className="absolute top-0 left-0 right-0 px-16 pt-8 z-30 pointer-events-auto">
                        <HeaderFooter
                          content={headerContent}
                          onChange={updateHeaderContent}
                          onFocus={(e) => setFocusedEditor(e)}
                          placeholder="Header (click to edit)"
                          type="header"
                          showPageNumber={showPageNumbers}
                          pageNumber={i + 1}
                        />
                      </div>
                    )}
                    
                    {/* Embedded Footer Editor */}
                    {(showFooter || (showPageNumbers && !showHeader)) && (
                      <div className="absolute bottom-0 left-0 right-0 px-16 pb-6 z-30 flex flex-col justify-end pointer-events-auto">
                        <HeaderFooter
                          content={footerContent}
                          onChange={updateFooterContent}
                          onFocus={(e) => setFocusedEditor(e)}
                          placeholder="Footer (click to edit)"
                          type="footer"
                          showPageNumber={showPageNumbers && !showHeader}
                          pageNumber={i + 1}
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>

      <StatusBar editor={editor} />
      
      <div className="border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 px-8 py-4">
        <p className="text-sm text-gray-600 dark:text-gray-300 text-center">
          💡 <strong>Pro Tips:</strong> Use Ctrl/Cmd + B/I/U for quick
          formatting • Ctrl/Cmd + S to save • Ctrl/Cmd + Z/Y for undo/redo • 
          Ctrl/Cmd + A to select all • Right-click for context menu • Use
          Tab/Shift+Tab for indentation • Insert tables, blockquotes, code
          blocks, and links.
        </p>
      </div>
    </div>
  );
}
