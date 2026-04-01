"use client"

import { useCallback, useState } from "react"

export function useIntersection(margin: string = "-80px"): [(node: HTMLElement | null) => void, boolean] {
  const [inView, setInView] = useState(false)

  const ref = useCallback(
    (node: HTMLElement | null) => {
      if (!node || inView) return

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setInView(true)
            observer.disconnect()
          }
        },
        { rootMargin: margin }
      )

      observer.observe(node)
    },
    [margin, inView]
  )

  return [ref, inView]
}
