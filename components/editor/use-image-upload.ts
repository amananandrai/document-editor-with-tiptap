'use client'

import React, { useCallback } from 'react'
import type { Editor } from '@tiptap/react'

export function useImageUpload(editor: Editor | null) {
  const handleImageUpload = useCallback((file: File) => {
    if (!editor) return

    // Check if file is an image
    if (!file.type.startsWith('image/')) {
      console.warn('File is not an image')
      return
    }

    // Check file size (max 5MB)
    const maxSize = 5 * 1024 * 1024 // 5MB
    if (file.size > maxSize) {
      console.warn('File size too large. Maximum size is 5MB')
      return
    }

    // Create a FileReader to convert image to base64
    const reader = new FileReader()
    
    reader.onload = (event) => {
      const result = event.target?.result as string
      if (result) {
        // Insert image into editor
        editor.chain().focus().setImage({ src: result }).run()
      }
    }
    
    reader.onerror = () => {
      console.error('Error reading file')
    }
    
    // Read file as data URL (base64)
    reader.readAsDataURL(file)
  }, [editor])

  const handleDrop = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    
    const files = event.dataTransfer?.files
    if (!files || files.length === 0) return
    
    // Handle multiple files
    Array.from(files).forEach(file => {
      handleImageUpload(file)
    })
  }, [handleImageUpload])

  const handleDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    // Add visual feedback for drag over
    const editorElement = editor?.view.dom as HTMLElement
    if (editorElement) {
      editorElement.classList.add('drag-over')
    }
  }, [editor])

  const handleDragLeave = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    // Remove visual feedback
    const editorElement = editor?.view.dom as HTMLElement
    if (editorElement) {
      editorElement.classList.remove('drag-over')
    }
  }, [editor])

  const handlePaste = useCallback((event: React.ClipboardEvent<HTMLDivElement>) => {
    const items = event.clipboardData?.items
    if (!items) return

    Array.from(items).forEach(item => {
      if (item.type.startsWith('image/')) {
        const file = item.getAsFile()
        if (file) {
          event.preventDefault()
          handleImageUpload(file)
        }
      }
    })
  }, [handleImageUpload])

  return {
    handleDrop,
    handleDragOver,
    handleDragLeave,
    handlePaste,
    handleImageUpload,
  }
}
