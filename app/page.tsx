import katex from "katex";
import "katex/dist/katex.min.css";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import React from "react";

// Server component: the equation is rendered to HTML at build time, so the
// page ships no KaTeX JavaScript. Feature tiles show each feature working
// instead of describing it.

function Tile({
  title,
  description,
  className = "",
  children,
}: {
  title: string;
  description: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <article
      className={`flex min-w-0 flex-col justify-between gap-6 rounded-[20px] p-5 sm:p-6 ${className}`}
    >
      <div className="min-w-0" aria-hidden="true">
        {children}
      </div>
      <div>
        <h3 className="font-display text-lg font-extrabold leading-tight [font-stretch:105%]">
          {title}
        </h3>
        <p className="mt-1 text-sm opacity-75">{description}</p>
      </div>
    </article>
  );
}

function MiniPage({ lines = 3, header = true }: { lines?: number; header?: boolean }) {
  return (
    <div className="grid aspect-[210/297] w-16 content-start gap-1 rounded-[3px] bg-white px-2 py-2.5 shadow-sm ring-1 ring-black/5">
      {header && <span className="mb-1 block h-1 w-3/5 rounded bg-slate-400" />}
      {Array.from({ length: lines }).map((_, i) => (
        <span
          key={i}
          className="block h-1 rounded bg-slate-200"
          style={{ width: i === lines - 1 ? "65%" : "100%" }}
        />
      ))}
    </div>
  );
}

function Equation({ latex }: { latex: string }) {
  const html = katex.renderToString(latex, { displayMode: true, throwOnError: false });
  return <div className="overflow-x-auto text-[1.35rem]" dangerouslySetInnerHTML={{ __html: html }} />;
}

const STEPS = [
  {
    title: "Open the editor",
    text: "No account and nothing to install. Your document saves in your browser as you type.",
  },
  {
    title: "Write on real pages",
    text: "Text flows onto A4 pages. Add headers, footers, page numbers, page breaks, equations and tables.",
  },
  {
    title: "Export the result",
    text: "Download a PDF that matches the screen, a Word document, Markdown or plain text.",
  },
];

const FEATURE_WORDS = ["A4 pages", "Page breaks", "Equations", "Legal numbering", "PDF & Word export"];

