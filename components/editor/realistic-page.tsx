"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface RealisticPageProps {
  children: React.ReactNode;
  className?: string;
  pageNumber?: number;
  isActive?: boolean;
  onClick?: () => void;
  pageMargin?: number;
}

export function RealisticPage({ 
  children, 
  className, 
  pageNumber, 
  isActive = false,
  onClick 
  , pageMargin = 64
}: RealisticPageProps) {
  return (
    <div
      className={cn(
        // A4 dimensions: 210mm x 297mm at 96 DPI
        "w-[794px] min-h-[1123px]",
        "bg-white",
        "shadow-2xl",
        "border border-gray-200",
        "relative",
        "transition-all duration-200",
        "hover:shadow-3xl",
        isActive && "ring-2 ring-blue-500 ring-opacity-50 shadow-3xl",
        onClick && "cursor-pointer hover:shadow-3xl",
        className
      )}
      style={{
        aspectRatio: "210/297",
        // Realistic page styling
        background: "linear-gradient(to bottom, #ffffff 0%, #fafafa 100%)",
        boxShadow: isActive 
          ? "0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(59, 130, 246, 0.5)"
          : "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
      }}
      onClick={onClick}
    >
      {/* Page content area with realistic margins */}
      <div className="absolute inset-0" style={{ padding: pageMargin }}>
        <div className="h-full w-full">
          {children}
        </div>
      </div>
      
      {/* Page number indicator */}
      {pageNumber && (
        <div className="absolute bottom-4 right-8 text-sm text-gray-400 font-medium">
          {pageNumber}
        </div>
      )}
      
      {/* Subtle page texture overlay */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-5"
        style={{
          backgroundImage: "radial-gradient(circle at 1px 1px, rgba(0,0,0,0.15) 1px, transparent 0)",
          backgroundSize: "20px 20px"
        }}
      />
    </div>
  );
}
