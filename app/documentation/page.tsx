import React from "react";

export default function Documentation() {
  return (
    <main className="max-w-3xl mx-auto py-12 px-4">
      <h1 className="text-4xl font-bold mb-6 text-center">Documentation</h1>
      <p className="mb-8 text-lg text-center">
        Welcome to the <strong>DocuEdit Pro Documentation</strong> — your complete guide to creating, editing, and exporting professional documents using our editor.
        Whether you’re a developer integrating the editor or a writer exploring its tools, this documentation will help you get started quickly.
      </p>

      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-3">1. Getting Started</h2>
        <p className="mb-4">
          To begin using DocuEdit Pro, install the dependencies and run the local development server. Once running, you’ll have access to a
          feature-rich document editor built on <strong>React</strong>, <strong>TypeScript</strong>, and <strong>TipTap</strong>.
        </p>
        <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg text-sm overflow-x-auto">
{`npm install
npm run dev`}
        </pre>
        <p className="mt-4">
          After starting the development server, navigate to <code>http://localhost:3000</code> to open the editor in your browser.
        </p>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-3">2. Editor Features</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>Rich text editing with headings, lists, tables, and code blocks.</li>
          <li>Real-time formatting and auto-save functionality.</li>
          <li>Keyboard shortcuts for quick navigation and editing.</li>
          <li>Collaborative editing (coming soon).</li>
        </ul>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-3">3. Customization</h2>
        <p className="mb-4">
          DocuEdit Pro supports deep customization through TipTap extensions. You can add your own formatting options, toolbar buttons, and themes.
        </p>
        <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg text-sm overflow-x-auto">
{`import { Extension } from '@tiptap/core'

const Highlight = Extension.create({
  name: 'highlight',
  addOptions() {
    return {
      HTMLAttributes: { class: 'bg-yellow-300' },
    }
  },
})`}
        </pre>
        <p className="mt-4">
          Add your custom extension to the editor configuration to enable it globally.
        </p>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-3">4. Exporting Documents</h2>
        <p className="mb-4">
          You can export documents directly to <strong>PDF</strong> or <strong>Word</strong> format. Click the <em>Export</em> button in the top toolbar, then choose your preferred format.
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Export as PDF — maintains layout and formatting.</li>
          <li>Export as DOCX — editable in Microsoft Word and Google Docs.</li>
          <li>Supports multi-page layout and embedded images.</li>
        </ul>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-3">5. Multi-Page Support</h2>
        <p className="mb-4">
          DocuEdit Pro provides seamless multi-page management. As your content grows, it automatically paginates the document.
          You can also preview and reorder pages using the page navigation panel.
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Auto-pagination as content expands.</li>
          <li>Manual page breaks available in the toolbar.</li>
          <li>Visual page indicators during editing and preview.</li>
        </ul>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-3">6. Developer Notes</h2>
        <p className="mb-4">
          The entire project is modular and open for extension. Follow best practices for TypeScript typing and component isolation
          to keep your editor performant and scalable.
        </p>
        <p className="italic text-sm text-gray-400">
          Tip: Always test your custom TipTap extensions separately before adding them to production.
        </p>
      </section>
    </main>
  );
}
