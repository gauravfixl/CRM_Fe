"use client"

import Link from "next/link"
import { ChevronRight } from "lucide-react"

interface BreadcrumbLink {
  label: string
  href?: string // optional so last item doesn't need a link
}

interface BreadcrumbProps {
  items: BreadcrumbLink[]
  separator?: React.ReactNode
}

export function Breadcrumb({ items, separator = <ChevronRight className="w-4 h-4 mx-1 text-white" /> }: BreadcrumbProps) {
  return (
    <nav className="flex items-center text-sm text-muted-foreground">
      {items.map((item, idx) => {
        const isLast = idx === items.length - 1
        return (
          <span key={idx} className="flex items-center">
            {item.href && !isLast ? (
              <Link href={item.href} className=" text-white font-medium hover:cursor-pointer">
                {item.label}
              </Link>
            ) : (
              <span className="font-semibold text-white">{item.label}</span>
            )}
            {!isLast && separator}
          </span>
        )
      })}
    </nav>
  )
}
