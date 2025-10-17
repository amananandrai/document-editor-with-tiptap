import React from 'react';
import { NodeViewWrapper } from '@tiptap/react';
import { Minus } from 'lucide-react';

export function PageBreakComponent() {
  return (
    <NodeViewWrapper as="div" className="page-break-wrapper">
      <div className="flex items-center justify-center py-4 my-4">
        <div className="flex items-center gap-2 text-gray-400">
          <div className="h-px bg-gray-300 flex-1 min-w-[100px]" />
          <div className="flex items-center gap-1 px-2 py-1 bg-gray-100 rounded text-xs font-medium">
            <Minus className="h-3 w-3" />
            <span>Page Break</span>
          </div>
          <div className="h-px bg-gray-300 flex-1 min-w-[100px]" />
        </div>
      </div>
    </NodeViewWrapper>
  );
}
