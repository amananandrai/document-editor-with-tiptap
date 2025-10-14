'use client'

import React, { useState, useEffect, useRef } from 'react'
import type { Editor } from '@tiptap/react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Search,
  Replace,
  ChevronUp,
  ChevronDown,
  X,
  RotateCcw,
} from 'lucide-react'

interface FindReplaceModalProps {
  editor: Editor | null
  isOpen: boolean
  onClose: () => void
}

export function FindReplaceModal({ editor, isOpen, onClose }: FindReplaceModalProps) {
  const [searchText, setSearchText] = useState('')
  const [replaceText, setReplaceText] = useState('')
  const [currentMatch, setCurrentMatch] = useState(0)
  const [totalMatches, setTotalMatches] = useState(0)
  const [matches, setMatches] = useState<Array<{ from: number; to: number }>>([])
  const [caseSensitive, setCaseSensitive] = useState(false)
  const [wholeWord, setWholeWord] = useState(false)
  const [isReplacing, setIsReplacing] = useState(false)
  
  const searchInputRef = useRef<HTMLInputElement>(null)
  const replaceInputRef = useRef<HTMLInputElement>(null)

  // Find all matches when search text changes
  useEffect(() => {
    if (!editor || !searchText.trim()) {
      setMatches([])
      setTotalMatches(0)
      setCurrentMatch(0)
      return
    }

    const findMatches = () => {
      const text = editor.getText()
      const searchRegex = createSearchRegex(searchText, caseSensitive, wholeWord)
      const newMatches: Array<{ from: number; to: number }> = []
      
      let match
      while ((match = searchRegex.exec(text)) !== null) {
        newMatches.push({
          from: match.index,
          to: match.index + match[0].length
        })
      }
      
      setMatches(newMatches)
      setTotalMatches(newMatches.length)
      setCurrentMatch(0)
    }

    findMatches()
  }, [editor, searchText, caseSensitive, wholeWord])

  // Navigate to current match
  useEffect(() => {
    if (!editor || matches.length === 0) return

    const match = matches[currentMatch]
    if (match) {
      editor.commands.setTextSelection({ from: match.from, to: match.to })
      editor.commands.scrollIntoView()
    }
  }, [editor, currentMatch, matches])

  const createSearchRegex = (text: string, caseSensitive: boolean, wholeWord: boolean) => {
    let pattern = text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    
    if (wholeWord) {
      pattern = `\\b${pattern}\\b`
    }
    
    const flags = caseSensitive ? 'g' : 'gi'
    return new RegExp(pattern, flags)
  }

  const handleSearch = (direction: 'next' | 'prev') => {
    if (matches.length === 0) return

    const newIndex = direction === 'next' 
      ? (currentMatch + 1) % matches.length
      : (currentMatch - 1 + matches.length) % matches.length
    
    setCurrentMatch(newIndex)
  }

  const handleReplace = () => {
    if (!editor || matches.length === 0) return

    const match = matches[currentMatch]
    if (match) {
      editor.commands.setTextSelection({ from: match.from, to: match.to })
      editor.commands.insertContent(replaceText)
      
      // Update matches after replacement
      const newMatches = matches.filter((_, index) => index !== currentMatch)
      setMatches(newMatches)
      setTotalMatches(newMatches.length)
      
      if (currentMatch >= newMatches.length) {
        setCurrentMatch(Math.max(0, newMatches.length - 1))
      }
    }
  }

  const handleReplaceAll = () => {
    if (!editor || matches.length === 0) return

    setIsReplacing(true)
    
    // Sort matches by position (descending) to avoid index shifting
    const sortedMatches = [...matches].sort((a, b) => b.from - a.from)
    
    sortedMatches.forEach(match => {
      editor.commands.setTextSelection({ from: match.from, to: match.to })
      editor.commands.insertContent(replaceText)
    })
    
    setMatches([])
    setTotalMatches(0)
    setCurrentMatch(0)
    setIsReplacing(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      if (e.shiftKey) {
        handleSearch('prev')
      } else {
        handleSearch('next')
      }
    } else if (e.key === 'Escape') {
      onClose()
    }
  }

  const clearSearch = () => {
    setSearchText('')
    setReplaceText('')
    setMatches([])
    setTotalMatches(0)
    setCurrentMatch(0)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Find & Replace
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Search Input */}
          <div className="space-y-2">
            <Label htmlFor="search">Find</Label>
            <div className="relative">
              <Input
                ref={searchInputRef}
                id="search"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Search for text..."
                className="pr-10"
              />
              {searchText && (
                <Button
                  size="sm"
                  variant="ghost"
                  className="absolute right-1 top-1 h-6 w-6 p-0"
                  onClick={clearSearch}
                >
                  <X className="h-3 w-3" />
                </Button>
              )}
            </div>
          </div>

          {/* Replace Input */}
          <div className="space-y-2">
            <Label htmlFor="replace">Replace</Label>
            <Input
              ref={replaceInputRef}
              id="replace"
              value={replaceText}
              onChange={(e) => setReplaceText(e.target.value)}
              placeholder="Replace with..."
            />
          </div>

          {/* Options */}
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={caseSensitive}
                onChange={(e) => setCaseSensitive(e.target.checked)}
                className="rounded"
              />
              Case sensitive
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={wholeWord}
                onChange={(e) => setWholeWord(e.target.checked)}
                className="rounded"
              />
              Whole word
            </label>
          </div>

          {/* Match Info */}
          {totalMatches > 0 && (
            <div className="text-sm text-muted-foreground">
              {currentMatch + 1} of {totalMatches} matches
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleSearch('prev')}
              disabled={totalMatches === 0}
            >
              <ChevronUp className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleSearch('next')}
              disabled={totalMatches === 0}
            >
              <ChevronDown className="h-4 w-4" />
            </Button>
            
            <div className="flex-1" />
            
            <Button
              size="sm"
              variant="outline"
              onClick={handleReplace}
              disabled={totalMatches === 0 || !replaceText}
            >
              <Replace className="h-4 w-4 mr-1" />
              Replace
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={handleReplaceAll}
              disabled={totalMatches === 0 || !replaceText}
            >
              <RotateCcw className="h-4 w-4 mr-1" />
              Replace All
            </Button>
          </div>

          {/* Keyboard Shortcuts */}
          <div className="text-xs text-muted-foreground">
            <div>Press Enter to find next, Shift+Enter for previous</div>
            <div>Press Escape to close</div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

