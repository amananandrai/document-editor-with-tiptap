# 📝 DocuEdit Pro

A powerful, feature-rich document editor built with modern web technologies. Create, edit, and format documents with professional-grade tools, featuring a beautiful interface and seamless export capabilities.

![DocuEdit Pro](https://img.shields.io/badge/Next.js-15.2.4-black?style=for-the-badge&logo=next.js)
![React](https://img.shields.io/badge/React-18.3.1-blue?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)
![TipTap](https://img.shields.io/badge/TipTap-Latest-green?style=for-the-badge)

---
## Table of Content 

- [✨ Features](#-features)
    - [🎨 Rich Text Editing](#-rich-text-editing)
    - [🎯 Advanced Features](#-advanced-features)
    - [🛠️ Technical Features](#️-technical-features)
  - [🚀 Quick Start](#-quick-start)
    - [Prerequisites](#prerequisites)
    - [Installation](#installation)
  - [📁 Project Folder Structure](#-project-folder-structure)
  - [🎨 Customization](#-customization)
    - [Theme Customization](#theme-customization)
    - [Adding New Extensions](#adding-new-extensions)
    - [Styling Components](#styling-components)
  - [🚀 Deployment](#-deployment)
    - [Vercel (Recommended)](#vercel-recommended)
    - [Other Platforms](#other-platforms)
  - [📦 Available Scripts](#-available-scripts)
  - [🧪 Testing](#-testing)
  - [📚 API Reference](#-api-reference)
    - [Editor Component](#editor-component)
    - [Custom Extensions](#custom-extensions)
  - [🤝 Contributing](#-contributing)
  - [📄 License](#-license)
  - [🙏 Acknowledgments](#-acknowledgments)
  - [📞 Support](#-support)

---

## ✨ Features

### 🎨 Rich Text Editing

- **Headings & Paragraphs**: Support for H1-H4 headings with proper hierarchy
- **Text Formatting**: Bold, italic, underline, superscript, and subscript
- **Font Customization**: Multiple font families (System, Serif, Monospace) and sizes (12px-48px)
- **Line Spacing**: Adjustable line height options (1, 1.15, 1.5, 2)
- **Lists**: Bullet and ordered lists with proper nesting and indentation
- **Colors**: Text color and background highlighting with color picker
- **Indentation**: Custom indent system for paragraphs and headings

### 🎯 Advanced Features

- **Keyboard Shortcuts**: Ctrl/Cmd + B/I/U for quick formatting
- **Export Capabilities**:
  - PDF export using html2pdf.js
  - Word document export (.doc format)
- **Theme Support**: Beautiful dark/light mode with system preference detection
- **Responsive Design**: Mobile-friendly interface
- **Accessibility**: ARIA labels and keyboard navigation support

### 🛠️ Technical Features

- **Modern Stack**: Next.js 15, React 18, TypeScript
- **Rich Editor**: TipTap with custom extensions
- **UI Components**: Radix UI primitives with shadcn/ui
- **Styling**: Tailwind CSS with OKLCH color system
- **Performance**: Optimized with dynamic imports and proper SSR handling

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- bun

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/yourusername/document-editor-with-tip-mukutap.git
   cd document-editor-with-tip-mukutap
   ```

2. **Install dependencies**

   ```bash
   bun install
   ```

3. **Run the development server**

   ```bash
   bun run dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

---


## 📁 Project Folder Structure

> **Note:** This is just the main folder structure. Some subfolders and files may be omitted for brevity.

```
├── app/
│   ├── editor/
│   │   ├── editor-client.tsx               # Client-side editor wrapper
│   │   ├── features.js                     # Editor features and Lucide icons
│   │   └── page.tsx                        # /editor route (editor page)
│   ├── layout.tsx                          # Root layout with navbar/footer
│   ├── globals.css                         # Global styles with design tokens
│   └── page.tsx                            # Home/landing page
├── components/
│   ├── editor/                             # Editor-related components and extensions
│   ├── ui/                                 # Reusable UI components (buttons, dialogs, etc.)
│   ├── navbar.tsx                          # Custom navigation bar
│   ├── footer.tsx                          # Footer component
│   ├── theme-provider.tsx                  # Theme context provider
│   ├── theme-toggle.tsx                    # Dark/light mode toggle
├── docs/
│   └── blockquote-code-link-guide.md       # Blockquote/code/link feature plan
├── lib/
│   └── utils.ts                            # Utility functions
├── public/                                 # Static assets (images, icons, etc.)
├── styles/
│   └── globals.css                         # Global CSS styles
```

---

## 🎨 Customization

### Theme Customization

The project uses a custom design system with OKLCH color space for better color consistency. You can customize colors in `app/globals.css`:

```css
:root {
  --background: oklch(1 0 0);
  --foreground: oklch(0.145 0 0);
  /* ... more color tokens */
}
```

### Adding New Extensions

Create custom TipTap extensions in `components/editor/tiptap-extensions.ts`:

```typescript
import { Extension } from "@tiptap/core";

export const CustomExtension = Extension.create({
  name: "customExtension",
  // Your extension logic here
});
```

### Styling Components

The project uses Tailwind CSS with custom design tokens. Components are styled using the `cn()` utility function for conditional classes.

---

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Deploy with zero configuration

### Other Platforms

The project can be deployed to any platform that supports Next.js:

- Netlify
- AWS Amplify
- Railway
- DigitalOcean App Platform

---

## 📦 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

---

## 🧪 Testing

```bash
# Run tests (when implemented)
npm run test

# Run tests in watch mode
npm run test:watch
```

---

## 📚 API Reference

### Editor Component

```typescript
import { RichEditor } from "@/components/editor/rich-editor";

// Basic usage
<RichEditor />;
```

### Custom Extensions

```typescript
import {
  IndentExtension,
  LineHeightExtension,
} from "@/components/editor/tiptap-extensions";

// Use in editor configuration
const editor = useEditor({
  extensions: [StarterKit, IndentExtension, LineHeightExtension],
});
```
---

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details on how to contribute to this project.

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- [TipTap](https://tiptap.dev/) - The headless editor framework
- [Next.js](https://nextjs.org/) - The React framework
- [Radix UI](https://www.radix-ui.com/) - Accessible UI primitives
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [shadcn/ui](https://ui.shadcn.com/) - Beautifully designed components

---

## 📞 Support

- 📧 Email: support@docueditpro.com
- 🐛 Issues: [GitHub Issues](https://github.com/amananandrai/document-editor-with-tiptap/issues)
- 💬 Discussions: [GitHub Discussions](https://github.com/amananandrai/document-editor-with-tiptap/discussions)

---
- [🔝 Back to Top](#-docuedit-pro)

---

<div align="center">
  <p>Made with ❤️ using Next.js & TipTap</p>
  <p>© 2025 DocuEdit Pro. All rights reserved.</p>
</div>
