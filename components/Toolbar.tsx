// components/Toolbar.tsx
import React from 'react'
import { Editor } from '@tiptap/react'

export default function Toolbar({ editor }: { editor: Editor | null }) {
  if (!editor) return null

  return (
    <div className="toolbar">
      <button onClick={() => editor.chain().focus().toggleBulletList().run()}>
        • Bullet
      </button>
      <button onClick={() => editor.chain().focus().toggleOrderedList().run()}>
        1. Number
      </button>
      <select onChange={(e) =>
        editor.chain().focus().updateAttributes('listItem', {
          style: e.target.value,
        }).run()
      }>
        <option value="disc">Disc</option>
        <option value="circle">Circle</option>
        <option value="square">Square</option>
        <option value="decimal">Decimal</option>
        <option value="lower-roman">Lower Roman</option>
      </select>
    </div>
  )
}