import React from "react";
import { Kbd, SitePage, type SiteSection } from "@/components/site-page";

const sections: SiteSection[] = [
  {
    id: "getting-started",
    title: "Getting started",
    content: (
      <>
        <p>
          Open the <a href="/editor">editor</a> and start typing. There’s no account and nothing to
          install.
        </p>
        <p>
          Your document saves automatically in this browser about a second after you stop typing.
          It isn’t uploaded anywhere, so it stays on this device and in this browser only. Clearing
          your browsing data deletes it, so export a copy of anything you want to keep.
        </p>
        <p>
          To start over, use the <strong>Clear content</strong> button at the end of the toolbar. It
          clears the document, header and footer, and the message that appears has an{" "}
          <strong>Undo</strong> button.
        </p>
      </>
    ),
  },
  {
    id: "formatting",
    title: "Writing and formatting",
    content: (
      <>
        <p>The toolbar covers the formatting you’d expect from a word processor:</p>
        <ul>
          <li>Paragraph styles and headings (H1–H4), which also build the Contents sidebar.</li>
          <li>Bold, italic, underline, superscript and subscript.</li>
          <li>Font family, font size, line spacing and alignment.</li>
          <li>Text color and highlight color.</li>
          <li>Links, block quotes, inline code and code blocks.</li>
          <li>Indent and outdent, and the format painter to copy formatting.</li>
        </ul>
        <p>
          Use <strong>Tools → Search</strong> to find and replace text.
        </p>
      </>
    ),
  },
  {
    id: "pages",
    title: "Pages and layout",
    content: (
      <>
        <p>
          The document is laid out on A4 pages. Text moves to the next page automatically when a
          page is full, and nothing runs into the margins, header or footer.
        </p>
        <ul>
          <li>
            <strong>Page break:</strong> Insert → Page Break. Everything after the break starts on a
            new page.
          </li>
          <li>
            <strong>Margins:</strong> drag the blue markers on the ruler for the left and right
            margins, or use File → Page Setup to set all four in inches.
          </li>
          <li>
            <strong>Header and footer:</strong> Insert → Header or Insert → Footer. Click a header
            or footer to edit it; the change appears on every page. Press <Kbd>Esc</Kbd> to return
            to the document.
          </li>
          <li>
            <strong>Page numbers:</strong> Insert → Page Numbers, then pick top or bottom and left,
            center or right.
          </li>
        </ul>
      </>
    ),
  },
  {
    id: "lists",
    title: "Lists",
    content: (
      <>
        <p>
          Start a bulleted or numbered list from the toolbar. Press <Kbd>Tab</Kbd> to move an item
          one level in and <Kbd>Shift</Kbd>+<Kbd>Tab</Kbd> to move it back out. Markers change
          automatically by level (● ○ ■ and 1. a. i.).
        </p>
        <ul>
          <li>
            <strong>Bullet and numbering styles:</strong> the arrow next to each list button opens
            a library of markers, such as squares, arrows, check marks, letters or Roman numerals.
          </li>
          <li>
            <strong>Multilevel lists:</strong> the multilevel button applies a style to the whole
            list, such as 1. a. i., I. A. 1., or legal numbering (1. 1.1. 1.1.1.).
          </li>
        </ul>
      </>
    ),
  },
  {
    id: "equations",
    title: "Equations",
    content: (
      <>
        <p>
          Choose Insert → Equation or the <strong>Σ</strong> button. Type LaTeX, or build the
          equation from the structure, symbol and example buttons; a live preview shows the result.
          Press <Kbd>Ctrl</Kbd>+<Kbd>Enter</Kbd> to insert.
        </p>
        <p>
          Choose <strong>Inline</strong> to place the equation within a sentence, or{" "}
          <strong>Display</strong> to give it its own centered line. Click an equation in the
          document to edit or delete it.
        </p>
        <pre>
          <code>{`\\frac{a}{b}      fraction
x^{2}  x_{i}     superscript, subscript
\\sqrt{x}         square root
\\sum_{i=1}^{n}   sum
\\int_{a}^{b}     integral`}</code>
        </pre>
      </>
    ),
  },
  {
    id: "tables-images",
    title: "Tables, images and contents",
    content: (
      <ul>
        <li>
          <strong>Tables:</strong> Insert → Insert Table. Use Tools → Table to add or remove rows and
          columns, merge or split cells, and toggle header rows. Drag column borders to resize.
        </li>
        <li>
          <strong>Images:</strong> Insert → Image, or paste or drag an image into the page. Drag the
          handles to resize.
        </li>
        <li>
          <strong>Table of contents:</strong> Insert → Table of Contents adds a clickable list of
          your headings to the document. The Contents sidebar shows the same headings.
        </li>
      </ul>
    ),
  },
  {
    id: "exporting",
    title: "Exporting",
    content: (
      <>
        <p>Everything is in the File menu:</p>
        <table>
          <thead>
            <tr>
              <th>Format</th>
              <th>What you get</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>PDF</td>
              <td>A4 pages exactly as on screen, including headers, footers and page numbers.</td>
            </tr>
            <tr>
              <td>Word</td>
              <td>An editable .doc file with your margins, page breaks, headers, footers and equations.</td>
            </tr>
            <tr>
              <td>Markdown</td>
              <td>Headings, lists (including nested ones), links and equations as $…$.</td>
            </tr>
            <tr>
              <td>Text</td>
              <td>Plain text only.</td>
            </tr>
          </tbody>
        </table>
      </>
    ),
  },
  {
    id: "shortcuts",
    title: "Keyboard shortcuts",
    content: (
      <>
        <p>
          On a Mac, use <Kbd>Cmd</Kbd> instead of <Kbd>Ctrl</Kbd>.
        </p>
        <table>
          <tbody>
            {[
              [["Ctrl", "B"], "Bold"],
              [["Ctrl", "I"], "Italic"],
              [["Ctrl", "U"], "Underline"],
              [["Ctrl", "Z"], "Undo"],
              [["Ctrl", "Shift", "Z"], "Redo"],
              [["Ctrl", "Shift", "8"], "Bulleted list"],
              [["Ctrl", "Shift", "7"], "Numbered list"],
              [["Tab"], "Indent a list item"],
              [["Shift", "Tab"], "Outdent a list item"],
              [["Esc"], "Leave the header or footer"],
              [["Ctrl", "Shift", "F"], "Turn focus mode on or off"],
            ].map(([keys, action]) => (
              <tr key={String(action)}>
                <td className="whitespace-nowrap">
                  {(keys as string[]).map((k, i) => (
                    <React.Fragment key={k}>
                      {i > 0 && "+"}
                      <Kbd>{k}</Kbd>
                    </React.Fragment>
                  ))}
                </td>
                <td>{action as string}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </>
    ),
  },
  {
    id: "developers",
    title: "For developers",
    content: (
      <>
        <p>
          DocuEdit Pro is open source and built with Next.js, React, Tailwind CSS and{" "}
          <a href="https://tiptap.dev" target="_blank" rel="noopener noreferrer">Tiptap</a>. To run
          it locally:
        </p>
        <pre>
          <code>{`npm install
npm run dev     # http://localhost:3000
npm test        # unit tests`}</code>
        </pre>
        <p>
          The editor lives in <code>components/editor</code>. Custom Tiptap extensions such as
          pagination, page breaks, list styles and equations are registered in the extension list
          in <code>rich-editor.tsx</code>. Add your own extension there to enable it.
        </p>
        <p>
          See{" "}
          <a href="https://github.com/amananandrai/document-editor-with-tiptap/blob/main/CONTRIBUTING.md" target="_blank" rel="noopener noreferrer">
            CONTRIBUTING.md
          </a>{" "}
          before opening a pull request.
        </p>
      </>
    ),
  },
];

export default function Documentation() {
  return (
    <SitePage
      eyebrow="Documentation"
      title={
        <>
          How to use <span className="marker">DocuEdit</span>
        </>
      }
      intro={<p>Everything the editor can do, where to find it, and how to run it yourself.</p>}
      sections={sections}
    />
  );
}
