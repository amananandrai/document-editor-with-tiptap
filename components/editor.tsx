// components/Editor.tsx
import React from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Toolbar from './Toolbar'
import '../styles/editor.css'

export default function Editor() {
  const editor = useEditor({
    extensions: [
      StarterKit,
    ],
    content: '<ul><li>Start typing...</li></ul>',
  })

  return (
    <div>
      <Toolbar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  )
}