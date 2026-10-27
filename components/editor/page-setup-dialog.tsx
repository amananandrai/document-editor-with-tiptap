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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React, { useEffect, useState } from "react";
import {
  clampMarginPair,
  DEFAULT_MARGIN,
  MAX_MARGIN,
  MIN_MARGIN,
  PAGE_HEIGHT,
  PAGE_WIDTH,
  type PageMargins,
} from "./page-layout";

interface PageSetupDialogProps {
  isOpen: boolean;
  onClose: () => void;
  margins: PageMargins;
  onApply: (margins: PageMargins) => void;
}

const SIDES: { key: keyof PageMargins; label: string }[] = [
  { key: "top", label: "Top" },
  { key: "bottom", label: "Bottom" },
  { key: "left", label: "Left" },
  { key: "right", label: "Right" },
];

const toInches = (px: number) => (px / 96).toFixed(2);

export function PageSetupDialog({ isOpen, onClose, margins, onApply }: PageSetupDialogProps) {
  const [values, setValues] = useState<Record<keyof PageMargins, string>>({
    top: "", bottom: "", left: "", right: "",
  });

  useEffect(() => {
    if (!isOpen) return;
    setValues({
      top: toInches(margins.top),
      bottom: toInches(margins.bottom),
      left: toInches(margins.left),
      right: toInches(margins.right),
    });
  }, [isOpen, margins]);

  const parse = (key: keyof PageMargins) => {
    const inches = Number.parseFloat(values[key]);
    return Number.isFinite(inches) ? inches * 96 : margins[key];
  };

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    const top = parse("top");
    const bottom = parse("bottom");
    const left = parse("left");
    const right = parse("right");
    const clampedLeft = clampMarginPair(left, right, PAGE_WIDTH);
    const clampedTop = clampMarginPair(top, bottom, PAGE_HEIGHT);
    onApply({
      top: clampedTop,
      bottom: clampMarginPair(bottom, clampedTop, PAGE_HEIGHT),
      left: clampedLeft,
      right: clampMarginPair(right, clampedLeft, PAGE_WIDTH),
    });
    onClose();
  };

  const resetDefaults = () => {
    const d = toInches(DEFAULT_MARGIN);
    setValues({ top: d, bottom: d, left: d, right: d });
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[400px]">
        <form onSubmit={handleApply}>
          <DialogHeader>
            <DialogTitle>Page setup</DialogTitle>
            <DialogDescription>
              A4 page. Margins in inches ({toInches(MIN_MARGIN)}–{toInches(MAX_MARGIN)}).
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 py-4">
            {SIDES.map(({ key, label }) => (
              <div key={key} className="grid gap-1.5">
                <Label htmlFor={`margin-${key}`}>{label}</Label>
                <Input
                  id={`margin-${key}`}
                  type="number"
                  step="any"
                  min={toInches(MIN_MARGIN)}
                  max={toInches(MAX_MARGIN)}
                  value={values[key]}
                  onChange={(e) => setValues((v) => ({ ...v, [key]: e.target.value }))}
                />
              </div>
            ))}
          </div>
          <DialogFooter className="gap-2">
            <Button type="button" variant="outline" onClick={resetDefaults}>
              Reset to 1 inch
            </Button>
            <Button type="button" variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Apply</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
