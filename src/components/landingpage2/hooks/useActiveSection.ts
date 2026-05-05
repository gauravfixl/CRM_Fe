"use client"

import { useState, useEffect } from "react"

const SECTION_IDS = [
  "overview",
  "solutions",
  "product-demos",
  "automation",
  "apps-addons",
  "customer-stories",
  "security",
  "featured-news",
  "next-steps",
]

export function useActiveSection(): string {
  const [activeSection, setActiveSection] = useState("overview")

  useEffect(() => {
    const onScroll = () => {
      const viewportH = window.innerHeight
      // Find the section that occupies the most space in the top half of the viewport
      let best = SECTION_IDS[0]
      let bestOverlap = -1

      for (const id of SECTION_IDS) {
        const el = document.getElementById(id)
        if (!el) continue
        const rect = el.getBoundingClientRect()
        // Calculate how much of this section overlaps with the top half of the viewport
        const overlapTop = Math.max(rect.top, 0)
        const overlapBottom = Math.min(rect.bottom, viewportH * 0.5)
        const overlap = Math.max(0, overlapBottom - overlapTop)

        if (overlap > bestOverlap) {
          bestOverlap = overlap
          best = id
        }
      }

      // Fallback: if nothing overlaps in top half, pick the last section scrolled past
      if (bestOverlap <= 0) {
        for (const id of SECTION_IDS) {
          const el = document.getElementById(id)
          if (!el) continue
          if (el.getBoundingClientRect().top <= 100) {
            best = id
          }
        }
      }

      setActiveSection(best)
    }

    window.addEventListener("scroll", onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return activeSection
}
