'use client'

import React, { useState, useEffect } from 'react'
import type { Editor } from '@tiptap/react'
import { FileText, Type, MousePointer } from 'lucide-react'

interface StatusBarProps {
  editor: Editor | null
}

export function StatusBar({ editor }: StatusBarProps) {
  const [wordCount, setWordCount] = useState(0)
  const [characterCount, setCharacterCount] = useState(0)
  const [selectedText, setSelectedText] = useState('')
  const [selectedWordCount, setSelectedWordCount] = useState(0)
  const [selectedCharacterCount, setSelectedCharacterCount] = useState(0)

  useEffect(() => {
    if (!editor) return

    const updateCounts = () => {
      // Get the full text content
      const fullText = editor.getText()
      const fullTextWithoutSpaces = fullText.replace(/\s/g, '')
      
      // Count words (split by whitespace and filter out empty strings)
      const words = fullText.split(/\s+/).filter(word => word.length > 0)
      setWordCount(words.length)
      
      // Count characters
      setCharacterCount(fullText.length)
      
      // Get selected text
      const { from, to } = editor.state.selection
      const selectedText = editor.state.doc.textBetween(from, to, ' ')
      setSelectedText(selectedText)
      
      // Count selected text
      if (selectedText.trim()) {
        const selectedWords = selectedText.split(/\s+/).filter(word => word.length > 0)
        setSelectedWordCount(selectedWords.length)
        setSelectedCharacterCount(selectedText.length)
      } else {
        setSelectedWordCount(0)
        setSelectedCharacterCount(0)
      }
    }

    // Update counts on content change
    editor.on('update', updateCounts)
    editor.on('selectionUpdate', updateCounts)

    // Initial update
    updateCounts()

    return () => {
      editor.off('update', updateCounts)
      editor.off('selectionUpdate', updateCounts)
    }
  }, [editor])

  if (!editor) return null

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between px-2 sm:px-4 py-2 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-200 dark:border-gray-700 text-xs sm:text-sm text-muted-foreground gap-2 sm:gap-4">
      {/* Left side - Document stats */}
      <div className="flex items-center gap-2 sm:gap-4">
        <div className="flex items-center gap-1">
          <FileText className="h-3 w-3 sm:h-4 sm:w-4" />
          <span className="font-medium hidden sm:inline">Document</span>
        </div>
        <div className="flex items-center gap-2 sm:gap-3">
          <span>{wordCount} words</span>
          <span className="hidden sm:inline">{characterCount} characters</span>
          <span className="sm:hidden">{characterCount} chars</span>
        </div>
      </div>

      {/* Right side - Selection stats and cursor position */}
      <div className="flex items-center gap-2 sm:gap-4">
        {selectedText.trim() && (
          <>
            <div className="flex items-center gap-1">
              <MousePointer className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="font-medium hidden sm:inline">Selected</span>
            </div>
            <div className="flex items-center gap-2 sm:gap-3">
              <span>{selectedWordCount} words</span>
              <span className="hidden sm:inline">{selectedCharacterCount} characters</span>
              <span className="sm:hidden">{selectedCharacterCount} chars</span>
            </div>
          </>
        )}
        
        {/* Cursor position indicator */}
        <div className="flex items-center gap-1">
          <Type className="h-3 w-3 sm:h-4 sm:w-4" />
          <span className="hidden sm:inline">Line {editor.state.selection.anchor + 1}</span>
          <span className="sm:hidden">L{editor.state.selection.anchor + 1}</span>
        </div>
      </div>
    </div>
  )
}
