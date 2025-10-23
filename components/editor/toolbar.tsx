"use client";
import React, { useState, useRef, useEffect } from "react";
import Picker from "@emoji-mart/react";
import data from "@emoji-mart/data";
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
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
} from "@/components/ui/dropdown-menu";
import { FindReplaceModal } from "./find-replace-modal";
import { LinkModal } from "./link-modal";
import { useFocusMode } from "../focus-mode-context";
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
  Quote,
  Code,
  CodeXml,
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
  CodeXmlIcon,
  Layout,
  FileX,
  FileText,
  File,
  FileCode,
  FileOutput,
  FileType2,
  Monitor,
  Square,
  PaintRoller,
  RotateCcw,
  SmilePlus
} from "lucide-react";
import { Eye } from "lucide-react";
import CustomColorPicker from '../ui/colorpicker'
import { toast } from "sonner";
import { Input } from "@/components/ui/input";

type Props = {
  editor: Editor | null;
  isPageLayout?: boolean;
  onTogglePageLayout?: () => void;
  isMultiPageMode?: boolean;
  onToggleMultiPageMode?: () => void;
  pageMargin?: number;
  onChangePageMargin?: (marginPx: number) => void;
};

export function EditorToolbar({ 
  editor, 
  isPageLayout = false, 
  onTogglePageLayout,
  isMultiPageMode = false,
  onToggleMultiPageMode
  ,pageMargin = 64,
  onChangePageMargin
}: Props) {
  const [isFindReplaceOpen, setIsFindReplaceOpen] = useState(false);
  const { isFocusMode, toggleFocusMode } = useFocusMode();
  // Text Color Picker Props
  const textColorRef = useRef<HTMLDivElement>(null);
  const [showTextColorPicker, setShowTextColorPicker] = useState(false);
  const [activeTextColor, setActiveTextColor] = useState("#000000"); // default color on the picker
  // Background Color Picker Props
  const [showBGColorPicker, setShowBGColorPicker] = useState(false);
  const [activeBGColor, setActiveBGColor] = useState("#FFFFFF"); // default color on the picker
  const bgColorRef = useRef<HTMLDivElement>(null);

  // Copy Format state
  const [copiedFormat, setCopiedFormat] = useState<any>(null);
  const [isFormatPainterActive, setIsFormatPainterActive] = useState(false);

  // Table state to check if table is active or not
  const [isTableActive, setIsTableActive] = useState(false)

  const [manualFontSize, setManualFontSize] = useState<string>("");

  // Manual table insert inputs (empty -> show placeholder "3")
  const [manualTableRows, setManualTableRows] = useState<string>("");
  const [manualTableCols, setManualTableCols] = useState<string>("");
  const [tableHover, setTableHover] = useState<{ rows: number; cols: number }>({ rows: 0, cols: 0 });
  const [selectedTable, setSelectedTable] = useState<{ rows: number; cols: number } | null>(null);

  // Close pickers when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
  
      // If clicked outside both pickers and their buttons
      if (
        textColorRef.current &&
        !textColorRef.current.contains(target)
      ) {
        setShowTextColorPicker(false);
      }
  
      if (
        bgColorRef.current &&
        !bgColorRef.current.contains(target)
      ) {
        setShowBGColorPicker(false);
      }
    };
  
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if(!editor) return
    const updateTableActiveState = () => {
      setIsTableActive(editor.isActive("table"))
    }
    editor.on("transaction", updateTableActiveState)
    editor.on("focus", updateTableActiveState)
    editor.on("blur", updateTableActiveState)
    editor.on("selectionUpdate", updateTableActiveState)

    return () => {
      editor.off('transaction', updateTableActiveState);
      editor.off('focus', updateTableActiveState);
      editor.off('blur', updateTableActiveState);
      editor.off('selectionUpdate', updateTableActiveState);
    }
  }, [editor])

  // Add click handler to editor for format painter
  useEffect(() => {
    if (!editor || !isFormatPainterActive) return;

    const handleClick = () => {
      // Small delay to ensure selection is updated
      setTimeout(() => {
        if (!isFormatPainterActive || !copiedFormat || !editor) return;

        const { marks, attributes } = copiedFormat;
        let chain = editor.chain().focus();

        // Clear existing formatting first to avoid conflicts
        chain = chain.unsetAllMarks().removeEmptyTextStyle();

        // Apply marks
        Object.entries(marks).forEach(([markType, value]) => {
          switch (markType) {
            case "bold":
              if (value) chain = chain.setBold();
              break;
            case "italic":
              if (value) chain = chain.setItalic();
              break;
            case "underline":
              if (value) chain = chain.setUnderline();
              break;
            case "superscript":
              if (value) chain = chain.setSuperscript();
              break;
            case "subscript":
              if (value) chain = chain.setSubscript();
              break;
            case "code":
              if (value) chain = chain.setCode();
              break;
            case "textStyle":
              if (value && typeof value === "object") {
                chain = chain.setMark("textStyle", value);
              }
              break;
            case "color":
              if (value && typeof value === "string") chain = chain.setColor(value);
              break;
            case "highlight":
              if (value && typeof value === "object" && "color" in value && value.color) {
                chain = chain.toggleHighlight({ color: value.color as string });
              }
              break;
            case "link":
              if (value && typeof value === "object" && "href" in value && value.href) {
                chain = chain.setLink({ href: value.href as string });
              }
              break;
          }
        });

        // Apply node attributes
        if (attributes.heading) {
          const level = attributes.heading.level;
          if (level) {
            chain = chain.toggleHeading({ level });
          }
          // Apply other heading attributes
          Object.entries(attributes.heading).forEach(([attr, val]) => {
            if (attr !== "level" && val !== null && val !== undefined) {
              chain = chain.updateAttributes("heading", { [attr]: val });
            }
          });
        } else if (attributes.paragraph) {
          chain = chain.setParagraph();
          // Apply paragraph attributes
          Object.entries(attributes.paragraph).forEach(([attr, val]) => {
            if (val !== null && val !== undefined) {
              chain = chain.updateAttributes("paragraph", { [attr]: val });
            }
          });
        }

        // Apply text alignment
        if (attributes.textAlign) {
          chain = chain.setTextAlign(attributes.textAlign);
        }

        chain.run();

        // Deactivate format painter after applying (single use like MS Word)
        setIsFormatPainterActive(false);
        setCopiedFormat(null);
      }, 10);
    };

    const editorElement = editor.view.dom;
    editorElement.addEventListener('click', handleClick);

    return () => {
      editorElement.removeEventListener('click', handleClick);
    };
  }, [editor, isFormatPainterActive, copiedFormat]);
  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);
  const [linkModalData, setLinkModalData] = useState<{
    initialUrl: string;
    initialText: string;
    hasSelection: boolean;
  }>({
    initialUrl: "",
    initialText: "",
    hasSelection: false,
  });

  if (!editor) return null;

  const addEmoji = (emoji: any) => {
    editor.chain().focus().insertContent(emoji.native).run();
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
  const headingOptions: Array<{ label: string; level: number | "paragraph", size: string }> =
    [
      { label: "Paragraph", level: "paragraph", size: "16" },
      { label: "Heading 1", level: 1, size: "32" },
      { label: "Heading 2", level: 2, size: "24" },
      { label: "Heading 3", level: 3, size: "18" },
      { label: "Heading 4", level: 4, size: "16" },
    ];

  const setHeading = (lvl: number | "paragraph", size: string) => {
    editor.chain().focus().unsetFontSize();
    if (lvl === "paragraph") {
    editor
      .chain()
      .focus()
      .setParagraph()
      // Apply the font size for the paragraph
      .setMark("textStyle", { fontSize: `${size}px` })
      .run();
  } else {
    editor
      .chain()
      .focus()
      .toggleHeading({ level: lvl as 1 | 2 | 3 | 4 })
      // Apply the font size for the heading
      .setMark("textStyle", { fontSize: `${size}px` })
      .run();
  }
  };

  const setFontSize = (sizePx: string) => {
    editor
      .chain()
      .focus()
      .setMark("textStyle", { fontSize: sizePx })
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

  // Function to REMOVE the highlight
  const removeBackgroundColor = () => {
    editor.chain().focus().unsetHighlight().run();
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
    const hasSelection = !editor.state.selection.empty;
    const selectedText = hasSelection ? editor.state.doc.textBetween(
      editor.state.selection.from,
      editor.state.selection.to
    ) : "";

    setLinkModalData({
      initialUrl: previousUrl || "",
      initialText: selectedText,
      hasSelection,
    });
    setIsLinkModalOpen(true);
  };

  const handleLinkConfirm = (url: string, text?: string) => {
    if (!url.trim()) {
      // Remove link if URL is empty
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }

    if (linkModalData.hasSelection) {
      // There's a selection - convert selected text to link
      const selection = editor.state.selection;
      editor.chain().focus().setLink({ href: url }).run();
      // Move cursor to the end of the link
      editor.commands.setTextSelection(selection.to);
    } else {
      // No selection - insert new link with provided text
      const linkText = text || "Link";
      const currentPos = editor.state.selection.from;
      editor.chain().focus().insertContent(`<a href="${url}">${linkText}</a>`).run();
      // Move cursor after the inserted link
      const newPos = currentPos + linkText.length + 2; // +2 for <a> tags
      editor.commands.setTextSelection(newPos);
    }
  };

  // Table functionality
  const insertTable = () => {
    editor
      .chain()
      .focus()
      .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
      .run();
  };

  const insertTableWithDims = (rowsStr?: string, colsStr?: string) => {
    const rawR = (rowsStr ?? (selectedTable?.rows?.toString() ?? manualTableRows)).trim();
    const rawC = (colsStr ?? (selectedTable?.cols?.toString() ?? manualTableCols)).trim();
    const parsedR = parseInt(rawR, 10);
    const parsedC = parseInt(rawC, 10);
    const baseR = Number.isNaN(parsedR) || rawR === "" ? 3 : parsedR;
    const baseC = Number.isNaN(parsedC) || rawC === "" ? 3 : parsedC;
    const r = Math.max(1, Math.min(20, baseR));
    const c = Math.max(1, Math.min(20, baseC));
    editor
      .chain()
      .focus()
      .insertTable({ rows: r, cols: c, withHeaderRow: false })
      .run();
    // reset selection & inputs after insertion
    setSelectedTable(null);
    setManualTableRows("");
    setManualTableCols("");
    setTableHover({ rows: 0, cols: 0 });
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
    // Get the HTML content
    const htmlContent = editor.getHTML();
    const textContent = editor.getText().trim();

    // Check if it's the default initial content
    const isDefaultContent =
      htmlContent === "<h1>Welcome</h1><p>Start typing…</p>" ||
      htmlContent === "<h1>Welcome</h1><p>Start typing...</p>" ||
      textContent === "WelcomeStart typing…" ||
      textContent === "WelcomeStart typing..." ||
      textContent.length < 5;

    if (editor.isEmpty || isDefaultContent) {
      toast.error("Document is empty", {
        description:
          "Please add some content to the document before exporting to PDF.",
      });
      return;
    }

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
      toast.success("PDF exported successfully", {
        description: "Your document has been downloaded as PDF.",
      });
    } catch (err) {
      console.error("[v0] Export PDF error:", err);
      toast.error("Export failed", {
        description: "An error occurred while exporting to PDF.",
      });
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

  const inlineComputedColors = (root: HTMLElement) => {
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_ELEMENT);
    let node = walker.currentNode as HTMLElement | null;
    while (node) {
      const el = node as HTMLElement;
      const styles = window.getComputedStyle(el);
      const color = styles.color;
      const backgroundColor = styles.backgroundColor;

      const inlineStyle = el.getAttribute('style') || '';
      if (color && !/color\s*:/.test(inlineStyle)) {
        el.style.color = color;
      }
      if (backgroundColor && backgroundColor !== 'rgba(0, 0, 0, 0)' && backgroundColor !== 'transparent' && !/background(-color)?\s*:/.test(inlineStyle)) {
        el.style.backgroundColor = backgroundColor;
      }

      node = walker.nextNode() as HTMLElement | null;
    }
  };

  // Convert any rgb()/rgba() color tokens inside a style string to #rrggbb hex
  const replaceRgbWithHex = (styleText: string): string => {
    const rgbRegex = /rgba?\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})(?:\s*,\s*([0-9.]+))?\s*\)/gi;
    return styleText.replace(rgbRegex, (_m, r, g, b) => {
      const toHex = (n: string) => {
        const v = Math.max(0, Math.min(255, parseInt(n, 10)));
        return v.toString(16).padStart(2, '0');
      };
      return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
    });
  };

  const handleExportWord = async () => {
    // Get the HTML content
    const htmlContent = editor.getHTML();
    const textContent = editor.getText().trim();
  
    // Check if it's the default initial content
    const isDefaultContent =
      htmlContent === "<h1>Welcome</h1><p>Start typing…</p>" ||
      htmlContent === "<h1>Welcome</h1><p>Start typing...</p>" ||
      textContent === "WelcomeStart typing…" ||
      textContent === "WelcomeStart typing..." ||
      textContent.length < 5;
  
    if (editor.isEmpty || isDefaultContent) {
      toast.error("Document is empty", {
        description:
          "Please add some content to the document before exporting to Word.",
      });
      return;
    }
  
    try {
      const liveDom = editor.view.dom as HTMLElement;
      const cloned = liveDom.cloneNode(true) as HTMLElement;
      inlineComputedColors(cloned);
      let html = cloned.innerHTML;
      // Process HTML for better Word compatibility
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');
      // Convert <mark> tags with data-color to spans with background-color
      const marks = doc.querySelectorAll('mark[data-color]');
      marks.forEach((mark) => {
        const span = doc.createElement('span');
        const bgColor = mark.getAttribute('data-color');
        span.style.backgroundColor = bgColor || '#ffff00';
        // Preserve all content and nested elements
        span.innerHTML = mark.innerHTML;
        // Replace mark with span
        mark.parentNode?.replaceChild(span, mark);
      });
      const spansWithBg = doc.querySelectorAll('span[style*="background"]');
      spansWithBg.forEach((span) => {
        const currentBg = (span as HTMLElement).style.backgroundColor;
        if (currentBg) {
          const existing = span.getAttribute('style') || '';
          if (!/background(-color)?\s*:/.test(existing)) {
            span.setAttribute('style', `${existing}; background-color: ${currentBg};`);
          }
        }
      });

       // Fix the "Welcome" H1 issue - convert H1 to paragraph if it's the default content
       const h1Elements = doc.querySelectorAll('h1');
       h1Elements.forEach((h1) => {
         if (h1.textContent?.trim() === 'Welcome') {
           const p = doc.createElement('p');
           p.innerHTML = h1.innerHTML;
           if (h1.getAttribute('style')) {
             p.setAttribute('style', h1.getAttribute('style') || '');
           }
           h1.parentNode?.replaceChild(p, h1);
         }
       });
      // Convert all headings (h1-h4) to paragraphs, preserving existing inline styles/classes and content
      const replaceHeadingWithParagraph = (selector: string) => {
        Array.from(doc.querySelectorAll(selector)).forEach((h) => {
          const el = h as HTMLElement;
          const p = doc.createElement('p');
          // Preserve existing inline styles
          const existingStyle = el.getAttribute('style') || '';
          if (existingStyle) p.setAttribute('style', existingStyle);
          // Preserve classes (alignment, etc.)
          if (el.className) p.className = el.className;
          // Move content
          p.innerHTML = el.innerHTML;
          el.parentNode?.replaceChild(p, el);
        });
      };
      replaceHeadingWithParagraph('h1');
      replaceHeadingWithParagraph('h2');
      replaceHeadingWithParagraph('h3');
      replaceHeadingWithParagraph('h4');
      // Process images
      const images = Array.from(doc.querySelectorAll('img')) as HTMLImageElement[];
      // Helper: fetch URL -> data URL
      const fetchToDataUrl = async (url: string): Promise<string | null> => {
        try {
          const resp = await fetch(url, { mode: 'cors' as RequestMode });
          if (!resp.ok) return null;
          const blob = await resp.blob();
          return await new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = reject;
            reader.readAsDataURL(blob);
          });
        } catch {
          return null;
        }
      };
      for (const img of images) {
        const src = img.getAttribute('src') || '';
        if (!src) continue;
        if (!src.startsWith('data:')) {
          const dataUrl = await fetchToDataUrl(src);
          if (dataUrl) {
            img.setAttribute('src', dataUrl);
          }
        }
        img.style.maxWidth = '100%';
        img.style.height = 'auto';
        img.style.display = 'block';
        img.style.margin = '8pt 0';
      }
      const imgsPostProcess = Array.from(doc.querySelectorAll('img')) as HTMLImageElement[];
      for (const img of imgsPostProcess) {
        const src = img.getAttribute('src') || '';
        if (!src || !src.startsWith('data:')) {
          img.remove();
          continue;
        }
        img.setAttribute('alt', '');
        img.setAttribute('title', '');
      }
      // Get processed HTML
      html = doc.body.innerHTML;
      // Enhanced Word-compatible HTML
      const docHtml = `
  <!DOCTYPE html>
  <html xmlns:o="urn:schemas-microsoft-com:office:office"
        xmlns:w="urn:schemas-microsoft-com:office:word"
        xmlns:m="http://schemas.microsoft.com/office/2004/12/omml"
        xmlns="http://www.w3.org/TR/REC-html40">
    <head>
      <meta charset="utf-8" />
      <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
      <meta name="ProgId" content="Word.Document" />
      <meta name="Generator" content="Microsoft Word 15" />
      <meta name="Originator" content="Microsoft Word 15" />
      <title>Document</title>
      <!--[if gte mso 9]>
      <xml>
        <w:WordDocument>
          <w:View>Print</w:View>
          <w:Zoom>100</w:Zoom>
          <w:DoNotOptimizeForBrowser/>
        </w:WordDocument>
      </xml>
      <![endif]-->
      <style>
        /* Reset */
        * { 
          margin: 0; 
          padding: 0; 
        }
        
        /* Page setup */
        @page WordSection1 {
          size: 8.5in 11.0in;
          margin: 1.0in;
        }
        
        div.WordSection1 { page: WordSection1; }
        
        body { 
          font-family: Calibri, Arial, sans-serif;
          font-size: 11pt;
          line-height: 115%;
          color: #000000;
        }
        
        /* CRITICAL: Inline styles must be preserved */
        [style] { 
          mso-style-priority: 1 !important;
        }
        
        /* Background/Highlight colors - Word compatibility */
        span[style*="background-color"],
        span[style*="background"] {
          mso-style-priority: 1 !important;
        }
        
        /* Text formatting */
        strong, b { 
          font-weight: bold;
          mso-bidi-font-weight: bold;
        }
        
        em, i { 
          font-style: italic;
          mso-bidi-font-style: italic;
        }
        
        u { 
          text-decoration: underline;
        }
        
        sup { vertical-align: super; font-size: 0.83em; }
        sub { vertical-align: sub; font-size: 0.83em; }
        
        /* Headings */
        h1 { font-size: 24pt; font-weight: bold; margin: 12pt 0 6pt; }
        h2 { font-size: 18pt; font-weight: bold; margin: 10pt 0 5pt; }
        h3 { font-size: 14pt; font-weight: bold; margin: 8pt 0 4pt; }
        h4 { font-size: 12pt; font-weight: bold; margin: 6pt 0 3pt; }
        
        /* Paragraphs */
        p { margin: 0 0 8pt; line-height: 115%; }
        
        /* Code */
        code { 
          font-family: 'Courier New', monospace;
          background-color: #f5f5f5;
          padding: 2px 4px;
          mso-highlight: #f5f5f5;
        }
        
        pre {
          font-family: 'Courier New', monospace;
          background-color: #f5f5f5;
          padding: 8pt;
          margin: 8pt 0;
          border: 1px solid #ddd;
          white-space: pre-wrap;
        }
        
        /* Blockquote */
        blockquote {
          margin: 8pt 0;
          padding-left: 16pt;
          border-left: 3pt solid #cccccc;
          font-style: italic;
          color: #666666;
        }
        
        /* Lists */
        ul, ol { margin: 8pt 0; padding-left: 24pt; }
        li { margin-bottom: 4pt; }
        
        /* Links */
        a { color: #0563c1; text-decoration: underline; }
        
        /* Tables */
        table {
          border-collapse: collapse;
          width: 100%;
          margin: 8pt 0;
        }
        
        th, td {
          border: 1px solid #d0d0d0;
          padding: 6pt;
          text-align: left;
        }
        
        th {
          background-color: #f2f2f2;
          font-weight: bold;
        }
        
        /* Images */
        img {
          max-width: 100%;
          height: auto;
          display: block;
          margin: 8pt 0;
        }
        
        /* Text alignment */
        .text-left { text-align: left; }
        .text-center { text-align: center; }
        .text-right { text-align: right; }
        .text-justify { text-align: justify; }
      </style>
    </head>
    <body>
      <div class="WordSection1">
        ${replaceRgbWithHex(html)}
      </div>
    </body>
  </html>`;
      
      downloadBlob(docHtml, "document.doc", "application/msword");
      toast.success("Word document exported successfully", {
        description: "Your document has been downloaded as .doc file.",
      });
    } catch (err) {
      console.error("[v0] Export Word (.doc) error:", err);
      toast.error("Export failed", {
        description: "An error occurred while exporting to Word.",
      });
    }
  };

  const convertHtmlToMarkdown = (html: string): string => {
    // Normalize whitespace
    let md = html
      .replace(/\r\n|\r/g, "\n")
      .replace(/\n{3,}/g, "\n\n");
    // Headings
    md = md.replace(/<h1[^>]*>([\s\S]*?)<\/h1>/gi, (_m, p1) => `# ${p1}\n\n`);
    md = md.replace(/<h2[^>]*>([\s\S]*?)<\/h2>/gi, (_m, p1) => `## ${p1}\n\n`);
    md = md.replace(/<h3[^>]*>([\s\S]*?)<\/h3>/gi, (_m, p1) => `### ${p1}\n\n`);
    md = md.replace(/<h4[^>]*>([\s\S]*?)<\/h4>/gi, (_m, p1) => `#### ${p1}\n\n`);
    // Paragraphs and line breaks
    md = md.replace(/<p[^>]*>([\s\S]*?)<\/p>/gi, (_m, p1) => `${p1}\n\n`);
    md = md.replace(/<br\s*\/?>/gi, "\n");
    // Strong/Emphasis/Underline
    md = md.replace(/<(strong|b)[^>]*>([\s\S]*?)<\/(strong|b)>/gi, (_m, _t, p1) => `**${p1}**`);
    md = md.replace(/<(em|i)[^>]*>([\s\S]*?)<\/(em|i)>/gi, (_m, _t, p1) => `_${p1}_`);
    md = md.replace(/<u[^>]*>([\s\S]*?)<\/u>/gi, (_m, p1) => `${p1}`);
    // Inline code
    md = md.replace(/<code[^>]*>([\s\S]*?)<\/code>/gi, (_m, p1) => `\`${p1}\``);
    // Code blocks
    md = md.replace(/<pre[^>]*>([\s\S]*?)<\/pre>/gi, (_m, p1) => `\n\n\`\`\`\n${p1}\n\`\`\`\n\n`);
    // Blockquotes
    md = md.replace(/<blockquote[^>]*>([\s\S]*?)<\/blockquote>/gi, (_m, p1) => {
      const inner = p1.replace(/\n/g, "\n> ");
      return `> ${inner}\n\n`;
    });
    // Links
    md = md.replace(/<a[^>]*href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi, (_m, href, text) => `[${text}](${href})`);
    // Images
    md = md.replace(/<img[^>]*alt=["']([^"']*)["'][^>]*src=["']([^"']+)["'][^>]*\/?\s*>/gi, (_m, alt, src) => `![${alt}](${src})`);
    // Unordered lists
    md = md.replace(/<ul[^>]*>([\s\S]*?)<\/ul>/gi, (_m, p1) => {
      const items = p1.replace(/<li[^>]*>([\s\S]*?)<\/li>/gi, (_m2, li) => `- ${li}\n`);
      return `\n${items}\n`;
    });
    // Ordered lists (numbers simplified to 1.)
    md = md.replace(/<ol[^>]*>([\s\S]*?)<\/ol>/gi, (_m, p1) => {
      const items = p1.replace(/<li[^>]*>([\s\S]*?)<\/li>/gi, (_m2, li) => `1. ${li}\n`);
      return `\n${items}\n`;
    });
    // Tables -> fallback to text rows
    md = md.replace(/<table[\s\S]*?<\/table>/gi, (tbl) => {
      const rows = tbl
        .replace(/<thead[\s\S]*?<\/thead>/gi, (thead) => thead.replace(/<th[^>]*>([\s\S]*?)<\/th>/gi, (_m, th) => `| ${th.trim()} `) + "|\n")
        .replace(/<tbody[\s\S]*?<\/tbody>/gi, (tbody) => tbody)
        .replace(/<tr[^>]*>([\s\S]*?)<\/tr>/gi, (_m, cells) => {
          const line = cells.replace(/<t[dh][^>]*>([\s\S]*?)<\/t[dh]>/gi, (_m2, cell) => `| ${String(cell).trim()} `) + "|\n";
          return line;
        });
      return `\n${rows}\n`;
    });
    // Remove remaining tags
    md = md.replace(/<[^>]+>/g, "");
    // Decode basic HTML entities
    md = md
      .replace(/&nbsp;/g, " ")
      .replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'");
    // Trim excess whitespace
    return md.replace(/\s+$/g, "").replace(/\n{3,}/g, "\n\n");
  };

  const handleExportMarkdown = async () => {
    const htmlContent = editor.getHTML();
    const textContent = editor.getText().trim();
    const isDefaultContent =
      htmlContent === "<h1>Welcome<\/h1><p>Start typing…<\/p>" ||
      htmlContent === "<h1>Welcome<\/h1><p>Start typing...<\/p>" ||
      textContent === "WelcomeStart typing…" ||
      textContent === "WelcomeStart typing..." ||
      textContent.length < 5;

    if (editor.isEmpty || isDefaultContent) {
      toast.error("Document is empty", {
        description: "Please add some content to the document before exporting to Markdown.",
      });
      return;
    }

    try {
      const md = convertHtmlToMarkdown(htmlContent);
      downloadBlob(md, "document.md", "text/markdown;charset=utf-8");
      toast.success("Markdown exported successfully", {
        description: "Your document has been downloaded as .md.",
      });
    } catch (err) {
      console.error("[v0] Export Markdown error:", err);
      toast.error("Export failed", {
        description: "An error occurred while exporting to Markdown.",
      });
    }
  };

  const handleExportText = async () => {
    const textContent = editor.getText().trim();
    if (!textContent || textContent.length < 1) {
      toast.error("Document is empty", {
        description: "Please add some content to the document before exporting to Text.",
      });
      return;
    }
    try {
      downloadBlob(textContent + "\n", "document.txt", "text/plain;charset=utf-8");
      toast.success("Text exported successfully", {
        description: "Your document has been downloaded as .txt.",
      });
    } catch (err) {
      console.error("[v0] Export Text error:", err);
      toast.error("Export failed", {
        description: "An error occurred while exporting to Text.",
      });
    }
  };

  const handleClear = () => {
    const confirmed = window.confirm(
      "Clear all content from the document? You can undo with Ctrl+Z."
    );
    if (!confirmed) return;
    editor.chain().focus().clearContent().run();
  };

  const insertPageBreak = () => {
    editor.chain().focus().setPageBreak().run();
  };

  const handleLayoutChange = (mode: 'normal' | 'a4' | 'multipage') => {
    // Reset all modes first
    if (isPageLayout) onTogglePageLayout?.();
    if (isMultiPageMode) onToggleMultiPageMode?.();
    
    // Set the desired mode
    if (mode === 'a4') {
      onTogglePageLayout?.();
    } else if (mode === 'multipage') {
      onToggleMultiPageMode?.();
    }
    // 'normal' mode is already set by resetting all modes
  };

  const getCurrentLayoutMode = () => {
    if (isMultiPageMode) return 'multipage';
    if (isPageLayout) return 'a4';
    return 'normal';
  };

  const getLayoutModeLabel = () => {
    if (isMultiPageMode) return "Multi-Page";
    if (isPageLayout) return "A4 Layout";
    return "Normal";
  };

  // Copy formatting from current selection (like MS Word Format Painter)
  const toggleFormatPainter = () => {
    if (!editor) return;

    if (isFormatPainterActive) {
      // Deactivate format painter
      setIsFormatPainterActive(false);
      setCopiedFormat(null);
      return;
    }

    const selection = editor.state.selection;
    
    // Check if there's a selection
    if (selection.empty) {
      // No selection, just toggle the format painter state
      setIsFormatPainterActive(true);
      return;
    }

    // Get all active marks and node attributes from selection
    const marks: any = {};
    const attributes: any = {};

    // Collect marks (bold, italic, underline, etc.)
    if (editor.isActive("bold")) marks.bold = true;
    if (editor.isActive("italic")) marks.italic = true;
    if (editor.isActive("underline")) marks.underline = true;
    if (editor.isActive("superscript")) marks.superscript = true;
    if (editor.isActive("subscript")) marks.subscript = true;
    if (editor.isActive("code")) marks.code = true;
    if (editor.isActive("link")) marks.link = editor.getAttributes("link");
    
    // Get text style attributes (color, font family, font size)
    const textStyle = editor.getAttributes("textStyle");
    if (textStyle && Object.keys(textStyle).length > 0) {
      marks.textStyle = textStyle;
    }

    // Get color attributes
    const color = editor.getAttributes("textStyle")?.color;
    if (color) marks.color = color;

    // Get highlight/background color
    const highlight = editor.getAttributes("highlight");
    if (highlight && Object.keys(highlight).length > 0) {
      marks.highlight = highlight;
    }

    // Get paragraph/heading attributes
    if (editor.isActive("heading")) {
      const headingAttrs = editor.getAttributes("heading");
      attributes.heading = headingAttrs;
    } else if (editor.isActive("paragraph")) {
      const paragraphAttrs = editor.getAttributes("paragraph");
      attributes.paragraph = paragraphAttrs;
    }

    // Get text alignment
    const textAlign = editor.getAttributes("paragraph")?.textAlign || 
                     editor.getAttributes("heading")?.textAlign;
    if (textAlign) attributes.textAlign = textAlign;

    setCopiedFormat({ marks, attributes });
    setIsFormatPainterActive(true);
  };

  // Clear all formatting from current selection
  const clearFormatting = () => {
    if (!editor) return;

    editor
      .chain()
      .focus()
      // Clear all marks
      .unsetAllMarks()
      // Clear text styles
      .removeEmptyTextStyle()
      // Clear colors
      .unsetColor()
      // Clear highlights
      .unsetHighlight()
      // Clear links
      .unsetLink()
      // Convert to paragraph (removes headings)
      .setParagraph()
      // Clear text alignment
      .unsetTextAlign()
      .run();
  };

  return (
    <div
      className="flex flex-wrap items-center gap-2 p-4 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm"
      role="toolbar"
      aria-label="Editor toolbar"
    >
      {/* Top menu bar */}
      <div className="w-full flex items-center gap-1 pb-2">
        {/* File */}
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger asChild>
            <Button variant="secondary" size="sm" title="File">File</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <DropdownMenuItem onClick={handleExportPDF}>
              <FileOutput className="h-4 w-4 mr-2" />
              Save as PDF
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleExportWord}>
              <FileText className="h-4 w-4 mr-2" />
              Save as Word
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleExportMarkdown}>
              <FileCode className="h-4 w-4 mr-2" />
              Save as Markdown
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleExportText}>
              <FileType2 className="h-4 w-4 mr-2" />
              Save as Text
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={toggleFocusMode}>
              <Eye className="h-4 w-4 mr-2" />
              {isFocusMode ? "Exit Focus Mode" : "Enter Focus Mode"}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        {/* View */}
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger asChild>
            <Button variant="secondary" size="sm" title="View">View</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-56 max-h-none overflow-visible">
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>
                <Layout className="h-4 w-4 mr-2" />
                Editor Layout
              </DropdownMenuSubTrigger>
              <DropdownMenuSubContent sideOffset={8} className="w-64 max-h-none overflow-visible">
                <DropdownMenuLabel className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Editor Layout
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuRadioGroup 
                  value={getCurrentLayoutMode()} 
                  onValueChange={(value) => handleLayoutChange(value as 'normal' | 'a4' | 'multipage')}
                >
                  <DropdownMenuRadioItem value="normal" className="flex items-center gap-3 py-2">
                    <div className="flex items-center justify-center w-8 h-8 rounded bg-gray-100 dark:bg-gray-800">
                      <Monitor className="h-4 w-4 text-gray-600" />
                    </div>
                    <div className="flex flex-col">
                      <span className="font-medium">Normal</span>
                      <span className="text-xs text-gray-500">Full-width editor</span>
                    </div>
                  </DropdownMenuRadioItem>
                  
                  <DropdownMenuRadioItem value="a4" className="flex items-center gap-3 py-2">
                    <div className="flex items-center justify-center w-8 h-8 rounded bg-gray-100 dark:bg-gray-800">
                      <Square className="h-4 w-4 text-gray-600" />
                    </div>
                    <div className="flex flex-col">
                      <span className="font-medium">A4 Layout</span>
                      <span className="text-xs text-gray-500">Single A4 page view</span>
                    </div>
                  </DropdownMenuRadioItem>
                  
                  <DropdownMenuRadioItem value="multipage" className="flex items-center gap-3 py-2">
                    <div className="flex items-center justify-center w-8 h-8 rounded bg-gray-100 dark:bg-gray-800">
                      <FileText className="h-4 w-4 text-gray-600" />
                    </div>
                    <div className="flex flex-col">
                      <span className="font-medium">Multi-Page</span>
                      <span className="text-xs text-gray-500">Google Docs style with multiple pages</span>
                    </div>
                  </DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
                
                <DropdownMenuSeparator />
                <div className="px-2 py-1.5 text-xs text-gray-500">
                  Switch between different editor layouts to match your workflow
                </div>
              </DropdownMenuSubContent>
            </DropdownMenuSub>

            {/* Page Margin submenu */}
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>
                <Monitor className="h-4 w-4 mr-2" />
                Page Margin
              </DropdownMenuSubTrigger>
              <DropdownMenuSubContent sideOffset={8} className="w-64 max-h-none overflow-visible">
                <DropdownMenuLabel>Page Margin</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => onChangePageMargin?.(32)}>
                  Narrow (32px)
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onChangePageMargin?.(64)}>
                  Normal (64px)
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onChangePageMargin?.(96)}>
                  Wide (96px)
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <div className="px-3 py-2">
                  <label className="text-xs text-muted-foreground">Custom (px)</label>
                  <input
                    type="number"
                    min={0}
                    className="w-full mt-1 p-1 border rounded text-sm"
                    value={String(pageMargin)}
                    onChange={(e) => {
                      const v = Number(e.target.value || 0);
                      if (!Number.isNaN(v)) onChangePageMargin?.(v);
                    }}
                  />
                </div>
              </DropdownMenuSubContent>
            </DropdownMenuSub>
          </DropdownMenuContent>
        </DropdownMenu>
        {/* Insert */}
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger asChild>
            <Button variant="secondary" size="sm" title="Insert">Insert</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="start"
            side="bottom"
            sideOffset={8}
            avoidCollisions={false}
            className="max-h-none overflow-visible"
            style={{ overflow: 'visible', maxHeight: 'none' }}
          >
            <DropdownMenuItem onClick={setLink}>
              <Link className="h-4 w-4 mr-2" />
              Add/Edit Link
            </DropdownMenuItem>
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>
                <SmilePlus className="h-4 w-4 mr-2" />
                Emoji
              </DropdownMenuSubTrigger>
              <DropdownMenuSubContent
                sideOffset={8}
                avoidCollisions={false}
                className="p-0 bg-transparent text-foreground max-h-none overflow-visible border-0 shadow-none ring-0 outline-none"
                style={{ overflow: 'visible', maxHeight: 'none', boxShadow: 'none', borderWidth: 0 }}
              >
                <div
                  className="p-0 bg-white max-h-[420px] overflow-auto scrollbar-none border border-input rounded-md shadow-md"
                  onWheelCapture={(e) => { e.stopPropagation(); }}
                >
                  <Picker
                    data={data}
                    theme="light"
                    onEmojiSelect={addEmoji}
                    previewPosition="none"
                    skinTonePosition="none"
                  />
                </div>
              </DropdownMenuSubContent>
            </DropdownMenuSub>
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>
                <Table className="h-4 w-4 mr-2" />
                Insert Table
              </DropdownMenuSubTrigger>
              <DropdownMenuSubContent
                sideOffset={8}
                avoidCollisions={false}
                className="w-64 max-h-none overflow-visible"
                style={{ overflow: 'visible', maxHeight: 'none' }}
              >
                <DropdownMenuLabel>Insert Table</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <div className="px-2 pt-2">
                  <div
                    className="grid grid-cols-10 gap-1 select-none"
                    onMouseLeave={() => {
                      setTableHover({ rows: 0, cols: 0 });
                      // revert to default placeholders when leaving without selection
                      if (!selectedTable) {
                        setManualTableRows("");
                        setManualTableCols("");
                      }
                    }}
                  >
                    {Array.from({ length: 10 }).map((_, r) => (
                      <React.Fragment key={r}>
                        {Array.from({ length: 10 }).map((_, c) => {
                          const active = selectedTable
                            ? r < selectedTable.rows && c < selectedTable.cols
                            : r < tableHover.rows && c < tableHover.cols;
                          return (
                            <button
                              key={`${r}-${c}`}
                              type="button"
                              className={`h-4 w-4 border ${active ? 'bg-muted border-foreground' : 'border-input'} rounded-sm`}
                              onMouseEnter={() => {
                                setTableHover({ rows: r + 1, cols: c + 1 });
                                setManualTableRows(String(r + 1));
                                setManualTableCols(String(c + 1));
                              }}
                              onMouseDown={(e) => e.preventDefault()}
                              onClick={(e) => {
                                e.preventDefault();
                                // select but do not insert; inputs reflect selection
                                setSelectedTable({ rows: r + 1, cols: c + 1 });
                                setManualTableRows(String(r + 1));
                                setManualTableCols(String(c + 1));
                              }}
                              aria-label={`Insert ${r + 1} by ${c + 1} table`}
                            />
                          );
                        })}
                      </React.Fragment>
                    ))}
                  </div>
                  <div className="text-xs text-muted-foreground mt-2 text-center min-h-4">
                    {tableHover.rows > 0 && tableHover.cols > 0 ? `${tableHover.rows} × ${tableHover.cols} table` : ''}
                  </div>
                </div>
                <div className="px-2 pb-2 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="w-16 text-sm text-muted-foreground">Rows</span>
                    <div className="relative w-28">
                      <Input
                        type="tel"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        placeholder="3"
                        value={manualTableRows}
                        onChange={(e) => setManualTableRows(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            insertTableWithDims(e.currentTarget.value, undefined);
                          }
                        }}
                        className="h-8 w-full text-center pl-7 pr-7"
                        autoFocus
                      />
                      <button
                        type="button"
                        className="absolute left-1 top-1/2 -translate-y-1/2 h-6 w-6 p-0 flex items-center justify-center bg-transparent text-foreground transition-none duration-0 hover:bg-transparent active:bg-transparent focus:outline-none focus-visible:ring-0 select-none"
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={(e) => {
                          e.preventDefault();
                          const n = Math.max(1, Math.min(20, (parseInt(manualTableRows, 10) || 1) - 1));
                          setManualTableRows(String(n));
                        }}
                        aria-label="Decrement rows"
                        title="Decrease rows"
                      >
                        -
                      </button>
                      <button
                        type="button"
                        className="absolute right-1 top-1/2 -translate-y-1/2 h-6 w-6 p-0 flex items-center justify-center bg-transparent text-foreground transition-none duration-0 hover:bg-transparent active:bg-transparent focus:outline-none focus-visible:ring-0 select-none"
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={(e) => {
                          e.preventDefault();
                          const n = Math.max(1, Math.min(20, (parseInt(manualTableRows, 10) || 1) + 1));
                          setManualTableRows(String(n));
                        }}
                        aria-label="Increment rows"
                        title="Increase rows"
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-16 text-sm text-muted-foreground">Columns</span>
                    <div className="relative w-28">
                      <Input
                        type="tel"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        placeholder="3"
                        value={manualTableCols}
                        onChange={(e) => setManualTableCols(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            insertTableWithDims(undefined, e.currentTarget.value);
                          }
                        }}
                        className="h-8 w-full text-center pl-7 pr-7"
                      />
                      <button
                        type="button"
                        className="absolute left-1 top-1/2 -translate-y-1/2 h-6 w-6 p-0 flex items-center justify-center bg-transparent text-foreground transition-none duration-0 hover:bg-transparent active:bg-transparent focus:outline-none focus-visible:ring-0 select-none"
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={(e) => {
                          e.preventDefault();
                          const n = Math.max(1, Math.min(20, (parseInt(manualTableCols, 10) || 1) - 1));
                          setManualTableCols(String(n));
                        }}
                        aria-label="Decrement columns"
                        title="Decrease columns"
                      >
                        -
                      </button>
                      <button
                        type="button"
                        className="absolute right-1 top-1/2 -translate-y-1/2 h-6 w-6 p-0 flex items-center justify-center bg-transparent text-foreground transition-none duration-0 hover:bg-transparent active:bg-transparent focus:outline-none focus-visible:ring-0 select-none"
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={(e) => {
                          e.preventDefault();
                          const n = Math.max(1, Math.min(20, (parseInt(manualTableCols, 10) || 1) + 1));
                          setManualTableCols(String(n));
                        }}
                        aria-label="Increment columns"
                        title="Increase columns"
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button size="sm" onClick={(e) => { e.preventDefault(); insertTableWithDims(); }}>Insert</Button>
                    <Button size="sm" variant="secondary" onClick={() => { setManualTableRows(""); setManualTableCols(""); setTableHover({ rows: 0, cols: 0 }); }}>Reset</Button>
                  </div>
                </div>
              </DropdownMenuSubContent>
            </DropdownMenuSub>
            <DropdownMenuItem onClick={insertPageBreak}>
              <FileX className="h-4 w-4 mr-2" />
              Page Break
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleImageUpload}>
              <Image className="h-4 w-4 mr-2" />
              Image
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        {/* Tools */}
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger asChild>
            <Button variant="secondary" size="sm" title="Tools">Tools</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <DropdownMenuItem onClick={() => setIsFindReplaceOpen(true)}>
              <Search className="h-4 w-4 mr-2" />
              Search
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Table (moved from toolbar into menu bar) */}
        {isTableActive && (
          <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" size="sm" title="Table">Table</Button>
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
              <DropdownMenuItem onClick={mergeCells}>Merge Cells</DropdownMenuItem>
              <DropdownMenuItem onClick={splitCell}>Split Cell</DropdownMenuItem>

              <DropdownMenuSeparator />
              <DropdownMenuLabel>Headers</DropdownMenuLabel>
              <DropdownMenuItem onClick={toggleHeaderRow}>Toggle Header Row</DropdownMenuItem>
              <DropdownMenuItem onClick={toggleHeaderColumn}>Toggle Header Column</DropdownMenuItem>
              <DropdownMenuItem onClick={toggleHeaderCell}>Toggle Header Cell</DropdownMenuItem>

              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={deleteTable} className="text-red-600">
                <Minus className="h-4 w-4 mr-2" />
                Delete Table
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>

      {/* Headings */}
      <DropdownMenu modal={false}>
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
              onClick={() => setHeading(opt.level, opt.size)}
            >
              <span style={{ fontSize: `${opt.size}px` }}>
                {opt.label}
              </span>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Font size */}
      <DropdownMenu modal={false}>
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
          <div className="px-2 py-2 flex items-center gap-2">
            <Input
              type="number"
              min={8}
              max={200}
              placeholder="Size"
              value={manualFontSize}
              onChange={(e) => setManualFontSize(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  const raw = (manualFontSize || '').trim();
                  const n = Math.max(8, Math.min(200, parseInt(raw, 10)));
                  if (!Number.isNaN(n)) setFontSize(`${n}px`);
                }
              }}
              className="h-8 w-24"
            />
            <Button
              size="sm"
              onClick={() => {
                const raw = (manualFontSize || '').trim();
                const n = Math.max(8, Math.min(200, parseInt(raw, 10)));
                if (!Number.isNaN(n)) setFontSize(`${n}px`);
              }}
            >
              Apply
            </Button>
          </div>
          <DropdownMenuRadioGroup
            value={String(editor.getAttributes("textStyle")?.fontSize || "")}
            onValueChange={(v) => setFontSize(v)}
            className="px-2"
          >
            {fontSizes.map((s) => (
              <DropdownMenuRadioItem
                key={s}
                value={`${s}px`}
                className="justify-start pl-0"
              >
                <span className="block w-full text-left">
                  {s}px
                  {s === "16" && (
                    <span className="text-muted-foreground ml-2">Default</span>
                  )}
                </span>
              </DropdownMenuRadioItem>
            ))}
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Font family */}
      <DropdownMenu modal={false}>
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
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="secondary"
            size="sm"
            aria-label="Line spacing"
            title="Line spacing"
          >
            <BetweenVerticalStart className="h-4 w-4 rotate-90" />
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
      <DropdownMenu modal={false}>
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
      <div className="flex items-center gap-2">
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
          onClick={() => {
            editor.chain().focus().unsetSubscript().run()
            editor.chain().focus().toggleSuperscript().run()
          }}
          aria-pressed={editor.isActive("superscript")}
          aria-label="Superscript"
          title="Superscript"
        >
          <SuperscriptIcon className="h-4 w-4" />
        </Button>
        <Button
          size="sm"
          variant={editor.isActive("subscript") ? "default" : "secondary"}
          onClick={() => {
            editor.chain().focus().unsetSuperscript().run()
            editor.chain().focus().toggleSubscript().run()
          }}
          aria-pressed={editor.isActive("subscript")}
          aria-label="Subscript"
          title="Subscript"
        >
          <SubscriptIcon className="h-4 w-4" />
        </Button>
      </div>

      {/* Format Actions */}
      <div className="flex items-center gap-2">
        <Button
          size="sm"
          variant={isFormatPainterActive ? "default" : "secondary"}
          onClick={toggleFormatPainter}
          aria-label="Format Painter"
          title="Copy formatting from one text and apply to another (like MS Word)"
          className={isFormatPainterActive ? "bg-blue-100 border-blue-300 text-blue-700" : ""}
        >
          <PaintRoller className="h-4 w-4" />
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={clearFormatting}
          aria-label="Clear formatting"
          title="Remove all formatting from selected text"
          className="text-orange-600 hover:text-orange-700 hover:bg-orange-50 border-orange-200 dark:text-orange-400 dark:hover:bg-orange-900/30 dark:border-orange-800"
        >
          <RotateCcw className="h-4 w-4" />
        </Button>
      </div>

      {/* Content blocks */}
      <div className="flex items-center gap-2">
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
          <CodeXml className="h-4 w-4" />
        </Button>
      </div>

      

      

      {/* Lists */}
      <div className="flex items-center gap-2">
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
      <div className="flex items-center gap-2">
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

      

      {/* Colors */}
      {/* Colors */}
      <div className="flex items-center gap-2 pl-1">
        <label
          className="text-xs text-muted-foreground flex items-center gap-1"
          htmlFor="text-color"
        >
          <PaletteIcon className="h-4 w-4" />
          <span className="sr-only">Text color</span>
        </label>
        <div className="relative" ref={textColorRef}>
          <button
            onClick={() => setShowTextColorPicker((prev) => !prev)}
            className="h-8 w-8 rounded border p-1 flex items-center justify-center cursor-pointer relative"
            title="Text color"
          >
            <span
              className="absolute inset-[4px] rounded-sm"
              style={{ backgroundColor: activeTextColor }}
            ></span>
          </button>
          {
            showTextColorPicker&&(
              <div className="absolute top-10 left-0 z-10">
                <CustomColorPicker value={activeTextColor} onChange={(newColor) => {setTextColor(newColor); setActiveTextColor(newColor);}}/>
              </div>
            )
          }
        </div>
        

        <label
          className="text-xs text-muted-foreground flex items-center gap-1"
          htmlFor="bg-color"
        >
          <HighlighterIcon className="h-4 w-4" />
          <span className="sr-only">Highlight color</span>
        </label>
        <div className="relative" ref={bgColorRef}>
          <button
            onClick={() => setShowBGColorPicker((prev) => !prev)}
            className="h-8 w-8 rounded border p-1 flex items-center justify-center cursor-pointer relative"
            title="Text color"
          >
            <span
              className="absolute inset-[4px] rounded-sm"
              style={{ backgroundColor: activeBGColor }}
            ></span>
          </button>
          {
            showBGColorPicker&&(
              <div className="absolute top-10 left-0 z-10">
                <CustomColorPicker
                  value={activeBGColor} 
                  onChange={(newColor) => {setBackgroundColor(newColor); setActiveBGColor(newColor);}}
                  children={
                      <button
                        type="button"
                        onClick={removeBackgroundColor}
                        className="w-full p-1.5 mt-1.5 cursor-pointer rounded border text-sm border-gray-200 dark:border-gray-700 dark:hover:bg-gray-600 hover:bg-gray-300"
                        aria-label="Remove highlight"
                        title="Remove highlight"
                      >
                        {/* You can replace this emoji with an icon component */}
                        🚫 Clear Background color
                      </button>
                  }
                />
              </div>
            )
          }
        </div>

        {/* ✨ ADD THIS BUTTON
        <button
          type="button"
          onClick={removeBackgroundColor}
          className="p-1.5 rounded border"
          aria-label="Remove highlight"
          title="Remove highlight"
        >
          🚫
        </button> */}
      </div>


      

      {/* Clear content */}
      <div className="flex items-center gap-2">
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

      {/* Find & Replace Modal */}
      <FindReplaceModal
        editor={editor}
        isOpen={isFindReplaceOpen}
        onClose={() => setIsFindReplaceOpen(false)}
      />

      {/* Link Modal */}
      <LinkModal
        isOpen={isLinkModalOpen}
        onClose={() => setIsLinkModalOpen(false)}
        onConfirm={handleLinkConfirm}
        initialUrl={linkModalData.initialUrl}
        initialText={linkModalData.initialText}
        hasSelection={linkModalData.hasSelection}
      />
    </div>
  );
}
