/**
 * Local Storage utility for persisting editor state
 * Provides type-safe access to localStorage with error handling
 */

export interface EditorState {
  content: string;
  isPageLayout: boolean;
  isMultiPageMode: boolean;
  pageMargin: number;
  lastSaved: string;
}

export interface PageManagerState {
  pages: Array<{
    id: string;
    content: string;
    title?: string;
    createdAt: string;
    updatedAt: string;
  }>;
  currentPageIndex: number;
  headerContent: string;
  footerContent: string;
  showHeader: boolean;
  showFooter: boolean;
  showPageNumbers: boolean;
  lastSaved: string;
}

const STORAGE_KEYS = {
  EDITOR_STATE: "tiptap-editor-state",
  PAGE_MANAGER_STATE: "tiptap-page-manager-state",
} as const;

/**
 * Safely get item from localStorage with error handling
 */
function getItem<T>(key: string, defaultValue: T): T {
  if (typeof window === "undefined") {
    return defaultValue;
  }

  try {
    const item = localStorage.getItem(key);
    if (item === null) {
      return defaultValue;
    }
    return JSON.parse(item) as T;
  } catch (error) {
    console.error(`Error reading from localStorage key "${key}":`, error);
    return defaultValue;
  }
}

/**
 * Safely set item in localStorage with error handling
 */
function setItem<T>(key: string, value: T): boolean {
  if (typeof window === "undefined") {
    return false;
  }

  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.error(`Error writing to localStorage key "${key}":`, error);
    return false;
  }
}

/**
 * Remove item from localStorage
 */
function removeItem(key: string): void {
  if (typeof window === "undefined") {
    return;
  }

  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error(`Error removing from localStorage key "${key}":`, error);
  }
}

/**
 * Clear all editor-related data from localStorage
 */
export function clearEditorStorage(): void {
  removeItem(STORAGE_KEYS.EDITOR_STATE);
  removeItem(STORAGE_KEYS.PAGE_MANAGER_STATE);
}

/**
 * Load editor state from localStorage
 */
export function loadEditorState(): EditorState | null {
  const state = getItem<EditorState | null>(STORAGE_KEYS.EDITOR_STATE, null);
  return state;
}

/**
 * Save editor state to localStorage
 */
export function saveEditorState(state: Partial<EditorState>): boolean {
  const currentState = loadEditorState();
  const newState: EditorState = {
    content: state.content ?? currentState?.content ?? "",
    isPageLayout: state.isPageLayout ?? currentState?.isPageLayout ?? false,
    isMultiPageMode:
      state.isMultiPageMode ?? currentState?.isMultiPageMode ?? false,
    pageMargin: state.pageMargin ?? currentState?.pageMargin ?? 64,
    lastSaved: new Date().toISOString(),
  };
  return setItem(STORAGE_KEYS.EDITOR_STATE, newState);
}

/**
 * Load page manager state from localStorage
 */
export function loadPageManagerState(): PageManagerState | null {
  const state = getItem<PageManagerState | null>(
    STORAGE_KEYS.PAGE_MANAGER_STATE,
    null
  );
  return state;
}

/**
 * Save page manager state to localStorage
 */
export function savePageManagerState(
  state: Partial<PageManagerState>
): boolean {
  const currentState = loadPageManagerState();
  const newState: PageManagerState = {
    pages: state.pages ?? currentState?.pages ?? [],
    currentPageIndex:
      state.currentPageIndex ?? currentState?.currentPageIndex ?? 0,
    headerContent: state.headerContent ?? currentState?.headerContent ?? "",
    footerContent: state.footerContent ?? currentState?.footerContent ?? "",
    showHeader: state.showHeader ?? currentState?.showHeader ?? false,
    showFooter: state.showFooter ?? currentState?.showFooter ?? false,
    showPageNumbers:
      state.showPageNumbers ?? currentState?.showPageNumbers ?? false,
    lastSaved: new Date().toISOString(),
  };
  return setItem(STORAGE_KEYS.PAGE_MANAGER_STATE, newState);
}

/**
 * Debounce helper for reducing localStorage write frequency
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func(...args);
    };

    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(later, wait);
  };
}
