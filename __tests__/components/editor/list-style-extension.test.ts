import { Editor } from '@tiptap/core'
import StarterKit from '@tiptap/starter-kit'
import { getActiveListStyle, ListStyleExtension } from '@/components/editor/list-style-extension'

const createEditor = (content: string) =>
  new Editor({ extensions: [StarterKit, ListStyleExtension], content })

// Put the cursor inside the first text node containing `text`
const placeCursor = (editor: Editor, text: string) => {
  let target = -1
  editor.state.doc.descendants((node, pos) => {
    if (target < 0 && node.isText && node.text?.includes(text)) target = pos + 1
  })
  editor.commands.setTextSelection(target)
}

const NESTED = '<ol><li><p>one</p><ol><li><p>inner</p></li></ol></li><li><p>two</p></li></ol>'

describe('ListStyleExtension', () => {
  it('wraps a paragraph in a list with the chosen bullet style', () => {
    const editor = createEditor('<p>item</p>')
    placeCursor(editor, 'item')
    editor.commands.setListStyle('bulletList', 'square')
    expect(editor.getHTML()).toMatch(
      /^<ul data-list-style="square" style="list-style-type: square;?"><li><p>item<\/p><\/li><\/ul>/
    )
    editor.destroy()
  })

  it('sets the numbering style only on the innermost list', () => {
    const editor = createEditor(NESTED)
    placeCursor(editor, 'inner')
    editor.commands.setListStyle('orderedList', 'upper-roman')
    const html = editor.getHTML()
    expect(html.match(/data-list-style="upper-roman"/g)).toHaveLength(1)
    expect(html).toMatch(/<ol><li><p>one<\/p><ol data-list-style="upper-roman"/)
    editor.destroy()
  })

  it('converts a bullet list to numbered when a numbering style is chosen', () => {
    const editor = createEditor('<ul><li><p>a</p></li></ul>')
    placeCursor(editor, 'a')
    editor.commands.setListStyle('orderedList', 'lower-alpha')
    expect(editor.getHTML()).toContain('<ol data-list-style="lower-alpha"')
    editor.destroy()
  })

  it('applies a multilevel preset to the outermost list and clears per-level styles', () => {
    const editor = createEditor(
      '<ol><li><p>one</p><ol data-list-style="upper-alpha"><li><p>inner</p></li></ol></li></ol>'
    )
    placeCursor(editor, 'inner')
    editor.commands.setMultilevelList('legal')
    const html = editor.getHTML()
    expect(html.startsWith('<ol data-multilevel="legal">')).toBe(true)
    expect(html).not.toContain('upper-alpha')
    expect(getActiveListStyle(editor.state.selection.$from).multilevel).toBe('legal')
    editor.destroy()
  })

  it('changes the list type when a bullet preset is applied to a numbered list', () => {
    const editor = createEditor(NESTED)
    placeCursor(editor, 'one')
    editor.commands.setMultilevelList('bullets')
    expect(editor.getHTML().startsWith('<ul data-multilevel="bullets">')).toBe(true)
    editor.destroy()
  })

  it('round-trips custom string bullets through HTML', () => {
    const editor = createEditor('<ul data-list-style="&quot;➢  &quot;"><li><p>x</p></li></ul>')
    placeCursor(editor, 'x')
    expect(getActiveListStyle(editor.state.selection.$from)).toEqual({
      listType: 'bulletList',
      listStyleType: '"➢  "',
      multilevel: null,
    })
    editor.destroy()
  })
})
