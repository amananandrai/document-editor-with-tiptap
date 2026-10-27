import React from "react";

// Shared layout for the documentation-style pages (Docs, Help Center,
// Contact): a headline band matching the home page, an "On this page" list
// and ruled sections.

export interface SiteSection {
  id: string;
  title: string;
  content: React.ReactNode;
}

interface SitePageProps {
  eyebrow: string;
  title: React.ReactNode;
  intro: React.ReactNode;
  sections: SiteSection[];
}

export function SitePage({ eyebrow, title, intro, sections }: SitePageProps) {
  return (
    <div className="bg-paper text-ink">
      <header className="mx-auto max-w-7xl px-4 pb-12 pt-12 sm:px-6 sm:pt-16 lg:px-8">
        <p className="font-mono text-xs uppercase tracking-[0.14em] text-ink-soft">{eyebrow}</p>
        <h1 className="mt-4 font-display text-[clamp(2.5rem,7vw,5.5rem)] font-black uppercase leading-[0.92] tracking-[-0.03em] [font-stretch:112%] [text-wrap:balance]">
          {title}
        </h1>
        <div className="mt-6 max-w-[60ch] text-lg leading-relaxed text-ink-soft">{intro}</div>
      </header>

      <div className="border-t-2 border-ink">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[200px_minmax(0,1fr)] lg:px-8 lg:py-16">
          <nav aria-label="On this page" className="lg:sticky lg:top-24 lg:self-start">
            <p className="font-display text-xs font-extrabold uppercase tracking-[0.08em] [font-stretch:110%]">
              On this page
            </p>
            <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-sm text-ink-soft lg:grid lg:gap-2">
              {sections.map((s) => (
                <li key={s.id}>
                  <a href={`#${s.id}`} className="hover:text-ink">
                    {s.title}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="grid min-w-0 gap-12">
            {sections.map((s) => (
              <section key={s.id} id={s.id} className="scroll-mt-24 border-t border-rule pt-8 first:border-t-0 first:pt-0">
                <h2 className="font-display text-2xl font-black uppercase leading-tight tracking-[-0.01em] [font-stretch:108%] [text-wrap:balance] sm:text-3xl">
                  {s.title}
                </h2>
                <div className="site-prose mt-5 max-w-[68ch]">{s.content}</div>
              </section>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/** Question-and-answer pair for FAQ-style sections */
export function QA({ q, children }: { q: string; children: React.ReactNode }) {
  return (
    <div className="border-l-2 border-mark pl-4">
      <h3 className="font-semibold text-ink">{q}</h3>
      <div className="mt-1">{children}</div>
    </div>
  );
}

/** Keyboard key */
export function Kbd({ children }: { children: React.ReactNode }) {
  return (
    <kbd className="rounded border border-rule bg-tile-stone px-1.5 py-0.5 font-mono text-[0.8em] text-ink">
      {children}
    </kbd>
  );
}

/** Large link card used for calls to action */
export function ActionCard({
  href,
  title,
  description,
  tone = "bg-tile-stone",
}: {
  href: string;
  title: string;
  description: string;
  tone?: string;
}) {
  const external = href.startsWith("http");
  return (
    <a
      href={href}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      className={`action-card group grid gap-2 rounded-[18px] p-5 transition-transform hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink ${tone}`}
    >
      <span className="font-display text-lg font-extrabold leading-tight text-ink [font-stretch:105%]">
        {title} <span aria-hidden="true" className="inline-block transition-transform group-hover:translate-x-0.5">→</span>
      </span>
      <span className="text-sm text-ink-soft">{description}</span>
    </a>
  );
}
