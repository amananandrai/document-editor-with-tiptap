import React from 'react';
import { NodeViewWrapper, type NodeViewProps } from '@tiptap/react';

// Padding instead of margins so pagination can measure the block exactly.
export function PageBreakComponent({ selected }: NodeViewProps) {
  return (
    <NodeViewWrapper as="div" className="page-break-wrapper" data-page-break="">
      <div
        contentEditable={false}
        className={[
          'page-break-marker flex items-center gap-2 py-2 select-none text-gray-400',
          selected ? 'text-blue-500' : '',
        ].join(' ')}
      >
        <div className="h-px flex-1 border-t border-dashed border-current" />
        <span className="px-2 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-[11px] font-medium uppercase tracking-wide">
          Page break
        </span>
        <div className="h-px flex-1 border-t border-dashed border-current" />
      </div>
    </NodeViewWrapper>
  );
}
