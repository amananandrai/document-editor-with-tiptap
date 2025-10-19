"use client";
import React from "react";
import { FileText, Github, Twitter, Linkedin, Heart } from "lucide-react";
import { useFocusMode } from "@/components/focus-mode-context";

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
    <footer className="bg-gradient-to-r from-slate-900 via-gray-900 to-slate-900 text-white">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-r from-blue-500 to-purple-600">
                <FileText className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold font-serif">DocuEdit Pro</h3>
                <p className="text-sm text-gray-400 font-mono">
                  Professional Document Editor
                </p>
              </div>
            </div>
            <p className="text-gray-300 mb-6 max-w-md">
              A powerful, feature-rich document editor built with modern web
              technologies. Create, edit, and format documents with
              professional-grade tools.
            </p>
            <div className="flex space-x-4">
              <a
                href="https://github.com/amananandrai/document-editor-with-tiptap"
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="GitHub"
              >
                <Github className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Features */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Features</h4>
            <ul className="space-y-2 text-gray-300">
              <li>Rich Text Editing</li>
              <li>Export to PDF & Word</li>
              <li>Dark/Light Themes</li>
              <li>Real-time Collaboration</li>
              <li>Advanced Formatting</li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Support</h4>
            <ul className="space-y-2 text-gray-300">
              <li>
                <a
                  href="/documentation"
                  className="hover:text-white transition-colors"
                >
                  Documentation
                </a>
              </li>
              <li>
                <a
                  href="/help-center"
                  className="hover:text-white transition-colors"
                >
                  Help Center
                </a>
              </li>
              <li>
                <a
                  href="/contact-us"
                  className="hover:text-white transition-colors"
                >
                  Contact Us
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/amananandrai/document-editor-with-tiptap/issues"
                  className="hover:text-white transition-colors"
                >
                  Bug Reports
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/amananandrai/document-editor-with-tiptap/issues"
                  className="hover:text-white transition-colors"
                >
                  Feature Requests
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-700 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 text-gray-400 mb-4 md:mb-0">
              <span>Made with</span>
              <Heart className="h-4 w-4 text-red-500" />
              <span>using Next.js & TipTap</span>
            </div>
            <div className="flex space-x-6 text-sm text-gray-400">
              <a href="#" className="hover:text-white transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="hover:text-white transition-colors">
                Terms of Service
              </a>
              <a href="#" className="hover:text-white transition-colors">
                Cookie Policy
              </a>
            </div>
          </div>
          <div className="text-center text-gray-500 text-sm mt-4">
            © 2024 DocuEdit Pro. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}
