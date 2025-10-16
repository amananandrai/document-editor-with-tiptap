"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  Trash2, 
  FileText,
  MoreHorizontal 
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { usePageManager } from "./page-manager";

export function PageNavigation() {
  const {
    pages,
    currentPageIndex,
    addPage,
    deletePage,
    nextPage,
    prevPage,
    canGoNext,
    canGoPrev,
    setCurrentPage,
  } = usePageManager();

  return (
    <div className="flex items-center justify-between px-4 py-3 bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
      {/* Left side - Page controls */}
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={prevPage}
          disabled={!canGoPrev}
          aria-label="Previous page"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        
        <div className="flex items-center gap-1 px-2">
          <FileText className="h-4 w-4 text-gray-500" />
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Page {currentPageIndex + 1} of {pages.length}
          </span>
        </div>
        
        <Button
          variant="outline"
          size="sm"
          onClick={nextPage}
          disabled={!canGoNext}
          aria-label="Next page"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Center - Page thumbnails */}
      <div className="flex items-center gap-1">
        {pages.map((page, index) => (
          <button
            key={page.id}
            onClick={() => setCurrentPage(index)}
            className={`
              w-8 h-10 rounded border text-xs font-medium transition-all duration-200
              ${index === currentPageIndex 
                ? 'bg-blue-500 text-white border-blue-500 shadow-md scale-105' 
                : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50 hover:border-gray-400 hover:scale-105'
              }
            `}
            title={`Page ${index + 1}${index === currentPageIndex ? ' (Current)' : ''}`}
          >
            {index + 1}
          </button>
        ))}
      </div>

      {/* Right side - Page actions */}
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => addPage()}
          aria-label="Add new page"
        >
          <Plus className="h-4 w-4 mr-1" />
          Add Page
        </Button>
        
        {pages.length > 1 && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                aria-label="Page options"
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() => deletePage(pages[currentPageIndex].id)}
                className="text-red-600 hover:text-red-700"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Current Page
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </div>
  );
}
