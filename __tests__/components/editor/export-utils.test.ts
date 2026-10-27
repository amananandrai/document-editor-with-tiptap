import {
  buildHeaderFooterHtml,
  equationsToMathML,
  formatListMarker,
  listsAndMathToMarkdown,
  wordHeaderFooterParts,
} from '@/components/editor/export-utils'

describe('listsAndMathToMarkdown', () => {
  it('converts nested lists with indentation and real numbers', () => {
    const md = listsAndMathToMarkdown(
      '<ol><li><p>one</p><ul><li><p>bullet</p><ol start="3"><li><p>deep</p></li></ol></li></ul></li><li><p>two</p></li></ol>'
    )
    expect(md).toContain('1. one\n   - bullet\n     3. deep\n2. two')
  })

  it('keeps inline formatting inside list items for later conversion', () => {
    expect(listsAndMathToMarkdown('<ul><li><p><strong>bold</strong> item</p></li></ul>')).toContain(
      '- <strong>bold</strong> item'
    )
  })

  it('converts inline and display equations, including inside lists', () => {
    const md = listsAndMathToMarkdown(
      '<p>Mass <span data-type="inline-math" data-latex="E = mc^2"></span></p>' +
        '<div data-type="block-math" data-latex="a &lt; b"></div>' +
        '<ul><li><p>item <span data-type="inline-math" data-latex="\\alpha"></span></p></li></ul>'
    )
    expect(md).toContain('Mass $E = mc^2$')
    expect(md).toContain('$$\na &lt; b\n$$')
    expect(md).toContain('- item $\\alpha$')
    expect(md).not.toMatch(/@@MD\d+@@/)
  })
})

describe('equationsToMathML', () => {
  it('replaces equations with MathML', () => {
    const root = document.createElement('div')
    root.innerHTML =
      '<p>x <span data-type="inline-math" data-latex="x^2"></span></p><div data-type="block-math" data-latex="\\frac{1}{2}"></div>'
    equationsToMathML(root)
    expect(root.querySelectorAll('math')).toHaveLength(2)
    expect(root.querySelector('[data-type]')).toBeNull()
    expect(root.querySelector('math[display="block"]')).not.toBeNull()
  })
})

describe('formatListMarker', () => {
  it.each([
    ['disc', 1, '•'],
    ['decimal', 12, '12.'],
    ['decimal-leading-zero', 7, '07.'],
    ['lower-alpha', 28, 'ab.'],
    ['upper-alpha', 3, 'C.'],
    ['lower-roman', 14, 'xiv.'],
    ['upper-roman', 1994, 'MCMXCIV.'],
    ['"➢  "', 1, '➢'],
  ])('%s #%i -> %s', (style, n, expected) => {
    expect(formatListMarker(style as string, n as number)).toBe(expected)
  })

  it('returns null for none', () => {
    expect(formatListMarker('none', 1)).toBeNull()
  })
})

describe('Word header/footer', () => {
  it('adds a PAGE field for page numbers', () => {
    expect(buildHeaderFooterHtml('<p>Title</p>', 'right')).toMatch(
      /<p>Title<\/p><p class="MsoHeader" style="text-align:right">.*PAGE/
    )
    expect(buildHeaderFooterHtml('', null)).toBe('')
  })

  it('references only the sections that exist', () => {
    expect(wordHeaderFooterParts({ header: '', footer: '' })).toEqual({ pageRules: '', sections: '' })
    const parts = wordHeaderFooterParts({ header: '', footer: '<p>f</p>' })
    expect(parts.pageRules).toContain('mso-footer: f1;')
    expect(parts.pageRules).not.toContain('mso-header:')
    expect(parts.sections).toContain('id="f1"')
    expect(parts.sections).not.toContain('id="h1"')
  })
})
