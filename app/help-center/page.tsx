import React from "react";
import { ActionCard, Kbd, QA, SitePage, type SiteSection } from "@/components/site-page";

const ISSUES = "https://github.com/amananandrai/document-editor-with-tiptap/issues";

const sections: SiteSection[] = [
  {
    id: "faq",
    title: "Common questions",
    content: (
      <div className="grid gap-6">
        <QA q="Where is my document saved?">
          <p>
            In this browser, on this device. It saves automatically as you type and is never
            uploaded. A different browser or computer starts with its own empty document.
          </p>
        </QA>
        <QA q="How do I keep a copy or move a document to another computer?">
          <p>
            Export it from the File menu as PDF, Word, Markdown or text. There’s no account or cloud
            sync, so exporting is the way to back up your work.
          </p>
        </QA>
        <QA q="Can I work without an internet connection?">
          <p>
            Editing keeps working if your connection drops after the editor has loaded. Exporting
            loads some extra code the first time you use it, so do that while online.
          </p>
        </QA>
        <QA q="How do I start a new document?">
          <p>
            Click <strong>Clear content</strong> at the end of the toolbar. It clears the text, header
            and footer. If you change your mind, click <strong>Undo</strong> in the message that
            appears.
          </p>
        </QA>
        <QA q="Why did my text jump to the next page?">
          <p>
            The editor works on real A4 pages. When a paragraph doesn’t fit above the bottom margin
            or footer, it moves to the next page, just as it would when printed.
          </p>
        </QA>
        <QA q="How do I edit the header or footer?">
          <p>
            Turn them on from the Insert menu, then click the header or footer on any page. Your
            changes appear on every page. Press <Kbd>Esc</Kbd> or click the page to go back to the
            document.
          </p>
        </QA>
        <QA q="Can several people edit the same document?">
          <p>No. Each document lives in one person’s browser, and there’s no real-time collaboration.</p>
        </QA>
        <QA q="Is it free?">
          <p>Yes. DocuEdit Pro is free and open source.</p>
        </QA>
      </div>
    ),
  },
  {
    id: "troubleshooting",
    title: "Troubleshooting",
    content: (
      <div className="grid gap-6">
        <QA q="The editor is blank or won’t load">
          <p>
            Refresh the page. Use a recent version of Chrome, Edge, Firefox or Safari, and check
            that an extension isn’t blocking scripts on the site.
          </p>
        </QA>
        <QA q="My document disappeared">
          <p>
            The document is stored with your browser’s site data. Clearing browsing data, using a
            private window, or switching browsers or devices will show an empty document. A cleared
            document can’t be recovered, so export copies of important work.
          </p>
        </QA>
        <QA q="Nothing downloads when I export">
          <p>
            Check that your browser allows downloads from the site. Long documents take a few
            seconds to turn into a PDF, so wait for the confirmation message.
          </p>
        </QA>
        <QA q="Word shows a warning when opening the file">
          <p>
            Word may open downloaded files in Protected View. Click <strong>Enable Editing</strong>{" "}
            to edit the document.
          </p>
        </QA>
        <QA q="Fonts look different in Word">
          <p>
            Word uses the fonts installed on your computer. If a font isn’t installed, Word
            substitutes another one. PDFs keep the fonts exactly as they appear on screen.
          </p>
        </QA>
      </div>
    ),
  },
  {
    id: "report",
    title: "Report a problem or suggest a feature",
    content: (
      <>
        <p>
          Bugs and ideas are tracked on GitHub. A good bug report includes what you did, what you
          expected, what happened instead, your browser, and a screenshot if possible.
        </p>
        <div className="grid gap-3 sm:grid-cols-2">
          <ActionCard
            href={`${ISSUES}/new`}
            title="Report a bug"
            description="Open a new issue on GitHub."
            tone="bg-tile-rose"
          />
          <ActionCard
            href={`${ISSUES}/new`}
            title="Suggest a feature"
            description="Describe what you need and why."
            tone="bg-tile-sky"
          />
        </div>
      </>
    ),
  },
];

export default function HelpCenter() {
  return (
    <SitePage
      eyebrow="Help Center"
      title={
        <>
          How can we <span className="marker">help</span>?
        </>
      }
      intro={
        <p>
          Common questions about saving, pages and exporting, and what to try when something goes
          wrong. For step-by-step instructions, see the <a className="underline decoration-mark decoration-[3px] underline-offset-[3px] text-ink" href="/documentation">documentation</a>.
        </p>
      }
      sections={sections}
    />
  );
}
