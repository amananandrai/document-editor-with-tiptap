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
import type { EditorOptions } from "@tiptap/core";
import { EditorContent, useEditor, type Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { NodeSelection, TextSelection } from "@tiptap/pm/state";
import "katex/dist/katex.min.css";
import { EquationDialog, type EquationDraft } from "./equation-dialog";
import { buildHeaderFooterHtml } from "./export-utils";
import { HeaderFooter } from "./header-footer";
import { ListStyleExtension } from "./list-style-extension";
import { createMathExtensions, type EquationMode } from "./math-extension";
import { ImageResize } from "./image-extension";
import { PageBreak } from "./page-break-extension";
import { MarginRuler } from "./margin-ruler";
import {
  clampMargin,
  DEFAULT_MARGIN,
  getContentInsets,
  getHeaderFooterVisibility,
  headerFooterDistance,
  PAGE_HEIGHT,
  PAGE_WIDTH,
  type PageMargins,
  type PageNumberPosition,
  type PaginationLayout,
} from "./page-layout";
import { PageSetupDialog } from "./page-setup-dialog";
import { Pagination, type PaginationStorage } from "./pagination-extension";
import { tocStore, TableOfContentsNode } from "./toc-extension";
import { StatusBar } from "./status-bar";
import {
  FontFamilyExtension,
  IndentExtension,
  LineHeightExtension,
} from "./tiptap-extensions";
import { EditorToolbar } from "./toolbar";
import { useImageUpload } from "./use-image-upload";
import React, { useCallback, useEffect, useMemo, useState, useRef } from "react";

const DEFAULT_CONTENT = `<h1>Welcome</h1><p>Start typing…</p>`;

// Tracks an element's border-box height (0 while unmounted).
function useElementHeight<T extends HTMLElement>() {
  const [element, setElement] = useState<T | null>(null);
  const [height, setHeight] = useState(0);
  useEffect(() => {
    if (!element) {
      setHeight(0);
      return;
    }
    const update = () => setHeight(element.getBoundingClientRect().height);
    update();
    const observer = new ResizeObserver(update);
    observer.observe(element);
    return () => observer.disconnect();
  }, [element]);
  return [setElement, height] as const;
}

type ActiveHeaderFooter = { type: "header" | "footer"; page: number } | null;

export function RichEditor() {
  const [items, setItems] = useState<TableOfContentDataItem[]>([]);
  const [activeHeadingId, setActiveHeadingId] = useState<string>("");
  const [editorHeight, setEditorHeight] = useState(PAGE_HEIGHT);
  const viewRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);

  // Read persisted state once on mount
  const [saved] = useState(() => loadEditorState());

  // Header/Footer State
  const [showHeader, setShowHeader] = useState(saved?.showHeader ?? false);
  const [showFooter, setShowFooter] = useState(saved?.showFooter ?? false);
  const [showPageNumbers, setShowPageNumbers] = useState(saved?.showPageNumbers ?? false);
  const [headerContent, setHeaderContent] = useState(saved?.headerContent ?? "");
  const [footerContent, setFooterContent] = useState(saved?.footerContent ?? "");
  const [pageNumberPosition, setPageNumberPosition] = useState<PageNumberPosition>(
    saved?.pageNumberPosition ?? "footer-right"
  );
  // The single header/footer currently being edited, and its editor instance
  const [activeHeaderFooter, setActiveHeaderFooter] = useState<ActiveHeaderFooter>(null);
  const [headerFooterEditor, setHeaderFooterEditor] = useState<Editor | null>(null);

  // Margin State
  const [margins, setMargins] = useState<PageMargins>(() => ({
    top: clampMargin(saved?.topMargin ?? DEFAULT_MARGIN),
    right: clampMargin(saved?.rightMargin ?? DEFAULT_MARGIN),
    bottom: clampMargin(saved?.bottomMargin ?? DEFAULT_MARGIN),
    left: clampMargin(saved?.leftMargin ?? DEFAULT_MARGIN),
  }));
  const [isPageSetupOpen, setIsPageSetupOpen] = useState(false);
  const [equationDraft, setEquationDraft] = useState<EquationDraft | null>(null);

  const persistMargins = useCallback((m: PageMargins) => {
    saveEditorState({
      topMargin: m.top,
      rightMargin: m.right,
      bottomMargin: m.bottom,
      leftMargin: m.left,
    });
  }, []);

  const marginsRef = useRef(margins);
  marginsRef.current = margins;

  // Ruler drags update state live and persist once on release
  const updateLeftMargin = useCallback((left: number) => {
    setMargins((m) => ({ ...m, left }));
  }, []);
  const updateRightMargin = useCallback((right: number) => {
    setMargins((m) => ({ ...m, right }));
  }, []);
  const commitMargins = useCallback(() => {
    persistMargins(marginsRef.current);
  }, [persistMargins]);
  const applyPageSetup = useCallback(
    (m: PageMargins) => {
      setMargins(m);
      persistMargins(m);
    },
    [persistMargins]
  );

  const toggleHeader = () => {
    const next = !showHeader;
    setShowHeader(next);
    if (!next && activeHeaderFooter?.type === "header") setActiveHeaderFooter(null);
    saveEditorState({ showHeader: next });
  };
  const toggleFooter = () => {
    const next = !showFooter;
    setShowFooter(next);
    if (!next && activeHeaderFooter?.type === "footer") setActiveHeaderFooter(null);
    saveEditorState({ showFooter: next });
  };

  const updatePageNumberPosition = (pos: string) => {
    const position = pos as PageNumberPosition;
    const enabled = position !== "none";
    setShowPageNumbers(enabled);
    if (enabled) setPageNumberPosition(position);
    saveEditorState(
      enabled
        ? { showPageNumbers: true, pageNumberPosition: position }
        : { showPageNumbers: false }
    );
  };

  // Header/footer text updates every page immediately; persisting is debounced
  const saveHeaderContent = useMemo(
    () => debounce((content: string) => saveEditorState({ headerContent: content }), 500),
    []
  );
  const saveFooterContent = useMemo(
    () => debounce((content: string) => saveEditorState({ footerContent: content }), 500),
    []
  );
  const updateHeaderContent = useCallback(
    (content: string) => {
      setHeaderContent(content);
      saveHeaderContent(content);
    },
    [saveHeaderContent]
  );
  const updateFooterContent = useCallback(
    (content: string) => {
      setFooterContent(content);
      saveFooterContent(content);
    },
    [saveFooterContent]
  );

  // --- Page geometry ---
  const visibility = getHeaderFooterVisibility(
    showHeader,
    showFooter,
    showPageNumbers,
    pageNumberPosition
  );
  const [headerMeasureRef, headerHeight] = useElementHeight<HTMLDivElement>();
  const [footerMeasureRef, footerHeight] = useElementHeight<HTMLDivElement>();
  const insets = getContentInsets(
    margins,
    visibility.headerZone ? headerHeight : 0,
    visibility.footerZone ? footerHeight : 0
  );
  const layoutRef = useRef<PaginationLayout>({
    pageHeight: PAGE_HEIGHT,
    contentTop: insets.top,
    contentBottom: insets.bottom,
  });
  layoutRef.current = {
    pageHeight: PAGE_HEIGHT,
    contentTop: insets.top,
    contentBottom: insets.bottom,
  };

  const extensions = useMemo(
    () => [
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

      // Bullet/numbering styles and multilevel list presets
      ListStyleExtension,

      // Inline and display equations (KaTeX); clicking one opens the editor
      ...createMathExtensions((mode, latex, pos) =>
        setEquationDraft({ mode, latex, pos })
      ),

      // Page break
      PageBreak,

      // Moves blocks onto the next page at page boundaries and page breaks
      Pagination.configure({
        getLayout: () => layoutRef.current,
      }),

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
    []
  );

  const editorStyle = `padding: ${insets.top}px ${margins.right}px ${insets.bottom}px ${margins.left}px; min-height: ${PAGE_HEIGHT}px;`;

  // Memoized so useEditor only re-applies options when the padding changes
  const editorProps = useMemo<EditorOptions["editorProps"]>(
    () => ({
      attributes: {
        class:
          cn(
            "w-full bg-transparent text-gray-900 focus:outline-none",
            "prose prose-lg max-w-none prose-headings:font-bold",
            "prose-p:leading-relaxed prose-headings:leading-tight"
          ),
        style: editorStyle,
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
    }),
    [editorStyle]
  );

  const editor = useEditor({
    extensions,
    // Prevent immediate DOM rendering on initial (server) render to avoid hydration mismatch
    immediatelyRender: false,
    editorProps,
    onFocus: () => {
      // Clicking back into the document ends header/footer editing
      setActiveHeaderFooter(null);
    },
    // Load saved content as the initial document (not as an undoable change)
    content: saved?.content || DEFAULT_CONTENT,
  });

  // Re-paginate when margins or header/footer sizes change
  useEffect(() => {
    if (!editor) return;
    (editor.storage as unknown as { pagination?: PaginationStorage }).pagination?.refresh();
  }, [editor, editorStyle]);

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

  // Track the document height to know how many page backgrounds to draw.
  // Pagination itself is handled by the Pagination extension.
  useEffect(() => {
    if (!editor) return;
    const dom = editor.view.dom as HTMLElement;
    const update = () => setEditorHeight(dom.getBoundingClientRect().height || PAGE_HEIGHT);
    update();
    const observer = new ResizeObserver(update);
    observer.observe(dom);
    return () => observer.disconnect();
  }, [editor]);

  // Derive how many visual pages we need (sub-pixel tolerance)
  const numberOfPages = Math.max(1, Math.ceil((editorHeight - 1) / PAGE_HEIGHT));

  // Stop editing a header/footer whose page no longer exists
  useEffect(() => {
    if (activeHeaderFooter && activeHeaderFooter.page >= numberOfPages) {
      setActiveHeaderFooter(null);
    }
  }, [activeHeaderFooter, numberOfPages]);

  // The toolbar formats the header/footer being edited, otherwise the document
  const toolbarEditor =
    activeHeaderFooter && headerFooterEditor && !headerFooterEditor.isDestroyed
      ? headerFooterEditor
      : editor;

  const insertOrUpdateEquation = useCallback(
    (latex: string, mode: EquationMode, pos?: number) => {
      if (!editor) return;
      const type = mode === "inline" ? "inlineMath" : "blockMath";
      const existing = pos !== undefined ? editor.state.doc.nodeAt(pos) : null;
      if (existing && pos !== undefined && existing.type.name === type) {
        editor.chain().focus().command(({ tr }) => {
          tr.setNodeMarkup(pos, undefined, { ...existing.attrs, latex });
          return true;
        }).run();
        return;
      }
      const chain = editor.chain().focus();
      if (existing && pos !== undefined) {
        // Switching inline <-> display: replace the old node
        chain.deleteRange({ from: pos, to: pos + existing.nodeSize }).setTextSelection(pos);
      }
      chain
        .insertContent({ type, attrs: { latex } })
        .command(({ tr }) => {
          // A selected block equation would be replaced by the next keystroke:
          // move the cursor into the following paragraph instead.
          if (tr.selection instanceof NodeSelection) {
            const after = tr.selection.to;
            if (!tr.doc.nodeAt(after)?.isTextblock) {
              tr.insert(after, tr.doc.type.schema.nodes.paragraph.create());
            }
            tr.setSelection(TextSelection.create(tr.doc, after + 1));
          }
          return true;
        })
        .run();
    },
    [editor]
  );

  const deleteEquation = useCallback(
    (_mode: EquationMode, pos: number) => {
      if (!editor) return;
      const node = editor.state.doc.nodeAt(pos);
      if (!node) return;
      editor.chain().focus().deleteRange({ from: pos, to: pos + node.nodeSize }).run();
    },
    [editor]
  );

  const clearHeaderFooter = useCallback(() => {
    const previous = { header: headerContent, footer: footerContent };
    // Close any live header/footer editor so it doesn't keep the old text
    setActiveHeaderFooter(null);
    updateHeaderContent("");
    updateFooterContent("");
    return () => {
      updateHeaderContent(previous.header);
      updateFooterContent(previous.footer);
    };
  }, [headerContent, footerContent, updateHeaderContent, updateFooterContent]);

  const exitHeaderFooter = useCallback(() => {
    setActiveHeaderFooter(null);
    editor?.commands.focus();
  }, [editor]);


  const scrollToHeading = useCallback(
    (id: string) => {
      if (!editor) return;
      const el = editor.view.dom.querySelector(`[data-toc-id="${id}"]`);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    },
    [editor]
  );

  const insertTableOfContents = useCallback(() => {
    if (!editor) return;
    editor.chain().focus().insertTableOfContents().run();
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
        editor.view.dom.querySelectorAll("[data-toc-id]")
      ) as HTMLElement[];
      const mainRect = mainEl.getBoundingClientRect();
      let current = "";
      for (const el of headingEls) {
        const rect = el.getBoundingClientRect();
        if (rect.top <= mainRect.top + mainRect.height * 0.35) {
          current = el.getAttribute("data-toc-id") || "";
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
      {/* z-50: above the sticky margin ruler (z-40) so toolbar popovers aren't covered */}
      <div className="sticky top-0 z-50 bg-white dark:bg-gray-900 shadow-sm flex flex-col">
        <EditorToolbar
          editor={toolbarEditor}
          documentEditor={editor}
          getPageCanvas={() => canvasRef.current}
          margins={margins}
          showHeader={showHeader}
          showFooter={showFooter}
          pageNumberPosition={showPageNumbers ? pageNumberPosition : "none"}
          onToggleHeader={toggleHeader}
          onToggleFooter={toggleFooter}
          onUpdatePageNumberPosition={updatePageNumberPosition}
          onInsertTableOfContents={insertTableOfContents}
          onOpenPageSetup={() => setIsPageSetupOpen(true)}
          onInsertEquation={() => setEquationDraft({ latex: "", mode: "inline" })}
          onClearHeaderFooter={clearHeaderFooter}
          getWordHeaderFooter={() => ({
            header: visibility.headerZone
              ? buildHeaderFooterHtml(visibility.headerText ? headerContent : "", visibility.headerPageNumber)
              : "",
            footer: visibility.footerZone
              ? buildHeaderFooterHtml(visibility.footerText ? footerContent : "", visibility.footerPageNumber)
              : "",
          })}
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
              leftMargin={margins.left}
              rightMargin={margins.right}
              onLeftMarginChange={updateLeftMargin}
              onRightMarginChange={updateRightMargin}
              onCommit={commitMargins}
            />

            {/* The A4 Canvas System */}
            <div
              ref={canvasRef}
              className="page-canvas relative"
              style={{ width: PAGE_WIDTH }}
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
                    className="page-background w-full shrink-0 bg-white border-b-2 border-dashed border-gray-200 last:border-b-0"
                    style={{ height: PAGE_HEIGHT }}
                  />
                ))}
              </div>

              {/* 2. The Transparent Interactive Editor Canvas over the pages */}
              <div
                className="relative z-10 w-full"
                style={{
                  // The container height stretches exactly as far as the contiguous backgrounds
                  minHeight: `${numberOfPages * PAGE_HEIGHT}px`
                }}
              >
                <EditorContent editor={editor} />
              </div>

              {/* 3. Headers and Footers, placed inside each page's top/bottom margin.
                  The body text is inset below/above them (see getContentInsets). */}
              <div className="absolute inset-0 z-20 pointer-events-none flex flex-col">
                {Array.from({ length: numberOfPages }).map((_, i) => (
                  <div
                    key={i}
                    className="relative w-full shrink-0 pointer-events-none"
                    style={{ height: PAGE_HEIGHT }}
                  >
                    {visibility.headerZone && (
                      <HeaderFooter
                        ref={i === 0 ? headerMeasureRef : undefined}
                        type="header"
                        content={headerContent}
                        showText={visibility.headerText}
                        pageNumber={i + 1}
                        pageNumberAlign={visibility.headerPageNumber}
                        isActive={activeHeaderFooter?.type === "header" && activeHeaderFooter.page === i}
                        onActivate={() => setActiveHeaderFooter({ type: "header", page: i })}
                        onChange={updateHeaderContent}
                        onEditorChange={setHeaderFooterEditor}
                        onExit={exitHeaderFooter}
                        style={{
                          top: headerFooterDistance(margins.top),
                          left: margins.left,
                          right: margins.right,
                          pointerEvents: "auto",
                        }}
                      />
                    )}

                    {visibility.footerZone && (
                      <HeaderFooter
                        ref={i === 0 ? footerMeasureRef : undefined}
                        type="footer"
                        content={footerContent}
                        showText={visibility.footerText}
                        pageNumber={i + 1}
                        pageNumberAlign={visibility.footerPageNumber}
                        isActive={activeHeaderFooter?.type === "footer" && activeHeaderFooter.page === i}
                        onActivate={() => setActiveHeaderFooter({ type: "footer", page: i })}
                        onChange={updateFooterContent}
                        onEditorChange={setHeaderFooterEditor}
                        onExit={exitHeaderFooter}
                        style={{
                          bottom: headerFooterDistance(margins.bottom),
                          left: margins.left,
                          right: margins.right,
                          pointerEvents: "auto",
                        }}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>

      <EquationDialog
        draft={equationDraft}
        onClose={() => setEquationDraft(null)}
        onSubmit={insertOrUpdateEquation}
        onDelete={deleteEquation}
      />

      <PageSetupDialog
        isOpen={isPageSetupOpen}
        onClose={() => setIsPageSetupOpen(false)}
        margins={margins}
        onApply={applyPageSetup}
      />

      <StatusBar editor={editor} />
      
      <div className="border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 px-8 py-4">
        <p className="text-sm text-gray-600 dark:text-gray-300 text-center">
          💡 <strong>Pro Tips:</strong> Your work saves automatically in
          this browser • Ctrl/Cmd + B/I/U for quick formatting • Ctrl/Cmd +
          Z/Y for undo/redo • Tab/Shift+Tab to indent list items • Click a
          header or footer to edit it, Esc to return • Export from the File
          menu.
        </p>
      </div>
    </div>
  );
}
