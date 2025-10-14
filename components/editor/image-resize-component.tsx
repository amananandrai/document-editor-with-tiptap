'use client'

import React, { useState, useRef, useEffect } from 'react'
import { NodeViewWrapper, type NodeViewProps } from '@tiptap/react'
import { X, Move, RotateCcw } from 'lucide-react'

interface ImageResizeComponentProps extends NodeViewProps {}

export const ImageResizeComponent: React.FC<ImageResizeComponentProps> = ({
  node,
  updateAttributes,
  deleteNode,
  selected,
}) => {
  const [isResizing, setIsResizing] = useState(false)
  const [resizeHandle, setResizeHandle] = useState<string | null>(null)
  const [startPos, setStartPos] = useState({ x: 0, y: 0 })
  const [startSize, setStartSize] = useState({ width: 0, height: 0 })
  const imgRef = useRef<HTMLImageElement>(null)

  const { src, alt, title, width, height } = node.attrs as {
    src: string
    alt?: string
    title?: string
    width?: number
    height?: number
  }

  const handleMouseDown = (e: React.MouseEvent, handle: string) => {
    e.preventDefault()
    e.stopPropagation()
    
    setIsResizing(true)
    setResizeHandle(handle)
    
    const rect = imgRef.current?.getBoundingClientRect()
    if (rect) {
      setStartPos({ x: e.clientX, y: e.clientY })
      setStartSize({ width: rect.width, height: rect.height })
    }
  }

  const handleMouseMove = (e: MouseEvent) => {
    if (!isResizing || !resizeHandle || !imgRef.current) return

    const deltaX = e.clientX - startPos.x
    const deltaY = e.clientY - startPos.y

    let newWidth = startSize.width
    let newHeight = startSize.height

    switch (resizeHandle) {
      case 'se':
        newWidth = Math.max(50, startSize.width + deltaX)
        newHeight = Math.max(50, startSize.height + deltaY)
        break
      case 'sw':
        newWidth = Math.max(50, startSize.width - deltaX)
        newHeight = Math.max(50, startSize.height + deltaY)
        break
      case 'ne':
        newWidth = Math.max(50, startSize.width + deltaX)
        newHeight = Math.max(50, startSize.height - deltaY)
        break
      case 'nw':
        newWidth = Math.max(50, startSize.width - deltaX)
        newHeight = Math.max(50, startSize.height - deltaY)
        break
    }

    updateAttributes({
      width: Math.round(newWidth),
      height: Math.round(newHeight),
    })
  }

  const handleMouseUp = () => {
    setIsResizing(false)
    setResizeHandle(null)
  }

  useEffect(() => {
    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove)
        document.removeEventListener('mouseup', handleMouseUp)
      }
    }
  }, [isResizing, resizeHandle, startPos, startSize])

  const handleRemove = () => {
    deleteNode()
  }

  const handleResetSize = () => {
    updateAttributes({
      width: null,
      height: null,
    })
  }

  return (
    <NodeViewWrapper
      className={`image-wrapper ${selected ? 'selected' : ''} ${isResizing ? 'resizing' : ''}`}
      style={{ display: 'inline-block', position: 'relative' }}
    >
      <div className="image-container" style={{ position: 'relative', display: 'inline-block' }}>
        <img
          ref={imgRef}
          src={src}
          alt={alt || ''}
          title={title || ''}
          style={{
            width: width ? `${width}px` : 'auto',
            height: height ? `${height}px` : 'auto',
            maxWidth: '100%',
            display: 'block',
          }}
          draggable={false}
        />
        
        {/* Resize handles */}
        {selected && (
          <>
            {/* Corner handles */}
            <div
              className="resize-handle resize-se"
              onMouseDown={(e) => handleMouseDown(e, 'se')}
            />
            <div
              className="resize-handle resize-sw"
              onMouseDown={(e) => handleMouseDown(e, 'sw')}
            />
            <div
              className="resize-handle resize-ne"
              onMouseDown={(e) => handleMouseDown(e, 'ne')}
            />
            <div
              className="resize-handle resize-nw"
              onMouseDown={(e) => handleMouseDown(e, 'nw')}
            />
            
            {/* Control buttons */}
            <div className="image-controls">
              <button
                className="image-control-btn remove-btn"
                onClick={handleRemove}
                title="Remove image"
              >
                <X size={14} />
              </button>
              <button
                className="image-control-btn reset-btn"
                onClick={handleResetSize}
                title="Reset size"
              >
                <RotateCcw size={14} />
              </button>
            </div>
          </>
        )}
      </div>
    </NodeViewWrapper>
  )
}
