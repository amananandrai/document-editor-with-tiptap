"use client"
import type { Editor } from "@tiptap/react"
import { Button } from "@/components/ui/button"
import html2canvas from 'html2canvas-pro';
import html2PDF from 'jspdf-html2canvas-pro';
import { EmojiPicker } from "./emoji-picker"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  BoldIcon,
  ItalicIcon,
  UnderlineIcon,
  SuperscriptIcon,
  SubscriptIcon,
  ListIcon,
  ListOrderedIcon,
  IndentIncrease,
  IndentDecrease,
  HeadingIcon,
  TextIcon,
  TypeIcon,
  BetweenVerticalStart,
  PaletteIcon,
  HighlighterIcon,
  FileDown,
  FileText,
  Quote,
  Code,
  Link,
  Table,
  Plus,
  Minus,
  MoreHorizontal,
  Image,
  Upload,
  AtSign,
  ChevronDown,
} from "lucide-react"
import { useState } from "react"

type Props = {
  editor: Editor | null
}

export function EditorToolbar({ editor }: Props) {
  const [isExpanded, setIsExpanded] = useState(false)
  
  if (!editor) return null

  // Font size options in px
  const fontSizes = ["12", "14", "16", "18", "20", "24", "32", "48"]

  // Font family options
  const fontFamilies: Record<string, string> = {
  "System Sans": `system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", sans-serif`,
  Serif: `Georgia, Cambria, "Times New Roman", Times, serif`,
  Monospace: `ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace`,
  Cursive: `cursive, system-ui, sans-serif`,
  Arial: "Arial, Helvetica, sans-serif",
  Verdana: "Verdana, Geneva, sans-serif",
  Tahoma: "Tahoma, Geneva, sans-serif",
  "Trebuchet MS": "'Trebuchet MS', Helvetica, sans-serif",
  "Times New Roman": "'Times New Roman', Times, serif",
  "Courier New": "'Courier New', Courier, monospace",
  "Lucida Console": "'Lucida Console', Monaco, monospace",
  "Palatino Linotype": "'Palatino Linotype', 'Book Antiqua', Palatino, serif",
  }

  // Line height options
  const lineHeights = ["1", "1.15", "1.5", "2"]

  // Heading options
  const headingOptions: Array<{ label: string; level: number | "paragraph" }> = [
    { label: "Paragraph", level: "paragraph" },
    { label: "Heading 1", level: 1 },
    { label: "Heading 2", level: 2 },
    { label: "Heading 3", level: 3 },
    { label: "Heading 4", level: 4 },
  ]

  const setHeading = (lvl: number | "paragraph") => {
    const chain = editor.chain().focus()
    if (lvl === "paragraph") {
      chain.setNode('paragraph').run()
    } else {
      chain.setNode('heading', { level: lvl as 1 | 2 | 3 | 4 }).run()
    }
  }

  const setFontSize = (sizePx: string) => {
    editor
      .chain()
      .focus()
      .setMark("textStyle", { fontSize: `${sizePx}px` })
      .run()
  }

  const clearFontSize = () => {
    // remove only font-size from textStyle while keeping other styles
    // Strategy: set fontSize undefined by applying empty then unset
    editor
      .chain()
      .focus()
      .setMark("textStyle", { fontSize: undefined as unknown as string })
      .removeEmptyTextStyle()
      .run()
  }

  const setFontFamily = (family: string) => {
    editor.chain().focus().setMark("textStyle", { fontFamily: family }).run()
  }

  const clearFontFamily = () => {
    editor
      .chain()
      .focus()
      .setMark("textStyle", { fontFamily: undefined as unknown as string })
      .removeEmptyTextStyle()
      .run()
  }

  const setLineHeight = (lh: string) => {
    // Apply to paragraph or heading (current node)
    if (editor.isActive("heading")) {
      editor.chain().focus().updateAttributes("heading", { lineHeight: lh }).run()
    } else {
      editor.chain().focus().updateAttributes("paragraph", { lineHeight: lh }).run()
    }
  }

  const indent = () => {
    // If in list, use sinkListItem for proper nested list indentation
    if (editor.isActive("listItem")) {
      editor.chain().focus().sinkListItem("listItem").run()
      return
    }
    // For paragraphs/headings: custom indent attribute
    const type = editor.isActive("heading") ? "heading" : "paragraph"
    const attrs = editor.getAttributes(type)
    const next = Math.min(8, (attrs?.indent || 0) + 1)
    editor.chain().focus().updateAttributes(type, { indent: next }).run()
  }

  const outdent = () => {
    if (editor.isActive("listItem")) {
      editor.chain().focus().liftListItem("listItem").run()
      return
    }
    const type = editor.isActive("heading") ? "heading" : "paragraph"
    const attrs = editor.getAttributes(type)
    const next = Math.max(0, (attrs?.indent || 0) - 1)
    editor.chain().focus().updateAttributes(type, { indent: next }).run()
  }

  const setTextColor = (color: string) => {
    editor.chain().focus().setColor(color).run()
  }

  const setBackgroundColor = (color: string) => {
    editor.chain().focus().toggleHighlight({ color }).run()
  }

  // Blockquote functionality
  const toggleBlockquote = () => {
    editor.chain().focus().toggleBlockquote().run()
  }

  // Code functionality
  const toggleCode = () => {
    editor.chain().focus().toggleCode().run()
  }

  const toggleCodeBlock = () => {
    editor.chain().focus().toggleCodeBlock().run()
  }

  // Link functionality
  const setLink = () => {
    const previousUrl = editor.getAttributes('link').href
    const url = window.prompt('URL', previousUrl)

    // cancelled
    if (url === null) {
      return
    }

    // empty
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run()
      return
    }

    // update link
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
  }

  // Table functionality
  const insertTable = (rows: number = 3, cols: number = 3) => {
    editor.chain().focus().insertTable({ rows, cols, withHeaderRow: true }).run()
  }

  const addColumnBefore = () => {
    editor.chain().focus().addColumnBefore().run()
  }

  const addColumnAfter = () => {
    editor.chain().focus().addColumnAfter().run()
  }

  const deleteColumn = () => {
    editor.chain().focus().deleteColumn().run()
  }

  const addRowBefore = () => {
    editor.chain().focus().addRowBefore().run()
  }

  const addRowAfter = () => {
    editor.chain().focus().addRowAfter().run()
  }

  const deleteRow = () => {
    editor.chain().focus().deleteRow().run()
  }

  const deleteTable = () => {
    editor.chain().focus().deleteTable().run()
  }

  const mergeCells = () => {
    editor.chain().focus().mergeCells().run()
  }

  const splitCell = () => {
    editor.chain().focus().splitCell().run()
  }

  const toggleHeaderColumn = () => {
    editor.chain().focus().toggleHeaderColumn().run()
  }

  const toggleHeaderRow = () => {
    editor.chain().focus().toggleHeaderRow().run()
  }

  const toggleHeaderCell = () => {
    editor.chain().focus().toggleHeaderCell().run()
  }

  // Image functionality
  const handleImageUpload = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'image/*'
    input.multiple = false
    
    input.onchange = (event) => {
      const file = (event.target as HTMLInputElement).files?.[0]
      if (file) {
        // Check file size (max 5MB)
        const maxSize = 5 * 1024 * 1024 // 5MB
        if (file.size > maxSize) {
          alert('File size too large. Maximum size is 5MB')
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
        
        reader.readAsDataURL(file)
      }
    }
    
    input.click()
  }

  const removeImage = () => {
    editor.chain().focus().deleteSelection().run()
  }

  const handleExportPDF = async () => {
    try {
      const element = editor.view.dom as HTMLElement
      const opt = {
          output: "document.pdf",
          imageType: "image/jpeg",      
          imageQuality: 0.98,           
          margin: { 
              top: 0.5, 
              right: 0.5, 
              bottom: 0.5, 
              left: 0.5 
          },
          html2canvas: { 
              scale: 2, 
              useCORS: true 
          },
          jsPDF: { 
              unit: "in" as const, 
              format: "letter", 
              orientation: "portrait" as const 
          },
      };
      const { default: html2PDF } = await import("jspdf-html2canvas-pro")
      await html2PDF(element, opt);
    } catch (err) {
      console.error("[v0] Export PDF error:", err)
    }
  }

  const downloadBlob = (data: BlobPart | BlobPart[], filename: string, mime: string) => {
    const parts = Array.isArray(data) ? data : [data]
    const blob = new Blob(parts, { type: mime })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    a.remove()
    URL.revokeObjectURL(url)
  }

  const handleExportWord = async () => {
    try {
      const html = editor.getHTML()
      // Minimal Word-compatible HTML wrapper
      const docHtml = `
<!DOCTYPE html>
<html xmlns:o="urn:schemas-microsoft-com:office:office"
      xmlns:w="urn:schemas-microsoft-com:office:word"
      xmlns="http://www.w3.org/TR/REC-html40">
  <head>
    <meta charset="utf-8" />
    <title>Document</title>
    <style>
      body { font-family: system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif; }
      h1,h2,h3,h4,h5 { line-height: 1.25; }
      p { line-height: 1.5; }
    </style>
  </head>
  <body>
    ${html}
  </body>
</html>`
      downloadBlob(docHtml, "document.doc", "application/msword")
    } catch (err) {
      console.error("[v0] Export Word (.doc) error:", err)
    }
  }

  // Emoji picker functionality
  const handleEmojiSelect = (emoji: string) => {
    editor.chain().focus().insertContent(emoji).run()
  }

  // Mentions functionality
  const insertMention = () => {
    editor.chain().focus().insertContent('@').run()
  }

  return (
    <div
      className="bg-white dark:bg-slate-800"
      role="toolbar"
      aria-label="Editor toolbar"
    >
      {/* Mobile Toolbar - Always visible basic tools */}
      <div className="flex flex-wrap items-center gap-1 sm:gap-2 p-2 sm:p-4">
        {/* Basic formatting - always visible on mobile */}
        <div className="flex items-center gap-1">
          <Button
            size="sm"
            variant={editor.isActive("bold") ? "default" : "secondary"}
            onClick={(e) => {
              e.preventDefault()
              editor.chain().focus().toggleMark('bold').run()
            }}
            onMouseDown={(e) => e.preventDefault()}
            aria-pressed={editor.isActive("bold")}
            aria-label="Bold"
            title="Bold"
            className="h-8 w-8 p-0"
          >
            <BoldIcon className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant={editor.isActive("italic") ? "default" : "secondary"}
            onClick={(e) => {
              e.preventDefault()
              editor.chain().focus().toggleMark('italic').run()
            }}
            onMouseDown={(e) => e.preventDefault()}
            aria-pressed={editor.isActive("italic")}
            aria-label="Italic"
            title="Italic"
            className="h-8 w-8 p-0"
          >
            <ItalicIcon className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant={editor.isActive("underline") ? "default" : "secondary"}
            onClick={(e) => {
              e.preventDefault()
              editor.chain().focus().toggleMark('underline').run()
            }}
            onMouseDown={(e) => e.preventDefault()}
            aria-pressed={editor.isActive("underline")}
            aria-label="Underline"
            title="Underline"
            className="h-8 w-8 p-0"
          >
            <UnderlineIcon className="h-4 w-4" />
          </Button>
        </div>

        {/* Lists - always visible on mobile */}
        <div className="flex items-center gap-1">
          <Button
            size="sm"
            variant={editor.isActive("bulletList") ? "default" : "secondary"}
            onClick={(e) => {
              e.preventDefault()
              editor.chain().focus().toggleBulletList().run()
            }}
            onMouseDown={(e) => e.preventDefault()}
            aria-pressed={editor.isActive("bulletList")}
            aria-label="Bullet list"
            title="Bullet list"
            className="h-8 w-8 p-0"
          >
            <ListIcon className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant={editor.isActive("orderedList") ? "default" : "secondary"}
            onClick={(e) => {
              e.preventDefault()
              editor.chain().focus().toggleOrderedList().run()
            }}
            onMouseDown={(e) => e.preventDefault()}
            aria-pressed={editor.isActive("orderedList")}
            aria-label="Ordered list"
            title="Ordered list"
            className="h-8 w-8 p-0"
          >
            <ListOrderedIcon className="h-4 w-4" />
          </Button>
        </div>

        {/* Mobile expand/collapse button */}
        <Button
          size="sm"
          variant="secondary"
          onClick={(e) => {
            e.preventDefault()
            setIsExpanded(!isExpanded)
          }}
          onMouseDown={(e) => e.preventDefault()}
          className="md:hidden h-8 px-2"
        >
          <MoreHorizontal className="h-4 w-4 mr-1" />
          <ChevronDown className={`h-3 w-3 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
        </Button>

        {/* Export buttons - always visible */}
        <div className="ml-auto flex items-center gap-1 sm:gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={(e) => {
              e.preventDefault()
              handleExportPDF()
            }}
            onMouseDown={(e) => e.preventDefault()}
            aria-label="Export as PDF"
            title="Export as PDF"
            className="h-8 px-2 text-xs bg-red-50 hover:bg-red-100 text-red-700 border-red-200 dark:bg-red-900/20 dark:hover:bg-red-900/30 dark:text-red-400 dark:border-red-800"
          >
            <FileDown className="h-3 w-3 sm:mr-1" />
            <span className="hidden sm:inline">PDF</span>
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={(e) => {
              e.preventDefault()
              handleExportWord()
            }}
            onMouseDown={(e) => e.preventDefault()}
            aria-label="Export as Word (.doc)"
            title="Export as Word (.doc)"
            className="h-8 px-2 text-xs bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:hover:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800"
          >
            <FileText className="h-3 w-3 sm:mr-1" />
            <span className="hidden sm:inline">Word</span>
          </Button>
        </div>
      </div>

      {/* Expanded mobile toolbar / Desktop toolbar */}
      <div className={`${isExpanded ? 'block' : 'hidden'} md:block border-t border-gray-200 dark:border-gray-700`}>
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 p-2 sm:p-4">
          {/* Headings */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" size="sm" aria-label="Heading" title="Heading">
                <HeadingIcon className="h-4 w-4" />
                <span className="hidden sm:inline ml-1">Heading</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuLabel>Headings</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {headingOptions.map((opt) => (
                <DropdownMenuItem key={opt.label} onClick={() => setHeading(opt.level)}>
                  {opt.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Font size */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" size="sm" aria-label="Font size" title="Font size">
                <TextIcon className="h-4 w-4" />
                <span className="hidden sm:inline ml-1">Size</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuLabel>Font Size</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={clearFontSize}>Default</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuRadioGroup
                value={String(editor.getAttributes("textStyle")?.fontSize || "")}
                onValueChange={(v) => setFontSize(v)}
              >
                {fontSizes.map((s) => (
                  <DropdownMenuRadioItem key={s} value={`${s}px`}>
                    {s}px
                  </DropdownMenuRadioItem>
                ))}
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Font family */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" size="sm" aria-label="Font family" title="Font family">
                <TypeIcon className="h-4 w-4" />
                <span className="hidden sm:inline ml-1">Font</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuLabel>Font Family</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={clearFontFamily}>Default</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuRadioGroup
                value={String(editor.getAttributes("textStyle")?.fontFamily || "")}
                onValueChange={(v) => setFontFamily(v)}
              >
                {Object.entries(fontFamilies).map(([label, family]) => (
                  <DropdownMenuRadioItem key={label} value={family} className="font-sans">
                    {label}
                  </DropdownMenuRadioItem>
                ))}
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Line spacing */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" size="sm" aria-label="Line spacing" title="Line spacing">
                <BetweenVerticalStart className="h-4 w-4" />
                <span className="hidden sm:inline ml-1">Spacing</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuLabel>Line Spacing</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {lineHeights.map((lh) => (
                <DropdownMenuItem key={lh} onClick={() => setLineHeight(lh)}>
                  {lh}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Additional styles */}
          <div className="flex items-center gap-1">
            <Button
              size="sm"
              variant={editor.isActive("superscript") ? "default" : "secondary"}
              onClick={() => editor.chain().focus().toggleSuperscript().run()}
              aria-pressed={editor.isActive("superscript")}
              aria-label="Superscript"
              title="Superscript"
              className="h-8 w-8 p-0"
            >
              <SuperscriptIcon className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              variant={editor.isActive("subscript") ? "default" : "secondary"}
              onClick={() => editor.chain().focus().toggleSubscript().run()}
              aria-pressed={editor.isActive("subscript")}
              aria-label="Subscript"
              title="Subscript"
              className="h-8 w-8 p-0"
            >
              <SubscriptIcon className="h-4 w-4" />
            </Button>
          </div>

          {/* Content blocks */}
          <div className="flex items-center gap-1">
            <Button
              size="sm"
              variant={editor.isActive("blockquote") ? "default" : "secondary"}
              onClick={toggleBlockquote}
              aria-pressed={editor.isActive("blockquote")}
              aria-label="Blockquote"
              title="Blockquote"
              className="h-8 w-8 p-0"
            >
              <Quote className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              variant={editor.isActive("code") ? "default" : "secondary"}
              onClick={toggleCode}
              aria-pressed={editor.isActive("code")}
              aria-label="Inline code"
              title="Inline code"
              className="h-8 w-8 p-0"
            >
              <Code className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              variant={editor.isActive("codeBlock") ? "default" : "secondary"}
              onClick={toggleCodeBlock}
              aria-pressed={editor.isActive("codeBlock")}
              aria-label="Code block"
              title="Code block"
              className="h-8 w-8 p-0"
            >
              <Code className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              variant={editor.isActive("link") ? "default" : "secondary"}
              onClick={setLink}
              aria-pressed={editor.isActive("link")}
              aria-label="Link"
              title="Add/Edit link"
              className="h-8 w-8 p-0"
            >
              <Link className="h-4 w-4" />
            </Button>
          </div>

          {/* Emoji and Mentions */}
          <div className="flex items-center gap-1">
            <EmojiPicker onEmojiSelect={handleEmojiSelect} />
            <Button
              size="sm"
              variant="secondary"
              onClick={insertMention}
              aria-label="Insert mention"
              title="Insert mention (@username)"
              className="h-8 w-8 p-0"
            >
              <AtSign className="h-4 w-4" />
            </Button>
          </div>

          {/* Images */}
          <div className="flex items-center gap-1">
            <Button
              size="sm"
              variant="secondary"
              onClick={handleImageUpload}
              aria-label="Insert image"
              title="Insert image"
              className="h-8 w-8 p-0"
            >
              <Image className="h-4 w-4" />
            </Button>
            {editor.isActive("image") && (
              <Button
                size="sm"
                variant="outline"
                onClick={removeImage}
                aria-label="Remove image"
                title="Remove image"
                className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <Minus className="h-4 w-4" />
              </Button>
            )}
          </div>

          {/* Indentation */}
          <div className="flex items-center gap-1">
            <Button size="sm" variant="secondary" onClick={indent} aria-label="Increase indent" title="Increase indent" className="h-8 w-8 p-0">
              <IndentIncrease className="h-4 w-4" />
            </Button>
            <Button size="sm" variant="secondary" onClick={outdent} aria-label="Decrease indent" title="Decrease indent" className="h-8 w-8 p-0">
              <IndentDecrease className="h-4 w-4" />
            </Button>
          </div>

          {/* Tables */}
          <div className="flex items-center gap-1">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  size="sm"
                  variant="secondary"
                  aria-label="Insert table"
                  title="Insert table"
                  className="h-8 w-8 p-0"
                >
                  <Table className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                <DropdownMenuLabel>Insert Table</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <div className="p-2">
                  <div className="text-sm text-muted-foreground mb-2">Select table size:</div>
                  <div className="grid grid-cols-5 gap-1">
                    {Array.from({ length: 5 }, (_, row) => (
                      <div key={row} className="flex flex-col gap-1">
                        {Array.from({ length: 5 }, (_, col) => (
                          <button
                            key={`${row}-${col}`}
                            onClick={() => insertTable(row + 1, col + 1)}
                            className="w-6 h-6 border border-gray-300 hover:bg-blue-100 hover:border-blue-500 rounded text-xs flex items-center justify-center"
                            title={`${row + 1} × ${col + 1} table`}
                          >
                            {row + 1}×{col + 1}
                          </button>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
            
            {/* Table controls dropdown - only show when cursor is in a table */}
            {editor.isActive("table") && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="secondary" 
                    size="sm" 
                    aria-label="Table options" 
                    title="Table options" 
                    className="h-8 w-8 p-0"
                    onMouseDown={(e) => e.preventDefault()}
                  >
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                  <DropdownMenuLabel>Table Options</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  
                  <DropdownMenuLabel>Columns</DropdownMenuLabel>
                  <DropdownMenuItem onClick={addColumnBefore}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Column Before
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={addColumnAfter}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Column After
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={deleteColumn}>
                    <Minus className="h-4 w-4 mr-2" />
                    Delete Column
                  </DropdownMenuItem>
                  
                  <DropdownMenuSeparator />
                  <DropdownMenuLabel>Rows</DropdownMenuLabel>
                  <DropdownMenuItem onClick={addRowBefore}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Row Before
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={addRowAfter}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Row After
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={deleteRow}>
                    <Minus className="h-4 w-4 mr-2" />
                    Delete Row
                  </DropdownMenuItem>
                  
                  <DropdownMenuSeparator />
                  <DropdownMenuLabel>Cells</DropdownMenuLabel>
                  <DropdownMenuItem onClick={mergeCells}>
                    Merge Cells
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={splitCell}>
                    Split Cell
                  </DropdownMenuItem>
                  
                  <DropdownMenuSeparator />
                  <DropdownMenuLabel>Headers</DropdownMenuLabel>
                  <DropdownMenuItem onClick={toggleHeaderRow}>
                    Toggle Header Row
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={toggleHeaderColumn}>
                    Toggle Header Column
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={toggleHeaderCell}>
                    Toggle Header Cell
                  </DropdownMenuItem>
                  
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={deleteTable} className="text-red-600">
                    <Minus className="h-4 w-4 mr-2" />
                    Delete Table
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>

          {/* Colors */}
          <div className="flex items-center gap-2 pl-1">
            <label className="text-xs text-muted-foreground flex items-center gap-1" htmlFor="text-color">
              <PaletteIcon className="h-4 w-4" />
              <span className="sr-only">Text color</span>
            </label>
            <input
              id="text-color"
              type="color"
              onChange={(e) => setTextColor(e.currentTarget.value)}
              className="h-8 w-8 cursor-pointer rounded border bg-background p-1"
              aria-label="Text color"
              title="Text color"
            />
            <label className="text-xs text-muted-foreground flex items-center gap-1" htmlFor="bg-color">
              <HighlighterIcon className="h-4 w-4" />
              <span className="sr-only">Highlight color</span>
            </label>
            <input
              id="bg-color"
              type="color"
              onChange={(e) => setBackgroundColor(e.currentTarget.value)}
              className="h-8 w-8 cursor-pointer rounded border bg-background p-1"
              aria-label="Background color"
              title="Background color"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
