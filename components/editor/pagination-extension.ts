import { Extension } from "@tiptap/core";
import { Plugin, PluginKey } from "@tiptap/pm/state";
import { Decoration, DecorationSet, type EditorView } from "@tiptap/pm/view";
import {
  computeSpacers,
  PAGE_HEIGHT,
  type PaginationBlock,
  type PaginationLayout,
} from "./page-layout";

// Pushes top-level blocks onto the next page so they never run into the
// bottom margin/footer, and makes page breaks start a new page.
//
// Spacing is applied with ProseMirror widget decorations. Writing styles
// directly onto the editor's DOM does not work: ProseMirror re-renders its
// nodes and drops any foreign inline styles.

export interface PaginationOptions {
  getLayout: () => PaginationLayout;
  pageBreakNodeName: string;
}

export interface PaginationStorage {
  /** Re-measure and re-paginate on the next animation frame */
  refresh: () => void;
}

export const paginationPluginKey = new PluginKey<DecorationSet>("pagination");

const SPACER_CLASS = "pagination-spacer";

function createSpacer(height: number) {
  return () => {
    const el = document.createElement("div");
    el.className = SPACER_CLASS;
    el.style.height = `${height}px`;
    el.contentEditable = "false";
    el.setAttribute("aria-hidden", "true");
    return el;
  };
}

function buildDecorations(
  doc: Parameters<typeof DecorationSet.create>[0],
  spacers: { pos: number; height: number }[]
) {
  return DecorationSet.create(
    doc,
    spacers.map(({ pos, height }) =>
      Decoration.widget(pos, createSpacer(height), {
        side: -1,
        key: `pagination-spacer-${height}`,
        ignoreSelection: true,
        height,
      })
    )
  );
}

function px(value: string) {
  return Number.parseFloat(value) || 0;
}

// Margin that actually applies at an element's edge, including child margins
// that collapse through a wrapper without padding/border (e.g. node views).
function effectiveMargin(el: Element, side: "top" | "bottom", depth = 0): number {
  const style = window.getComputedStyle(el);
  const own = px(side === "top" ? style.marginTop : style.marginBottom);
  if (depth >= 3) return own;
  const padding = px(side === "top" ? style.paddingTop : style.paddingBottom);
  const border = px(
    side === "top" ? style.borderTopWidth : style.borderBottomWidth
  );
  if (padding || border || style.display !== "block") return own;
  const child = side === "top" ? el.firstElementChild : el.lastElementChild;
  return child ? Math.max(own, effectiveMargin(child, side, depth + 1)) : own;
}

function measure(view: EditorView, current: DecorationSet, pageBreakName: string) {
  const root = view.dom as HTMLElement;
  const rootTop = root.getBoundingClientRect().top;
  const paddingTop = px(window.getComputedStyle(root).paddingTop);

  const positions: number[] = [];
  const blocks: PaginationBlock[] = [];
  let prevBottom = paddingTop;
  let prevMarginBottom = 0;
  let prevIsBreak = false;
  let first = true;

  view.state.doc.forEach((node, offset) => {
    const el = view.nodeDOM(offset);
    if (!(el instanceof HTMLElement)) return;
    const rect = el.getBoundingClientRect();
    const top = rect.top - rootTop;
    const marginTop = effectiveMargin(el, "top");
    const marginBottom = effectiveMargin(el, "bottom");
    const existing = current.find(offset, offset, (spec) => !!spec.height);
    const hasSpacer = existing.length > 0;

    const marginSum = (first ? 0 : prevMarginBottom) + marginTop;
    const collapsed = first ? marginTop : Math.max(prevMarginBottom, marginTop);
    blocks.push({
      naturalGap: hasSpacer ? collapsed : top - prevBottom,
      marginSum,
      height: rect.height,
      breakBefore: prevIsBreak,
    });
    positions.push(offset);

    prevBottom = top + rect.height;
    prevMarginBottom = marginBottom;
    prevIsBreak = node.type.name === pageBreakName;
    first = false;
  });

  return { positions, blocks };
}

export const Pagination = Extension.create<PaginationOptions, PaginationStorage>({
  name: "pagination",

  addOptions() {
    return {
      getLayout: () => ({
        pageHeight: PAGE_HEIGHT,
        contentTop: 96,
        contentBottom: 96,
      }),
      pageBreakNodeName: "pageBreak",
    };
  },

  addStorage() {
    return {
      refresh: () => {},
    };
  },

  addProseMirrorPlugins() {
    const { options, storage } = this;

    return [
      new Plugin<DecorationSet>({
        key: paginationPluginKey,
        state: {
          init: () => DecorationSet.empty,
          apply(tr, set) {
            const next = tr.getMeta(paginationPluginKey) as
              | { pos: number; height: number }[]
              | undefined;
            if (next) return buildDecorations(tr.doc, next);
            return set.map(tr.mapping, tr.doc);
          },
        },
        props: {
          decorations(state) {
            return paginationPluginKey.getState(state);
          },
        },
        view(view) {
          let frame = 0;
          let destroyed = false;

          const run = () => {
            frame = 0;
            if (destroyed || !view.dom.isConnected) return;
            const current =
              paginationPluginKey.getState(view.state) ?? DecorationSet.empty;
            const { positions, blocks } = measure(
              view,
              current,
              options.pageBreakNodeName
            );
            const heights = computeSpacers(blocks, options.getLayout());
            const next = positions
              .map((pos, i) => ({ pos, height: heights[i] }))
              .filter((s) => s.height > 0);

            const existing = current.find().map((d) => ({
              pos: d.from,
              height: d.spec.height as number,
            }));
            const unchanged =
              existing.length === next.length &&
              next.every(
                (s, i) =>
                  s.pos === existing[i].pos &&
                  Math.abs(s.height - existing[i].height) <= 1
              );
            if (unchanged) return;

            view.dispatch(
              view.state.tr
                .setMeta(paginationPluginKey, next)
                .setMeta("addToHistory", false)
            );
          };

          const schedule = () => {
            if (destroyed || frame) return;
            frame = requestAnimationFrame(run);
          };

          storage.refresh = schedule;

          const observer = new ResizeObserver(schedule);
          observer.observe(view.dom);
          schedule();

          return {
            update(view, prevState) {
              if (!prevState.doc.eq(view.state.doc)) schedule();
            },
            destroy() {
              destroyed = true;
              if (frame) cancelAnimationFrame(frame);
              observer.disconnect();
              storage.refresh = () => {};
            },
          };
        },
      }),
    ];
  },
});
