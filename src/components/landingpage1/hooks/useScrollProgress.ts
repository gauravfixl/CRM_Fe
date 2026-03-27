"use client"

import { useRef } from "react"
import { useScroll, useTransform, type MotionValue } from "framer-motion"

interface ScrollProgressResult {
  ref: React.RefObject<HTMLElement | null>
  scrollYProgress: MotionValue<number>
  parallaxY: MotionValue<number>
}

export function useScrollProgress(offset: number = 120): ScrollProgressResult {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  })
  const parallaxY = useTransform(scrollYProgress, [0, 1], [0, offset])

  return { ref, scrollYProgress, parallaxY }
}
