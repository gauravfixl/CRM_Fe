"use client"

import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { ChevronDown, X, Search } from "lucide-react"
import { useMemo, useRef, useState, useEffect } from "react"
import { Input } from "@/components/ui/input"

interface Option {
  label: string
  value: string
}

interface MultiSelectProps {
  selected: string[]
  setSelected: (value: string[]) => void
  options: Option[]
  placeholder?: string
  className?: string
}

export function MultiSelect({
  selected,
  setSelected,
  options,
  placeholder = "Select...",
  className,
}: MultiSelectProps) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState("")
  const triggerRef = useRef<HTMLButtonElement>(null)
  const [triggerWidth, setTriggerWidth] = useState<number>(0)

  // Match the popover width to the trigger so dropdown doesn't look detached
  useEffect(() => {
    if (triggerRef.current) {
      setTriggerWidth(triggerRef.current.offsetWidth)
    }
  }, [open])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return options
    return options.filter((o) => o.label.toLowerCase().includes(q))
  }, [options, query])

  const toggleOption = (value: string) => {
    if (selected.includes(value)) {
      setSelected(selected.filter((v) => v !== value))
    } else {
      setSelected([...selected, value])
    }
  }

  const removeChip = (value: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setSelected(selected.filter((v) => v !== value))
  }

  const selectedLabels = selected
    .map((val) => options.find((o) => o.value === val)?.label)
    .filter(Boolean) as string[]

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          ref={triggerRef}
          type="button"
          variant="outline"
          className={`w-full justify-between font-normal h-11 ${className || ""}`}
        >
          <span className="flex flex-wrap gap-1 items-center text-left flex-1 min-w-0">
            {selected.length === 0 && (
              <span className="text-zinc-400 truncate">{placeholder}</span>
            )}
            {selected.length > 0 && selected.length <= 2 && (
              <span className="truncate">{selectedLabels.join(", ")}</span>
            )}
            {selected.length > 2 && (
              <span className="truncate">
                {selectedLabels[0]} +{selected.length - 1} more
              </span>
            )}
          </span>
          <ChevronDown className="w-4 h-4 text-zinc-400 shrink-0 ml-2" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        // z-[60] + pointer-events-auto: when MultiSelect is rendered inside a
        // Radix Dialog/Sheet (modal), the portaled popover content sits at
        // body-level and inherits the dialog's pointer-events:none guard,
        // which makes items unclickable. Same z-50 also stacks behind the
        // sheet. Lift z-index and re-enable pointer events so options can
        // be selected from inside a side sheet (e.g. the Invite User form).
        className="p-0 max-h-[280px] overflow-hidden flex flex-col z-[60] pointer-events-auto"
        style={{ width: triggerWidth || undefined }}
        align="start"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        {options.length > 5 && (
          <div className="p-2 border-b border-zinc-100 relative shrink-0">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-400" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search..."
              className="pl-8 h-8 text-xs"
            />
          </div>
        )}
        <div className="overflow-y-auto flex-1 p-1">
          {options.length === 0 ? (
            <div className="px-3 py-6 text-center text-xs text-zinc-500">
              No options available
            </div>
          ) : filtered.length === 0 ? (
            <div className="px-3 py-6 text-center text-xs text-zinc-500">
              No matches for &quot;{query}&quot;
            </div>
          ) : (
            filtered.map((option) => {
              const isChecked = selected.includes(option.value)
              return (
                // Single source of truth for click → toggle. Inner content has
                // pointer-events: none so neither the checkbox nor the label
                // intercept the click and double-fire the toggle (which was
                // making the selection appear to "do nothing").
                <div
                  key={option.value}
                  onClick={() => toggleOption(option.value)}
                  className={`flex items-center gap-2 px-2 py-1.5 rounded-md cursor-pointer hover:bg-zinc-100 ${
                    isChecked ? "bg-primary/5" : ""
                  }`}
                >
                  <div className="pointer-events-none flex items-center gap-2 flex-1">
                    <Checkbox checked={isChecked} />
                    <Label className="text-xs font-medium flex-1 cursor-pointer">
                      {option.label}
                    </Label>
                  </div>
                </div>
              )
            })
          )}
        </div>
        {selected.length > 0 && (
          <div className="p-2 border-t border-zinc-100 flex items-center justify-between shrink-0">
            <span className="text-[10px] text-zinc-500">
              {selected.length} selected
            </span>
            <button
              type="button"
              onClick={() => setSelected([])}
              className="text-[10px] text-rose-600 hover:underline"
            >
              Clear all
            </button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  )
}
