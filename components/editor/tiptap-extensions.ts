import { TextStyle } from "@tiptap/extension-text-style"

// Extensão customizada para fontFamily
export const FontFamilyExtension = TextStyle.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      fontFamily: {
        default: null,
        parseHTML: (element) => element.style.fontFamily?.replace(/['"]/g, "") || null,
        renderHTML: (attributes) => {
          if (!attributes.fontFamily) return {}
          return { style: `font-family: ${attributes.fontFamily}` }
        },
      },
    }
  },
})
import { Extension } from "@tiptap/core"

export const IndentExtension = Extension.create({
  name: "indent",
  addGlobalAttributes() {
    return [
      {
        types: ["paragraph", "heading"],
        attributes: {
          indent: {
            default: 0,
            parseHTML: (element) => {
              const v = element.getAttribute("data-indent")
              return v ? Number.parseInt(v, 10) || 0 : 0
            },
            renderHTML: (attributes) => {
              const level = attributes.indent ?? 0
              if (!level) return {}
              // 24px per level behaves nicely
              return {
                "data-indent": String(level),
                style: `margin-left: ${level * 24}px;`,
              }
            },
          },
        },
      },
    ]
  },
})

export const LineHeightExtension = Extension.create({
  name: "lineHeight",
  addGlobalAttributes() {
    return [
      {
        types: ["paragraph", "heading"],
        attributes: {
          lineHeight: {
            default: null,
            parseHTML: (element) => element.style.lineHeight || null,
            renderHTML: (attributes) => {
              const lh = attributes.lineHeight
              if (!lh) return {}
              return { style: `line-height: ${lh};` }
            },
          },
        },
      },
    ]
  },
})
