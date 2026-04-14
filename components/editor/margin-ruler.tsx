"use client";

import React from "react";

export function MarginRuler() {
  return (
    <div className="w-full flex justify-center bg-[#f8f9fa] border-b border-gray-200 z-30 sticky top-[border] print:hidden">
      <div className="relative w-[794px] h-6 bg-white overflow-hidden shadow-[inset_0_0_2px_rgba(0,0,0,0.1)]">
        {/* Usable Area Background (visualizing the 1-inch margins) */}
        <div className="absolute left-[96px] right-[96px] h-full bg-[#f1f3f4]" />

        {/* Tick marks (inches / half-inches simplified) */}
        <div className="absolute left-[96px] right-[96px] h-full flex justify-between items-end">
          {Array.from({ length: 40 }).map((_, i) => (
            <div
              key={i}
              className={`w-[1px] bg-gray-400 ${
                i % 5 === 0 ? "h-3" : "h-1.5"
              }`}
            />
          ))}
        </div>

        {/* Left Indent Marker */}
        <div 
          className="absolute left-[90px] top-0 cursor-ew-resize"
          title="Left Margin (1 inch)"
        >
          <div className="w-0 h-0 border-l-[5px] border-r-[5px] border-t-[8px] border-l-transparent border-r-transparent border-t-blue-500 hover:border-t-blue-600 transition-colors" />
          <div className="w-2.5 h-1.5 bg-blue-500 hover:bg-blue-600 mt-[1px] rounded-sm" />
        </div>

        {/* Right Indent Marker */}
        <div 
          className="absolute right-[90px] top-0 cursor-ew-resize"
          title="Right Margin (1 inch)"
        >
          <div className="w-0 h-0 border-l-[5px] border-r-[5px] border-t-[8px] border-l-transparent border-r-transparent border-t-blue-500 hover:border-t-blue-600 transition-colors" />
        </div>
      </div>
    </div>
  );
}
