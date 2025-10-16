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
import Emoji from "@tiptap/extension-emoji"
import Mention from "@tiptap/extension-mention"
import { ReactRenderer } from "@tiptap/react"
import { SuggestionOptions } from "@tiptap/suggestion"
import { MentionsSuggestion, MentionItem } from "./mentions-suggestion"
import tippy from "tippy.js"

// Sample users for mentions
const users: MentionItem[] = [
  { id: "1", label: "John Doe", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=John" },
  { id: "2", label: "Jane Smith", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jane" },
  { id: "3", label: "Mike Johnson", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mike" },
  { id: "4", label: "Sarah Wilson", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah" },
  { id: "5", label: "Alex Brown", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex" },
  { id: "6", label: "Emma Davis", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emma" },
  { id: "7", label: "Chris Lee", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Chris" },
  { id: "8", label: "Lisa Garcia", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Lisa" },
]

// Configure mention suggestion
const mentionSuggestion: Partial<SuggestionOptions<MentionItem>> = {
  items: ({ query }) => {
    return users.filter((user) =>
      user.label.toLowerCase().startsWith(query.toLowerCase())
    )
  },
  render: () => {
    let component: ReactRenderer<MentionsSuggestion>
    let popup: any

    return {
      onStart: (props) => {
        component = new ReactRenderer(MentionsSuggestion, {
          props,
          editor: props.editor,
        })

        if (!props.clientRect) {
          return
        }

        popup = tippy("body", {
          getReferenceClientRect: props.clientRect,
          appendTo: () => document.body,
          content: component.element,
          showOnCreate: true,
          interactive: true,
          trigger: "manual",
          placement: "bottom-start",
        })
      },

      onUpdate(props) {
        component.updateProps(props)

        if (!props.clientRect) {
          return
        }

        popup[0].setProps({
          getReferenceClientRect: props.clientRect,
        })
      },

      onKeyDown(props) {
        if (props.event.key === "Escape") {
          popup[0].hide()
          return true
        }

        return component.ref?.onKeyDown?.(props)
      },

      onExit() {
        popup[0].destroy()
        component.destroy()
      },
    }
  },
}

export const EmojiExtension = Emoji.configure({
  enableEmoticons: true,
  enableShortcodes: true,
})

export const MentionExtension = Mention.configure({
  HTMLAttributes: {
    class: "mention",
  },
  suggestion: mentionSuggestion,
})

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
