import katex from "katex";

// Helpers for the Markdown and Word exporters.

const escapeHtml = (text: string) =>
  text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

/**
 * Convert lists (including nested/multilevel ones) and equations in editor
 * HTML to Markdown text, leaving the rest of the HTML for the regex-based
 * converter. List items keep their inline HTML (bold, links…) so the later
 * passes still convert it.
 */
export function listsAndMathToMarkdown(html: string): string {
  const doc = new DOMParser().parseFromString(html, "text/html");
  const replacements: string[] = [];
  const placeholder = (markdown: string) => {
    replacements.push(markdown);
    return `@@MD${replacements.length - 1}@@`;
  };

  doc.querySelectorAll<HTMLElement>('[data-type="inline-math"]').forEach((el) => {
    const latex = el.getAttribute("data-latex") ?? "";
    el.replaceWith(doc.createTextNode(placeholder(`$${escapeHtml(latex)}$`)));
  });
  doc.querySelectorAll<HTMLElement>('[data-type="block-math"]').forEach((el) => {
    const latex = el.getAttribute("data-latex") ?? "";
    const p = doc.createElement("p");
    p.textContent = placeholder(`$$\n${escapeHtml(latex)}\n$$`);
    el.replaceWith(p);
  });

  const renderList = (list: Element, indent: string): string[] => {
    const ordered = list.tagName === "OL";
    const start = Number.parseInt(list.getAttribute("start") ?? "1", 10) || 1;
    const lines: string[] = [];
    Array.from(list.children)
      .filter((child) => child.tagName === "LI")
      .forEach((li, index) => {
        const marker = ordered ? `${start + index}.` : "-";
        const childIndent = indent + " ".repeat(marker.length + 1);
        const text: string[] = [];
        const nested: string[] = [];
        Array.from(li.childNodes).forEach((node) => {
          if (node instanceof Element && (node.tagName === "UL" || node.tagName === "OL")) {
            nested.push(...renderList(node, childIndent));
          } else if (node instanceof Element) {
            text.push(node.tagName === "P" ? node.innerHTML : node.outerHTML);
          } else if (node.textContent?.trim()) {
            text.push(node.textContent);
          }
        });
        lines.push(`${indent}${marker} ${text.join(" ").trim()}`, ...nested);
      });
    return lines;
  };

  Array.from(doc.body.querySelectorAll("ul, ol"))
    .filter((list) => !list.parentElement?.closest("li"))
    .forEach((list) => {
      const p = doc.createElement("p");
      p.textContent = placeholder(renderList(list, "").join("\n"));
      list.replaceWith(p);
    });

  // List text can itself contain equation placeholders: resolve until none remain
  let result = doc.body.innerHTML;
  for (let pass = 0; pass < 3 && /@@MD\d+@@/.test(result); pass++) {
    result = result.replace(/@@MD(\d+)@@/g, (_m, i) => replacements[Number(i)]);
  }
  return result;
}

/** Replace KaTeX-rendered equations in a DOM tree with MathML, which Word converts to equations. */
export function equationsToMathML(root: HTMLElement) {
  root
    .querySelectorAll<HTMLElement>('[data-type="inline-math"], [data-type="block-math"]')
    .forEach((el) => {
      const latex = el.getAttribute("data-latex") ?? "";
      const display = el.getAttribute("data-type") === "block-math";
      const mathml = katex.renderToString(latex, {
        output: "mathml",
        displayMode: display,
        throwOnError: false,
      });
      const replacement = el.ownerDocument.createElement(display ? "p" : "span");
      if (display) replacement.setAttribute("style", "text-align: center;");
      replacement.innerHTML = mathml;
      el.replaceWith(replacement);
    });
}

export interface WordHeaderFooter {
  header: string;
  footer: string;
}

// Word field that renders the current page number
const PAGE_FIELD =
  "<span style='mso-field-code:\" PAGE \"'><span style='mso-no-proof:yes'>1</span></span>";

/** HTML for one header/footer: its text plus an optional page number line */
export function buildHeaderFooterHtml(
  text: string,
  pageNumberAlign: "left" | "center" | "right" | null
): string {
  const number = pageNumberAlign
    ? `<p class="MsoHeader" style="text-align:${pageNumberAlign}">${PAGE_FIELD}</p>`
    : "";
  return `${text}${number}`;
}

/**
 * Word-specific markup for headers/footers in an HTML .doc: the @page rules
 * reference header/footer sections, which live in a table moved off the page
 * so they don't also appear in the body.
 */
