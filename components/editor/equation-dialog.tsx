"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import katex from "katex";
import React, { useEffect, useMemo, useRef, useState } from "react";
import type { EquationMode } from "./math-extension";

export interface EquationDraft {
  latex: string;
  mode: EquationMode;
  /** Position of the equation being edited; undefined when inserting */
  pos?: number;
}

interface EquationDialogProps {
  draft: EquationDraft | null;
  onClose: () => void;
  onSubmit: (latex: string, mode: EquationMode, pos?: number) => void;
  onDelete: (mode: EquationMode, pos: number) => void;
}

interface Snippet {
  label: string; // LaTeX rendered on the button
  insert: string;
  /** Characters from the end of `insert` to leave the caret at */
  caretBack?: number;
}

const STRUCTURES: Snippet[] = [
  { label: "\\frac{a}{b}", insert: "\\frac{}{}", caretBack: 3 },
  { label: "x^{n}", insert: "^{}", caretBack: 1 },
  { label: "x_{i}", insert: "_{}", caretBack: 1 },
  { label: "\\sqrt{x}", insert: "\\sqrt{}", caretBack: 1 },
  { label: "\\sqrt[n]{x}", insert: "\\sqrt[]{}", caretBack: 3 },
  { label: "\\sum_{i=1}^{n}", insert: "\\sum_{i=1}^{n} " },
  { label: "\\prod_{i=1}^{n}", insert: "\\prod_{i=1}^{n} " },
  { label: "\\int_{a}^{b}", insert: "\\int_{a}^{b} \\, dx", caretBack: 5 },
  { label: "\\lim_{x\\to\\infty}", insert: "\\lim_{x \\to \\infty} " },
  { label: "\\binom{n}{k}", insert: "\\binom{}{}", caretBack: 3 },
  { label: "\\vec{v}", insert: "\\vec{}", caretBack: 1 },
  { label: "\\overline{x}", insert: "\\overline{}", caretBack: 1 },
  { label: "\\left( x \\right)", insert: "\\left(  \\right)", caretBack: 8 },
  {
    label: "\\begin{pmatrix}a&b\\\\c&d\\end{pmatrix}",
    insert: "\\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix}",
  },
  {
    label: "\\begin{cases}a\\\\b\\end{cases}",
    insert: "\\begin{cases} a & x > 0 \\\\ b & x \\le 0 \\end{cases}",
  },
];

const SYMBOLS: string[] = [
  "\\alpha", "\\beta", "\\gamma", "\\delta", "\\epsilon", "\\theta", "\\lambda",
  "\\mu", "\\pi", "\\sigma", "\\phi", "\\omega", "\\Delta", "\\Sigma", "\\Omega",
  "\\pm", "\\times", "\\div", "\\cdot", "\\le", "\\ge", "\\ne", "\\approx",
  "\\equiv", "\\infty", "\\partial", "\\nabla", "\\in", "\\notin", "\\subset",
  "\\cup", "\\cap", "\\forall", "\\exists", "\\to", "\\Rightarrow", "\\Leftrightarrow",
  "\\degree",
];

const EXAMPLES: { name: string; latex: string }[] = [
  { name: "Quadratic formula", latex: "x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}" },
  { name: "Pythagorean theorem", latex: "a^2 + b^2 = c^2" },
  { name: "Euler's identity", latex: "e^{i\\pi} + 1 = 0" },
  { name: "Area of a circle", latex: "A = \\pi r^2" },
  { name: "Binomial theorem", latex: "(x + y)^n = \\sum_{k=0}^{n} \\binom{n}{k} x^{n-k} y^k" },
  { name: "Derivative", latex: "f'(x) = \\lim_{h \\to 0} \\frac{f(x + h) - f(x)}{h}" },
];

function renderLatex(latex: string, displayMode = false) {
  return katex.renderToString(latex, { throwOnError: false, displayMode });
}

function KatexLabel({ latex }: { latex: string }) {
  const html = useMemo(() => renderLatex(latex), [latex]);
  return <span dangerouslySetInnerHTML={{ __html: html }} />;
}

