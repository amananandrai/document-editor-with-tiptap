"use client"
import type { Editor } from "@tiptap/react"
import { Button } from "@/components/ui/button"
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
} from "lucide-react"

type Props = {
  editor: Editor | null
}

export function EditorToolbar({ editor }: Props) {
  if (!editor) return null

  // Font size options in px
  const fontSizes = ["12", "14", "16", "18", "20", "24", "32", "48"]

  // Font family options
  const fontFamilies: Record<string, string> = {
    "System Sans": `system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", sans-serif`,
    Serif: `Georgia, Cambria, "Times New Roman", Times, serif`,
    Monospace: `ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace`,
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
      chain.setParagraph().run()
    } else {
      chain.toggleHeading({ level: lvl }).run()
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

  const handleExportPDF = async () => {
    try {
      const element = editor.view.dom as HTMLElement
      const opt = {
        margin: 0.5,
        filename: "document.pdf",
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
      }
      const { default: html2pdf } = await import("html2pdf.js")
      await html2pdf().set(opt).from(element).save()
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

  return (
    <div
      className="flex flex-wrap items-center gap-3 p-4 bg-white dark:bg-slate-800"
      role="toolbar"
      aria-label="Editor toolbar"
    >
      {/* Headings */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="secondary" size="sm" aria-label="Heading" title="Heading">
            <HeadingIcon className="h-4 w-4" />
            <span className="sr-only">Headings</span>
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
            <span className="sr-only">Font Size</span>
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
            <span className="sr-only">Font Family</span>
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
            <span className="sr-only">Line Spacing</span>
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

      {/* Styles */}
      <div className="flex items-center gap-1">
        <Button
          size="sm"
          variant={editor.isActive("bold") ? "default" : "secondary"}
          onClick={() => editor.chain().focus().toggleBold().run()}
          aria-pressed={editor.isActive("bold")}
          aria-label="Bold"
          title="Bold"
        >
          <BoldIcon className="h-4 w-4" />
        </Button>
        <Button
          size="sm"
          variant={editor.isActive("italic") ? "default" : "secondary"}
          onClick={() => editor.chain().focus().toggleItalic().run()}
          aria-pressed={editor.isActive("italic")}
          aria-label="Italic"
          title="Italic"
        >
          <ItalicIcon className="h-4 w-4" />
        </Button>
        <Button
          size="sm"
          variant={editor.isActive("underline") ? "default" : "secondary"}
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          aria-pressed={editor.isActive("underline")}
          aria-label="Underline"
          title="Underline"
        >
          <UnderlineIcon className="h-4 w-4" />
        </Button>
        <Button
          size="sm"
          variant={editor.isActive("superscript") ? "default" : "secondary"}
          onClick={() => editor.chain().focus().toggleSuperscript().run()}
          aria-pressed={editor.isActive("superscript")}
          aria-label="Superscript"
          title="Superscript"
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
        >
          <SubscriptIcon className="h-4 w-4" />
        </Button>
      </div>

      {/* Lists */}
      <div className="flex items-center gap-1">
        <Button
          size="sm"
          variant={editor.isActive("bulletList") ? "default" : "secondary"}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          aria-pressed={editor.isActive("bulletList")}
          aria-label="Bullet list"
          title="Bullet list"
        >
          <ListIcon className="h-4 w-4" />
        </Button>
        <Button
          size="sm"
          variant={editor.isActive("orderedList") ? "default" : "secondary"}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          aria-pressed={editor.isActive("orderedList")}
          aria-label="Ordered list"
          title="Ordered list"
        >
          <ListOrderedIcon className="h-4 w-4" />
        </Button>
      </div>

      {/* Indentation */}
      <div className="flex items-center gap-1">
        <Button size="sm" variant="secondary" onClick={indent} aria-label="Increase indent" title="Increase indent">
          <IndentIncrease className="h-4 w-4" />
        </Button>
        <Button size="sm" variant="secondary" onClick={outdent} aria-label="Decrease indent" title="Decrease indent">
          <IndentDecrease className="h-4 w-4" />
        </Button>
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

      {/* Export actions: PDF and Word */}
      <div className="ml-auto flex items-center gap-2 pl-4 border-l border-gray-200 dark:border-gray-700">
        <Button
          size="sm"
          variant="outline"
          onClick={handleExportPDF}
          aria-label="Export as PDF"
          title="Export as PDF"
          className="bg-red-50 hover:bg-red-100 text-red-700 border-red-200 dark:bg-red-900/20 dark:hover:bg-red-900/30 dark:text-red-400 dark:border-red-800"
        >
          <FileDown className="h-4 w-4 mr-2" />
          PDF
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={handleExportWord}
          aria-label="Export as Word (.doc)"
          title="Export as Word (.doc)"
          className="bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:hover:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800"
        >
          <FileText className="h-4 w-4 mr-2" />
          Word
        </Button>
      </div>
    </div>
  )
}
