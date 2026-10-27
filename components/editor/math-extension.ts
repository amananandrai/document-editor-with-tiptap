import { BlockMath, InlineMath } from "@tiptap/extension-mathematics";
import type { Node as PMNode } from "@tiptap/pm/model";

export type EquationMode = "inline" | "block";

export type EquationClickHandler = (
  mode: EquationMode,
  latex: string,
  pos: number
) => void;

const katexOptions = { throwOnError: false };

/**
 * Inline ($…$) and display ($$…$$) equations rendered with KaTeX.
 * `onClick` opens the equation editor for an existing equation.
 */
export function createMathExtensions(onClick: EquationClickHandler) {
  return [
    InlineMath.extend({
      renderText: ({ node }: { node: PMNode }) => `$${node.attrs.latex}$`,
    }).configure({
      katexOptions,
      onClick: (node: PMNode, pos: number) => onClick("inline", node.attrs.latex, pos),
    }),
    BlockMath.extend({
      renderText: ({ node }: { node: PMNode }) => `$$${node.attrs.latex}$$`,
    }).configure({
      katexOptions: { ...katexOptions, displayMode: true },
      onClick: (node: PMNode, pos: number) => onClick("block", node.attrs.latex, pos),
    }),
  ];
}
