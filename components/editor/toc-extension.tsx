"use client";

import React, { useEffect, useState } from "react";
import { Node, mergeAttributes } from "@tiptap/core";
import { NodeViewWrapper, ReactNodeViewRenderer } from "@tiptap/react";
import type { TableOfContentDataItem } from "@tiptap/extension-table-of-contents";

// ─── Module-level reactive store ─────────────────────────────────────────────
// TipTap NodeViews are rendered in a separate React root, which breaks context
// inheritance. A simple pub/sub store avoids that limitation entirely.
type TocListener = () => void;
let _tocItems: TableOfContentDataItem[] = [];
let _tocListeners: TocListener[] = [];
let _onHeadingClick: (id: string) => void = () => {};

export const tocStore = {
  getItems: () => _tocItems,
  setItems: (items: TableOfContentDataItem[]) => {
    _tocItems = items;
    _tocListeners.forEach((fn) => fn());
  },
  setOnHeadingClick: (fn: (id: string) => void) => {
    _onHeadingClick = fn;
  },
  click: (id: string) => _onHeadingClick(id),
  subscribe: (fn: TocListener) => {
    _tocListeners.push(fn);
    return () => {
      _tocListeners = _tocListeners.filter((l) => l !== fn);
    };
  },
};

// Hook for NodeView components to subscribe to store updates
function useTocStore() {
  const [items, setItems] = useState<TableOfContentDataItem[]>(() =>
    tocStore.getItems()
  );
  useEffect(
    () =>
      tocStore.subscribe(() => {
        setItems([...tocStore.getItems()]);
      }),
    []
  );
  return { items, onHeadingClick: tocStore.click };
}

// ─── NodeView React Component ─────────────────────────────────────────────────
function TocNodeViewComponent({ selected }: { selected?: boolean }) {
  const { items, onHeadingClick } = useTocStore();

  return (
    <NodeViewWrapper as="div">
      <div
        contentEditable={false}
        data-type="toc-block"
        className={[
          "toc-block-node my-6 rounded-xl overflow-hidden border shadow-md transition-all duration-150",
          selected
            ? "ring-2 ring-blue-400 border-blue-300 dark:border-blue-600"
            : "border-slate-200 dark:border-slate-700",
        ].join(" ")}
      >
        {/* ── Header bar ── */}
        <div className="flex items-center justify-between px-5 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-800 dark:to-indigo-800">
          <div className="flex items-center gap-2">
            <svg
              className="w-4 h-4 text-white/90 shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 6h16M4 10h12M4 14h8M4 18h6"
              />
            </svg>
            <span className="text-white font-semibold text-sm tracking-wider uppercase select-none">
              Table of Contents
            </span>
          </div>
          <span className="text-white/50 text-[10px] select-none">
            {items.length} heading{items.length !== 1 ? "s" : ""}
          </span>
        </div>

        {/* ── Body ── */}
        <div className="bg-white dark:bg-slate-900 px-5 py-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center py-6 gap-2">
              <svg
                className="w-8 h-8 text-gray-300 dark:text-gray-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 6h16M4 10h12M4 14h8M4 18h6"
                />
              </svg>
              <p className="text-xs text-gray-400 dark:text-gray-500 italic text-center">
                No headings found. Add H1–H4 headings to populate this table of
                contents.
              </p>
            </div>
          ) : (
            <ul className="space-y-0.5">
              {items.map((item) => {
                const indent = (item.level - 1) * 20;
                const isH1 = item.level === 1;
                const isH2 = item.level === 2;

                return (
                  <li key={item.id}>
                    <button
                      type="button"
                      onClick={() => onHeadingClick(item.id)}
                      style={{ paddingLeft: `${indent + 8}px` }}
                      className="group w-full text-left py-1.5 pr-2 rounded-lg transition-all duration-150 hover:bg-blue-50 dark:hover:bg-blue-900/30 flex items-center gap-2"
                    >
                      {/* Level bullet */}
                      <span
                        className={[
                          "shrink-0 w-3.5 text-center select-none leading-none",
                          isH1
                            ? "text-blue-600 dark:text-blue-400 text-[9px]"
                            : isH2
                            ? "text-indigo-400 dark:text-indigo-400 text-[9px]"
                            : "text-gray-400 text-[11px]",
                        ].join(" ")}
                      >
                        {isH1 ? "●" : isH2 ? "◆" : "–"}
                      </span>

                      {/* Heading text */}
                      <span
                        className={[
                          "flex-1 group-hover:text-blue-700 dark:group-hover:text-blue-300 transition-colors leading-snug",
                          isH1
                            ? "font-semibold text-gray-900 dark:text-gray-100 text-sm"
                            : isH2
                            ? "font-medium text-gray-800 dark:text-gray-200 text-[13px]"
                            : "text-gray-600 dark:text-gray-300 text-xs",
                        ].join(" ")}
                      >
                        {item.textContent}
                      </span>

                      {/* Hover arrow */}
                      <span className="ml-auto text-blue-400 dark:text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity text-xs shrink-0">
                        ↗
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </NodeViewWrapper>
  );
}

// ─── TipTap Node Extension ────────────────────────────────────────────────────
export const TableOfContentsNode = Node.create({
  name: "tableOfContentsNode",
  group: "block",
  atom: true,
  selectable: true,
  draggable: true,

  parseHTML() {
    return [{ tag: "div[data-type='toc-block']" }];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "div",
      mergeAttributes(HTMLAttributes, {
        "data-type": "toc-block",
        class: "toc-placeholder",
        style:
          "border:1px solid #c7d5e8; padding:12px; border-radius:8px; page-break-inside:avoid; background:#f0f4ff;",
      }),
      "[ Table of Contents ]",
    ];
  },

  addNodeView() {
    return ReactNodeViewRenderer(TocNodeViewComponent);
  },

  // @ts-ignore – addCommands generic typing differs across TipTap versions
  addCommands() {
    return {
      insertTableOfContents:
        () =>
        ({ commands }: any) =>
          commands.insertContent({ type: this.name }),
    };
  },
});
