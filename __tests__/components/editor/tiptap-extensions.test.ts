import { IndentExtension, LineHeightExtension, FontFamilyExtension } from '@/components/editor/tiptap-extensions'

describe('TipTap Extensions', () => {
  describe('IndentExtension', () => {
    it('should have correct name', () => {
      expect(IndentExtension.name).toBe('indent')
    })

    it('should configure indent attributes for correct node types', () => {
      const globalAttributes = IndentExtension.config.addGlobalAttributes?.()
      expect(globalAttributes).toBeDefined()
      expect(globalAttributes[0].types).toEqual(['paragraph', 'heading', 'blockquote'])
    })

    it('should parse indent from data-indent attribute', () => {
      const globalAttributes = IndentExtension.config.addGlobalAttributes?.()
      const parseHTML = globalAttributes[0].attributes.indent.parseHTML
      
      const mockElement = {
        getAttribute: jest.fn().mockReturnValue('2')
      }
      
      expect(parseHTML(mockElement)).toBe(2)
      expect(mockElement.getAttribute).toHaveBeenCalledWith('data-indent')
    })

    it('should render indent with correct margin', () => {
      const globalAttributes = IndentExtension.config.addGlobalAttributes?.()
      const renderHTML = globalAttributes[0].attributes.indent.renderHTML
      
      const result = renderHTML({ indent: 3 })
      expect(result).toEqual({
        'data-indent': '3',
        style: 'margin-left: 72px;'
      })
    })

    it('should return empty object for zero indent', () => {
      const globalAttributes = IndentExtension.config.addGlobalAttributes?.()
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
      const globalAttributes = LineHeightExtension.config.addGlobalAttributes?.()
      expect(globalAttributes[0].types).toEqual(['paragraph', 'heading', 'blockquote'])
    })

    it('should parse line height from style', () => {
      const globalAttributes = LineHeightExtension.config.addGlobalAttributes?.()
      const parseHTML = globalAttributes[0].attributes.lineHeight.parseHTML
      
      const mockElement = {
        style: { lineHeight: '1.5' }
      }
      
      expect(parseHTML(mockElement)).toBe('1.5')
    })

    it('should render line height style', () => {
      const globalAttributes = LineHeightExtension.config.addGlobalAttributes?.()
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
      const attributes = FontFamilyExtension.config.addAttributes?.()
      expect(attributes.fontFamily).toBeDefined()
      expect(attributes.fontFamily.default).toBeNull()
    })

    it('should parse font family from style', () => {
      const attributes = FontFamilyExtension.config.addAttributes?.()
      const parseHTML = attributes.fontFamily.parseHTML
      
      const mockElement = {
        style: { fontFamily: '"Arial", sans-serif' }
      }
      
      expect(parseHTML(mockElement)).toBe('Arial, sans-serif')
    })

    it('should render font family style', () => {
      const attributes = FontFamilyExtension.config.addAttributes?.()
      const renderHTML = attributes.fontFamily.renderHTML
      
      const result = renderHTML({ fontFamily: 'Georgia, serif' })
      expect(result).toEqual({
        style: 'font-family: Georgia, serif'
      })
    })
  })
})