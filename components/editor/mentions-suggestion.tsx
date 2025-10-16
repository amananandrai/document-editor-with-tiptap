"use client"

import { forwardRef, useEffect, useImperativeHandle, useState } from "react"
import { cn } from "@/lib/utils"

export interface MentionItem {
  id: string
  label: string
  avatar?: string
}

interface MentionsSuggestionProps {
  items: MentionItem[]
  command: (item: MentionItem) => void
}

export const MentionsSuggestion = forwardRef<
  { onKeyDown: (props: { event: KeyboardEvent }) => boolean },
  MentionsSuggestionProps
>(({ items, command }, ref) => {
  const [selectedIndex, setSelectedIndex] = useState(0)

  const selectItem = (index: number) => {
    const item = items[index]
    if (item) {
      command(item)
    }
  }

  const upHandler = () => {
    setSelectedIndex((selectedIndex + items.length - 1) % items.length)
  }

  const downHandler = () => {
    setSelectedIndex((selectedIndex + 1) % items.length)
  }

  const enterHandler = () => {
    selectItem(selectedIndex)
  }

  useEffect(() => setSelectedIndex(0), [items])

  useImperativeHandle(ref, () => ({
    onKeyDown: ({ event }: { event: KeyboardEvent }) => {
      if (event.key === "ArrowUp") {
        upHandler()
        return true
      }

      if (event.key === "ArrowDown") {
        downHandler()
        return true
      }

      if (event.key === "Enter") {
        enterHandler()
        return true
      }

      return false
    },
  }))

  return (
    <div className="z-50 min-w-[8rem] max-w-[16rem] sm:max-w-[20rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md">
      {items.length ? (
        items.map((item, index) => (
          <button
            className={cn(
              "relative flex w-full cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
              index === selectedIndex && "bg-accent text-accent-foreground"
            )}
            key={item.id}
            onClick={() => selectItem(index)}
          >
            {item.avatar && (
              <img
                src={item.avatar}
                alt={item.label}
                className="mr-2 h-5 w-5 sm:h-6 sm:w-6 rounded-full flex-shrink-0"
              />
            )}
            <span className="truncate">{item.label}</span>
          </button>
        ))
      ) : (
        <div className="px-2 py-1.5 text-sm text-muted-foreground">
          No results found
        </div>
      )}
    </div>
  )
})

MentionsSuggestion.displayName = "MentionsSuggestion"

