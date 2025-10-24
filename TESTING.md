# 🧪 Testing Guide

This document provides comprehensive guidelines for testing in the DocuEdit Pro project.

## 📋 Table of Contents

- [Testing Framework](#testing-framework)
- [Running Tests](#running-tests)
- [Writing Tests](#writing-tests)
- [Test Structure](#test-structure)
- [Testing Patterns](#testing-patterns)
- [Mocking Guidelines](#mocking-guidelines)
- [Coverage Requirements](#coverage-requirements)

## 🛠️ Testing Framework

We use the following testing stack:

- **Jest** - Testing framework
- **React Testing Library** - Component testing utilities
- **Jest DOM** - Custom Jest matchers for DOM elements
- **User Event** - Simulating user interactions

## 🚀 Running Tests

### Available Commands

```bash
# Run all tests once
npm run test

# Run tests in watch mode (recommended for development)
npm run test:watch

# Run tests with coverage report
npm run test:coverage

# Run tests in CI mode (no watch, with coverage)
npm run test:ci
```

### Test Files Location

Tests are located in the `__tests__` directory with the following structure:

```
__tests__/
├── components/
│   ├── ui/
│   │   └── button.test.tsx
│   └── editor/
│       └── tiptap-extensions.test.ts
├── lib/
│   └── utils.test.ts
└── setup/
    └── test-utils.tsx
```

## ✍️ Writing Tests

### Component Testing

```typescript
import { render, screen, fireEvent } from '@testing-library/react'
import { Button } from '@/components/ui/button'

describe('Button Component', () => {
  it('renders button with text', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByRole('button', { name: /click me/i })).toBeInTheDocument()
  })

  it('handles click events', () => {
    const handleClick = jest.fn()
    render(<Button onClick={handleClick}>Click me</Button>)
    
    fireEvent.click(screen.getByRole('button'))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })
})
```

### Editor Component Testing

For TipTap editor components, use the provided mock editor:

```typescript
import { createMockEditor } from '@/__tests__/setup/test-utils'

describe('Editor Component', () => {
  it('should handle editor interactions', () => {
    const mockEditor = createMockEditor()
    // Test your component with the mock editor
  })
})
```

### Utility Function Testing

```typescript
import { cn } from '@/lib/utils'

describe('Utils', () => {
  describe('cn function', () => {
    it('should merge class names correctly', () => {
      const result = cn('base-class', 'additional-class')
      expect(result).toContain('base-class')
      expect(result).toContain('additional-class')
    })
  })
})
```

## 🏗️ Test Structure

### File Naming Convention

- Component tests: `ComponentName.test.tsx`
- Utility tests: `utilityName.test.ts`
- Hook tests: `useHookName.test.ts`

### Test Organization

```typescript
describe('ComponentName', () => {
  // Setup and teardown
  beforeEach(() => {
    // Common setup
  })

  afterEach(() => {
    // Cleanup
  })

  describe('rendering', () => {
    it('should render correctly', () => {
      // Rendering tests
    })
  })

  describe('interactions', () => {
    it('should handle user interactions', () => {
      // Interaction tests
    })
  })

  describe('edge cases', () => {
    it('should handle edge cases', () => {
      // Edge case tests
    })
  })
})
```

## 🎯 Testing Patterns

### 1. Arrange, Act, Assert (AAA)

```typescript
it('should update state when button is clicked', () => {
  // Arrange
  const handleClick = jest.fn()
  render(<Button onClick={handleClick}>Click me</Button>)

  // Act
  fireEvent.click(screen.getByRole('button'))

  // Assert
  expect(handleClick).toHaveBeenCalledTimes(1)
})
```

### 2. Testing User Interactions

```typescript
import userEvent from '@testing-library/user-event'

it('should handle user typing', async () => {
  const user = userEvent.setup()
  render(<input data-testid="text-input" />)
  
  await user.type(screen.getByTestId('text-input'), 'Hello World')
  
  expect(screen.getByTestId('text-input')).toHaveValue('Hello World')
})
```

### 3. Testing Async Operations

```typescript
it('should handle async operations', async () => {
  render(<AsyncComponent />)
  
  // Wait for element to appear
  await waitFor(() => {
    expect(screen.getByText('Loaded')).toBeInTheDocument()
  })
})
```

### 4. Testing Error States

```typescript
it('should display error message on failure', async () => {
  // Mock API to return error
  jest.spyOn(api, 'fetchData').mockRejectedValue(new Error('API Error'))
  
  render(<DataComponent />)
  
  await waitFor(() => {
    expect(screen.getByText('Error loading data')).toBeInTheDocument()
  })
})
```

## 🎭 Mocking Guidelines

### Mocking External Dependencies

```typescript
// Mock Next.js router
jest.mock('next/router', () => ({
  useRouter: () => ({
    push: jest.fn(),
    pathname: '/',
    query: {},
  }),
}))

// Mock API calls
jest.mock('@/lib/api', () => ({
  fetchData: jest.fn(),
}))
```

### Mocking TipTap Editor

Use the provided mock editor from test utilities:

```typescript
import { createMockEditor } from '@/__tests__/setup/test-utils'

const mockEditor = createMockEditor()
// Customize mock behavior as needed
mockEditor.isActive.mockReturnValue(true)
```

### Mocking File Uploads

```typescript
import { createMockFile } from '@/__tests__/setup/test-utils'

it('should handle file upload', () => {
  const file = createMockFile('test.jpg', 'image/jpeg', 1024)
  // Test file upload functionality
})
```

## 📊 Coverage Requirements

### Minimum Coverage Thresholds

- **Branches**: 70%
- **Functions**: 70%
- **Lines**: 70%
- **Statements**: 70%

### Coverage Reports

Generate coverage reports with:

```bash
npm run test:coverage
```

View the HTML coverage report at `coverage/lcov-report/index.html`

### What to Test

#### ✅ Do Test

- Component rendering
- User interactions
- State changes
- Error handling
- Edge cases
- Accessibility features
- Business logic
- Utility functions

#### ❌ Don't Test

- Third-party library internals
- Implementation details
- Trivial getters/setters
- Static content

## 🔧 Configuration

### Jest Configuration

The Jest configuration is in `jest.config.js`:

```javascript
const nextJest = require('next/jest')

const createJestConfig = nextJest({
  dir: './',
})

const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jsdom',
  // ... other config
}

module.exports = createJestConfig(customJestConfig)
```

### Test Setup

Global test setup is in `jest.setup.js`:

- DOM matchers from `@testing-library/jest-dom`
- Mocks for Next.js APIs
- Browser API mocks (ResizeObserver, IntersectionObserver)

## 🚀 Continuous Integration

Tests run automatically on:

- Push to `main` or `develop` branches
- Pull requests to `main` or `develop` branches

The CI pipeline:

1. Installs dependencies
2. Runs linting
3. Runs tests with coverage
4. Uploads coverage reports

## 💡 Best Practices

### 1. Write Descriptive Test Names

```typescript
// ✅ Good
it('should display error message when API call fails')

// ❌ Bad
it('should work')
```

### 2. Test Behavior, Not Implementation

```typescript
// ✅ Good - Testing behavior
expect(screen.getByText('Welcome')).toBeInTheDocument()

// ❌ Bad - Testing implementation
expect(component.state.showWelcome).toBe(true)
```

### 3. Use Semantic Queries

```typescript
// ✅ Good - Semantic queries
screen.getByRole('button', { name: /submit/i })
screen.getByLabelText('Email address')

// ❌ Bad - Implementation details
screen.getByClassName('submit-btn')
screen.getByTestId('email-input')
```

### 4. Keep Tests Independent

Each test should be able to run independently without relying on other tests.

### 5. Use Factory Functions for Complex Setup

```typescript
const createUser = (overrides = {}) => ({
  id: 1,
  name: 'John Doe',
  email: 'john@example.com',
  ...overrides,
})
```

## 🐛 Debugging Tests

### Running Specific Tests

```bash
# Run tests matching a pattern
npm test -- --testNamePattern="Button"

# Run tests in a specific file
npm test -- button.test.tsx

# Run tests in watch mode with coverage
npm run test:watch -- --coverage
```

### Debugging Tips

1. Use `screen.debug()` to see the current DOM state
2. Use `console.log()` in tests for debugging
3. Use `--verbose` flag for detailed test output
4. Check the coverage report to identify untested code paths

## 📚 Resources

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)
- [Jest DOM Matchers](https://github.com/testing-library/jest-dom)

---

Happy Testing! 🎉