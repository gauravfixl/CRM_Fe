"use client"

import { useState } from "react"
import { ChevronDown, ChevronUp } from "lucide-react"
import { cn } from "@/lib/utils"

export function RecentActivityPanel({
  title,
  children,
  className,
}: {
  title: string
  children?: React.ReactNode
  className?: string
}) {
  const [open, setOpen] = useState(true)

  return (
    <div
      className={cn(
        " border-white bg-white shadow-sm w-full max-w-xs text-sm shadow-md",
        className
      )}
    >
      {/* Header */}
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-3 py-1.5  font-medium hover:bg-gray-50 transition rounded-t-sm"
      >
        {title}
        {open ? (
          <ChevronUp className="h-3 w-3 text-gray-400" />
        ) : (
          <ChevronDown className="h-3 w-3 text-gray-400" />
        )}
      </button>

      {/* Body */}
      {open && (
        <div className="p-2 text-gray-600 bg-gray-50 text-sm space-y-1">
          {children || <span className="text-gray-400">No data available</span>}
        </div>
      )}
    </div>
  )
}
