"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface A4PageLayoutProps {
  children: React.ReactNode;
  className?: string;
  pageMargin?: number; // px
}

export function A4PageLayout({ children, className, pageMargin = 64 }: A4PageLayoutProps) {
  return (
    <div className="flex justify-center items-start min-h-screen bg-gray-100 dark:bg-gray-800 py-8">
      <div
        className={cn(
          // A4 dimensions: 210mm x 297mm at 96 DPI
          // 210mm = 8.27 inches = 794px
          // 297mm = 11.69 inches = 1123px
          "w-[794px] min-h-[1123px]",
          "bg-white shadow-2xl",
          "border border-gray-300",
          // padding replaced by inline style to allow dynamic margin (default 64px)
          "prose prose-lg max-w-none",
          "prose-headings:font-bold prose-headings:leading-tight",
          "prose-p:leading-relaxed",
          className
        )}
        style={{
          // Ensure exact A4 proportions
          aspectRatio: "210/297",
          padding: `${pageMargin}px`,
        }}
      >
        {children}
      </div>
    </div>
  );
}