export default function HomePage() {
  return (
    <div className="bg-paper text-ink">
      {/* =================== HERO =================== */}
      <section id="top" className="mx-auto max-w-7xl px-4 pb-16 pt-12 sm:px-6 sm:pt-16 lg:px-8 lg:pb-24">
        <p className="font-mono text-xs uppercase tracking-[0.14em] text-ink-soft">
          Free document editor · runs in your browser
        </p>
        <h1 className="mt-5 font-display text-[clamp(2.75rem,9vw,7.5rem)] font-black uppercase leading-[0.9] tracking-[-0.03em] [font-stretch:112%] [text-wrap:balance]">
          Write it. <span className="marker">Format</span> it. Print it.
        </h1>

        <div className="mt-10 grid gap-8 border-t border-rule pt-8 lg:grid-cols-[1.2fr_1fr] lg:items-end">
          <p className="max-w-[46ch] text-lg leading-relaxed text-ink-soft">
            A document editor built around real pages: headers, footers, page numbers, equations and
            multilevel lists. What you see on screen is what you get in the PDF.
          </p>
          <div className="flex flex-wrap gap-3 lg:justify-end">
            <Link
              href="/editor"
              className="group inline-flex items-center gap-2 bg-ink px-6 py-4 font-display text-sm font-extrabold uppercase tracking-[0.04em] text-paper transition-transform [font-stretch:110%] hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink"
            >
              Open the editor
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
            </Link>
            <a
              href="#features"
              className="inline-flex items-center bg-mark px-6 py-4 font-display text-sm font-extrabold uppercase tracking-[0.04em] text-mark-ink transition-transform [font-stretch:110%] hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink"
            >
              See features
            </a>
          </div>
        </div>

        <ul className="mt-10 flex flex-wrap gap-x-6 gap-y-2 font-display text-sm font-bold uppercase [font-stretch:105%]">
          {FEATURE_WORDS.map((word) => (
            <li key={word} className="flex items-center gap-2">
              <span className="text-ink-soft" aria-hidden="true">✓</span>
              {word}
            </li>
          ))}
        </ul>
      </section>

      {/* =================== FEATURES (bento) =================== */}
      <section id="features" className="scroll-mt-20 border-t-2 border-ink">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <h2 className="max-w-[16ch] font-display text-[clamp(2rem,5vw,3.5rem)] font-black uppercase leading-[0.95] tracking-[-0.02em] [font-stretch:110%] [text-wrap:balance]">
              Everything a <span className="marker">real</span> document needs
            </h2>
            <p className="max-w-[40ch] text-ink-soft">
              Pages, headers, equations and lists that behave like a word processor, without
              installing one.
            </p>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-6">
            <Tile
              className="bg-tile-sky lg:col-span-3"
              title="True A4 pagination"
              description="Text flows from page to page, and a page break always starts a new page."
            >
              <div className="flex items-end gap-2">
                <MiniPage lines={4} />
                <span className="self-center border-t border-dashed border-current px-1 pt-1 font-mono text-[10px] uppercase tracking-wider text-ink-soft">
                  Page break
                </span>
                <MiniPage lines={2} />
                <MiniPage lines={3} />
              </div>
            </Tile>

            <Tile
              className="bg-ink text-paper sm:col-span-1 lg:col-span-3"
              title="Equations"
              description="Type LaTeX or build formulas from templates and symbols."
            >
              <Equation latex="x = \frac{-b \pm \sqrt{b^2 - 4ac}}{2a}" />
            </Tile>

            <Tile
              className="bg-tile-sage lg:col-span-2"
              title="Multilevel lists"
              description="Legal, outline and bullet presets that follow every level."
            >
              <ol className="grid gap-1 text-sm">
                {[
                  ["1.", "Scope", 0],
                  ["1.1.", "Goals", 1],
                  ["1.1.1.", "Success metrics", 2],
                  ["2.", "Timeline", 0],
                ].map(([n, label, depth]) => (
                  <li key={String(n)} style={{ paddingLeft: Number(depth) * 18 }}>
                    <b className="mr-2 font-semibold tabular-nums">{n}</b>
                    {label}
                  </li>
                ))}
              </ol>
            </Tile>

            <Tile
              className="bg-tile-sand lg:col-span-2"
              title="Headers & footers"
              description="Shown on every page, with automatic page numbers."
            >
              <div className="grid gap-2 rounded-md bg-white p-3 text-[11px] text-slate-500 shadow-sm">
                <div className="flex justify-between font-medium text-slate-700">
                  <span>Quarterly Report</span>
                  <span>Q3</span>
                </div>
                <span className="block h-1 rounded bg-slate-200" />
                <span className="block h-1 w-4/5 rounded bg-slate-200" />
                <div className="flex justify-end">Page 2 of 3</div>
              </div>
            </Tile>

            <Tile
              className="bg-tile-rose sm:col-span-2 lg:col-span-2"
              title="Export anywhere"
              description="The PDF matches the screen exactly, page for page."
            >
              <div className="flex flex-wrap gap-2">
                {["PDF", "DOCX", "MD", "TXT"].map((f) => (
                  <span
                    key={f}
                    className="rounded-md bg-white px-3 py-2 font-display text-xs font-extrabold tracking-wider text-slate-900 shadow-sm [font-stretch:110%]"
                  >
                    {f}
                  </span>
                ))}
              </div>
            </Tile>

            <Tile
              className="bg-tile-stone lg:col-span-2"
              title="Margins & page setup"
              description="Drag the ruler or set each margin in inches."
            >
              <div className="relative h-7 overflow-hidden rounded bg-white shadow-sm">
                <span className="absolute inset-y-0 left-0 w-1/6 bg-slate-200" />
                <span className="absolute inset-y-0 right-0 w-1/6 bg-slate-200" />
                <span
                  className="absolute inset-x-0 bottom-0 h-2"
                  style={{
                    backgroundImage:
                      "repeating-linear-gradient(to right, #94a3b8 0 1px, transparent 1px 8px)",
                  }}
                />
                <span className="absolute -top-0.5 left-[16.6%] -translate-x-1/2 border-x-[5px] border-t-[8px] border-x-transparent border-t-blue-500" />
                <span className="absolute -top-0.5 right-[16.6%] translate-x-1/2 border-x-[5px] border-t-[8px] border-x-transparent border-t-blue-500" />
              </div>
            </Tile>

            <Tile
              className="bg-tile-sky lg:col-span-2"
              title="Bullet & numbering styles"
              description="Pick the marker for each list, or let it change by level."
            >
              <div className="flex flex-wrap gap-2 text-lg">
                {["●", "○", "■", "➢", "✓", "1.", "a."].map((m) => (
                  <span
                    key={m}
                    className="grid h-10 min-w-10 place-items-center rounded-md bg-white px-2 text-slate-900 shadow-sm"
                  >
                    {m}
                  </span>
                ))}
              </div>
            </Tile>

            <Tile
              className="bg-tile-sand sm:col-span-2 lg:col-span-2"
              title="Tables, images & more"
              description="Resizable tables and images, find and replace, a contents sidebar, focus mode."
            >
              <div className="grid grid-cols-3 overflow-hidden rounded-md bg-white text-[11px] text-slate-600 shadow-sm">
                {["Item", "Qty", "Price", "Paper", "4", "$12", "Ink", "2", "$30"].map((cell, i) => (
                  <span
                    key={i}
                    className={`border-b border-r border-slate-100 px-2 py-1.5 ${i < 3 ? "bg-slate-50 font-semibold text-slate-800" : ""}`}
                  >
                    {cell}
                  </span>
                ))}
              </div>
            </Tile>
          </div>
        </div>
      </section>

      {/* =================== HOW IT WORKS =================== */}
      <section id="how-it-works" className="scroll-mt-20 border-t-2 border-ink">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
          <h2 className="font-display text-[clamp(2rem,5vw,3.5rem)] font-black uppercase leading-[0.95] tracking-[-0.02em] [font-stretch:110%]">
            Three steps to a finished document
          </h2>
          <ol className="mt-10 grid gap-0 md:grid-cols-3">
            {STEPS.map((step, i) => (
              <li
                key={step.title}
                className="border-t border-rule py-6 md:border-l md:border-t-0 md:px-6 md:py-0 md:first:border-l-0 md:first:pl-0"
              >
                <span className="font-display text-6xl font-black tabular-nums text-ink-soft/40 [font-stretch:112%]">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-3 font-display text-xl font-extrabold uppercase [font-stretch:108%]">
                  {step.title}
                </h3>
                <p className="mt-2 max-w-[38ch] text-ink-soft">{step.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* =================== CLOSING =================== */}
      <section className="bg-mark text-mark-ink">
        <div className="mx-auto flex max-w-7xl flex-wrap items-end justify-between gap-8 px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
          <h2 className="max-w-[18ch] font-display text-[clamp(2rem,5.5vw,4rem)] font-black uppercase leading-[0.92] tracking-[-0.02em] [font-stretch:112%] [text-wrap:balance]">
            Your next document starts on page one.
          </h2>
          <Link
            href="/editor"
            className="group inline-flex items-center gap-2 bg-[#0b0b0c] px-6 py-4 font-display text-sm font-extrabold uppercase tracking-[0.04em] text-white transition-transform [font-stretch:110%] hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0b0b0c]"
          >
            Open the editor
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
          </Link>
        </div>
      </section>
    </div>
  );
}
