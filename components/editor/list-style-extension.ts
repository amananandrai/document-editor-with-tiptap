import { Extension, type ChainedCommands } from "@tiptap/core";
import type { Node as PMNode, ResolvedPos } from "@tiptap/pm/model";

// Bullet/numbering styles and multilevel list presets.
//
// - `listStyleType` (per list): explicit marker for one list level, rendered
//   as an inline `list-style-type`, so it wins over any preset.
// - `multilevel` (on the outermost list): a preset whose CSS (globals.css)
//   styles every nested level, including levels created later with Tab.

export type ListType = "bulletList" | "orderedList";

export interface ListStyleOption {
  value: string;
  label: string;
  /** Marker shown in the style picker */
  preview: string;
}

export const BULLET_STYLES: ListStyleOption[] = [
  { value: "disc", label: "Filled circle", preview: "●" },
  { value: "circle", label: "Hollow circle", preview: "○" },
  { value: "square", label: "Square", preview: "■" },
  { value: '"◆  "', label: "Diamond", preview: "◆" },
  { value: '"➢  "', label: "Arrow", preview: "➢" },
  { value: '"✓  "', label: "Check mark", preview: "✓" },
  { value: '"–  "', label: "Dash", preview: "–" },
];

export const NUMBER_STYLES: ListStyleOption[] = [
  { value: "decimal", label: "1. 2. 3.", preview: "1." },
  { value: "decimal-leading-zero", label: "01. 02. 03.", preview: "01." },
  { value: "lower-alpha", label: "a. b. c.", preview: "a." },
  { value: "upper-alpha", label: "A. B. C.", preview: "A." },
  { value: "lower-roman", label: "i. ii. iii.", preview: "i." },
  { value: "upper-roman", label: "I. II. III.", preview: "I." },
];

export interface MultilevelPreset {
  id: string;
  label: string;
  listType: ListType;
  /** Marker preview for the first three levels */
  levels: [string, string, string];
}

export const MULTILEVEL_PRESETS: MultilevelPreset[] = [
  { id: "numbered", label: "Numbered", listType: "orderedList", levels: ["1.", "a.", "i."] },
  { id: "outline", label: "Outline", listType: "orderedList", levels: ["I.", "A.", "1."] },
  { id: "legal", label: "Legal", listType: "orderedList", levels: ["1.", "1.1.", "1.1.1."] },
  { id: "bullets", label: "Bullets", listType: "bulletList", levels: ["●", "○", "■"] },
  { id: "arrows", label: "Arrows", listType: "bulletList", levels: ["➢", "●", "○"] },
];

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    listStyle: {
      /** Turn the current block into a list of `listType` (if needed) and set its marker */
      setListStyle: (listType: ListType, style: string | null) => ReturnType;
      /** Apply a multilevel preset to the outermost list around the selection */
      setMultilevelList: (presetId: string) => ReturnType;
    };
  }
}

const LIST_TYPES = ["bulletList", "orderedList"];

/** Depth of the innermost list of any type around $pos, or -1 */
function innermostListDepth($pos: ResolvedPos): number {
  for (let d = $pos.depth; d > 0; d--) {
    if (LIST_TYPES.includes($pos.node(d).type.name)) return d;
  }
  return -1;
}

/** Depth of the outermost list in the unbroken chain of lists around $pos */
function outermostListDepth($pos: ResolvedPos): number {
  let found = -1;
  for (let d = $pos.depth; d > 0; d--) {
    const name = $pos.node(d).type.name;
    if (LIST_TYPES.includes(name)) found = d;
    else if (found > 0 && name !== "listItem") break;
  }
  return found;
}

/** Ensure the selection's innermost list is `listType`, converting or wrapping as needed */
function ensureListType(
  chain: () => ChainedCommands,
  $from: ResolvedPos,
  listType: ListType
): ChainedCommands {
  const depth = innermostListDepth($from);
  if (depth > 0 && $from.node(depth).type.name === listType) return chain();
  return listType === "bulletList"
    ? chain().toggleBulletList()
    : chain().toggleOrderedList();
}

export const ListStyleExtension = Extension.create({
  name: "listStyle",

  addGlobalAttributes() {
    return [
      {
        types: LIST_TYPES,
        attributes: {
          listStyleType: {
            default: null,
            parseHTML: (element) =>
              element.getAttribute("data-list-style") ||
              element.style.listStyleType ||
              null,
            renderHTML: (attributes) => {
              if (!attributes.listStyleType) return {};
              return {
                "data-list-style": attributes.listStyleType,
                style: `list-style-type: ${attributes.listStyleType}`,
              };
            },
          },
          multilevel: {
            default: null,
            parseHTML: (element) => element.getAttribute("data-multilevel"),
            renderHTML: (attributes) =>
              attributes.multilevel
                ? { "data-multilevel": attributes.multilevel }
                : {},
          },
        },
      },
    ];
  },

  addCommands() {
    return {
      setListStyle:
        (listType, style) =>
        ({ chain, state }) =>
          ensureListType(chain, state.selection.$from, listType)
            .command(({ tr }) => {
              const { $from } = tr.selection;
              const depth = innermostListDepth($from);
              if (depth < 1) return false;
              const node = $from.node(depth);
              tr.setNodeMarkup($from.before(depth), undefined, {
                ...node.attrs,
                listStyleType: style,
              });
              return true;
            })
            .run(),

      setMultilevelList:
        (presetId) =>
        ({ chain, state }) => {
          const preset = MULTILEVEL_PRESETS.find((p) => p.id === presetId);
          if (!preset) return false;
          return ensureListType(chain, state.selection.$from, preset.listType)
            .command(({ tr }) => {
              const { $from } = tr.selection;
              const depth = outermostListDepth($from);
              if (depth < 1) return false;
              const rootPos = $from.before(depth);
              let root = $from.node(depth);
              // The preset styles the whole list: make sure the root has
              // the preset's type and clear per-level overrides inside it.
              if (root.type.name !== preset.listType) {
                const type = tr.doc.type.schema.nodes[preset.listType];
                tr.setNodeMarkup(rootPos, type, root.attrs);
                root = tr.doc.nodeAt(rootPos) as PMNode;
              }
              root.descendants((child, offset) => {
                if (LIST_TYPES.includes(child.type.name) && child.attrs.listStyleType) {
                  tr.setNodeMarkup(rootPos + 1 + offset, undefined, {
                    ...child.attrs,
                    listStyleType: null,
                  });
                }
              });
              tr.setNodeMarkup(rootPos, undefined, {
                ...root.attrs,
                listStyleType: null,
                multilevel: preset.id,
              });
              return true;
            })
            .run();
        },
    };
  },
});

/** The list attributes around the selection, for highlighting the active style */
export function getActiveListStyle($from: ResolvedPos): {
  listType: ListType | null;
  listStyleType: string | null;
  multilevel: string | null;
} {
  const inner = innermostListDepth($from);
  const outer = outermostListDepth($from);
  return {
    listType: inner > 0 ? ($from.node(inner).type.name as ListType) : null,
    listStyleType: inner > 0 ? $from.node(inner).attrs.listStyleType ?? null : null,
    multilevel: outer > 0 ? $from.node(outer).attrs.multilevel ?? null : null,
  };
}