export function wordHeaderFooterParts({ header, footer }: WordHeaderFooter) {
  const pageRules = [
    header ? "mso-header: h1;" : "",
    footer ? "mso-footer: f1;" : "",
    header ? "mso-header-margin: 0.5in;" : "",
    footer ? "mso-footer-margin: 0.5in;" : "",
  ].join(" ");
  if (!header && !footer) return { pageRules: "", sections: "" };
  const cells = [
    header ? `<td><div style="mso-element:header" id="h1">${header}</div>&nbsp;</td>` : "",
    footer ? `<td><div style="mso-element:footer" id="f1">${footer}</div>&nbsp;</td>` : "",
  ].join("");
  const sections = `<table style="margin-left:50in" border="0" cellspacing="0" cellpadding="0"><tr>${cells}</tr></table>`;
  return { pageRules, sections };
}

// ─── List markers for PDF rendering ──────────────────────────────────────────

const toAlpha = (n: number): string => {
  let s = "";
  while (n > 0) {
    n--;
    s = String.fromCharCode(97 + (n % 26)) + s;
    n = Math.floor(n / 26);
  }
  return s;
};

const toRoman = (n: number): string => {
  if (n <= 0 || n >= 4000) return String(n);
  const table: [number, string][] = [
    [1000, "m"], [900, "cm"], [500, "d"], [400, "cd"], [100, "c"], [90, "xc"],
    [50, "l"], [40, "xl"], [10, "x"], [9, "ix"], [5, "v"], [4, "iv"], [1, "i"],
  ];
  let s = "";
  for (const [value, numeral] of table) {
    while (n >= value) {
      s += numeral;
      n -= value;
    }
  }
  return s;
};

/** Marker text for item `n` (1-based) of a list with the given computed list-style-type */
export function formatListMarker(styleType: string, n: number): string | null {
  switch (styleType) {
    case "none":
      return null;
    case "disc":
      return "•";
    case "circle":
      return "◦";
    case "square":
      return "▪";
    case "decimal":
      return `${n}.`;
    case "decimal-leading-zero":
      return `${n < 10 ? "0" : ""}${n}.`;
    case "lower-alpha":
    case "lower-latin":
      return `${toAlpha(n)}.`;
    case "upper-alpha":
    case "upper-latin":
      return `${toAlpha(n).toUpperCase()}.`;
    case "lower-roman":
      return `${toRoman(n)}.`;
    case "upper-roman":
      return `${toRoman(n).toUpperCase()}.`;
    default: {
      // String markers such as "➢  "
      const match = /^"(.*)"$/.exec(styleType);
      return match ? match[1].trim() : "•";
    }
  }
}

/**
 * html2canvas draws list markers poorly (custom string bullets are lost,
 * roman/alpha markers misplaced, CSS counters mis-spaced). Replace them in the
 * cloned tree with plain text spans computed from the live list styles.
 * `sources`/`targets` are matching element lists of the live and cloned trees.
 */
export function materializeListMarkers(sources: Element[], targets: Element[]) {
  const ordinal = (li: Element) => {
    const list = li.parentElement;
    const start = Number.parseInt(list?.getAttribute("start") ?? "1", 10) || 1;
    const items = list ? Array.from(list.children).filter((c) => c.tagName === "LI") : [];
    return start + items.indexOf(li);
  };
  // "1.2.3" style numbering from the chain of ancestor list items
  const legalNumber = (li: Element) => {
    const parts: number[] = [];
    let current: Element | null = li;
    while (current && current.tagName === "LI") {
      parts.unshift(ordinal(current));
      current = current.parentElement?.parentElement ?? null;
      if (current?.tagName !== "LI") break;
    }
    return `${parts.join(".")}.`;
  };

  sources.forEach((source, i) => {
    if (source.tagName !== "LI" || !source.parentElement) return;
    const target = targets[i] as HTMLElement;
    const list = source.parentElement;
    const firstBlock = source.firstElementChild;
    const before = firstBlock ? window.getComputedStyle(firstBlock, "::before").content : "none";
    const isCounter = before.includes("counters(") || (before !== "none" && before !== "normal" && /\d/.test(before));

    const marker = document.createElement("span");
    marker.className = "pdf-list-marker";
    if (isCounter) {
      // Legal numbering is drawn inline before the text
      marker.textContent = `${legalNumber(source)} `;
      marker.style.marginRight = "0.25em";
      const block = target.firstElementChild;
      // Drop html2canvas's rendering of the ::before counter
      Array.from(block?.children ?? [])
        .filter((el) => el.tagName.startsWith("HTML2CANVAS"))
        .forEach((el) => el.remove());
      block?.prepend(marker);
      return;
    }
    const text = formatListMarker(window.getComputedStyle(list).listStyleType, ordinal(source));
    if (!text) return;
    marker.textContent = text;
    Object.assign(marker.style, {
      position: "absolute",
      right: "100%",
      top: "0",
      paddingRight: "0.5em",
      whiteSpace: "nowrap",
    });
    target.style.position = "relative";
    (target.parentElement as HTMLElement).style.listStyleType = "none";
    target.prepend(marker);
  });
}
