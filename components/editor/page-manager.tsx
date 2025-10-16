"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import type { Editor } from "@tiptap/react";

export interface Page {
  id: string;
  content: string;
  title?: string;
  createdAt: Date;
  updatedAt: Date;
}

interface PageManagerContextType {
  pages: Page[];
  currentPageIndex: number;
  addPage: (content?: string) => void;
  deletePage: (pageId: string) => void;
  updatePageContent: (pageId: string, content: string) => void;
  setCurrentPage: (index: number) => void;
  nextPage: () => void;
  prevPage: () => void;
  canGoNext: boolean;
  canGoPrev: boolean;
  currentPage: Page | null;
}

const PageManagerContext = createContext<PageManagerContextType | null>(null);

export function usePageManager() {
  const context = useContext(PageManagerContext);
  if (!context) {
    throw new Error("usePageManager must be used within a PageManagerProvider");
  }
  return context;
}

interface PageManagerProviderProps {
  children: React.ReactNode;
  editor: Editor | null;
}

export function PageManagerProvider({ children, editor }: PageManagerProviderProps) {
  const [pages, setPages] = useState<Page[]>([
    {
      id: "page-1",
      content: "<h1>Welcome</h1><p>Start typing your document...</p>",
      title: "Page 1",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ]);
  const [currentPageIndex, setCurrentPageIndex] = useState(0);

  const addPage = useCallback((content = "<p>New page content...</p>") => {
    const newPage: Page = {
      id: `page-${Date.now()}`,
      content,
      title: `Page ${pages.length + 1}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    setPages(prev => [...prev, newPage]);
    setCurrentPageIndex(pages.length);
  }, [pages.length]);

  const deletePage = useCallback((pageId: string) => {
    if (pages.length <= 1) return; // Don't delete the last page
    
    setPages(prev => {
      const newPages = prev.filter(page => page.id !== pageId);
      const deletedIndex = prev.findIndex(page => page.id === pageId);
      
      // Adjust current page index if necessary
      if (deletedIndex <= currentPageIndex) {
        setCurrentPageIndex(Math.max(0, currentPageIndex - 1));
      }
      
      return newPages;
    });
  }, [pages.length, currentPageIndex]);

  const updatePageContent = useCallback((pageId: string, content: string) => {
    setPages(prev => prev.map(page => 
      page.id === pageId 
        ? { ...page, content, updatedAt: new Date() }
        : page
    ));
  }, []);

  const setCurrentPage = useCallback((index: number) => {
    if (index >= 0 && index < pages.length) {
      setCurrentPageIndex(index);
    }
  }, [pages.length]);

  const nextPage = useCallback(() => {
    if (currentPageIndex < pages.length - 1) {
      setCurrentPageIndex(prev => prev + 1);
    }
  }, [currentPageIndex, pages.length]);

  const prevPage = useCallback(() => {
    if (currentPageIndex > 0) {
      setCurrentPageIndex(prev => prev - 1);
    }
  }, [currentPageIndex]);

  const canGoNext = currentPageIndex < pages.length - 1;
  const canGoPrev = currentPageIndex > 0;
  const currentPage = pages[currentPageIndex] || null;

  // Update editor content when page changes
  React.useEffect(() => {
    if (editor && currentPage) {
      // Small delay to ensure editor is ready
      setTimeout(() => {
        editor.commands.setContent(currentPage.content);
      }, 50);
    }
  }, [currentPageIndex]); // Only depend on currentPageIndex, not currentPage object

  // Save content when editor updates
  React.useEffect(() => {
    if (editor && currentPage) {
      const handleUpdate = () => {
        const content = editor.getHTML();
        updatePageContent(currentPage.id, content);
      };

      editor.on('update', handleUpdate);
      return () => {
        editor.off('update', handleUpdate);
      };
    }
  }, [editor, currentPage, updatePageContent]);

  const value: PageManagerContextType = {
    pages,
    currentPageIndex,
    addPage,
    deletePage,
    updatePageContent,
    setCurrentPage,
    nextPage,
    prevPage,
    canGoNext,
    canGoPrev,
    currentPage,
  };

  return (
    <PageManagerContext.Provider value={value}>
      {children}
    </PageManagerContext.Provider>
  );
}
