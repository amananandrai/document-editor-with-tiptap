"use client";
import React from "react";
import Link from "next/link";
import { Github } from "lucide-react";
import { useFocusMode } from "@/components/focus-mode-context";
import { Logo } from "@/components/navbar";

const REPO = "https://github.com/amananandrai/document-editor-with-tiptap";

const columns = [
  {
    title: "Product",
    links: [
      { label: "Open the editor", href: "/editor" },
      { label: "Features", href: "/#features" },
      { label: "How it works", href: "/#how-it-works" },
    ],
  },
  {
    title: "Support",
    links: [
      { label: "Documentation", href: "/documentation" },
      { label: "Help Center", href: "/help-center" },
      { label: "Contact Us", href: "/contact-us" },
    ],
  },
  {
    title: "Project",
    links: [
      { label: "Source code", href: REPO },
      { label: "Report a bug", href: `${REPO}/issues` },
      { label: "Request a feature", href: `${REPO}/issues` },
    ],
  },
];

export function Footer() {
  let isFocusMode = false;

  // ✅ Safely try to use focus mode (avoid runtime error)
  try {
    const focus = useFocusMode();
    isFocusMode = focus.isFocusMode;
  } catch {
    // No FocusModeProvider found — ignore (safe)
  }

  // ✅ Hide footer in focus mode
  if (isFocusMode) return null;

  return (
    <footer className="border-t-2 border-ink bg-paper text-ink">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-[1.4fr_repeat(3,1fr)]">
          <div className="grid content-start gap-4">
            <Logo />
            <p className="max-w-[36ch] text-sm text-ink-soft">
              A free, browser-based document editor with real pages, equations and PDF and Word
              export. Built with Next.js and Tiptap.
            </p>
            <a
              href={REPO}
              className="inline-flex items-center gap-2 justify-self-start text-sm font-medium text-ink-soft hover:text-ink"
            >
              <Github className="h-4 w-4" aria-hidden="true" />
              Star on GitHub
            </a>
          </div>

          {columns.map((column) => (
            <div key={column.title}>
              <h4 className="font-display text-xs font-extrabold uppercase tracking-[0.08em] [font-stretch:110%]">
                {column.title}
              </h4>
              <ul className="mt-4 grid gap-2 text-sm text-ink-soft">
                {column.links.map((link) => (
                  <li key={link.label}>
                    {link.href.startsWith("http") ? (
                      <a href={link.href} className="hover:text-ink">
                        {link.label}
                      </a>
                    ) : (
                      <Link href={link.href} className="hover:text-ink">
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-wrap justify-between gap-2 border-t border-rule pt-6 text-xs text-ink-soft">
          <span>© {new Date().getFullYear()} DocuEdit Pro</span>
          <span>Documents are saved in your browser, not on a server.</span>
        </div>
      </div>
    </footer>
  );
}
