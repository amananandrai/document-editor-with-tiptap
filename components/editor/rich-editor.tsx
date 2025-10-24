"use client";
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
import { FontSize, TextStyle } from "@tiptap/extension-text-style";
import Underline from "@tiptap/extension-underline";
import type { Editor } from "@tiptap/react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import React, { useCallback, useEffect, useState } from "react";
import { A4PageLayout } from "./a4-page-layout";
import { useFocusMode } from "@/components/focus-mode-context"; // 1. Import the hook
import { HeaderFooterEditor } from "./header-footer";
import { ImageResize } from "./image-extension";
import { MultiPageEditor } from "./multi-page-editor";
import { PageBreak } from "./page-break-extension";
import { PageManagerProvider, usePageManager } from "./page-manager";
import { StatusBar } from "./status-bar";
import {
  FontFamilyExtension,
  IndentExtension,
  LineHeightExtension,
} from "./tiptap-extensions";
import { EditorToolbar } from "./toolbar";
import { useImageUpload } from "./use-image-upload";

function RichEditorContent({
  editor,
  isPageLayout,
  togglePageLayout,
  isMultiPageMode,
  toggleMultiPageMode,
  pageMargin,
  setPageMargin,
  items,
  handleItemClick,
  handleDrop,
  handleDragOver,
  handleDragLeave,
  handlePaste,
}: {
  editor: any;
  isPageLayout: boolean;
  togglePageLayout: () => void;
  isMultiPageMode: boolean;
  toggleMultiPageMode: () => void;
  pageMargin: number;
  setPageMargin: (m: number) => void;
  items: TableOfContentDataItem[];
  handleItemClick: (
    e: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
    id: string
  ) => void;
  handleDrop: (event: React.DragEvent<HTMLDivElement>) => void;
  handleDragOver: (event: React.DragEvent<HTMLDivElement>) => void;
  handleDragLeave: (event: React.DragEvent<HTMLDivElement>) => void;
  handlePaste: (event: React.ClipboardEvent<HTMLDivElement>) => void;
}) {
  // Get page manager context if in multi-page mode or A4 layout
  const pageManager = isMultiPageMode || isPageLayout ? usePageManager() : null;

  // Register main editor focus handler when in multi-page mode or A4 layout
  useEffect(() => {
    if (
      editor &&
      pageManager?.setActiveEditor &&
      (isMultiPageMode || isPageLayout)
    ) {
      const handleFocus = () => {
        pageManager.setActiveEditor(editor, "main");
      };

      editor.on("focus", handleFocus);

      return () => {
        editor.off("focus", handleFocus);
      };
    }
  }, [editor, pageManager?.setActiveEditor, isMultiPageMode, isPageLayout]);

  // Handlers for header/footer editor focus in A4 layout
  const handleHeaderEditorReady = useCallback((headerEditor: Editor) => {
    // Store reference if needed
  }, []);

  const handleFooterEditorReady = useCallback((footerEditor: Editor) => {
    // Store reference if needed
  }, []);

  const handleHeaderFocus = useCallback(
    (headerEditor: Editor) => {
      if (pageManager?.setActiveEditor) {
        pageManager.setActiveEditor(headerEditor, "header");
      }
    },
    [pageManager]
  );

  const handleFooterFocus = useCallback(
    (footerEditor: Editor) => {
      if (pageManager?.setActiveEditor) {
        pageManager.setActiveEditor(footerEditor, "footer");
      }
    },
    [pageManager]
  );

  const handleHeaderBlur = useCallback(() => {
    // Don't clear active editor on blur - wait for another editor to gain focus
  }, []);

  const handleFooterBlur = useCallback(() => {
    // Don't clear active editor on blur - wait for another editor to gain focus
  }, []);

  return (
    <div className="flex flex-col">
      <div className="sticky top-0 z-40 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
        <EditorToolbar
          editor={pageManager?.activeEditor || editor}
          isPageLayout={isPageLayout}
          onTogglePageLayout={togglePageLayout}
          isMultiPageMode={isMultiPageMode}
          onToggleMultiPageMode={toggleMultiPageMode}
          pageMargin={pageMargin}
          onChangePageMargin={(m: number) => setPageMargin(m)}
          showHeader={pageManager?.showHeader || false}
          showFooter={pageManager?.showFooter || false}
          showPageNumbers={pageManager?.showPageNumbers || false}
          onToggleHeader={pageManager?.toggleHeader}
          onToggleFooter={pageManager?.toggleFooter}
          onTogglePageNumbers={pageManager?.togglePageNumbers}
          activeEditorType={pageManager?.activeEditorType || null}
        />
      </div>

      {/* sidebar + editor) */}
      <div className="flex flex-1 overflow-hidden">
        {/* Table of Contents Sidebar */}
        <aside className="flex-none w-64 border-r border-gray-200 dark:border-gray-700 dark:bg-slate-900 overflow-y-auto p-4 z-10">
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

        {/* Editor */}
        <main className="flex-1 overflow-auto bg-white">
          {isMultiPageMode ? (
            <MultiPageEditor
              editor={editor}
              pageMargin={pageMargin}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onPaste={handlePaste}
            />
          ) : isPageLayout ? (
            <A4PageLayout
              pageMargin={pageMargin}
              header={
                pageManager?.showHeader || pageManager?.showPageNumbers ? (
                  <HeaderFooterEditor
                    headerContent={pageManager?.headerContent || ""}
                    footerContent=""
                    onHeaderChange={
                      pageManager?.updateHeaderContent || (() => {})
                    }
                    onFooterChange={() => {}}
                    showHeader={pageManager?.showHeader || false}
                    showFooter={false}
                    showPageNumbers={pageManager?.showPageNumbers || false}
                    pageNumber={1}
                    onHeaderEditorReady={handleHeaderEditorReady}
                    onFooterEditorReady={handleFooterEditorReady}
                    onHeaderFocus={handleHeaderFocus}
                    onFooterFocus={handleFooterFocus}
                    onHeaderBlur={handleHeaderBlur}
                    onFooterBlur={handleFooterBlur}
                  />
                ) : undefined
              }
              footer={
                pageManager?.showFooter ||
                (pageManager?.showPageNumbers && !pageManager?.showHeader) ? (
                  <HeaderFooterEditor
                    headerContent=""
                    footerContent={pageManager?.footerContent || ""}
                    onHeaderChange={() => {}}
                    onFooterChange={
                      pageManager?.updateFooterContent || (() => {})
                    }
                    showHeader={false}
                    showFooter={pageManager?.showFooter || false}
                    showPageNumbers={
                      (pageManager?.showPageNumbers &&
                        !pageManager?.showHeader) ||
                      false
                    }
                    pageNumber={1}
                    onHeaderEditorReady={handleHeaderEditorReady}
                    onFooterEditorReady={handleFooterEditorReady}
                    onHeaderFocus={handleHeaderFocus}
                    onFooterFocus={handleFooterFocus}
                    onHeaderBlur={handleHeaderBlur}
                    onFooterBlur={handleFooterBlur}
                  />
                ) : undefined
              }
            >
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
            <div
              className="w-full h-full mx-auto bg-white"
              style={{ padding: `${pageMargin}px` }}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onPaste={handlePaste}
            >
              <EditorContent editor={editor} />
            </div>
          )}
        </main>
      </div>
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

export function RichEditor() {
  const [isPageLayout, setIsPageLayout] = useState(false);
  const [isMultiPageMode, setIsMultiPageMode] = useState(false);
  // page margin in pixels (applies as padding inside page container)
  const [pageMargin, setPageMargin] = useState<number>(64); // default: 64px (p-16)

  const [items, setItems] = useState<TableOfContentDataItem[]>([]);

  // ✅ 2. Safely get focus mode state
  let isFocusMode = false;
  try {
    const focus = useFocusMode();
    isFocusMode = focus.isFocusMode;
  } catch (error) {
    // FocusModeProvider not found, default to false
    // This is safe and prevents errors if the editor is used elsewhere
  }

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
          // Keep styles semantic and token-based
          cn(
            "w-full h-full min-h-[600px] rounded-lg bg-white text-gray-900 focus:outline-none",
            "prose prose-lg max-w-none prose-headings:font-bold",
            "prose-p:leading-relaxed prose-headings:leading-tight"
            // If the project doesn't include Typography plugin, this still renders fine
          ),
      },
    },
    content: `<h1>Welcome</h1><p>Start typing…</p>`,
  });

  // Image upload functionality
  const { handleDrop, handleDragOver, handleDragLeave, handlePaste } =
    useImageUpload(editor);

  const handleItemClick = (
    e: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
    id: string
  ) => {
    e.preventDefault();

    // Find the heading element in the document by id
    const element = document.getElementById(id);

    if (!editor) {
      return;
    }

    if (element) {
      // Smooth scroll
      element.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });

      // Focus the editor after clicking
      editor.chain().focus().run();
    }
  };

  return (
    <div className="flex flex-col">
      <div className="sticky top-0 z-40 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
        <EditorToolbar
          editor={editor}
          isPageLayout={isPageLayout}
          onTogglePageLayout={togglePageLayout}
          isMultiPageMode={isMultiPageMode}
          onToggleMultiPageMode={toggleMultiPageMode}
          pageMargin={pageMargin}
          onChangePageMargin={(m: number) => setPageMargin(m)}
        />
      </div>

      {/* sidebar + editor) */}
      <div className="flex flex-1 overflow-hidden">
        {/* Table of Contents Sidebar */}
        <aside className="flex-none w-64 border-r border-gray-200 dark:border-gray-700 dark:bg-slate-900 overflow-y-auto p-4 z-10">
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

        {/* Editor */}
        <main className="flex-1 overflow-auto bg-white">
          {isMultiPageMode ? (
            <PageManagerProvider editor={editor}>
              <MultiPageEditor
                editor={editor}
                pageMargin={pageMargin}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onPaste={handlePaste}
              />
            </PageManagerProvider>
          ) : isPageLayout ? (
            <A4PageLayout pageMargin={pageMargin}>
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
            <div
              className="w-full h-full mx-auto bg-white"
              style={{ padding: `${pageMargin}px` }}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onPaste={handlePaste}
            >
              <EditorContent editor={editor} />
            </div>
          )}
        </main>
      </div>
      {/* Status bar */}
      <StatusBar editor={editor} />

      {/* ✅ 3. Conditionally render the "Help text" div */}
      {!isFocusMode && (
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
      )}
    </div>
  return isMultiPageMode || isPageLayout ? (
    <PageManagerProvider editor={editor}>
      <RichEditorContent
        editor={editor}
        isPageLayout={isPageLayout}
        togglePageLayout={togglePageLayout}
        isMultiPageMode={isMultiPageMode}
        toggleMultiPageMode={toggleMultiPageMode}
        pageMargin={pageMargin}
        setPageMargin={setPageMargin}
        items={items}
        handleItemClick={handleItemClick}
        handleDrop={handleDrop}
        handleDragOver={handleDragOver}
        handleDragLeave={handleDragLeave}
        handlePaste={handlePaste}
      />
    </PageManagerProvider>
  ) : (
    <RichEditorContent
      editor={editor}
      isPageLayout={isPageLayout}
      togglePageLayout={togglePageLayout}
      isMultiPageMode={isMultiPageMode}
      toggleMultiPageMode={toggleMultiPageMode}
      pageMargin={pageMargin}
      setPageMargin={setPageMargin}
      items={items}
      handleItemClick={handleItemClick}
      handleDrop={handleDrop}
      handleDragOver={handleDragOver}
      handleDragLeave={handleDragLeave}
      handlePaste={handlePaste}
    />
  );
}
