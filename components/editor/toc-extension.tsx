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
          "toc-block-node my-4 relative rounded outline-none transition-colors",
          selected ? "bg-blue-50/30 dark:bg-blue-900/20 ring-1 ring-blue-500/40" : "",
        ].join(" ")}
      >
        {selected && (
          <div className="absolute -top-[34px] left-0 bg-white dark:bg-gray-800 shadow-sm border border-gray-200 dark:border-gray-700 px-3 py-1.5 rounded text-xs text-gray-600 dark:text-gray-300 flex items-center gap-2 select-none z-10 whitespace-nowrap">
            <span className="font-semibold text-gray-700 dark:text-gray-200">Table of contents</span>
          </div>
        )}
        
        <div className="py-2 px-3 min-h-[40px]">
          {items.length === 0 ? (
            <p className="text-[14px] text-gray-400 dark:text-gray-500 italic">
              Add headings (Format &gt; Paragraph styles) and they will appear in your table of contents.
            </p>
          ) : (
            <ul className="flex flex-col gap-1.5">
              {items.map((item) => {
                const indent = (item.level - 1) * 24;
                return (
                  <li key={item.id} style={{ marginLeft: `${indent}px` }}>
                    <button
                      type="button"
                      onClick={() => onHeadingClick(item.id)}
                      className="text-left text-[15px] font-normal text-[#1155cc] dark:text-[#8ab4f8] hover:underline underline-offset-2 w-full truncate cursor-pointer"
                    >
                      {item.textContent}
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
        style: "page-break-inside:avoid;",
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
