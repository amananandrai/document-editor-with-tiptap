// Shared A4 page geometry and pure layout helpers used by the editor canvas,
// the pagination extension and the exporters.

// A4 at 96 DPI
export const PAGE_WIDTH = 794;
export const PAGE_HEIGHT = 1123;

export const DEFAULT_MARGIN = 96; // 1 inch
export const MIN_MARGIN = 24;
export const MAX_MARGIN = 300;
// Minimum width/height left for body content after margins
export const MIN_CONTENT_SIZE = 200;

// Distance of header from the top edge / footer from the bottom edge (0.5in)
export const HEADER_FOOTER_DISTANCE = 48;
// Gap kept between header/footer and the body text
export const HEADER_FOOTER_GAP = 8;

export type PageNumberPosition =
  | "header-left"
  | "header-center"
  | "header-right"
  | "footer-left"
  | "footer-center"
  | "footer-right"
  | "none";

export interface PageMargins {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

export function clampMargin(value: number): number {
  if (!Number.isFinite(value)) return DEFAULT_MARGIN;
  return Math.round(Math.max(MIN_MARGIN, Math.min(MAX_MARGIN, value)));
}

/**
 * Clamp a pair of opposite margins so at least MIN_CONTENT_SIZE remains
 * between them. `changed` is the margin being edited; the other is kept.
 */
export function clampMarginPair(
  changed: number,
  other: number,
  total: number
): number {
  const clamped = clampMargin(changed);
  return Math.min(clamped, Math.max(MIN_MARGIN, total - other - MIN_CONTENT_SIZE));
}

/** Distance of the header (or footer) from the page edge for a given margin. */
export function headerFooterDistance(margin: number): number {
  return Math.min(HEADER_FOOTER_DISTANCE, Math.round(margin / 2));
}

/**
 * Where the body text starts/ends on each page. The header/footer is placed
 * inside the margin; if it is taller than the margin allows, the body is
 * pushed further in so the two never overlap.
 */
export function getContentInsets(
  margins: Pick<PageMargins, "top" | "bottom">,
  headerHeight: number,
  footerHeight: number
): { top: number; bottom: number } {
  const top = headerHeight > 0
    ? Math.max(
        margins.top,
        headerFooterDistance(margins.top) + headerHeight + HEADER_FOOTER_GAP
      )
    : margins.top;
  const bottom = footerHeight > 0
    ? Math.max(
        margins.bottom,
        headerFooterDistance(margins.bottom) + footerHeight + HEADER_FOOTER_GAP
      )
    : margins.bottom;
  return { top: Math.ceil(top), bottom: Math.ceil(bottom) };
}

export interface HeaderFooterVisibility {
  /** Render the header zone at all (editable text and/or page number) */
  headerZone: boolean;
  /** Render the footer zone at all */
  footerZone: boolean;
  /** Render the editable header text */
  headerText: boolean;
  /** Render the editable footer text */
  footerText: boolean;
  /** Alignment of the page number in the header, or null */
  headerPageNumber: "left" | "center" | "right" | null;
  /** Alignment of the page number in the footer, or null */
  footerPageNumber: "left" | "center" | "right" | null;
}

export function getHeaderFooterVisibility(
  showHeader: boolean,
  showFooter: boolean,
  showPageNumbers: boolean,
  position: PageNumberPosition | string
): HeaderFooterVisibility {
  const [zone, align] = position.split("-") as [string, string | undefined];
  const alignment =
    align === "left" || align === "center" || align === "right" ? align : null;
  const numbersOn = showPageNumbers && position !== "none" && alignment !== null;
  const headerPageNumber = numbersOn && zone === "header" ? alignment : null;
  const footerPageNumber = numbersOn && zone === "footer" ? alignment : null;
  return {
    headerZone: showHeader || headerPageNumber !== null,
    footerZone: showFooter || footerPageNumber !== null,
    headerText: showHeader,
    footerText: showFooter,
    headerPageNumber,
    footerPageNumber,
  };
}

/** True when header/footer HTML has no visible content. */
export function isEmptyHtml(html: string | null | undefined): boolean {
  if (!html) return true;
  if (/<img\b/i.test(html)) return false;
  return html.replace(/<[^>]*>/g, "").replace(/&nbsp;/g, " ").trim() === "";
}

// ─── Pagination math ──────────────────────────────────────────────────────────

export interface PaginationLayout {
  pageHeight: number;
  /** Body start offset from the top of each page */
  contentTop: number;
  /** Body end offset from the bottom of each page */
  contentBottom: number;
}

export interface PaginationBlock {
  /** Gap above the block when no spacer is inserted (collapsed margins) */
  naturalGap: number;
  /** Margins that apply around an inserted spacer (they don't collapse) */
  marginSum: number;
  /** Border-box height of the block */
  height: number;
  /** Force this block to the start of the next page (follows a page break) */
  breakBefore: boolean;
}

/**
 * Given the natural (un-paginated) geometry of top-level blocks, compute the
 * height of a spacer to insert before each block so that blocks never cross
 * a page's bottom inset and page breaks start a new page. Returns one entry
 * per block; 0 means no spacer.
 */
export function computeSpacers(
  blocks: PaginationBlock[],
  layout: PaginationLayout
): number[] {
  const { pageHeight: H, contentTop, contentBottom } = layout;
  const usable = H - contentTop - contentBottom;
  const spacers: number[] = [];
  let prevBottom = contentTop;

  for (const block of blocks) {
    const naturalTop = prevBottom + block.naturalGap;
    const page = Math.floor(naturalTop / H);
    const pageContentTop = page * H + contentTop;
    const pageContentBottom = (page + 1) * H - contentBottom;

    let target: number | null = null;
    if (block.breakBefore) {
      const breakPage = Math.floor(Math.max(prevBottom - 1, 0) / H);
      target = (breakPage + 1) * H + contentTop;
    } else if (naturalTop < pageContentTop) {
      // Landed in the gap between pages (after an oversized block)
      target = pageContentTop;
    } else if (
      naturalTop + block.height > pageContentBottom &&
      (block.height <= usable || naturalTop >= pageContentBottom)
    ) {
      target = (page + 1) * H + contentTop;
    }

    let spacer = 0;
    let top = naturalTop;
    if (target !== null) {
      spacer = Math.max(0, target - prevBottom - block.marginSum);
      top = spacer > 0 ? prevBottom + block.marginSum + spacer : naturalTop;
    }
    spacers.push(Math.round(spacer));
    prevBottom = top + block.height;
  }

  return spacers;
}
