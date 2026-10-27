"use client";

import React, { useRef, useState } from "react";
import { clampMarginPair, PAGE_WIDTH } from "./page-layout";

interface MarginRulerProps {
  leftMargin: number;
  rightMargin: number;
  /** Called continuously while dragging */
  onLeftMarginChange: (value: number) => void;
  onRightMarginChange: (value: number) => void;
  /** Called once when a drag or key press finishes, to persist the value */
  onCommit?: () => void;
}

type Side = "left" | "right";

// 1 inch = 96px; major ticks every inch, minor every 1/8 inch
const TICKS = Array.from({ length: Math.floor(PAGE_WIDTH / 12) + 1 }, (_, i) => i * 12);

export function MarginRuler({
  leftMargin,
  rightMargin,
  onLeftMarginChange,
  onRightMarginChange,
  onCommit,
}: MarginRulerProps) {
  const [dragging, setDragging] = useState<Side | null>(null);
  const rulerRef = useRef<HTMLDivElement>(null);

  const setMargin = (side: Side, value: number) => {
    if (side === "left") {
      onLeftMarginChange(clampMarginPair(value, rightMargin, PAGE_WIDTH));
    } else {
      onRightMarginChange(clampMarginPair(value, leftMargin, PAGE_WIDTH));
    }
  };

  const handlePointerDown = (side: Side) => (e: React.PointerEvent<HTMLDivElement>) => {
    e.preventDefault(); // avoid selecting text while dragging
    e.currentTarget.setPointerCapture(e.pointerId);
    setDragging(side);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragging || !rulerRef.current) return;
    const x = e.clientX - rulerRef.current.getBoundingClientRect().left;
    setMargin(dragging, dragging === "left" ? x : PAGE_WIDTH - x);
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragging) return;
    e.currentTarget.releasePointerCapture(e.pointerId);
    setDragging(null);
    onCommit?.();
  };

  const handleKeyDown = (side: Side) => (e: React.KeyboardEvent<HTMLDivElement>) => {
    const step = e.shiftKey ? 48 : 12;
    const current = side === "left" ? leftMargin : rightMargin;
    // Arrow keys move the marker in the direction pressed
    const grow = side === "left" ? "ArrowRight" : "ArrowLeft";
    const shrink = side === "left" ? "ArrowLeft" : "ArrowRight";
    if (e.key !== grow && e.key !== shrink) return;
    e.preventDefault();
    setMargin(side, current + (e.key === grow ? step : -step));
  };

  const handle = (side: Side) => {
    const value = side === "left" ? leftMargin : rightMargin;
    const active = dragging === side;
    return (
      <div
        role="slider"
        tabIndex={0}
        aria-label={`${side === "left" ? "Left" : "Right"} margin`}
        aria-valuenow={value}
        aria-valuetext={`${(value / 96).toFixed(2)} inches`}
        title={`${side === "left" ? "Left" : "Right"} margin: ${(value / 96).toFixed(2)}"`}
        className="absolute top-0 z-50 group cursor-ew-resize touch-none outline-none focus-visible:ring-2 focus-visible:ring-blue-400 rounded-sm px-[3px]"
        style={side === "left" ? { left: `${value - 8}px` } : { right: `${value - 8}px` }}
        onPointerDown={handlePointerDown(side)}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onKeyDown={handleKeyDown(side)}
        onKeyUp={() => onCommit?.()}
      >
        <div
          className={`w-0 h-0 border-l-[5px] border-r-[5px] border-t-[8px] border-l-transparent border-r-transparent transition-colors ${
            active ? "border-t-blue-600" : "border-t-blue-500 group-hover:border-t-blue-600"
          }`}
        />
      </div>
    );
  };

  return (
    <div className="w-full flex justify-center bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 z-40 sticky top-0 print:hidden select-none h-8 items-center">
      <div
        ref={rulerRef}
        className="relative h-6 bg-white overflow-visible shadow-[inset_0_0_2px_rgba(0,0,0,0.1)] border-x border-gray-100"
        style={{ width: PAGE_WIDTH }}
      >
        {/* Margin areas are shaded, the writable area is white */}
        <div className="absolute inset-y-0 left-0 bg-[#e8eaed]" style={{ width: leftMargin }} />
        <div className="absolute inset-y-0 right-0 bg-[#e8eaed]" style={{ width: rightMargin }} />

        {/* Tick marks measured from the left page edge */}
        {TICKS.map((x) => {
          const major = x % 96 === 0;
          const half = x % 48 === 0;
          return (
            <div
              key={x}
              className="absolute bottom-0 w-px bg-gray-400"
              style={{ left: x, height: major ? 10 : half ? 7 : 4 }}
            />
          );
        })}
        {TICKS.filter((x) => x % 96 === 0 && x > 0).map((x) => (
          <span
            key={`label-${x}`}
            className="absolute top-0 text-[9px] leading-none text-gray-500 -translate-x-1/2"
            style={{ left: x }}
          >
            {x / 96}
          </span>
        ))}

        {handle("left")}
        {handle("right")}
      </div>
    </div>
  );
}
