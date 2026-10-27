import { IndentExtension, LineHeightExtension, FontFamilyExtension } from '@/components/editor/tiptap-extensions'

// The extension config hooks are typed for Tiptap's internal `this` context;
// these accessors call them directly with loose, test-friendly types.
type AttributeSpec = {
  default?: unknown
  parseHTML: (element: unknown) => unknown
  renderHTML: (attributes: Record<string, unknown>) => unknown
}
type GlobalAttributes = { types: string[]; attributes: Record<string, AttributeSpec> }[]

const globalAttributesOf = (extension: { config: object }) =>
  (extension.config as { addGlobalAttributes: () => GlobalAttributes }).addGlobalAttributes()

const attributesOf = (extension: { config: object }) =>
  (extension.config as { addAttributes: () => Record<string, AttributeSpec> }).addAttributes()

describe('TipTap Extensions', () => {
  describe('IndentExtension', () => {
    it('should have correct name', () => {
      expect(IndentExtension.name).toBe('indent')
    })

    it('should configure indent attributes for correct node types', () => {
      const globalAttributes = globalAttributesOf(IndentExtension)
      expect(globalAttributes).toBeDefined()
      expect(globalAttributes[0].types).toEqual(['paragraph', 'heading', 'blockquote'])
    })

    it('should parse indent from data-indent attribute', () => {
      const globalAttributes = globalAttributesOf(IndentExtension)
      const parseHTML = globalAttributes[0].attributes.indent.parseHTML
      
      const mockElement = {
        getAttribute: jest.fn().mockReturnValue('2')
      }
      
      expect(parseHTML(mockElement)).toBe(2)
      expect(mockElement.getAttribute).toHaveBeenCalledWith('data-indent')
    })

    it('should render indent with correct margin', () => {
      const globalAttributes = globalAttributesOf(IndentExtension)
      const renderHTML = globalAttributes[0].attributes.indent.renderHTML
      
      const result = renderHTML({ indent: 3 })
      expect(result).toEqual({
        'data-indent': '3',
        style: 'margin-left: 72px;'
      })
    })

    it('should return empty object for zero indent', () => {
      const globalAttributes = globalAttributesOf(IndentExtension)
      const renderHTML = globalAttributes[0].attributes.indent.renderHTML
      
      const result = renderHTML({ indent: 0 })
      expect(result).toEqual({})
    })
  })

  describe('LineHeightExtension', () => {
    it('should have correct name', () => {
      expect(LineHeightExtension.name).toBe('lineHeight')
    })

    it('should configure line height for correct node types', () => {
      const globalAttributes = globalAttributesOf(LineHeightExtension)
      expect(globalAttributes[0].types).toEqual(['paragraph', 'heading', 'blockquote'])
    })

    it('should parse line height from style', () => {
      const globalAttributes = globalAttributesOf(LineHeightExtension)
      const parseHTML = globalAttributes[0].attributes.lineHeight.parseHTML
      
      const mockElement = {
        style: { lineHeight: '1.5' }
      }
      
      expect(parseHTML(mockElement)).toBe('1.5')
    })

    it('should render line height style', () => {
      const globalAttributes = globalAttributesOf(LineHeightExtension)
      const renderHTML = globalAttributes[0].attributes.lineHeight.renderHTML
      
      const result = renderHTML({ lineHeight: '2' })
      expect(result).toEqual({
        style: 'line-height: 2;'
      })
    })
  })

  describe('FontFamilyExtension', () => {
    it('should extend TextStyle', () => {
      expect(FontFamilyExtension.parent).toBeDefined()
    })

    it('should add fontFamily attribute', () => {
      const attributes = attributesOf(FontFamilyExtension)
      expect(attributes.fontFamily).toBeDefined()
      expect(attributes.fontFamily.default).toBeNull()
    })

    it('should parse font family from style', () => {
      const attributes = attributesOf(FontFamilyExtension)
      const parseHTML = attributes.fontFamily.parseHTML
      
      const mockElement = {
        style: { fontFamily: '"Arial", sans-serif' }
      }
      
      expect(parseHTML(mockElement)).toBe('Arial, sans-serif')
    })

    it('should render font family style', () => {
      const attributes = attributesOf(FontFamilyExtension)
      const renderHTML = attributes.fontFamily.renderHTML
      
      const result = renderHTML({ fontFamily: 'Georgia, serif' })
      expect(result).toEqual({
        style: 'font-family: Georgia, serif'
      })
    })
  })
})