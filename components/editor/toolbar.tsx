"use client";
import React, { useState } from "react";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import type { Editor } from "@tiptap/react";
import { Button } from "@/components/ui/button";
import html2canvas from "html2canvas-pro";
import html2PDF from "jspdf-html2canvas-pro";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { FindReplaceModal } from "./find-replace-modal";
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
  Type,
  Hash,
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
  Search,
  Eraser,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
} from "lucide-react";

type Props = {
  editor: Editor | null;
};

export function EditorToolbar({ editor }: Props) {
  const [isFindReplaceOpen, setIsFindReplaceOpen] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  if (!editor) return null;

  const addEmoji = (emoji: any) => {
    editor.chain().focus().insertContent(emoji.native).run();
    setShowEmojiPicker(false);
  };

  // Font size options in px
  const fontSizes = ["12", "14", "16", "18", "20", "24", "32", "48"];

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
  };
  // Line height options
  const lineHeights = ["1", "1.15", "1.5", "2"];

  // Heading options
  const headingOptions: Array<{ label: string; level: number | "paragraph" }> =
    [
      { label: "Paragraph", level: "paragraph" },
      { label: "Heading 1", level: 1 },
      { label: "Heading 2", level: 2 },
      { label: "Heading 3", level: 3 },
      { label: "Heading 4", level: 4 },
    ];

  const setHeading = (lvl: number | "paragraph") => {
    const chain = editor.chain().focus();
    if (lvl === "paragraph") {
      chain.setParagraph().run();
    } else {
      chain.toggleHeading({ level: lvl as 1 | 2 | 3 | 4 }).run();
    }
  };

  const setFontSize = (sizePx: string) => {
    editor
      .chain()
      .focus()
      .setMark("textStyle", { fontSize: `${sizePx}px` })
      .run();
  };

  const clearFontSize = () => {
    // remove only font-size from textStyle while keeping other styles
    // Strategy: set fontSize undefined by applying empty then unset
    editor
      .chain()
      .focus()
      .setMark("textStyle", { fontSize: undefined as unknown as string })
      .removeEmptyTextStyle()
      .run();
  };

  const setFontFamily = (family: string) => {
    editor.chain().focus().setMark("textStyle", { fontFamily: family }).run();
  };

  const clearFontFamily = () => {
    editor
      .chain()
      .focus()
      .setMark("textStyle", { fontFamily: undefined as unknown as string })
      .removeEmptyTextStyle()
      .run();
  };

  const setLineHeight = (lh: string) => {
    // Apply to paragraph or heading (current node)
    if (editor.isActive("heading")) {
      editor
        .chain()
        .focus()
        .updateAttributes("heading", { lineHeight: lh })
        .run();
    } else {
      editor
        .chain()
        .focus()
        .updateAttributes("paragraph", { lineHeight: lh })
        .run();
    }
  };

  const indent = () => {
    // If in list, use sinkListItem for proper nested list indentation
    if (editor.isActive("listItem")) {
      editor.chain().focus().sinkListItem("listItem").run();
      return;
    }
    // For paragraphs/headings: custom indent attribute
    const type = editor.isActive("heading") ? "heading" : "paragraph";
    const attrs = editor.getAttributes(type);
    const next = Math.min(8, (attrs?.indent || 0) + 1);
    editor.chain().focus().updateAttributes(type, { indent: next }).run();
  };

  const outdent = () => {
    if (editor.isActive("listItem")) {
      editor.chain().focus().liftListItem("listItem").run();
      return;
    }
    const type = editor.isActive("heading") ? "heading" : "paragraph";
    const attrs = editor.getAttributes(type);
    const next = Math.max(0, (attrs?.indent || 0) - 1);
    editor.chain().focus().updateAttributes(type, { indent: next }).run();
  };

  const setTextColor = (color: string) => {
    editor.chain().focus().setColor(color).run();
  };

  const setBackgroundColor = (color: string) => {
    editor.chain().focus().toggleHighlight({ color }).run();
  };

  // Text alignment functions
  const setTextAlign = (alignment: "left" | "center" | "right" | "justify") => {
    editor.chain().focus().setTextAlign(alignment).run();
  };

  // Blockquote functionality
  const toggleBlockquote = () => {
    editor.chain().focus().toggleBlockquote().run();
  };

  // Code functionality
  const toggleCode = () => {
    editor.chain().focus().toggleCode().run();
  };

  const toggleCodeBlock = () => {
    editor.chain().focus().toggleCodeBlock().run();
  };

  // Link functionality
  const setLink = () => {
    const previousUrl = editor.getAttributes("link").href;
    const url = window.prompt("URL", previousUrl);

    // cancelled
    if (url === null) {
      return;
    }

    // empty
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }

    // update link
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  };

  // Table functionality
  const insertTable = () => {
    editor
      .chain()
      .focus()
      .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
      .run();
  };

  const addColumnBefore = () => {
    editor.chain().focus().addColumnBefore().run();
  };

  const addColumnAfter = () => {
    editor.chain().focus().addColumnAfter().run();
  };

  const deleteColumn = () => {
    editor.chain().focus().deleteColumn().run();
  };

  const addRowBefore = () => {
    editor.chain().focus().addRowBefore().run();
  };

  const addRowAfter = () => {
    editor.chain().focus().addRowAfter().run();
  };

  const deleteRow = () => {
    editor.chain().focus().deleteRow().run();
  };

  const deleteTable = () => {
    editor.chain().focus().deleteTable().run();
  };

  const mergeCells = () => {
    editor.chain().focus().mergeCells().run();
  };

  const splitCell = () => {
    editor.chain().focus().splitCell().run();
  };

  const toggleHeaderColumn = () => {
    editor.chain().focus().toggleHeaderColumn().run();
  };

  const toggleHeaderRow = () => {
    editor.chain().focus().toggleHeaderRow().run();
  };

  const toggleHeaderCell = () => {
    editor.chain().focus().toggleHeaderCell().run();
  };

  // Image functionality
  const handleImageUpload = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.multiple = false;

    input.onchange = (event) => {
      const file = (event.target as HTMLInputElement).files?.[0];
      if (file) {
        // Check file size (max 5MB)
        const maxSize = 5 * 1024 * 1024; // 5MB
        if (file.size > maxSize) {
          alert("File size too large. Maximum size is 5MB");
          return;
        }

        // Create a FileReader to convert image to base64
        const reader = new FileReader();

        reader.onload = (event) => {
          const result = event.target?.result as string;
          if (result) {
            // Insert image into editor
            editor.chain().focus().setImage({ src: result }).run();
          }
        };

        reader.readAsDataURL(file);
      }
    };

    input.click();
  };

  const removeImage = () => {
    editor.chain().focus().deleteSelection().run();
  };

  const handleExportPDF = async () => {
    try {
      const element = editor.view.dom as HTMLElement;
      const opt = {
        output: "document.pdf",
        imageType: "image/jpeg",
        imageQuality: 0.98,
        margin: {
          top: 0.5,
          right: 0.5,
          bottom: 0.5,
          left: 0.5,
        },
        html2canvas: {
          scale: 2,
          useCORS: true,
        },
        jsPDF: {
          unit: "in" as const,
          format: "letter" as const,
          orientation: "portrait" as const,
        },
      };
      const { default: html2PDF } = await import("jspdf-html2canvas-pro");
      await html2PDF(element, opt);
    } catch (err) {
      console.error("[v0] Export PDF error:", err);
    }
  };

  const downloadBlob = (
    data: BlobPart | BlobPart[],
    filename: string,
    mime: string
  ) => {
    const parts = Array.isArray(data) ? data : [data];
    const blob = new Blob(parts, { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  const handleExportWord = async () => {
    try {
      const html = editor.getHTML();
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
</html>`;
      downloadBlob(docHtml, "document.doc", "application/msword");
    } catch (err) {
      console.error("[v0] Export Word (.doc) error:", err);
    }
  };

  const handleClear = () => {
    const confirmed = window.confirm(
      "Clear all content from the document? You can undo with Ctrl+Z."
    );
    if (!confirmed) return;
    editor.chain().focus().clearContent().run();
  };

  return (
    <div
      className="flex flex-wrap items-center gap-2 p-4 bg-white dark:bg-slate-800"
      role="toolbar"
      aria-label="Editor toolbar"
    >
      {/* Headings */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="secondary"
            size="sm"
            aria-label="Heading"
            title="Heading"
          >
            <HeadingIcon className="h-4 w-4" />
            <span className="sr-only">Headings</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuLabel>Headings</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {headingOptions.map((opt) => (
            <DropdownMenuItem
              key={opt.label}
              onClick={() => setHeading(opt.level)}
            >
              {opt.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Font size */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="secondary"
            size="sm"
            aria-label="Font size"
            title="Font size"
          >
            <Hash className="h-4 w-4" />
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
          <Button
            variant="secondary"
            size="sm"
            aria-label="Font family"
            title="Font family"
          >
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
              <DropdownMenuRadioItem
                key={label}
                value={family}
                className="font-sans"
                style={{ fontFamily: family }}
              >
                {label}
              </DropdownMenuRadioItem>
            ))}
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Line spacing */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="secondary"
            size="sm"
            aria-label="Line spacing"
            title="Line spacing"
          >
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

      {/* Text Alignment */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="secondary"
            size="sm"
            aria-label="Text alignment"
            title="Text alignment"
          >
            <AlignLeft className="h-4 w-4" />
            <span className="sr-only">Text Alignment</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuLabel>Text Alignment</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setTextAlign("left")}>
            <AlignLeft className="h-4 w-4 mr-2" />
            Left
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setTextAlign("center")}>
            <AlignCenter className="h-4 w-4 mr-2" />
            Center
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setTextAlign("right")}>
            <AlignRight className="h-4 w-4 mr-2" />
            Right
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setTextAlign("justify")}>
            <AlignJustify className="h-4 w-4 mr-2" />
            Justify
          </DropdownMenuItem>
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

      {/* Content blocks */}
      <div className="flex items-center gap-1">
        <Button
          size="sm"
          variant={editor.isActive("blockquote") ? "default" : "secondary"}
          onClick={toggleBlockquote}
          aria-pressed={editor.isActive("blockquote")}
          aria-label="Blockquote"
          title="Blockquote"
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
        >
          <Link className="h-4 w-4" />
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
            className="text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <Minus className="h-4 w-4" />
          </Button>
        )}
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
        <Button
          size="sm"
          variant="secondary"
          onClick={indent}
          aria-label="Increase indent"
          title="Increase indent"
        >
          <IndentIncrease className="h-4 w-4" />
        </Button>
        <Button
          size="sm"
          variant="secondary"
          onClick={outdent}
          aria-label="Decrease indent"
          title="Decrease indent"
        >
          <IndentDecrease className="h-4 w-4" />
        </Button>
      </div>

      {/* Tables */}
      <div className="flex items-center gap-1">
        <Button
          size="sm"
          variant="secondary"
          onClick={insertTable}
          aria-label="Insert table"
          title="Insert table"
        >
          <Table className="h-4 w-4" />
        </Button>

        {/* Table controls dropdown */}
        {editor.isActive("table") && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="secondary"
                size="sm"
                aria-label="Table options"
                title="Table options"
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
        <label
          className="text-xs text-muted-foreground flex items-center gap-1"
          htmlFor="text-color"
        >
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
        <label
          className="text-xs text-muted-foreground flex items-center gap-1"
          htmlFor="bg-color"
        >
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

      {/* Find & Replace */}
      <div className="flex items-center gap-1">
        <Button
          size="sm"
          variant="secondary"
          onClick={() => setIsFindReplaceOpen(true)}
          aria-label="Find and Replace"
          title="Find and Replace"
        >
          <Search className="h-4 w-4" />
        </Button>
      </div>

      {/* Clear content */}
      <div className="flex items-center gap-1">
        <Button
          size="sm"
          variant="outline"
          onClick={handleClear}
          aria-label="Clear content"
          title="Clear content"
          className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200 dark:text-red-400 dark:hover:bg-red-900/30 dark:border-red-800"
        >
          <Eraser className="h-4 w-4" />
        </Button>
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

      {/* Find & Replace Modal */}
      <FindReplaceModal
        editor={editor}
        isOpen={isFindReplaceOpen}
        onClose={() => setIsFindReplaceOpen(false)}
      />
    </div>
  );
}
