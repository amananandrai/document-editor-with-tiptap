'use client'
import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { ThemeToggle } from '@/components/theme-toggle'
import { FileText, Download, Save, Share2, Settings, Menu, X } from 'lucide-react'
import Link from 'next/link'

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 shadow-lg">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
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

          {/* Desktop Navigation Actions */}
          <div className="hidden md:flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/20 hover:text-white border-white/30"
            >
              <Save className="h-4 w-4 mr-2" />
              Save
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/20 hover:text-white border-white/30"
            >
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/20 hover:text-white border-white/30"
            >
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/20 hover:text-white border-white/30"
            >
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>

            {/* Theme Toggle */}
            <div className="ml-4 pl-4 border-l border-white/30">
              <ThemeToggle className="text-white hover:bg-white/20" />
            </div>
          </div>

          {/* Mobile Menu Button and Theme Toggle */}
          <div className="flex md:hidden items-center space-x-2">
            <ThemeToggle className="text-white hover:bg-white/20" />
            <Button
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/20"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden pb-4 space-y-2">
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start text-white hover:bg-white/20 hover:text-white"
              onClick={() => setIsMenuOpen(false)}
            >
              <Save className="h-4 w-4 mr-2" />
              Save
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start text-white hover:bg-white/20 hover:text-white"
              onClick={() => setIsMenuOpen(false)}
            >
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start text-white hover:bg-white/20 hover:text-white"
              onClick={() => setIsMenuOpen(false)}
            >
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start text-white hover:bg-white/20 hover:text-white"
              onClick={() => setIsMenuOpen(false)}
            >
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
          </div>
        )}
      </div>
    </nav>
  )
}