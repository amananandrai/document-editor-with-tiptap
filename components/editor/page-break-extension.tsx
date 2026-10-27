import { canInsertNode, isNodeSelection, mergeAttributes, Node } from '@tiptap/core';
import { NodeSelection, TextSelection } from '@tiptap/pm/state';
import { ReactNodeViewRenderer } from '@tiptap/react';
import { PageBreakComponent } from './page-break-component';

export interface PageBreakOptions {
  HTMLAttributes: Record<string, unknown>;
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    pageBreak: {
      setPageBreak: () => ReturnType;
    };
  }
}

export const PageBreak = Node.create<PageBreakOptions>({
  name: 'pageBreak',

  addOptions() {
    return {
      HTMLAttributes: {},
    };
  },

  group: 'block',

  atom: true,

  selectable: true,

  parseHTML() {
    return [
      { tag: 'div[data-page-break]' },
    ];
  },

  // Leaf node: no content hole. The page-break styles make it work when the
  // HTML is printed or opened in Word.
  renderHTML({ HTMLAttributes }) {
    return [
      'div',
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, {
        'data-page-break': '',
        class: 'page-break',
        style: 'page-break-after: always; break-after: page;',
      }),
    ];
  },

  renderText() {
    return '\n\n';
  },

  addNodeView() {
    return ReactNodeViewRenderer(PageBreakComponent);
  },

  addCommands() {
    return {
      setPageBreak:
        () =>
        ({ chain, state }) => {
          if (!canInsertNode(state, state.schema.nodes[this.name])) {
            return false;
          }
          const { selection } = state;
          const currentChain = chain();
          if (isNodeSelection(selection)) {
            currentChain.insertContentAt(selection.$to.pos, { type: this.name });
          } else {
            currentChain.insertContent({ type: this.name });
          }
          // Put the cursor in the block after the break (creating a paragraph
          // if needed) so typing doesn't replace the selected break.
          return currentChain
            .command(({ tr, dispatch }) => {
              // Splitting a paragraph already leaves the cursor in the second
              // half; only a selected break (inserted at a block end) needs it.
              if (dispatch && tr.selection instanceof NodeSelection) {
                const after = tr.selection.to;
                if (!tr.doc.nodeAt(after)?.isTextblock) {
                  tr.insert(after, state.schema.nodes.paragraph.create());
                }
                tr.setSelection(TextSelection.create(tr.doc, after + 1));
              }
              if (dispatch) tr.scrollIntoView();
              return true;
            })
            .run();
        },
    };
  },
});
