import React, { ReactElement } from 'react'
import { render, RenderOptions } from '@testing-library/react'
import { ThemeProvider } from '@/components/theme-provider'

// Custom render function that includes providers
const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      {children}
    </ThemeProvider>
  )
}

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>,
) => render(ui, { wrapper: AllTheProviders, ...options })

export * from '@testing-library/react'
export { customRender as render }

// Mock TipTap editor for testing
export const createMockEditor = () => ({
  isActive: jest.fn().mockReturnValue(false),
  getAttributes: jest.fn().mockReturnValue({}),
  chain: jest.fn().mockReturnThis(),
  focus: jest.fn().mockReturnThis(),
  toggleBold: jest.fn().mockReturnThis(),
  toggleItalic: jest.fn().mockReturnThis(),
  toggleUnderline: jest.fn().mockReturnThis(),
  run: jest.fn(),
  getHTML: jest.fn().mockReturnValue('<p>Test content</p>'),
  getText: jest.fn().mockReturnValue('Test content'),
  isEmpty: false,
  state: {
    selection: {
      empty: true,
      from: 0,
      to: 0,
    },
    doc: {
      textBetween: jest.fn().mockReturnValue(''),
    },
  },
  view: {
    dom: document.createElement('div'),
  },
  commands: {
    setTextSelection: jest.fn(),
  },
})

// Helper to create mock file for testing file uploads
export const createMockFile = (name = 'test.jpg', type = 'image/jpeg', size = 1024) => {
  const file = new File([''], name, { type })
  Object.defineProperty(file, 'size', { value: size })
  return file
}