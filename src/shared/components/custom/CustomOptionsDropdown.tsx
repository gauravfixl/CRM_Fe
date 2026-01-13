"use client"

import { useState } from "react"
import { ChevronDown, ChevronUp } from "lucide-react"
import { cn } from "@/lib/utils"

export function CustomOptionsDropdown({
  title = "Options",
  options,
  onSelect,
  className,
}: {
  title?: string
  options: { label: string; value: string }[]
  onSelect?: (value: string) => void
  className?: string
}) {
  const [open, setOpen] = useState(false)

  return (
    <div
      className={cn(
        "w-full sm:w-64 border bg-white shadow-sm border-white shadow-md p-2 space-y-1 text-sm",
        "max-w-full",
        className
      )}
    >
      {/* Section title */}
      <h2 className="text-xs font-medium  uppercase ">{title}</h2>

      {/* Dropdown button */}
      <div>
        <button
          onClick={() => setOpen(!open)}
          className="w-full flex items-center justify-between border border-gray-200  px-2 py-1 text-left text-gray-700 bg-gray-50 hover:bg-gray-100 transition text-sm"
        >
          Create New
          {open ? (
            <ChevronUp className="h-3 w-3 text-gray-500" />
          ) : (
            <ChevronDown className="h-3 w-3 text-gray-500" />
          )}
        </button>

        {/* Dropdown options */}
        {open && (
          <div className="mt-1 w-full border border-gray-200  bg-white shadow-sm z-50">
            {options.map((opt, idx) => (
              <button
                key={idx}
                onClick={() => {
                  onSelect?.(opt.value)
                  setOpen(false)
                }}
                className="w-full text-left px-2 py-1 text-gray-600 hover:bg-gray-100 text-sm transition"
              >
                {opt.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
