# DocuEdit Pro

A rich document editor built with Next.js, React, TypeScript, and TipTap. It includes formatting tools, page layout controls, image handling, table editing, PDF/Word export, and a polished landing experience.

## Features

- Rich text editing with headings, lists, blockquotes, code, links, tables, and inline formatting
- Focus mode, A4 layout mode, and multi-page editing tools
- Header, footer, page number, and table of contents support
- Image upload with resize controls
- PDF and Word export options
- Dark mode and responsive UI

## Tech Stack

- Next.js 15
- React 18
- TypeScript
- TipTap
- Tailwind CSS
- Radix UI

## Getting Started

### Prerequisites

- Node.js 18 or newer
- npm

### Installation

```bash
git clone https://github.com/amananandrai/document-editor-with-tiptap.git
cd document-editor-with-tiptap
npm install
```

### Run Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Available Scripts

- `npm run dev` starts the development server
- `npm run build` creates a production build
- `npm run start` runs the production build
- `npm run lint` runs ESLint
- `npm run test` runs Jest tests
- `npm run test:watch` runs Jest in watch mode
- `npm run test:coverage` generates coverage output
- `npm run test:ci` runs tests in CI mode

## Project Structure

```text
app/
  contact-us/              # Contact page
  documentation/           # Documentation page
  editor/
    editor-client.tsx      # Client wrapper for the editor experience
    features.js            # Landing-page feature metadata
    layout.tsx             # Focus mode provider for editor routes
    page.tsx               # Main editor page
  help-center/             # Help center page
  globals.css              # Global design tokens and base styles
  layout.tsx               # Root app layout
  page.tsx                 # Landing page

components/
  editor/                  # Active editor implementation
  ui/                      # Reusable UI primitives
  BackToTopButton.tsx
  focus-mode-context.tsx
  footer.tsx
  navbar.tsx
  RootLayoutClient.tsx
  theme-provider.tsx
  theme-toggle.tsx

docs/
  blockquote-code-link-guide.md

lib/
  local-storage.ts
  utils.ts

public/
  logo.png
  placeholder-bg.jpg

__tests__/
  components/
  lib/
  setup/
```

## Notes

- The active editor lives under `components/editor/`.
- Legacy standalone editor files and unused placeholder assets were removed during codebase cleanup.
- Global styling is defined in `app/globals.css`; the old standalone editor stylesheet is no longer used.

## Customization

### Theme Tokens

Update the design tokens in `app/globals.css` to change colors, radius values, and shared theme settings.

### Editor Extensions

Editor extensions are composed in `components/editor/rich-editor.tsx`, with reusable extension helpers in `components/editor/tiptap-extensions.ts`.

### UI Components

Shared UI building blocks live in `components/ui/` and are used across the editor, navigation, dialogs, and controls.

## Testing

```bash
npm run test
npm run test:watch
```

## Deployment

This project can be deployed anywhere that supports Next.js, including Vercel, Netlify, Railway, and AWS Amplify.

## Support

- Issues: [GitHub Issues](https://github.com/amananandrai/document-editor-with-tiptap/issues)
- Discussions: [GitHub Discussions](https://github.com/amananandrai/document-editor-with-tiptap/discussions)

