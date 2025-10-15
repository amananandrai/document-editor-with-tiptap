# 🤝 Contributing to DocuEdit Pro

Thank you for your interest in contributing to DocuEdit Pro! This document provides guidelines and information for contributors.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Contributing Guidelines](#contributing-guidelines)
- [Pull Request Process](#pull-request-process)
- [Issue Reporting](#issue-reporting)
- [Development Workflow](#development-workflow)
- [Code Style Guide](#code-style-guide)
- [Testing Guidelines](#testing-guidelines)

## 📜 Code of Conduct

This project adheres to a code of conduct that we expect all contributors to follow. Please be respectful, inclusive, and constructive in all interactions.

### Our Pledge
- Use welcoming and inclusive language
- Be respectful of differing viewpoints and experiences
- Accept constructive criticism gracefully
- Focus on what's best for the community
- Show empathy towards other community members

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- Git
- A code editor (VS Code recommended)
- Basic knowledge of React, TypeScript, and Next.js

### Fork and Clone
1. Fork the repository on GitHub
2. Clone your fork locally:
   ```bash
   git clone https://github.com/yourusername/document-editor-with-tip-mukutap.git
   cd document-editor-with-tip-mukutap
   ```
3. Add the upstream repository:
   ```bash
   git remote add upstream https://github.com/originalowner/document-editor-with-tip-mukutap.git
   ```

## 🛠️ Development Setup

### Installation
```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

### Environment Setup
Create a `.env.local` file for local development:
```env
# Add any environment variables needed for development
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### VS Code Setup (Recommended)
Install the following extensions for the best development experience:
- ES7+ React/Redux/React-Native snippets
- TypeScript Importer
- Tailwind CSS IntelliSense
- Prettier - Code formatter
- ESLint

## 📝 Contributing Guidelines

### Types of Contributions
We welcome various types of contributions:

- 🐛 **Bug Fixes**: Fix issues and improve stability
- ✨ **New Features**: Add new functionality
- 📚 **Documentation**: Improve docs and examples
- 🎨 **UI/UX Improvements**: Enhance the user interface
- ⚡ **Performance**: Optimize code and improve speed
- 🧪 **Tests**: Add or improve test coverage
- 🔧 **Tooling**: Improve development tools and workflows

### Before You Start
1. Check existing issues and pull requests
2. Discuss significant changes in an issue first
3. Ensure your changes align with the project goals
4. Follow the coding standards and style guide

## 🔄 Pull Request Process

### Creating a Pull Request
1. **Create a feature branch**:
   ```bash
   git checkout -b feature/your-feature-name
   # or
   git checkout -b fix/issue-description
   ```

2. **Make your changes** following the code style guide

3. **Test your changes**:
   ```bash
   npm run build
   npm run lint
   ```

4. **Commit your changes**:
   ```bash
   git add .
   git commit -m "feat: add new feature description"
   ```

5. **Push to your fork**:
   ```bash
   git push origin feature/your-feature-name
   ```

6. **Create a Pull Request** on GitHub with a clear description

### Pull Request Template
```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Tests pass locally
- [ ] New tests added for new functionality
- [ ] Manual testing completed

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] No console errors
```

## 🐛 Issue Reporting

### Before Creating an Issue
1. Search existing issues to avoid duplicates
2. Check if the issue is already being discussed
3. Ensure you're using the latest version

### Issue Template
```markdown
## Bug Description
Clear description of the bug

## Steps to Reproduce
1. Go to '...'
2. Click on '...'
3. See error

## Expected Behavior
What you expected to happen

## Actual Behavior
What actually happened

## Environment
- OS: [e.g., Windows 10, macOS 12.0, Ubuntu 20.04]
- Browser: [e.g., Chrome 91, Firefox 89, Safari 14]
- Node.js version: [e.g., 18.0.0]
- npm version: [e.g., 8.0.0]

## Additional Context
Any other relevant information
```

## 🔄 Development Workflow

### Branch Naming Convention
- `feature/description` - New features
- `fix/description` - Bug fixes
- `docs/description` - Documentation updates
- `refactor/description` - Code refactoring
- `test/description` - Test improvements

### Commit Message Convention
We use [Conventional Commits](https://www.conventionalcommits.org/):

```
type(scope): description

feat(editor): add new formatting option
fix(toolbar): resolve button alignment issue
docs(readme): update installation instructions
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes
- `refactor`: Code refactoring
- `test`: Test additions/changes
- `chore`: Build process or auxiliary tool changes

## 🎨 Code Style Guide

### TypeScript/React Guidelines
```typescript
// ✅ Good
interface EditorProps {
  content?: string;
  onChange?: (content: string) => void;
}

const Editor: React.FC<EditorProps> = ({ content, onChange }) => {
  // Component logic
};

// ❌ Avoid
const Editor = (props) => {
  // Component logic
};
```

### Component Structure
```typescript
// 1. Imports
import React from 'react';
import { Button } from '@/components/ui/button';

// 2. Types/Interfaces
interface ComponentProps {
  // props definition
}

// 3. Component
export const Component: React.FC<ComponentProps> = ({ prop1, prop2 }) => {
  // 4. Hooks
  const [state, setState] = useState();
  
  // 5. Event handlers
  const handleClick = () => {
    // handler logic
  };
  
  // 6. Render
  return (
    <div>
      {/* JSX */}
    </div>
  );
};
```

### CSS/Tailwind Guidelines
```typescript
// ✅ Good - Use semantic class names
className="flex items-center justify-between p-4 bg-white dark:bg-slate-800"

// ✅ Good - Use cn() utility for conditional classes
className={cn(
  "base-classes",
  condition && "conditional-classes",
  className
)}

// ❌ Avoid - Inline styles
style={{ color: 'red', fontSize: '16px' }}
```

### File Naming
- Components: `PascalCase.tsx` (e.g., `RichEditor.tsx`)
- Utilities: `camelCase.ts` (e.g., `formatText.ts`)
- Types: `camelCase.types.ts` (e.g., `editor.types.ts`)

## 🧪 Testing Guidelines

### Writing Tests
```typescript
// Component test example
import { render, screen, fireEvent } from '@testing-library/react';
import { RichEditor } from '@/components/editor/rich-editor';

describe('RichEditor', () => {
  it('renders editor content', () => {
    render(<RichEditor />);
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  it('handles text input', () => {
    render(<RichEditor />);
    const editor = screen.getByRole('textbox');
    fireEvent.input(editor, { target: { textContent: 'Hello World' } });
    expect(editor).toHaveTextContent('Hello World');
  });
});
```

### Test Coverage
- Aim for >80% test coverage
- Test user interactions and edge cases
- Mock external dependencies
- Test accessibility features

## 📚 Documentation

### Code Documentation
```typescript
/**
 * Custom TipTap extension for text indentation
 * @param options - Configuration options for the extension
 * @returns TipTap extension instance
 */
export const IndentExtension = Extension.create({
  name: 'indent',
  // Extension implementation
});
```

### README Updates
- Update README.md for new features
- Add usage examples
- Update installation instructions if needed
- Document breaking changes

## 🚀 Release Process

### Version Bumping
We use [Semantic Versioning](https://semver.org/):
- `MAJOR`: Breaking changes
- `MINOR`: New features (backward compatible)
- `PATCH`: Bug fixes (backward compatible)

### Release Checklist
- [ ] All tests pass
- [ ] Documentation updated
- [ ] Changelog updated
- [ ] Version bumped
- [ ] Release notes prepared

## 💡 Tips for Contributors

### Getting Help
- Check existing issues and discussions
- Ask questions in GitHub Discussions
- Join our community Discord (if available)

### Best Practices
- Keep pull requests focused and small
- Write clear commit messages
- Test your changes thoroughly
- Update documentation when needed
- Be patient with the review process

### Common Pitfalls to Avoid
- Don't commit `node_modules` or build files
- Don't ignore linting errors
- Don't break existing functionality
- Don't forget to update tests
- Don't skip the review process

## 🏆 Recognition

Contributors will be recognized in:
- README.md contributors section
- Release notes
- Project documentation

## 📞 Contact
 <!--  
- 📧 Email: contributors@docueditpro.com
- 💬 Discord: [Join our community](https://discord.gg/docueditpro)
-->
- 🐛 Issues: [GitHub Issues](https://github.com/amananandrai/document-editor-with-tiptap/issues)

---

Thank you for contributing to DocuEdit Pro! 🎉

<div align="center">
  <p>Made with ❤️ by the DocuEdit Pro community</p>
</div>
