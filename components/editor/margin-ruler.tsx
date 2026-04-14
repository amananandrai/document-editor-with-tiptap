"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";

interface MarginRulerProps {
  leftMargin: number;
  rightMargin: number;
  onLeftMarginChange: (value: number) => void;
  onRightMarginChange: (value: number) => void;
}

export function MarginRuler({
  leftMargin,
  rightMargin,
  onLeftMarginChange,
  onRightMarginChange,
}: MarginRulerProps) {
  const [isDraggingLeft, setIsDraggingLeft] = useState(false);
  const [isDraggingRight, setIsDraggingRight] = useState(false);
  const rulerRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDraggingLeft && !isDraggingRight) return;
      if (!rulerRef.current) return;

      const rect = rulerRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const totalWidth = 794;

      if (isDraggingLeft) {
        // Limit left margin between 24 and 300
        const newLeft = Math.max(24, Math.min(x, 300));
        onLeftMarginChange(newLeft);
      } else if (isDraggingRight) {
        // Limit right margin between 24 and 300
        const marginFromRight = totalWidth - x;
        const newRight = Math.max(24, Math.min(marginFromRight, 300));
        onRightMarginChange(newRight);
      }
    },
    [isDraggingLeft, isDraggingRight, onLeftMarginChange, onRightMarginChange]
  );

  const handleMouseUp = useCallback(() => {
    setIsDraggingLeft(false);
    setIsDraggingRight(false);
  }, []);

  useEffect(() => {
    if (isDraggingLeft || isDraggingRight) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    } else {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    }
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDraggingLeft, isDraggingRight, handleMouseMove, handleMouseUp]);

  return (
    <div className="w-full flex justify-center bg-white border-b border-gray-200 z-40 sticky top-0 print:hidden select-none h-8 items-center">
      <div 
        ref={rulerRef}
        className="relative w-[794px] h-6 bg-white overflow-visible shadow-[inset_0_0_2px_rgba(0,0,0,0.1)] border-x border-gray-100"
      >
        {/* Usable Area Background */}
        <div 
          className="absolute h-full bg-[#f1f3f4]" 
          style={{ left: `${leftMargin}px`, right: `${rightMargin}px` }}
        />

        {/* Tick marks */}
        <div 
          className="absolute h-full flex justify-between items-end overflow-hidden pb-1"
          style={{ left: `${leftMargin}px`, right: `${rightMargin}px` }}
        >
          {Array.from({ length: 30 }).map((_, i) => (
            <div
              key={i}
              className={`w-[1px] bg-gray-300 ${
                i % 5 === 0 ? "h-3" : "h-1.5"
              }`}
            />
          ))}
        </div>

        {/* Left Indent Marker Handle */}
        <div 
          className="absolute top-0 cursor-ew-resize z-50 group"
          style={{ left: `${leftMargin - 5}px` }}
          onMouseDown={() => setIsDraggingLeft(true)}
        >
          <div className={`w-0 h-0 border-l-[5px] border-r-[5px] border-t-[8px] border-l-transparent border-r-transparent transition-colors ${isDraggingLeft ? 'border-t-blue-600' : 'border-t-blue-500 group-hover:border-t-blue-600'}`} />
          <div className={`w-2.5 h-1.5 mt-[1px] rounded-sm transition-colors ${isDraggingLeft ? 'bg-blue-600' : 'bg-blue-500 group-hover:bg-blue-600'}`} />
        </div>

        {/* Right Indent Marker Handle */}
        <div 
          className="absolute top-0 cursor-ew-resize z-50 group"
          style={{ right: `${rightMargin - 5}px` }}
          onMouseDown={() => setIsDraggingRight(true)}
        >
          <div className={`w-0 h-0 border-l-[5px] border-r-[5px] border-t-[8px] border-l-transparent border-r-transparent transition-colors ${isDraggingRight ? 'border-t-blue-600' : 'border-t-blue-500 group-hover:border-t-blue-600'}`} />
        </div>
      </div>
    </div>
  );
}
