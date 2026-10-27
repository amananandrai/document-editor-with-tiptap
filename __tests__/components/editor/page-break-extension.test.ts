import { Editor } from '@tiptap/core'
import StarterKit from '@tiptap/starter-kit'
import { PageBreak } from '@/components/editor/page-break-extension'

// The React node view needs <EditorContent>; test the schema and commands only.
const PlainPageBreak = PageBreak.extend({ addNodeView: undefined })

const createEditor = (content: string) =>
  new Editor({ extensions: [StarterKit, PlainPageBreak], content })

describe('PageBreak', () => {
  it('serializes to HTML without throwing', () => {
    const editor = createEditor('<p>a</p>')
    editor.commands.setPageBreak()
    expect(() => editor.getHTML()).not.toThrow()
    expect(editor.getHTML()).toContain('data-page-break')
    editor.destroy()
  })

  it('round-trips through HTML', () => {
    const editor = createEditor('<p>a</p><div data-page-break=""></div><p>b</p>')
    const types: string[] = []
    editor.state.doc.forEach((node) => types.push(node.type.name))
    expect(types).toEqual(['paragraph', 'pageBreak', 'paragraph'])
    editor.destroy()
  })

  it('moves the cursor after the break so typing does not replace it', () => {
    const editor = createEditor('<p>before</p>')
    editor.commands.focus('end')
    editor.commands.setPageBreak()
    editor.commands.insertContent('after')
    const types: string[] = []
    editor.state.doc.forEach((node) => types.push(node.type.name))
    expect(types).toEqual(['paragraph', 'pageBreak', 'paragraph'])
    expect(editor.state.doc.lastChild?.textContent).toBe('after')
    editor.destroy()
  })
})