export function EquationDialog({ draft, onClose, onSubmit, onDelete }: EquationDialogProps) {
  const [latex, setLatex] = useState("");
  const [mode, setMode] = useState<EquationMode>("inline");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const isEditing = draft?.pos !== undefined;

  useEffect(() => {
    if (!draft) return;
    setLatex(draft.latex);
    setMode(draft.mode);
    requestAnimationFrame(() => textareaRef.current?.focus());
  }, [draft]);

  const preview = useMemo(() => {
    if (!latex.trim()) return { html: "", error: "" };
    try {
      return {
        html: katex.renderToString(latex, { throwOnError: true, displayMode: mode === "block" }),
        error: "",
      };
    } catch (err) {
      return { html: "", error: err instanceof Error ? err.message.replace(/^KaTeX parse error: /, "") : "Invalid LaTeX" };
    }
  }, [latex, mode]);

  const insertSnippet = (snippet: string, caretBack = 0) => {
    const el = textareaRef.current;
    const start = el?.selectionStart ?? latex.length;
    const end = el?.selectionEnd ?? latex.length;
    const next = latex.slice(0, start) + snippet + latex.slice(end);
    setLatex(next);
    const caret = start + snippet.length - caretBack;
    requestAnimationFrame(() => {
      el?.focus();
      el?.setSelectionRange(caret, caret);
    });
  };

  const canSubmit = latex.trim() !== "" && !preview.error;

  const submit = () => {
    if (!canSubmit) return;
    onSubmit(latex.trim(), mode, draft?.pos);
    onClose();
  };

  return (
    <Dialog open={draft !== null} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[720px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit equation" : "Insert equation"}</DialogTitle>
          <DialogDescription>
            Type LaTeX or use the buttons below. Ctrl+Enter to {isEditing ? "save" : "insert"}.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4">
          <div className="flex items-center gap-2" role="radiogroup" aria-label="Equation display">
            {(["inline", "block"] as const).map((m) => (
              <Button
                key={m}
                type="button"
                size="sm"
                role="radio"
                aria-checked={mode === m}
                variant={mode === m ? "default" : "secondary"}
                onClick={() => setMode(m)}
              >
                {m === "inline" ? "Inline (in text)" : "Display (own line)"}
              </Button>
            ))}
          </div>

          <div className="grid gap-1.5">
            <Label htmlFor="equation-latex">LaTeX</Label>
            <textarea
              id="equation-latex"
              ref={textareaRef}
              value={latex}
              onChange={(e) => setLatex(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
                  e.preventDefault();
                  submit();
                }
              }}
              rows={3}
              spellCheck={false}
              placeholder="e.g. \frac{a}{b} + \sqrt{x}"
              className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-3 py-2 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div
            className="min-h-[64px] rounded-md border border-dashed border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 px-3 py-2 flex items-center justify-center overflow-x-auto"
            aria-live="polite"
          >
            {preview.error ? (
              <p className="text-sm text-red-600">{preview.error}</p>
            ) : preview.html ? (
              <div className="text-gray-900 dark:text-gray-100 text-lg" dangerouslySetInnerHTML={{ __html: preview.html }} />
            ) : (
              <p className="text-sm text-gray-400">Preview</p>
            )}
          </div>

          <div className="grid gap-1.5">
            <Label>Structures</Label>
            <div className="flex flex-wrap gap-1">
              {STRUCTURES.map((s) => (
                <button
                  key={s.insert}
                  type="button"
                  title={s.insert}
                  onClick={() => insertSnippet(s.insert, s.caretBack)}
                  className="min-w-10 h-10 px-2 rounded border border-gray-200 dark:border-gray-700 hover:bg-blue-50 dark:hover:bg-gray-800 text-sm text-gray-900 dark:text-gray-100"
                >
                  <KatexLabel latex={s.label} />
                </button>
              ))}
            </div>
          </div>

          <div className="grid gap-1.5">
            <Label>Symbols</Label>
            <div className="flex flex-wrap gap-1">
              {SYMBOLS.map((s) => (
                <button
                  key={s}
                  type="button"
                  title={s}
                  onClick={() => insertSnippet(`${s} `)}
                  className="w-8 h-8 rounded border border-gray-200 dark:border-gray-700 hover:bg-blue-50 dark:hover:bg-gray-800 text-sm text-gray-900 dark:text-gray-100"
                >
                  <KatexLabel latex={s} />
                </button>
              ))}
            </div>
          </div>

          <div className="grid gap-1.5">
            <Label>Common equations</Label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
              {EXAMPLES.map((ex) => (
                <button
                  key={ex.name}
                  type="button"
                  onClick={() => setLatex(ex.latex)}
                  className="text-left px-2 py-1.5 rounded border border-gray-200 dark:border-gray-700 hover:bg-blue-50 dark:hover:bg-gray-800 text-gray-900 dark:text-gray-100"
                >
                  <div className="text-[11px] text-gray-500">{ex.name}</div>
                  <div className="text-sm overflow-x-auto">
                    <KatexLabel latex={ex.latex} />
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2">
          {isEditing && draft?.pos !== undefined && (
            <Button
              type="button"
              variant="outline"
              className="text-red-600 sm:mr-auto"
              onClick={() => {
                onDelete(draft.mode, draft.pos as number);
                onClose();
              }}
            >
              Delete
            </Button>
          )}
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="button" onClick={submit} disabled={!canSubmit}>
            {isEditing ? "Save" : "Insert"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
