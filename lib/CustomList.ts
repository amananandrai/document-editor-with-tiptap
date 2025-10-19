// lib/extensions/CustomList.ts
import { Extension } from '@tiptap/core'

export const CustomList = Extension.create({
  name: 'customList',

  addKeyboardShortcuts() {
    return {
      Tab: () => this.editor.commands.sinkListItem('listItem'),
      'Shift-Tab': () => this.editor.commands.liftListItem('listItem'),
    }
  },

  addAttributes() {
    return {
      level: {
        default: 0,
        parseHTML: el => parseInt(el.getAttribute('data-level') || '0'),
        renderHTML: attrs => ({ 'data-level': attrs.level }),
      },
      listType: {
        default: 'bullet',
        parseHTML: el => el.tagName === 'OL' ? 'number' : 'bullet',
        renderHTML: attrs => ({ 'data-type': attrs.listType }),
      },
      style: {
        default: 'disc',
        parseHTML: el => el.getAttribute('data-style') || 'disc',
        renderHTML: attrs => ({ 'data-style': attrs.style }),
      },
    }
  },
})