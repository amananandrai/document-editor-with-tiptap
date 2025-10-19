// components/Editor.tsx
import React from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import BulletList from '@tiptap/extension-bullet-list'
import OrderedList from '@tiptap/extension-ordered-list'
import ListItem from '@tiptap/extension-list-item'
import { CustomList } from '../lib/extensions/CustomList'
import Toolbar from './Toolbar'
import '../styles/editor.css'

export default function Editor() {
  const editor = useEditor({
    extensions: [
      StarterKit,
      BulletList,
      OrderedList,
      ListItem,
      CustomList,
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