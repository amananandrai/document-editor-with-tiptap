"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Editor } from "@tiptap/react";
import { ChevronDown, ListIcon, ListOrderedIcon, ListTree } from "lucide-react";
import React, { useState } from "react";
import {
  BULLET_STYLES,
  getActiveListStyle,
  MULTILEVEL_PRESETS,
  NUMBER_STYLES,
  type ListStyleOption,
  type ListType,
} from "./list-style-extension";

interface ListStyleMenuProps {
  editor: Editor;
}

function StyleGrid({
  title,
  options,
  activeValue,
  onSelect,
}: {
  title: string;
  options: ListStyleOption[];
  activeValue: string | null;
  onSelect: (value: string | null) => void;
}) {
  return (
    <>
      <DropdownMenuLabel className="text-xs">{title}</DropdownMenuLabel>
      <div className="grid grid-cols-4 gap-1 p-1" role="group" aria-label={title}>
        <DropdownMenuItem
          onSelect={() => onSelect(null)}
          title="Automatic (changes with nesting level)"
          className={`h-12 justify-center text-[11px] border ${
            activeValue === null ? "border-blue-500 bg-blue-50 dark:bg-blue-900/30" : "border-gray-200 dark:border-gray-700"
          }`}
        >
          Auto
        </DropdownMenuItem>
        {options.map((option) => (
          <DropdownMenuItem
            key={option.value}
            onSelect={() => onSelect(option.value)}
            title={option.label}
            aria-label={option.label}
            className={`h-12 justify-center text-base border ${
              activeValue === option.value
                ? "border-blue-500 bg-blue-50 dark:bg-blue-900/30"
                : "border-gray-200 dark:border-gray-700"
            }`}
          >
            {option.preview}
          </DropdownMenuItem>
        ))}
      </div>
    </>
  );
}

export function ListStyleMenu({ editor }: ListStyleMenuProps) {
  // Read the list around the cursor when a menu opens
  const [active, setActive] = useState(() => getActiveListStyle(editor.state.selection.$from));
  const refreshActive = (open: boolean) => {
    if (open) setActive(getActiveListStyle(editor.state.selection.$from));
  };

  const setStyle = (listType: ListType) => (style: string | null) => {
    editor.chain().focus().setListStyle(listType, style).run();
  };

  const isBullet = editor.isActive("bulletList");
  const isOrdered = editor.isActive("orderedList");

  return (
    <div className="flex items-center gap-2">
      {/* Bullets */}
      <div className="flex items-center">
        <Button
          size="sm"
          variant={isBullet ? "default" : "secondary"}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          aria-pressed={isBullet}
          aria-label="Bullet list"
          title="Bullet list"
          className="rounded-r-none"
        >
          <ListIcon className="h-4 w-4" />
        </Button>
        <DropdownMenu modal={false} onOpenChange={refreshActive}>
          <DropdownMenuTrigger asChild>
            <Button
              size="sm"
              variant={isBullet ? "default" : "secondary"}
              aria-label="Bullet style"
              title="Bullet style"
              className="rounded-l-none px-1 border-l border-black/10"
            >
              <ChevronDown className="h-3 w-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-56">
            <StyleGrid
              title="Bullet library"
              options={BULLET_STYLES}
              activeValue={active.listType === "bulletList" ? active.listStyleType : "-"}
              onSelect={setStyle("bulletList")}
            />
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Numbering */}
      <div className="flex items-center">
        <Button
          size="sm"
          variant={isOrdered ? "default" : "secondary"}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          aria-pressed={isOrdered}
          aria-label="Ordered list"
          title="Numbered list"
          className="rounded-r-none"
        >
          <ListOrderedIcon className="h-4 w-4" />
        </Button>
        <DropdownMenu modal={false} onOpenChange={refreshActive}>
          <DropdownMenuTrigger asChild>
            <Button
              size="sm"
              variant={isOrdered ? "default" : "secondary"}
              aria-label="Numbering style"
              title="Numbering style"
              className="rounded-l-none px-1 border-l border-black/10"
            >
              <ChevronDown className="h-3 w-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-56">
            <StyleGrid
              title="Numbering library"
              options={NUMBER_STYLES}
              activeValue={active.listType === "orderedList" ? active.listStyleType : "-"}
              onSelect={setStyle("orderedList")}
            />
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Multilevel presets */}
      <DropdownMenu modal={false} onOpenChange={refreshActive}>
        <DropdownMenuTrigger asChild>
          <Button size="sm" variant="secondary" aria-label="Multilevel list" title="Multilevel list">
            <ListTree className="h-4 w-4" />
            <ChevronDown className="h-3 w-3 ml-0.5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-64">
          <DropdownMenuLabel className="text-xs">Multilevel list</DropdownMenuLabel>
          <div className="grid grid-cols-2 gap-1 p-1">
            {MULTILEVEL_PRESETS.map((preset) => (
              <DropdownMenuItem
                key={preset.id}
                onSelect={() => editor.chain().focus().setMultilevelList(preset.id).run()}
                aria-label={`${preset.label} multilevel list`}
                className={`flex-col items-stretch gap-0.5 border px-2 py-1.5 ${
                  active.multilevel === preset.id
                    ? "border-blue-500 bg-blue-50 dark:bg-blue-900/30"
                    : "border-gray-200 dark:border-gray-700"
                }`}
              >
                {preset.levels.map((marker, level) => (
                  <div
                    key={level}
                    className="flex items-center gap-1 text-[11px] leading-4"
                    style={{ paddingLeft: level * 10 }}
                  >
                    <span className="font-medium">{marker}</span>
                    <span className="h-1 flex-1 rounded bg-gray-300 dark:bg-gray-600" />
                  </div>
                ))}
                <span className="mt-0.5 text-[10px] text-gray-500">{preset.label}</span>
              </DropdownMenuItem>
            ))}
          </div>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onSelect={() => editor.chain().focus().sinkListItem("listItem").run()}
            disabled={!editor.can().sinkListItem("listItem")}
          >
            Increase list level <span className="ml-auto text-xs text-gray-400">Tab</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            onSelect={() => editor.chain().focus().liftListItem("listItem").run()}
            disabled={!editor.isActive("listItem")}
          >
            Decrease list level <span className="ml-auto text-xs text-gray-400">Shift+Tab</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
