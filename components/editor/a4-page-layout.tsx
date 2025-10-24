"use client";

import { cn } from "@/lib/utils";
import React from "react";

interface A4PageLayoutProps {
  children: React.ReactNode;
  className?: string;
  pageMargin?: number; // px
  header?: React.ReactNode;
  footer?: React.ReactNode;
}

export function A4PageLayout({
  children,
  className,
  pageMargin = 64,
  header,
  footer,
}: A4PageLayoutProps) {
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
          "flex flex-col",
          className
        )}
        style={{
          // Ensure exact A4 proportions
          aspectRatio: "210/297",
        }}
      >
        {/* Header */}
        {header && <div className="flex-none">{header}</div>}

        {/* Main Content */}
        <div
          className={cn(
            "flex-1",
            "prose prose-lg max-w-none",
            "prose-headings:font-bold prose-headings:leading-tight",
            "prose-p:leading-relaxed"
          )}
          style={{
            padding: `${pageMargin}px`,
          }}
        >
          {children}
        </div>

        {/* Footer */}
        {footer && <div className="flex-none">{footer}</div>}
      </div>
    </div>
  );
}
