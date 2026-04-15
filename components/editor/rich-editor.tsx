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
import { tocStore, TableOfContentsNode } from "./toc-extension";
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
  const [activeHeadingId, setActiveHeadingId] = useState<string>("");
  const [editorHeight, setEditorHeight] = useState(1124);
  const viewRef = useRef<HTMLDivElement>(null);

  const [focusedEditor, setFocusedEditor] = useState<Editor | null>(null);

  // Header/Footer State
  const [showHeader, setShowHeader] = useState(() => loadEditorState()?.showHeader ?? false);
  const [showFooter, setShowFooter] = useState(() => loadEditorState()?.showFooter ?? false);
  const [showPageNumbers, setShowPageNumbers] = useState(() => loadEditorState()?.showPageNumbers ?? false);
  const [headerContent, setHeaderContent] = useState(() => loadEditorState()?.headerContent ?? "");
  const [footerContent, setFooterContent] = useState(() => loadEditorState()?.footerContent ?? "");
  const [pageNumberPosition, setPageNumberPosition] = useState(() => loadEditorState()?.pageNumberPosition ?? 'footer-right');

  // Margin State
  const [leftMargin, setLeftMargin] = useState(() => loadEditorState()?.leftMargin ?? 96);
  const [rightMargin, setRightMargin] = useState(() => loadEditorState()?.rightMargin ?? 96);
  const [topMargin] = useState(() => loadEditorState()?.topMargin ?? 96);
  const [bottomMargin] = useState(() => loadEditorState()?.bottomMargin ?? 96);

  const updateLeftMargin = (val: number) => {
    setLeftMargin(val);
    saveEditorState({ leftMargin: val });
  };
  const updateRightMargin = (val: number) => {
    setRightMargin(val);
    saveEditorState({ rightMargin: val });
  };

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

  const updatePageNumberPosition = (pos: any) => {
    setPageNumberPosition(pos);
    const updates: any = { pageNumberPosition: pos };
    
    if (pos === 'none') {
      setShowPageNumbers(false);
      updates.showPageNumbers = false;
    } else {
      setShowPageNumbers(true);
      updates.showPageNumbers = true;
      
      // Auto-enable header or footer if position is inside them
      if (pos.startsWith('header') && !showHeader) {
        setShowHeader(true);
        updates.showHeader = true;
      } else if (pos.startsWith('footer') && !showFooter) {
        setShowFooter(true);
        updates.showFooter = true;
      }
    }
    
    saveEditorState(updates);
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
      // Inline insertable Table of Contents block
      TableOfContentsNode,
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
        style: `padding: ${topMargin}px ${rightMargin}px ${bottomMargin}px ${leftMargin}px;`,
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
        const currentTopMargin = topMargin;
        const currentBottomMargin = bottomMargin;
        const usableHeight = pageHeight - currentTopMargin - currentBottomMargin;

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
          const pageBoundary = (pageIndex + 1) * pageHeight - currentBottomMargin;

          if (contentBottom > pageBoundary && height < usableHeight) {
            // Target the very beginning of the next page block
            const targetTop = (pageIndex + 1) * pageHeight + currentTopMargin;
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

  const scrollToHeading = useCallback(
    (id: string) => {
      if (!editor) return;
      const el = editor.view.dom.querySelector(`[data-id="${id}"]`);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    },
    [editor]
  );

  const insertTableOfContents = useCallback(() => {
    if (!editor) return;
    (editor.chain().focus() as any).insertTableOfContents().run();
  }, [editor]);

  const handleItemClick = (
    e: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
    id: string
  ) => {
    e.preventDefault();
    scrollToHeading(id);
  };

  // Sync TOC items to global store so the inline TOC NodeView stays up-to-date
  useEffect(() => {
    tocStore.setItems(items);
  }, [items]);

  useEffect(() => {
    tocStore.setOnHeadingClick(scrollToHeading);
  }, [scrollToHeading]);

  // Track which heading is currently visible to highlight it in the sidebar
  useEffect(() => {
    if (!viewRef.current || !editor) return;
    const mainEl = viewRef.current;
    const updateActive = () => {
      const headingEls = Array.from(
        editor.view.dom.querySelectorAll("[data-id]")
      ) as HTMLElement[];
      const mainRect = mainEl.getBoundingClientRect();
      let current = "";
      for (const el of headingEls) {
        const rect = el.getBoundingClientRect();
        if (rect.top <= mainRect.top + mainRect.height * 0.35) {
          current = el.getAttribute("data-id") || "";
        } else break;
      }
      setActiveHeadingId(current);
    };
    mainEl.addEventListener("scroll", updateActive, { passive: true });
    updateActive();
    return () => mainEl.removeEventListener("scroll", updateActive);
  }, [editor]);

  return (
    <div className="flex flex-col h-full bg-gray-100 dark:bg-gray-800">
      <div className="sticky top-0 z-40 bg-white dark:bg-gray-900 shadow-sm flex flex-col">
        <EditorToolbar 
          editor={focusedEditor || editor} 
          showHeader={showHeader}
          showFooter={showFooter}
          showPageNumbers={showPageNumbers}
          pageNumberPosition={pageNumberPosition}
          onToggleHeader={toggleHeader}
          onToggleFooter={toggleFooter}
          onTogglePageNumbers={togglePageNumbers}
          onUpdatePageNumberPosition={updatePageNumberPosition}
          onInsertTableOfContents={insertTableOfContents}
        />
      </div>

      <div className="flex flex-1 overflow-hidden relative">
        <aside className="w-60 border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-slate-900 z-10 hidden md:flex flex-col overflow-hidden">
          {/* Sidebar header */}
          <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-100 dark:border-gray-700 shrink-0">
            <svg
              className="w-4 h-4 text-blue-500 shrink-0"
              fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 10h12M4 14h8M4 18h6" />
            </svg>
            <h2 className="text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
              Contents
            </h2>
            {items.length > 0 && (
              <span className="ml-auto text-[10px] text-gray-400 dark:text-gray-500 font-mono">
                {items.length}
              </span>
            )}
          </div>

          {/* Scrollable TOC list */}
          <div className="flex-1 overflow-y-auto px-2 py-3">
            {items.length > 0 ? (
              <ul className="space-y-0.5">
                {items.map((item) => {
                  const isActive = item.id === activeHeadingId;
                  return (
                    <li key={item.id}>
                      <a
                        href={`#${item.id}`}
                        onClick={(e) => handleItemClick(e, item.id)}
                        style={{ paddingLeft: `${(item.level - 1) * 14 + 8}px` }}
                        className={[
                          "group flex items-center gap-2 py-1.5 pr-2 rounded-lg transition-all duration-150 no-underline",
                          isActive
                            ? "bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300"
                            : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-800 hover:text-gray-900 dark:hover:text-gray-100",
                        ].join(" ")}
                      >
                        <span
                          className={[
                            "shrink-0 text-[9px] font-bold font-mono w-5 text-center leading-none",
                            isActive
                              ? "text-blue-500 dark:text-blue-400"
                              : "text-gray-400 dark:text-gray-500",
                          ].join(" ")}
                        >
                          H{item.level}
                        </span>
                        <span
                          className={[
                            "truncate text-[13px] leading-snug",
                            item.level === 1
                              ? "font-semibold"
                              : item.level === 2
                              ? "font-medium"
                              : "font-normal",
                          ].join(" ")}
                        >
                          {item.textContent}
                        </span>
                        {isActive && (
                          <span className="ml-auto w-1 h-3.5 bg-blue-500 dark:bg-blue-400 rounded-full shrink-0" />
                        )}
                      </a>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <div className="flex flex-col items-center justify-center h-32 gap-3 px-3">
                <svg
                  className="w-8 h-8 text-gray-300 dark:text-gray-600"
                  fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 10h12M4 14h8M4 18h6" />
                </svg>
                <p className="text-xs text-gray-400 dark:text-gray-500 text-center leading-relaxed">
                  Add headings (H1–H4) to build your contents panel.
                </p>
              </div>
            )}
          </div>
        </aside>

        <main className="flex-1 overflow-y-auto relative" ref={viewRef}>
          {/* Scroll container logic centering the A4 page stack */}
          <div className="min-h-full py-8 flex items-center flex-col">
            {/* The Ruler stays aligned with the page container */}
            <MarginRuler 
              leftMargin={leftMargin}
              rightMargin={rightMargin}
              onLeftMarginChange={updateLeftMargin}
              onRightMarginChange={updateRightMargin}
            />

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
                      <div 
                        className="absolute top-0 left-0 right-0 z-30 pointer-events-auto"
                        style={{ paddingLeft: `${leftMargin}px`, paddingRight: `${rightMargin}px`, paddingTop: `${topMargin / 2}px` }}
                      >
                        <HeaderFooter
                          content={headerContent}
                          onChange={updateHeaderContent}
                          onFocus={(e) => setFocusedEditor(e)}
                          placeholder="Header (click to edit)"
                          type="header"
                          showPageNumber={showPageNumbers}
                          pageNumber={i + 1}
                          pageNumberPosition={pageNumberPosition}
                        />
                      </div>
                    )}
                    
                    {/* Embedded Footer Editor */}
                    {(showFooter || (showPageNumbers && !showHeader)) && (
                      <div 
                        className="absolute bottom-0 left-0 right-0 z-30 flex flex-col justify-end pointer-events-auto"
                        style={{ paddingLeft: `${leftMargin}px`, paddingRight: `${rightMargin}px`, paddingBottom: `${bottomMargin / 2}px` }}
                      >
                        <HeaderFooter
                          content={footerContent}
                          onChange={updateFooterContent}
                          onFocus={(e) => setFocusedEditor(e)}
                          placeholder="Footer (click to edit)"
                          type="footer"
                          showPageNumber={showPageNumbers && !showHeader}
                          pageNumber={i + 1}
                          pageNumberPosition={pageNumberPosition}
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
