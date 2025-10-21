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
  const [isLoaded, setIsLoaded] = useState(false)
  const [hasError, setHasError] = useState(false)
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
  const handleImageLoad = () => {
    setIsLoaded(true)
    setHasError(false)
  }
  const handleImageError = () => {
    setIsLoaded(false)
    setHasError(true)
  }
  useEffect(() => {
    setIsLoaded(false)
    setHasError(false)
  }, [src])
  return (
    <NodeViewWrapper
      className={`image-wrapper ${selected ? 'selected' : ''} ${isResizing ? 'resizing' : ''}`}
      style={{ display: 'inline-block', position: 'relative' }}
    >
      <div className="image-container" style={{ position: 'relative', display: 'inline-block' }}>
        {!isLoaded && !hasError && (
          <div
            style={{
              width: width ? `${width}px` : '200px',
              height: height ? `${height}px` : '150px',
              maxWidth: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#f9fafb',
              border: '1px solid #e5e7eb',
              borderRadius: '0.5rem',
              color: '#6b7280',
            }}
          >
            <div className="flex items-center space-x-2">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
              <span className="text-sm">Loading...</span>
            </div>
          </div>
        )}
        {hasError && (
          <div
            style={{
              width: width ? `${width}px` : '200px',
              height: height ? `${height}px` : '150px',
              maxWidth: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#f3f4f6',
              border: '2px dashed #d1d5db',
              borderRadius: '0.5rem',
              color: '#6b7280',
              textAlign: 'center',
              padding: '1rem',
            }}
          >
            <p className="text-sm font-medium mb-2">Failed to load image</p>
            <button
              onClick={() => {
                setHasError(false)
                setIsLoaded(false)
                if (imgRef.current) {
                  imgRef.current.src = src
                }
              }}
              className="px-3 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            >
              Retry
            </button>
          </div>
        )}
        <img
          ref={imgRef}
          src={src}
          alt=""
          title=""
          style={{
            width: width ? `${width}px` : 'auto',
            height: height ? `${height}px` : 'auto',
            maxWidth: '100%',
            display: isLoaded ? 'block' : 'none',
          }}
          draggable={false}
          onLoad={handleImageLoad}
          onError={handleImageError}
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
