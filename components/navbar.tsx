"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { FileText, Menu, X, Home, Star, Info, BookOpen } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";

const navLinks = [
  { name: "Home", href: "#home-section", icon: <Home size={20} /> },
  { name: "About", href: "#about-section", icon: <BookOpen size={20} /> },
  { name: "Features", href: "#features-section", icon: <Star size={20} /> },
];

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const handleNavClick = (href: string) => {
    const [, hash] = href.split("#");

    if (pathname === "/") {
      // Already on home → smooth scroll
      const element = document.getElementById(hash);
      if (element) element.scrollIntoView({ behavior: "smooth" });
    } else {
      // Navigate to home with hash
      router.push(`/${hash ? `#${hash}` : ""}`);
    }

    setIsMenuOpen(false);
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 shadow-lg">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-1">
        <div className="flex h-16 items-center justify-between">
          {/* Logo and Brand */}
          <div className="flex items-center space-x-4">
            <Link
              href="/"
            >
              <div className="flex items-center space-x-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/20 backdrop-blur-sm">
                  <FileText className="h-6 w-6 text-white" />
                </div>
                <div className="flex flex-col">
                  <h1 className="text-xl font-bold text-white font-serif">
                    DocuEdit Pro
                  </h1>
                  <p className="hidden sm:block text-xs text-white/80 font-mono">
                    Professional Document Editor
                  </p>
                </div>
              </div>
            </Link>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-4">
            {navLinks.map((link, i) => (
              <button
                key={i}
                onClick={() => handleNavClick(link.href)}
                className="group cursor-pointer flex gap-2 items-center text-white text-base md:text-lg px-4 py-2 
                  rounded-lg transition duration-300 hover:scale-105 hover:bg-purple-800 hover:shadow outline-none"
              >
                <span className="group-hover:animate-bounce">{link.icon}</span>
                <span>{link.name}</span>
              </button>
            ))}
            <div className="ml-4 pl-4 border-l border-white/30">
              <ThemeToggle className="text-white hover:bg-white/20" />
            </div>
          </div>

          {/* Mobile */}
          <div className="flex md:hidden items-center space-x-2">
            <ThemeToggle className="text-white hover:bg-white/20" />
            <Button
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/20"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden pb-4 space-y-2">
            {navLinks.map((link, i) => (
              <button
                key={i}
                onClick={() => handleNavClick(link.href)}
                className="group cursor-pointer flex gap-2 items-center text-white text-base md:text-lg px-4 py-2 
                  rounded-lg hover:bg-purple-800 hover:scale-105 hover:shadow outline-none"
              >
                <span className="group-hover:animate-bounce">{link.icon}</span>
                <span>{link.name}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
}
