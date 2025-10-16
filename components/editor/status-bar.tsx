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
  const [characterCountWhiteSpaces, setCharacterCountWhiteSpaces] = useState(0)
  const [selectedText, setSelectedText] = useState('')
  const [selectedWordCount, setSelectedWordCount] = useState(0)
  const [selectedCharacterCount, setSelectedCharacterCount] = useState(0)
  const [lineNumber, setLineNumber] = useState(1)

  useEffect(() => {
    if (!editor) return

      //Update line number
      const updateLineNumber = ()=>{
        const pos = editor.state.selection.anchor;
        const textBeforeCursor = editor.state.doc.textBetween(0, pos, '\n');
        const currentLine = textBeforeCursor.split('\n').length;
        setLineNumber(currentLine);
      }

    const updateCounts = () => {
      // Get the full text content
      const fullText = editor.getText()
      const fullTextWithoutSpaces = fullText.replace(/\s/g, '')
      setCharacterCountWhiteSpaces(fullTextWithoutSpaces.length)

      editor.on('transaction', updateLineNumber);
      
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
      editor.off('transaction', updateLineNumber);
    }
  }, [editor])

  if (!editor) return null

  return (
    <div className="w-full flex flex-col lg:flex-row items-center md:justify-between gap-y-2 lg:gap-y-0 px-4 py-2 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 text-sm text-gray-600 dark:text-gray-300">
      {/* Left side - Document stats */}
      <div className="flex flex-wrap items-center justify-center gap-y-2 gap-x-4 md:gap-4">
        <div className="flex items-center gap-1 text-blue-400">
          <FileText className="h-4 w-4" />
          <span className="font-medium">Document</span>
        </div>

        <div className="flex items-center gap-3">
          <span>{wordCount} words</span>
        </div>

        <div>
          {/* offset of -2 */}
          <span>{characterCount-2} characters</span>
        </div>

        <div>
          <span>{characterCountWhiteSpaces} characters excluding spaces</span>
        </div>
      </div>

      {/* Right side - Selection stats */}
      <div className="flex flex-wrap items-center justify-center gap-y-2 gap-x-4 md:gap-4">
        {selectedText.trim() && (
          <>
            <div className="flex items-center gap-1 text-green-400">
              <MousePointer className="h-4 w-4" />
              <span className="font-medium">Selected</span>
            </div>
            <div className="flex items-center gap-3">
              <span>{selectedWordCount} words</span>
              <span>{selectedCharacterCount} characters</span>
            </div>
          </>
        )}
        
        {/* Cursor position indicator */}
        <div className="flex items-center justify-end gap-1">
          <Type className="h-4 w-4" />
          <span>Line {lineNumber}</span>
        </div>
      </div>
    </div>
  )
}
