"use client";

import { cn } from "@/lib/utils";
import type { Editor } from "@tiptap/react";
import { EditorContent } from "@tiptap/react";
import React from "react";
import { HeaderFooterEditor } from "./header-footer";
import { usePageManager } from "./page-manager";
import { PageNavigation } from "./page-navigation";
import { RealisticPage } from "./realistic-page";

interface MultiPageEditorProps {
  editor: any;
  onDrop?: (event: React.DragEvent<HTMLDivElement>) => void;
  onDragOver?: (event: React.DragEvent<HTMLDivElement>) => void;
  onDragLeave?: (event: React.DragEvent<HTMLDivElement>) => void;
  onPaste?: (event: React.ClipboardEvent<HTMLDivElement>) => void;
  pageMargin?: number;
}

export function MultiPageEditor({
  editor,
  onDrop,
  onDragOver,
  onDragLeave,
  onPaste,
  pageMargin = 64,
}: MultiPageEditorProps) {
  const {
    pages,
    currentPageIndex,
    setCurrentPage,
    headerContent,
    footerContent,
    updateHeaderContent,
    updateFooterContent,
    showHeader,
    showFooter,
    showPageNumbers,
    setActiveEditor,
  } = usePageManager();
  const containerRef = React.useRef<HTMLDivElement>(null);

  // Handlers for header/footer editor focus
  const handleHeaderEditorReady = React.useCallback((headerEditor: Editor) => {
    // Store reference if needed
  }, []);

  const handleFooterEditorReady = React.useCallback((footerEditor: Editor) => {
    // Store reference if needed
  }, []);

  const handleHeaderFocus = React.useCallback(
    (headerEditor: Editor) => {
      setActiveEditor(headerEditor, "header");
    },
    [setActiveEditor]
  );

  const handleFooterFocus = React.useCallback(
    (footerEditor: Editor) => {
      setActiveEditor(footerEditor, "footer");
    },
    [setActiveEditor]
  );

  const handleHeaderBlur = React.useCallback(() => {
    // Don't clear active editor on blur - wait for another editor to gain focus
  }, []);

  const handleFooterBlur = React.useCallback(() => {
    // Don't clear active editor on blur - wait for another editor to gain focus
  }, []);

  // Auto-scroll to top when page changes
  React.useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [currentPageIndex]);

  // Focus editor and move cursor to start when page changes
  React.useEffect(() => {
    if (editor) {
      // Small delay to ensure editor is ready
      setTimeout(() => {
        editor.commands.focus();
        editor.commands.setTextSelection(0);
      }, 150);
    }
  }, [currentPageIndex, editor]);

  return (
    <div className="flex flex-col h-full">
      {/* Page Navigation */}
      <PageNavigation />

      {/* Editor Content Area */}
      <div
        ref={containerRef}
        className="flex-1 overflow-auto bg-gray-100 dark:bg-gray-800"
      >
        <div className="min-h-full py-8">
          <div className="flex justify-center">
            <div className="space-y-8">
              {pages.map((page, index) => (
                <RealisticPage
                  key={page.id}
                  pageNumber={index + 1}
                  isActive={index === currentPageIndex}
                  onClick={() => setCurrentPage(index)}
                  pageMargin={pageMargin}
                  className={cn(
                    "transition-all duration-300",
                    index === currentPageIndex
                      ? "scale-100 z-10"
                      : "scale-95 opacity-60 hover:scale-98 hover:opacity-80 cursor-pointer"
                  )}
                  header={
                    showHeader || showPageNumbers ? (
                      <HeaderFooterEditor
                        headerContent={headerContent}
                        footerContent=""
                        onHeaderChange={updateHeaderContent}
                        onFooterChange={() => {}}
                        showHeader={showHeader}
                        showFooter={false}
                        showPageNumbers={showPageNumbers}
                        pageNumber={index + 1}
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
                    showFooter || (showPageNumbers && !showHeader) ? (
                      <HeaderFooterEditor
                        headerContent=""
                        footerContent={footerContent}
                        onHeaderChange={() => {}}
                        onFooterChange={updateFooterContent}
                        showHeader={false}
                        showFooter={showFooter}
                        showPageNumbers={showPageNumbers && !showHeader}
                        pageNumber={index + 1}
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
                    className={cn(
                      "h-full w-full",
                      "prose prose-lg max-w-none",
                      "prose-headings:font-bold prose-headings:leading-tight",
                      "prose-p:leading-relaxed",
                      "focus:outline-none"
                    )}
                    onDrop={index === currentPageIndex ? onDrop : undefined}
                    onDragOver={
                      index === currentPageIndex ? onDragOver : undefined
                    }
                    onDragLeave={
                      index === currentPageIndex ? onDragLeave : undefined
                    }
                    onPaste={index === currentPageIndex ? onPaste : undefined}
                  >
                    {index === currentPageIndex ? (
                      <EditorContent editor={editor} />
                    ) : (
                      <div
                        dangerouslySetInnerHTML={{ __html: page.content }}
                        className="pointer-events-none"
                      />
                    )}
                  </div>
                </RealisticPage>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
