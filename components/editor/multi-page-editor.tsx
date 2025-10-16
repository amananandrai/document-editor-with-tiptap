"use client";

import React from "react";
import { EditorContent } from "@tiptap/react";
import { RealisticPage } from "./realistic-page";
import { PageNavigation } from "./page-navigation";
import { usePageManager } from "./page-manager";
import { cn } from "@/lib/utils";

interface MultiPageEditorProps {
  editor: any;
  onDrop?: (event: React.DragEvent<HTMLDivElement>) => void;
  onDragOver?: (event: React.DragEvent<HTMLDivElement>) => void;
  onDragLeave?: (event: React.DragEvent<HTMLDivElement>) => void;
  onPaste?: (event: React.ClipboardEvent<HTMLDivElement>) => void;
}

export function MultiPageEditor({ 
  editor, 
  onDrop, 
  onDragOver, 
  onDragLeave, 
  onPaste 
}: MultiPageEditorProps) {
  const { pages, currentPageIndex, setCurrentPage } = usePageManager();
  const containerRef = React.useRef<HTMLDivElement>(null);

  // Auto-scroll to top when page changes
  React.useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
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
      <div ref={containerRef} className="flex-1 overflow-auto bg-gray-100 dark:bg-gray-800">
        <div className="min-h-full py-8">
          <div className="flex justify-center">
            <div className="space-y-8">
              {pages.map((page, index) => (
                <RealisticPage
                  key={page.id}
                  pageNumber={index + 1}
                  isActive={index === currentPageIndex}
                  onClick={() => setCurrentPage(index)}
                  className={cn(
                    "transition-all duration-300",
                    index === currentPageIndex 
                      ? "scale-100 z-10" 
                      : "scale-95 opacity-60 hover:scale-98 hover:opacity-80 cursor-pointer"
                  )}
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
                    onDragOver={index === currentPageIndex ? onDragOver : undefined}
                    onDragLeave={index === currentPageIndex ? onDragLeave : undefined}
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
