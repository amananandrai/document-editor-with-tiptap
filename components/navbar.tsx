"use client";

import React, { useState } from "react";
import { ThemeToggle } from "@/components/theme-toggle";
import { Menu, X } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { useFocusMode } from "@/components/focus-mode-context"; // ✅ added

// Section links scroll on the home page; page links navigate
const navLinks = [
  { name: "Features", href: "/#features" },
  { name: "How it works", href: "/#how-it-works" },
  { name: "Docs", href: "/documentation" },
  { name: "Help", href: "/help-center" },
];

export function Logo() {
  return (
    <Link
      href="/"
      className="flex items-center gap-2 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink"
    >
      {/* A page with a highlighted line */}
      <span
        className="relative grid h-8 w-6 content-start gap-[3px] border-2 border-ink bg-paper px-[3px] pt-[5px]"
        aria-hidden="true"
      >
        <span className="h-[3px] bg-mark" />
        <span className="h-[2px] bg-ink" />
        <span className="h-[2px] w-2/3 bg-ink" />
      </span>
      <span className="font-display text-lg font-black uppercase tracking-[-0.01em] [font-stretch:112%]">
        DocuEdit Pro
      </span>
    </Link>
  );
}

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  // ✅ Try to use Focus Mode (safe access)
  let isFocusMode = false;
  try {
    const focus = useFocusMode();
    isFocusMode = focus.isFocusMode;
  } catch {
    // No FocusModeProvider found (e.g., landing page)
  }

  // ✅ Hide navbar completely if in Focus Mode (only works inside editor)
  if (isFocusMode) return null;

  const onEditor = pathname.startsWith("/editor");

  const handleNavClick = (e: React.MouseEvent, href: string) => {
    const [path, hash] = href.split("#");
    if (hash && pathname === (path || "/")) {
      e.preventDefault();
      document.getElementById(hash)?.scrollIntoView({ behavior: "smooth" });
      history.replaceState(null, "", `#${hash}`);
    } else if (hash) {
      e.preventDefault();
      router.push(href);
    }
    setIsMenuOpen(false);
  };

  const linkClass =
    "font-display text-sm font-bold uppercase tracking-[0.03em] [font-stretch:105%] text-ink-soft hover:text-ink transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink";

  return (
    <nav className="sticky top-0 z-50 w-full border-b-2 border-ink bg-paper/95 text-ink backdrop-blur supports-[backdrop-filter]:bg-paper/85">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Logo />

        {/* Desktop Nav */}
        <div className="hidden items-center gap-7 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              onClick={(e) => handleNavClick(e, link.href)}
              className={linkClass}
            >
              {link.name}
            </Link>
          ))}
          <ThemeToggle className="text-ink hover:bg-tile-stone" />
          {!onEditor && (
            <Link
              href="/editor"
              className="bg-ink px-4 py-2.5 font-display text-xs font-extrabold uppercase tracking-[0.05em] text-paper [font-stretch:110%] transition-transform hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink"
            >
              Open editor
            </Link>
          )}
        </div>

        {/* Mobile */}
        <div className="flex items-center gap-1 md:hidden">
          <ThemeToggle className="text-ink hover:bg-tile-stone" />
          <button
            type="button"
            className="grid h-10 w-10 place-items-center text-ink"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={isMenuOpen}
          >
            {isMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="border-t border-rule px-4 pb-5 pt-3 md:hidden">
          <div className="grid gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className={linkClass}
              >
                {link.name}
              </Link>
            ))}
            {!onEditor && (
              <Link
                href="/editor"
                onClick={() => setIsMenuOpen(false)}
                className="justify-self-start bg-ink px-4 py-2.5 font-display text-xs font-extrabold uppercase tracking-[0.05em] text-paper [font-stretch:110%]"
              >
                Open editor
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
