"use client";

import {
  debounce,
  loadPageManagerState,
  savePageManagerState,
} from "@/lib/local-storage";
import type { Editor } from "@tiptap/react";
import React, { createContext, useCallback, useContext, useState } from "react";

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
  // Global header/footer (shared across all pages)
  headerContent: string;
  footerContent: string;
  updateHeaderContent: (content: string) => void;
  updateFooterContent: (content: string) => void;
  showHeader: boolean;
  showFooter: boolean;
  showPageNumbers: boolean;
  toggleHeader: () => void;
  toggleFooter: () => void;
  togglePageNumbers: () => void;
  // Active editor tracking
  activeEditor: Editor | null;
  activeEditorType: "main" | "header" | "footer" | null;
  setActiveEditor: (
    editor: Editor | null,
    type: "main" | "header" | "footer" | null
  ) => void;
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

export function PageManagerProvider({
  children,
  editor,
}: PageManagerProviderProps) {
  // Load saved state from localStorage or use defaults
  const [pages, setPages] = useState<Page[]>(() => {
    const saved = loadPageManagerState();
    if (saved?.pages && saved.pages.length > 0) {
      // Convert date strings back to Date objects
      return saved.pages.map((p) => ({
        ...p,
        createdAt: new Date(p.createdAt),
        updatedAt: new Date(p.updatedAt),
      }));
    }
    return [
      {
        id: "page-1",
        content: "<h1>Welcome</h1><p>Start typing your document...</p>",
        title: "Page 1",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];
  });

  const [currentPageIndex, setCurrentPageIndex] = useState(() => {
    const saved = loadPageManagerState();
    return saved?.currentPageIndex ?? 0;
  });

  // Global header and footer content (shared across all pages)
  const [headerContent, setHeaderContent] = useState(() => {
    const saved = loadPageManagerState();
    return saved?.headerContent ?? "";
  });

  const [footerContent, setFooterContent] = useState(() => {
    const saved = loadPageManagerState();
    return saved?.footerContent ?? "";
  });

  const [showHeader, setShowHeader] = useState(() => {
    const saved = loadPageManagerState();
    return saved?.showHeader ?? false;
  });

  const [showFooter, setShowFooter] = useState(() => {
    const saved = loadPageManagerState();
    return saved?.showFooter ?? false;
  });

  const [showPageNumbers, setShowPageNumbers] = useState(() => {
    const saved = loadPageManagerState();
    return saved?.showPageNumbers ?? false;
  });

  // Active editor tracking
  const [activeEditor, setActiveEditorState] = useState<Editor | null>(null);
  const [activeEditorType, setActiveEditorType] = useState<
    "main" | "header" | "footer" | null
  >(null);

  const addPage = useCallback((content = "<p>New page content...</p>") => {
    // Use functional updates so we always derive from the latest state
    setPages((prevPages: Page[]) => {
      const newIndex = prevPages.length; // index for the newly appended page
      const newPage: Page = {
        id: `page-${Date.now()}`,
        content,
        title: `Page ${newIndex + 1}`,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      // Update the current page index to point to the newly added page
      setCurrentPageIndex(newIndex);
      return [...prevPages, newPage];
    });
  }, []);

  const deletePage = useCallback((pageId: string) => {
    // Use functional updates so calculations are based on freshest state
    setPages((prevPages: Page[]) => {
      if (prevPages.length <= 1) return prevPages; // Don't delete the last page

      const deletedIndex = prevPages.findIndex((p: Page) => p.id === pageId);
      if (deletedIndex === -1) return prevPages; // Page not found, no-op

      const newPages = prevPages.filter((p: Page) => p.id !== pageId);

      // Clamp or shift the current page index relative to the deleted page
      setCurrentPageIndex((idx: number) => {
        if (idx > deletedIndex) return idx - 1; // shift left if a previous page was removed
        if (idx === deletedIndex)
          return Math.max(0, Math.min(idx, newPages.length - 1));
        return idx; // unchanged if deletion was after current index
      });

      return newPages;
    });
  }, []);

  const updatePageContent = useCallback((pageId: string, content: string) => {
    setPages((prev: Page[]) =>
      prev.map((page: Page) =>
        page.id === pageId ? { ...page, content, updatedAt: new Date() } : page
      )
    );
  }, []);

  // Global header and footer update functions
  const updateHeaderContent = useCallback((content: string) => {
    setHeaderContent(content);
    savePageManagerState({ headerContent: content });
  }, []);

  const updateFooterContent = useCallback((content: string) => {
    setFooterContent(content);
    savePageManagerState({ footerContent: content });
  }, []);

  const toggleHeader = useCallback(() => {
    setShowHeader((prev) => {
      const newValue = !prev;
      savePageManagerState({ showHeader: newValue });
      return newValue;
    });
  }, []);

  const toggleFooter = useCallback(() => {
    setShowFooter((prev) => {
      const newValue = !prev;
      savePageManagerState({ showFooter: newValue });
      return newValue;
    });
  }, []);

  const togglePageNumbers = useCallback(() => {
    setShowPageNumbers((prev) => {
      const newValue = !prev;
      savePageManagerState({ showPageNumbers: newValue });
      return newValue;
    });
  }, []);

  const setActiveEditor = useCallback(
    (editor: Editor | null, type: "main" | "header" | "footer" | null) => {
      setActiveEditorState(editor);
      setActiveEditorType(type);
    },
    []
  );

  const setCurrentPage = useCallback(
    (index: number) => {
      if (index >= 0 && index < pages.length) {
        setCurrentPageIndex(index);
        savePageManagerState({ currentPageIndex: index });
      }
    },
    [pages.length]
  );

  const nextPage = useCallback(() => {
    if (currentPageIndex < pages.length - 1) {
      const newIndex = currentPageIndex + 1;
      setCurrentPageIndex(newIndex);
      savePageManagerState({ currentPageIndex: newIndex });
    }
  }, [currentPageIndex, pages.length]);

  const prevPage = useCallback(() => {
    if (currentPageIndex > 0) {
      const newIndex = currentPageIndex - 1;
      setCurrentPageIndex(newIndex);
      savePageManagerState({ currentPageIndex: newIndex });
    }
  }, [currentPageIndex]);

  const canGoNext = currentPageIndex < pages.length - 1;
  const canGoPrev = currentPageIndex > 0;
  const currentPage = pages[currentPageIndex] || null;

  // Save pages to localStorage whenever they change (debounced)
  React.useEffect(() => {
    const debouncedSave = debounce(() => {
      savePageManagerState({
        pages: pages.map((p) => ({
          ...p,
          createdAt: p.createdAt.toISOString(),
          updatedAt: p.updatedAt.toISOString(),
        })),
      });
    }, 500);

    debouncedSave();
  }, [pages]);

  // Update editor content when page changes
  React.useEffect(() => {
    if (editor && currentPage) {
      // Small delay to ensure editor is ready
      const timeoutId = setTimeout(() => {
        editor.commands.setContent(currentPage.content);
      }, 50);

      // Cleanup: Cancel timeout if page changes again before timeout executes
      return () => clearTimeout(timeoutId);
    }
  }, [currentPageIndex]); // Only depend on currentPageIndex, not currentPage object

  // Save content when editor updates
  React.useEffect(() => {
    if (editor && currentPage) {
      const handleUpdate = () => {
        const content = editor.getHTML();
        updatePageContent(currentPage.id, content);
      };

      editor.on("update", handleUpdate);
      return () => {
        editor.off("update", handleUpdate);
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
    headerContent,
    footerContent,
    updateHeaderContent,
    updateFooterContent,
    showHeader,
    showFooter,
    showPageNumbers,
    toggleHeader,
    toggleFooter,
    togglePageNumbers,
    activeEditor,
    activeEditorType,
    setActiveEditor,
  };

  return (
    <PageManagerContext.Provider value={value}>
      {children}
    </PageManagerContext.Provider>
  );
}
