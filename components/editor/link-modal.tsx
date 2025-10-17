"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Link } from "lucide-react";

interface LinkModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (url: string, text?: string) => void;
  initialUrl?: string;
  initialText?: string;
  hasSelection: boolean;
}

export function LinkModal({
  isOpen,
  onClose,
  onConfirm,
  initialUrl = "",
  initialText = "",
  hasSelection,
}: LinkModalProps) {
  const [url, setUrl] = useState(initialUrl);
  const [text, setText] = useState(initialText);

  // Reset form when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setUrl(initialUrl);
      setText(initialText);
    }
  }, [isOpen, initialUrl, initialText]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (url.trim()) {
      onConfirm(url.trim(), text.trim() || undefined);
      onClose();
    }
  };

  const handleCancel = () => {
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Link className="h-5 w-5" />
            {hasSelection ? "Add Link" : "Insert Link"}
          </DialogTitle>
          <DialogDescription>
            {hasSelection
              ? "Add a link to the selected text"
              : "Insert a new link with custom text"}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            {!hasSelection && (
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="link-text" className="text-right">
                  Text
                </Label>
                <Input
                  id="link-text"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Enter link text"
                  className="col-span-3"
                  autoFocus
                />
              </div>
            )}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="link-url" className="text-right">
                URL
              </Label>
              <Input
                id="link-url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://example.com"
                className="col-span-3"
                autoFocus={hasSelection}
                type="url"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button type="submit" disabled={!url.trim()}>
              {hasSelection ? "Add Link" : "Insert Link"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
