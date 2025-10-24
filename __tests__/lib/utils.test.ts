import { cn } from '@/lib/utils'

describe('Utils', () => {
  describe('cn function', () => {
    it('should merge class names correctly', () => {
      const result = cn('base-class', 'additional-class')
      expect(result).toContain('base-class')
      expect(result).toContain('additional-class')
    })

    it('should handle conditional classes', () => {
      const condition = true
      const result = cn('base-class', condition && 'conditional-class')
      expect(result).toContain('base-class')
      expect(result).toContain('conditional-class')
    })

    it('should ignore falsy values', () => {
      const result = cn('base-class', false && 'hidden-class', null, undefined, '')
      expect(result).toContain('base-class')
      expect(result).not.toContain('hidden-class')
    })

    it('should handle Tailwind class conflicts', () => {
      const result = cn('p-4', 'p-2')
      // Should resolve conflicts and keep the last one
      expect(result).toContain('p-2')
      expect(result).not.toContain('p-4')
    })

    it('should work with arrays', () => {
      const result = cn(['class1', 'class2'], 'class3')
      expect(result).toContain('class1')
      expect(result).toContain('class2')
      expect(result).toContain('class3')
    })

    it('should handle empty input', () => {
      const result = cn()
      expect(result).toBe('')
    })
  })
})